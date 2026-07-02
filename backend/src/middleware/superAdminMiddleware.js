/**
 * superAdminMiddleware.js — Restricts access to SUPER_ADMIN only
 * Returns 403 for all other roles.
 */
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Super Admin access required',
    });
  }

  next();
};

module.exports = { requireSuperAdmin };
