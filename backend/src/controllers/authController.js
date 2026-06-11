const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body; // username can be username or email

  try {
    const { user, token } = await authService.login(username, password);
    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    if (error.message === 'Invalid credentials' || error.message.startsWith('Account is')) {
      res.status(401);
      throw new Error(error.message);
    }
    throw error;
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

const logout = asyncHandler(async (req, res) => {
  // In the future, we could add the token to a blacklist database table here
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
