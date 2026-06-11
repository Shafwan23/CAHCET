/**
 * AdminAuthContext.jsx — Real Backend Authentication Context
 * Wraps the real full-stack authService.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../../services/authService';
import { auditService, AUDIT_ACTIONS } from '../services/auditService';
import { permissionService } from '../services/permissionService';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [lockMins, setLockMins] = useState(0);

  // Restore session from API on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setSession({
            userId: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            deptKey: user.department?.code || null,
            status: user.status || 'ACTIVE',
            firstLoginRequired: false // Real backend doesn't support this yet
          });
        }
      } catch (err) {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await authService.login(username, password);
    const user = res.user;
    
    const s = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      deptKey: user.department?.code || null,
      status: user.status || 'ACTIVE',
      firstLoginRequired: false
    };
    
    setSession(s);
    setAttempts(0);
    setLockMins(0);
    
    auditService.log({
      action: AUDIT_ACTIONS.LOGIN,
      section: 'auth',
      deptKey: s.deptKey,
      performedBy: s.username,
      performedByName: s.name,
    });
    return s;
  }, []);

  const logout = useCallback(async () => {
    if (session) {
      auditService.log({
        action: AUDIT_ACTIONS.LOGOUT,
        section: 'auth',
        deptKey: session.deptKey,
        performedBy: session.username,
        performedByName: session.name,
      });
    }
    await authService.logout();
    setSession(null);
  }, [session]);

  const updatePassword = useCallback(async (currentPwd, newPwd) => {
    if (!session) throw new Error("No active session");
    console.warn("Update password not implemented on backend yet");
    // Throw error or mock
  }, [session]);

  // Permission helpers
  const canEditRoute = useCallback((pathname) => {
    return permissionService.canEditRoute(session, pathname);
  }, [session]);
  
  const canAccessDept = useCallback((deptKey) => {
    if (!session) return false;
    if (session.role === 'SUPER_ADMIN') return true;
    return session.deptKey === deptKey;
  }, [session]);

  const isSuperAdmin = session?.role === 'SUPER_ADMIN';

  const value = {
    // Session data
    session,
    admin: session, // alias
    isAuthenticated: !!session,
    firstLoginRequired: session?.firstLoginRequired || false,
    loading,

    // Role & permissions
    role: session?.role || null,
    deptKey: session?.deptKey || null,
    isSuperAdmin,
    isDeptAdmin: session?.role === 'DEPARTMENT_ADMIN',
    isFacultyEditor: session?.role === 'FACULTY_EDITOR',
    canEditRoute,
    canAccessDept, // legacy alias

    // Lockout / attempts (mocked for now since real backend doesn't handle this yet)
    attempts,
    maxAttempts: 5,
    isLocked: lockMins > 0,
    lockMinutes: lockMins,

    // Actions
    login,
    logout,
    updatePassword,

    // User management (Mocked until backend implements it)
    getAllUsers: async () => [],
    createUser: async () => {},
    updateUser: async () => {},
    deleteUser: async () => {},
    adminResetPassword: async () => {},
  };

  if (loading) return null;

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
};
