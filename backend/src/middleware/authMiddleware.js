const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/jwt');
const authService = require('../services/authService');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route. Missing token.');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Fetch user and check if still exists
    const user = await authService.getUserById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('The user belonging to this token no longer exists.');
    }

    // Attach user to req object
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized to access this route. Invalid token.');
  }
});

module.exports = { protect };
