const express = require('express');
const { login, getMe, logout } = require('../controllers/authController');
const { validateLogin } = require('../validations/authValidation');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
