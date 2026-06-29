const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/applicantController');
const { protectApplicant } = require('../middleware/applicantAuthMiddleware');
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 OTP requests per window
  message: { success: false, message: 'Too many OTP requests from this IP, please try again after 15 minutes' }
});

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protectApplicant, getMe);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/verify-otp', otpLimiter, verifyOtp);
router.post('/reset-password', resetPassword);

// Applications routes
router.get('/applications', protectApplicant, getApplications);
router.post('/applications', protectApplicant, createApplication);
router.get('/applications/:id', protectApplicant, getApplication);
router.delete('/applications/:id', protectApplicant, deleteApplication);

// Application flow routes
router.post('/applications/:id/save-personal', protectApplicant, savePersonal);
router.post('/applications/:id/save-academic', protectApplicant, saveAcademic);
router.post('/applications/:id/save-course', protectApplicant, saveCourse);
router.post('/applications/:id/save-payment', protectApplicant, savePayment);

module.exports = router;
