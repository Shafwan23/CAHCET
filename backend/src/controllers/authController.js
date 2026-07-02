const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

// Import userService for login tracking (optional graceful fallback)
let userService;
try { userService = require('../services/userService'); } catch (e) { userService = null; }

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body; // username can be username or email
  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';

  try {
    const { user, token } = await authService.login(username, password);

    // Record successful login (non-blocking)
    if (userService) {
      userService.recordSuccessfulLogin(user.id, ipAddress, userAgent).catch(err => {
        console.error('Failed to record login:', err.message);
      });
    }

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    // Record failed login attempt (non-blocking)
    if (userService && (error.message === 'Invalid credentials')) {
      userService.recordFailedLogin(username, ipAddress, userAgent).catch(err => {
        console.error('Failed to record failed login:', err.message);
      });
    }

    if (error.message === 'Invalid credentials' || error.message.startsWith('Account is') || error.message.startsWith('Account is locked')) {
      res.status(401);
      throw new Error(error.message);
    }
    throw error;
  }
});

const getMe = asyncHandler(async (req, res) => {
  // Update last activity (non-blocking)
  if (userService && req.user?.id) {
    const prisma = require('../config/database');
    prisma.user.update({
      where: { id: req.user.id },
      data: { lastActivity: new Date() },
    }).catch(() => {});
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

const logout = asyncHandler(async (req, res) => {
  // Record logout (non-blocking)
  if (userService && req.user?.id) {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
    userService.recordLogout(req.user.id, ipAddress, userAgent).catch(err => {
      console.error('Failed to record logout:', err.message);
    });
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = {
  login,
  getMe,
  logout,
};
