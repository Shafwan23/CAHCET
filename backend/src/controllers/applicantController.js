const asyncHandler = require('../utils/asyncHandler');
const prisma = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

let transporter = null;
function initMailer() {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: parseInt(process.env.SMTP_PORT.trim()),
      secure: process.env.SMTP_PORT.trim() === '465', 
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS.trim().replace(/\s+/g, ''),
      },
    });
    console.log('[INFO] SMTP configured successfully for production email delivery.');
  } else {
    console.warn('[WARNING] SMTP configuration is missing. Emails will not be sent out.');
  }
}
initMailer();

const generateAccessToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '15m' }); // 15 minutes
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const setAuthCookies = (res, accessToken, refreshToken, rememberMe = false) => {
  const isProd = process.env.NODE_ENV === 'production';
  const accessMaxAge = 15 * 60 * 1000; // 15 minutes

  // Access Token is always short-lived
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: accessMaxAge
  });

  // Refresh Token Configuration
  const refreshTokenOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax'
  };

  if (rememberMe) {
    // Standard university best practice: 7 days for "Remember Me"
    refreshTokenOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
  } else {
    // If not checked, no maxAge makes it a "Session Cookie"
    // It will automatically be deleted by the browser when the browser is closed.
  }

  res.cookie('refreshToken', refreshToken, refreshTokenOptions);
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const applicantExists = await prisma.applicant.findUnique({
    where: { email },
  });

  if (applicantExists) {
    res.status(400);
    throw new Error('Applicant already exists with this email');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const refreshToken = generateRefreshToken();

  const applicant = await prisma.applicant.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
      refreshToken,
    },
  });

  if (applicant) {
    const accessToken = generateAccessToken(applicant.id);
    setAuthCookies(res, accessToken, refreshToken, false);
    
    res.status(201).json({
      success: true,
      applicant: {
        id: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
        phone: applicant.phone,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid applicant data');
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const applicant = await prisma.applicant.findUnique({
    where: { email },
    include: { applications: true }
  });

  if (applicant && (await bcrypt.compare(password, applicant.passwordHash))) {
    const accessToken = generateAccessToken(applicant.id);
    const refreshToken = generateRefreshToken();

    await prisma.applicant.update({
      where: { id: applicant.id },
      data: { refreshToken }
    });

    setAuthCookies(res, accessToken, refreshToken, rememberMe);

    res.json({
      success: true,
      applicant: {
        id: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
        phone: applicant.phone,
        applications: applicant.applications,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getMe = asyncHandler(async (req, res) => {
  console.log('[DEBUG] getMe called. req.cookies:', req.cookies);
  const applicant = await prisma.applicant.findUnique({
    where: { id: req.applicant.id },
    include: {
      applications: true
    }
  });

  res.status(200).json({
    success: true,
    applicant,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const applicant = await prisma.applicant.findUnique({
    where: { email },
  });

  if (!applicant) {
    return res.status(200).json({ success: true, message: 'If email exists, an OTP will be sent.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await prisma.applicant.update({
    where: { email },
    data: { resetOtp: otp, resetOtpExpiry: expiry },
  });

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"CAHCET Admissions" <admissions@cahcet.edu.in>',
        to: email,
        subject: "CAHCET Portal Password Reset OTP",
        text: `Your secure OTP for password reset is: ${otp}. It will expire in 15 minutes. Do not share this with anyone.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #1e293b; text-align: center;">Password Reset Request</h2>
            <p style="color: #475569; font-size: 16px;">Hello,</p>
            <p style="color: #475569; font-size: 16px;">We received a request to reset the password for your CAHCET Admissions account. Please use the following 6-digit verification code to proceed.</p>
            <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #d4af37;">${otp}</span>
            </div>
            <p style="color: #475569; font-size: 14px;">This code is valid for <strong>15 minutes</strong>. If you did not request this, please ignore this email or contact support if you have concerns.</p>
            <hr style="border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">Secure system generated message. Please do not reply.</p>
          </div>
        `
      });
      console.log(`[INFO] Password reset email sent securely to ${email}`);
    } catch (err) {
      console.error("[ERROR] Failed to send production email:", err.message);
      // Depending on strictness, we might throw an error here, but standard practice is 
      // to not reveal if the email actually failed/exists to prevent enumeration.
    }
  } else {
    // Fallback log for testing if SMTP is not configured
    console.log(`[DEV FALLBACK] OTP for ${email}: ${otp}`);
  }

  res.status(200).json({
    success: true,
    message: 'If email exists, an OTP will be sent.',
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const applicant = await prisma.applicant.findUnique({
    where: { email },
  });

  if (!applicant || applicant.resetOtp !== otp || new Date() > applicant.resetOtpExpiry) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully.',
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const applicant = await prisma.applicant.findUnique({
    where: { email },
  });

  if (!applicant || applicant.resetOtp !== otp || new Date() > applicant.resetOtpExpiry) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.applicant.update({
    where: { email },
    data: {
      passwordHash,
      resetOtp: null,
      resetOtpExpiry: null,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Password successfully reset. You can now login.',
  });
});

// Applications CRUD
const getApplications = asyncHandler(async (req, res) => {
  const applications = await prisma.application.findMany({
    where: { applicantId: req.applicant.id },
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json({ success: true, applications });
});

const getApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await prisma.application.findFirst({
    where: { id, applicantId: req.applicant.id }
  });
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  res.status(200).json({ success: true, application });
});

const createApplication = asyncHandler(async (req, res) => {
  const application = await prisma.application.create({
    data: {
      applicantId: req.applicant.id,
      applicationStatus: 'REGISTERED'
    }
  });
  res.status(201).json({ success: true, application });
});

// Flow endpoints
const savePersonal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { studentName, ...data } = req.body;
  const application = await prisma.application.update({
    where: { id, applicantId: req.applicant.id },
    data: {
      studentName,
      personalDetails: data,
      applicationStatus: 'PERSONAL_DONE'
    }
  });
  res.status(200).json({ success: true, application });
});

const saveAcademic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const application = await prisma.application.update({
    where: { id, applicantId: req.applicant.id },
    data: {
      academicInfo: data,
      applicationStatus: 'ACADEMIC_DONE'
    }
  });
  res.status(200).json({ success: true, application });
});

const saveCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { courseChoice } = req.body;
  const application = await prisma.application.update({
    where: { id, applicantId: req.applicant.id },
    data: {
      courseChoice,
      applicationStatus: 'COURSE_SELECTED'
    }
  });
  res.status(200).json({ success: true, application });
});

const savePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentMethod, transactionId, amountPaid } = req.body;
  const application = await prisma.application.update({
    where: { id, applicantId: req.applicant.id },
    data: {
      paymentMethod,
      transactionId,
      amountPaid,
      paymentDate: new Date(),
      applicationStatus: 'COMPLETED'
    }
  });
  res.status(200).json({ success: true, application });
});

const deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await prisma.application.findFirst({
    where: { id, applicantId: req.applicant.id }
  });

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.applicationStatus === 'COMPLETED') {
    res.status(400);
    throw new Error('Cannot delete a completed application');
  }

  await prisma.application.delete({
    where: { id }
  });

  res.status(200).json({ success: true, message: 'Application deleted successfully' });
});

const refresh = asyncHandler(async (req, res) => {
  console.log('[DEBUG] refresh called. req.cookies:', req.cookies);
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    console.log('[DEBUG] No refresh token found in cookies');
    res.status(401);
    throw new Error('Not authorized, no refresh token');
  }

  const applicant = await prisma.applicant.findFirst({
    where: { refreshToken }
  });

  if (!applicant) {
    res.status(401);
    throw new Error('Not authorized, invalid refresh token');
  }

  const accessToken = generateAccessToken(applicant.id);
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  res.status(200).json({ success: true });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await prisma.applicant.updateMany({
      where: { refreshToken },
      data: { refreshToken: null }
    });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getApplications,
  getApplication,
  createApplication,
  savePersonal,
  saveAcademic,
  saveCourse,
  savePayment,
  deleteApplication
};
