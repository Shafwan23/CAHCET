const { PERMISSIONS } = require('../constants/permissions');

/**
 * Checks if user has a specific role
 */
const isSuperAdmin = (user) => {
  return user && user.role === 'SUPER_ADMIN';
};

/**
 * Checks if the user has the required permission based on their role
 */
const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  if (isSuperAdmin(user)) return true;

  const rolePermissions = PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission) || rolePermissions.includes('*');
};

/**
 * Alias for hasPermission for semantic flexibility
 */
const canAccess = (user, permission) => {
  return hasPermission(user, permission);
};

/**
 * Checks if user has permission to access resources tied to a specific department ID
 */
const canAccessDepartment = (user, targetDepartmentId) => {
  if (!user) return false;
  
  // Super Admin can access all departments
  if (isSuperAdmin(user)) return true;

  // Placement cell has special scope (they typically don't own a specific academic department,
  // or if they do, they might access all placement resources globally. For this rule we assume
  // they check permissions via normal RBAC for placement resources, not department IDs)
  if (user.role === 'PLACEMENT_CELL') return false; 

  // For Dept Admin and Faculty Editor, they can only access their own department
  if (!user.departmentId || !targetDepartmentId) return false;
  return user.departmentId === targetDepartmentId;
};

module.exports = {
  isSuperAdmin,
  hasPermission,
  canAccess,
  canAccessDepartment
};
