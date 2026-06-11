import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  DEPARTMENT_ADMIN: ['department:view', 'department:edit', 'faculty:view'],
  FACULTY_EDITOR: ['faculty:view', 'faculty:create', 'faculty:update', 'gallery:view', 'gallery:create', 'gallery:update', 'achievement:view', 'achievement:create', 'achievement:update'],
  PLACEMENT_CELL: ['placement:view', 'placement:create', 'placement:update', 'recruiter:view', 'recruiter:create', 'recruiter:update']
};

export const PermissionRoute = ({ requiredPermission, children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const rolePermissions = PERMISSIONS[user.role] || [];
  const hasAccess = rolePermissions.includes('*') || rolePermissions.includes(requiredPermission);

  if (!hasAccess) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
};
