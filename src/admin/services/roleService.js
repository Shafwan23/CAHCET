/**
 * roleService.js — Enterprise Role Definitions
 * Centralized role and status structures.
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DEPARTMENT_ADMIN: 'DEPARTMENT_ADMIN',
  FACULTY_EDITOR: 'FACULTY_EDITOR',
  PLACEMENT_CELL: 'PLACEMENT_CELL'
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.DEPARTMENT_ADMIN]: 'Department Admin',
  [ROLES.FACULTY_EDITOR]: 'Faculty Editor',
  [ROLES.PLACEMENT_CELL]: 'Placement Cell'
};

export const ACCOUNT_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOCKED: 'LOCKED',
  SUSPENDED: 'SUSPENDED'
};

export const roleService = {
  getRoleLabel(role) {
    return ROLE_LABELS[role] || 'Unknown Role';
  },

  getAllRoles() {
    return Object.keys(ROLES).map(key => ({
      value: ROLES[key],
      label: ROLE_LABELS[key]
    }));
  },

  getAllStatuses() {
    return Object.keys(ACCOUNT_STATUSES).map(key => ({
      value: ACCOUNT_STATUSES[key],
      label: ACCOUNT_STATUSES[key]
    }));
  }
};
