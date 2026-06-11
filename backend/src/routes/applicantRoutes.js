const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/applicantController');
const { protectApplicant } = require('../middleware/applicantAuthMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protectApplicant, getMe);
router.post('/forgot-password', forgotPassword);
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
