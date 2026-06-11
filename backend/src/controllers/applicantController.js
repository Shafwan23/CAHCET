const asyncHandler = require('../utils/asyncHandler');
const prisma = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const nodemailer = require('nodemailer');

// Set up a test email account for professional mock email delivery
let testAccount = null;
let transporter = null;
async function initMailer() {
  if (!transporter) {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
}
initMailer();

const generateToken = (id, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : (config.jwtExpiresIn || '1d');
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn,
  });
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

  const applicant = await prisma.applicant.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
    },
  });

  if (applicant) {
    res.status(201).json({
      success: true,
      token: generateToken(applicant.id),
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
    res.json({
      success: true,
      token: generateToken(applicant.id, rememberMe),
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
      console.log(`[DEV INFO] Generated OTP for ${email}: ${otp}`);
      const info = await transporter.sendMail({
        from: '"CAHCET Admissions" <admissions@cahcet.edu.in>',
        to: email,
        subject: "CAHCET Portal Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 15 minutes.`,
        html: `<b>Your OTP for password reset is: ${otp}</b><br>It will expire in 15 minutes.`
      });
      console.log("Mock Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error("Failed to send mock email via Ethereal:", err.message);
      // Even if email sending fails in dev, we shouldn't block the frontend from showing success,
      // or we can log it so the user can just see the OTP in their DB/console.
    }
  }

  res.status(200).json({
    success: true,
    message: 'If email exists, an OTP will be sent.',
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

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
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
