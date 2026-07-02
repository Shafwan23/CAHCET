/**
 * roleService.js — Enterprise Role Definitions
 * Centralized role and status structures.
 * Generic role system — department-specific access is controlled via departmentId.
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  DEPARTMENT_ADMIN: 'DEPARTMENT_ADMIN',
  PLACEMENT_ADMIN: 'PLACEMENT_ADMIN',
  ADMISSION_ADMIN: 'ADMISSION_ADMIN',
  RESEARCH_ADMIN: 'RESEARCH_ADMIN',
  EDITOR: 'EDITOR',
  CONTRIBUTOR: 'CONTRIBUTOR',
  VIEWER: 'VIEWER',
  // Legacy roles for backward compatibility
  FACULTY_EDITOR: 'FACULTY_EDITOR',
  PLACEMENT_CELL: 'PLACEMENT_CELL',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.DEPARTMENT_ADMIN]: 'Department Admin',
  [ROLES.PLACEMENT_ADMIN]: 'Placement Admin',
  [ROLES.ADMISSION_ADMIN]: 'Admission Admin',
  [ROLES.RESEARCH_ADMIN]: 'Research Admin',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.CONTRIBUTOR]: 'Contributor',
  [ROLES.VIEWER]: 'Viewer',
  [ROLES.FACULTY_EDITOR]: 'Faculty Editor',
  [ROLES.PLACEMENT_CELL]: 'Placement Cell',
};

export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]:      { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  [ROLES.ADMIN]:            { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  [ROLES.DEPARTMENT_ADMIN]: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  [ROLES.PLACEMENT_ADMIN]:  { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  [ROLES.ADMISSION_ADMIN]:  { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
  [ROLES.RESEARCH_ADMIN]:   { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
  [ROLES.EDITOR]:           { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  [ROLES.CONTRIBUTOR]:      { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  [ROLES.VIEWER]:           { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  [ROLES.FACULTY_EDITOR]:   { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  [ROLES.PLACEMENT_CELL]:   { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
};

export const STATUS_COLORS = {
  ACTIVE:    { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  INACTIVE:  { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
  LOCKED:    { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  SUSPENDED: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
};

export const ACCOUNT_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOCKED: 'LOCKED',
  SUSPENDED: 'SUSPENDED',
};

export const roleService = {
  getRoleLabel(role) {
    return ROLE_LABELS[role] || 'Unknown Role';
  },

  getRoleColor(role) {
    return ROLE_COLORS[role] || ROLE_COLORS.VIEWER;
  },

  getStatusColor(status) {
    return STATUS_COLORS[status] || STATUS_COLORS.INACTIVE;
  },

  getAllRoles() {
    return Object.keys(ROLES).map(key => ({
      value: ROLES[key],
      label: ROLE_LABELS[key],
    }));
  },

  getAssignableRoles() {
    // All roles that can be assigned by SUPER_ADMIN
    return Object.keys(ROLES).map(key => ({
      value: ROLES[key],
      label: ROLE_LABELS[key],
      description: getRoleDescription(ROLES[key]),
    }));
  },

  getAllStatuses() {
    return Object.keys(ACCOUNT_STATUSES).map(key => ({
      value: ACCOUNT_STATUSES[key],
      label: ACCOUNT_STATUSES[key],
    }));
  },
};

function getRoleDescription(role) {
  const descriptions = {
    SUPER_ADMIN: 'Full system access. Can manage users, roles, and all settings.',
    ADMIN: 'Administrative access to CMS, departments, and user management (read-only).',
    DEPARTMENT_ADMIN: 'Full control over assigned department CMS pages.',
    PLACEMENT_ADMIN: 'Manages placement data, recruiters, and placement updates.',
    ADMISSION_ADMIN: 'Manages admission pages, registration, and procedures.',
    RESEARCH_ADMIN: 'Manages research center pages and publications.',
    EDITOR: 'Can view and edit CMS pages, save drafts.',
    CONTRIBUTOR: 'Can view CMS and save drafts only.',
    VIEWER: 'Read-only access to CMS pages.',
    FACULTY_EDITOR: 'Granular access to specific department modules.',
    PLACEMENT_CELL: 'Legacy placement management role.',
  };
  return descriptions[role] || '';
}
