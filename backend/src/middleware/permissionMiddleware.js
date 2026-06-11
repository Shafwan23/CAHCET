const { hasPermission } = require('../utils/authorization');

/**
 * Middleware factory that returns a middleware checking for a specific permission
 */
const permissionMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    // authMiddleware should have already run and populated req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, missing user context'
      });
    }

    const isAuthorized = hasPermission(req.user, requiredPermission);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: You do not have the required permission (${requiredPermission})`
      });
    }

    next();
  };
};

module.exports = {
  permissionMiddleware
};
