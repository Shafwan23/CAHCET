/**
 * userService.js — Enterprise User Management Business Logic
 * Full CRUD, audit logging, login tracking, session management.
 * 100% backward compatible with existing auth flow.
 */
const bcrypt = require('bcrypt');
const prisma = require('../config/database');

const MAX_FAILED_LOGINS = 5;
const SALT_ROUNDS = 10;

/* ─── Helpers ─── */

function parseUserAgent(uaString) {
  if (!uaString) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };
  
  let browser = 'Unknown';
  if (uaString.includes('Firefox/')) browser = 'Firefox';
  else if (uaString.includes('Edg/')) browser = 'Edge';
  else if (uaString.includes('Chrome/')) browser = 'Chrome';
  else if (uaString.includes('Safari/')) browser = 'Safari';
  else if (uaString.includes('Opera') || uaString.includes('OPR/')) browser = 'Opera';
  
  let os = 'Unknown';
  if (uaString.includes('Windows')) os = 'Windows';
  else if (uaString.includes('Mac OS X') || uaString.includes('Macintosh')) os = 'macOS';
  else if (uaString.includes('Linux')) os = 'Linux';
  else if (uaString.includes('Android')) os = 'Android';
  else if (uaString.includes('iPhone') || uaString.includes('iPad')) os = 'iOS';
  
  let device = 'Desktop';
  if (uaString.includes('Mobile') || uaString.includes('Android') || uaString.includes('iPhone')) device = 'Mobile';
  else if (uaString.includes('iPad') || uaString.includes('Tablet')) device = 'Tablet';
  
  return { browser, os, device };
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] || 
         req.socket?.remoteAddress || 
         'unknown';
}

/* ─── Audit Logging ─── */

async function createAuditLog({ action, targetType, targetId, targetUserId, performedById, details, ipAddress }) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        targetType: targetType || 'USER',
        targetId,
        targetUserId,
        performedById,
        details: details || {},
        ipAddress,
      },
    });
  } catch (err) {
    console.error('Failed to create audit log:', err.message);
  }
}

/* ─── User CRUD ─── */

/**
 * Get all users with optional filters.
 */
async function getUsers({ search, role, status, departmentId, includeDeleted = false, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 100 } = {}) {
  const where = {};
  
  if (!includeDeleted) {
    where.isDeleted = false;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { employeeId: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) where.role = role;
  if (status) where.status = status;
  if (departmentId) where.departmentId = departmentId;

  const orderBy = {};
  orderBy[sortBy] = sortOrder;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        departmentId: true,
        status: true,
        phone: true,
        employeeId: true,
        avatar: true,
        notes: true,
        lastLogin: true,
        lastActivity: true,
        lastProfileUpdate: true,
        loginCount: true,
        failedLoginCount: true,
        mfaEnabled: true,
        forcePasswordChange: true,
        isDeleted: true,
        deletedAt: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
        department: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, name: true, username: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit };
}

/**
 * Get user stats for KPI dashboard.
 */
async function getUserStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    lockedUsers,
    suspendedUsers,
    onlineUsers,
    todayLogins,
    failedLoginsToday,
    newUsersToday,
    roleBreakdown,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.user.count({ where: { status: 'ACTIVE', isDeleted: false } }),
    prisma.user.count({ where: { status: 'INACTIVE', isDeleted: false } }),
    prisma.user.count({ where: { status: 'LOCKED', isDeleted: false } }),
    prisma.user.count({ where: { status: 'SUSPENDED', isDeleted: false } }),
    prisma.user.count({ where: { lastActivity: { gte: fiveMinutesAgo }, isDeleted: false, status: 'ACTIVE' } }),
    prisma.loginHistory.count({ where: { action: 'LOGIN', createdAt: { gte: todayStart } } }),
    prisma.loginHistory.count({ where: { action: 'FAILED_LOGIN', createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: todayStart }, isDeleted: false } }),
    prisma.user.groupBy({ by: ['role'], where: { isDeleted: false }, _count: { id: true } }),
  ]);

  const roleStats = {};
  roleBreakdown.forEach(r => { roleStats[r.role] = r._count.id; });

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    lockedUsers,
    suspendedUsers,
    onlineUsers,
    todayLogins,
    failedLoginsToday,
    newUsersToday,
    roleStats,
  };
}

/**
 * Get a single user by ID with full profile.
 */
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      departmentId: true,
      status: true,
      phone: true,
      employeeId: true,
      avatar: true,
      notes: true,
      lastLogin: true,
      lastActivity: true,
      lastProfileUpdate: true,
      loginCount: true,
      failedLoginCount: true,
      mfaEnabled: true,
      forcePasswordChange: true,
      isDeleted: true,
      deletedAt: true,
      lockedAt: true,
      lockedReason: true,
      createdById: true,
      createdAt: true,
      updatedAt: true,
      department: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, username: true } },
      permissions: { select: { id: true, resource: true, action: true, granted: true } },
    },
  });

  if (!user) throw new Error('User not found');
  return user;
}

/**
 * Get user's login history.
 */
async function getUserLogins(userId, limit = 50) {
  return prisma.loginHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Get user's audit logs (activity timeline).
 */
async function getUserActivity(userId, limit = 50) {
  return prisma.auditLog.findMany({
    where: {
      OR: [
        { targetUserId: userId },
        { performedById: userId },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      performedBy: { select: { id: true, name: true, username: true } },
      targetUser: { select: { id: true, name: true, username: true } },
    },
  });
}

/**
 * Get user's active sessions.
 */
async function getUserSessions(userId) {
  return prisma.userSession.findMany({
    where: { userId, isActive: true },
    orderBy: { lastSeen: 'desc' },
  });
}

/**
 * Create a new user.
 */
async function createUser(data, performedBy, ipAddress) {
  // Check duplicate username
  const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
  if (existingUsername) throw new Error('Username already exists');

  // Check duplicate email
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) throw new Error('Email already exists');

  // Validate department if role requires it
  if (data.departmentId) {
    const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!dept) throw new Error('Invalid department');
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username.toLowerCase().replace(/\s/g, '_'),
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      departmentId: data.departmentId || null,
      status: data.status || 'ACTIVE',
      phone: data.phone || null,
      employeeId: data.employeeId || null,
      notes: data.notes || null,
      forcePasswordChange: data.forcePasswordChange !== false,
      createdById: performedBy.id,
    },
    select: {
      id: true, name: true, username: true, email: true, role: true,
      departmentId: true, status: true, createdAt: true,
      department: { select: { id: true, name: true, code: true } },
    },
  });

  // Audit log
  await createAuditLog({
    action: 'CREATED_USER',
    targetType: 'USER',
    targetId: user.id,
    targetUserId: user.id,
    performedById: performedBy.id,
    details: { user: { name: user.name, username: user.username, role: user.role } },
    ipAddress,
  });

  return user;
}

/**
 * Update a user's profile fields.
 */
async function updateUser(id, data, performedBy, ipAddress) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error('User not found');
  if (existing.isDeleted) throw new Error('Cannot update a deleted user');

  // Check duplicate email if changed
  if (data.email && data.email.toLowerCase() !== existing.email) {
    const dup = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (dup) throw new Error('Email already in use');
  }

  // Validate department
  if (data.departmentId) {
    const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!dept) throw new Error('Invalid department');
  }

  const updateData = {};
  const allowedFields = ['name', 'email', 'phone', 'employeeId', 'notes', 'avatar', 'departmentId', 'mfaEnabled'];
  
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (data.email) updateData.email = data.email.toLowerCase();
  updateData.lastProfileUpdate = new Date();

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true, name: true, username: true, email: true, role: true,
      departmentId: true, status: true, phone: true, employeeId: true,
      notes: true, updatedAt: true,
      department: { select: { id: true, name: true, code: true } },
    },
  });

  await createAuditLog({
    action: 'UPDATED_USER',
    targetType: 'USER',
    targetId: id,
    targetUserId: id,
    performedById: performedBy.id,
    details: { before: { name: existing.name, email: existing.email }, after: updateData },
    ipAddress,
  });

  return user;
}

/**
 * Change a user's role.
 */
async function changeRole(id, newRole, performedBy, ipAddress) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error('User not found');

  // Prevent removing last SUPER_ADMIN
  if (existing.role === 'SUPER_ADMIN' && newRole !== 'SUPER_ADMIN') {
    const superAdminCount = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', isDeleted: false, id: { not: id } },
    });
    if (superAdminCount === 0) {
      throw new Error('Cannot change role: this is the last Super Admin');
    }
  }

  const oldRole = existing.role;
  const user = await prisma.user.update({
    where: { id },
    data: { role: newRole },
    select: { id: true, name: true, username: true, role: true },
  });

  await createAuditLog({
    action: 'ROLE_CHANGED',
    targetType: 'USER',
    targetId: id,
    targetUserId: id,
    performedById: performedBy.id,
    details: { before: { role: oldRole }, after: { role: newRole } },
    ipAddress,
  });

  return user;
}

/**
 * Change user status (Activate / Deactivate / Lock / Unlock / Suspend).
 */
async function changeStatus(id, newStatus, performedBy, ipAddress, reason) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error('User not found');

  // Prevent locking yourself
  if (performedBy.id === id && (newStatus === 'LOCKED' || newStatus === 'INACTIVE' || newStatus === 'SUSPENDED')) {
    throw new Error('Cannot lock/deactivate your own account');
  }

  // Prevent deactivating/locking last SUPER_ADMIN
  if (existing.role === 'SUPER_ADMIN' && newStatus !== 'ACTIVE') {
    const otherActiveAdmins = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', status: 'ACTIVE', isDeleted: false, id: { not: id } },
    });
    if (otherActiveAdmins === 0) {
      throw new Error('Cannot change status: this is the last active Super Admin');
    }
  }

  const oldStatus = existing.status;
  const updateData = { status: newStatus };
  
  if (newStatus === 'LOCKED') {
    updateData.lockedAt = new Date();
    updateData.lockedReason = reason || 'Locked by administrator';
  }
  if (newStatus === 'ACTIVE') {
    updateData.lockedAt = null;
    updateData.lockedReason = null;
    updateData.failedLoginCount = 0;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, username: true, status: true },
  });

  const actionName = newStatus === 'LOCKED' ? 'ACCOUNT_LOCKED' :
                     newStatus === 'ACTIVE' && oldStatus === 'LOCKED' ? 'ACCOUNT_UNLOCKED' :
                     newStatus === 'ACTIVE' ? 'ACCOUNT_ACTIVATED' :
                     newStatus === 'INACTIVE' ? 'ACCOUNT_DEACTIVATED' : 'STATUS_CHANGED';

  await createAuditLog({
    action: actionName,
    targetType: 'USER',
    targetId: id,
    targetUserId: id,
    performedById: performedBy.id,
    details: { before: { status: oldStatus }, after: { status: newStatus }, reason },
    ipAddress,
  });

  return user;
}

/**
 * Admin reset password.
 */
async function resetPassword(id, newPassword, performedBy, ipAddress) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error('User not found');

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id },
    data: {
      passwordHash,
      forcePasswordChange: true,
      failedLoginCount: 0,
    },
  });

  // Invalidate all sessions
  await prisma.userSession.updateMany({
    where: { userId: id },
    data: { isActive: false },
  });

  await createAuditLog({
    action: 'PASSWORD_RESET',
    targetType: 'USER',
    targetId: id,
    targetUserId: id,
    performedById: performedBy.id,
    details: { reason: 'Admin reset' },
    ipAddress,
  });

  return { success: true, message: 'Password reset successfully' };
}

/**
 * Transfer user to a different department.
 */
async function transferDepartment(id, newDepartmentId, performedBy, ipAddress) {
  const existing = await prisma.user.findUnique({
    where: { id },
    include: { department: true },
  });
  if (!existing) throw new Error('User not found');

  let newDept = null;
  if (newDepartmentId) {
    newDept = await prisma.department.findUnique({ where: { id: newDepartmentId } });
    if (!newDept) throw new Error('Invalid department');
  }

  const user = await prisma.user.update({
    where: { id },
    data: { departmentId: newDepartmentId || null },
    select: {
      id: true, name: true, username: true, departmentId: true,
      department: { select: { id: true, name: true, code: true } },
    },
  });

  await createAuditLog({
    action: 'DEPARTMENT_TRANSFERRED',
    targetType: 'USER',
    targetId: id,
    targetUserId: id,
    performedById: performedBy.id,
    details: {
      before: { department: existing.department?.name || 'None' },
      after: { department: newDept?.name || 'None' },
    },
    ipAddress,
  });

  return user;
}

/**
 * Soft delete a user.
 */
async function softDeleteUser(id, performedBy, ipAddress) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error('User not found');
  if (existing.isDeleted) throw new Error('User is already deleted');

  // Prevent deleting yourself
  if (performedBy.id === id) {
    throw new Error('Cannot delete your own account');
  }

  // Prevent deleting last SUPER_ADMIN
  if (existing.role === 'SUPER_ADMIN') {
    const otherAdmins = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', isDeleted: false, id: { not: id } },
    });
    if (otherAdmins === 0) {
      throw new Error('Cannot delete the last Super Admin');
    }
  }

  // Invalidate sessions
  await prisma.userSession.updateMany({
    where: { userId: id },
    data: { isActive: false },
  });

  const user = await prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedById: performedBy.id,
      status: 'INACTIVE',
    },
    select: { id: true, name: true, username: true },
  });

  await createAuditLog({
    action: 'USER_DELETED',
    targetType: 'USER',
    targetId: id,
    targetUserId: id,
    performedById: performedBy.id,
    details: { user: { name: existing.name, username: existing.username } },
    ipAddress,
  });

  return user;
}

/**
 * Restore a soft-deleted user.
 */
async function restoreUser(id, performedBy, ipAddress) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error('User not found');
  if (!existing.isDeleted) throw new Error('User is not deleted');

  const user = await prisma.user.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
      deletedById: null,
      status: 'ACTIVE',
    },
    select: { id: true, name: true, username: true, status: true },
  });

  await createAuditLog({
    action: 'USER_RESTORED',
    targetType: 'USER',
    targetId: id,
    targetUserId: id,
    performedById: performedBy.id,
    details: { user: { name: existing.name, username: existing.username } },
    ipAddress,
  });

  return user;
}

/**
 * Terminate a user session.
 */
async function terminateSession(sessionId, performedBy, ipAddress) {
  const session = await prisma.userSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error('Session not found');

  await prisma.userSession.update({
    where: { id: sessionId },
    data: { isActive: false },
  });

  await createAuditLog({
    action: 'SESSION_TERMINATED',
    targetType: 'USER',
    targetId: session.userId,
    targetUserId: session.userId,
    performedById: performedBy.id,
    details: { sessionId, browser: session.browser, device: session.device },
    ipAddress,
  });

  return { success: true };
}

/**
 * Update user permissions (permission matrix).
 */
async function updatePermissions(userId, permissions, performedBy, ipAddress) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  // Delete existing and recreate
  await prisma.userPermission.deleteMany({ where: { userId } });

  if (permissions && permissions.length > 0) {
    await prisma.userPermission.createMany({
      data: permissions.map(p => ({
        userId,
        resource: p.resource,
        action: p.action,
        granted: p.granted !== false,
      })),
      skipDuplicates: true,
    });
  }

  await createAuditLog({
    action: 'PERMISSIONS_UPDATED',
    targetType: 'PERMISSION',
    targetId: userId,
    targetUserId: userId,
    performedById: performedBy.id,
    details: { permissions },
    ipAddress,
  });

  return prisma.userPermission.findMany({ where: { userId } });
}

/**
 * Get all audit logs with filters.
 */
async function getAuditLogs({ userId, action, targetType, limit = 100, page = 1 } = {}) {
  const where = {};
  if (userId) {
    where.OR = [{ performedById: userId }, { targetUserId: userId }];
  }
  if (action) where.action = action;
  if (targetType) where.targetType = targetType;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        performedBy: { select: { id: true, name: true, username: true } },
        targetUser: { select: { id: true, name: true, username: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total, page, limit };
}

/**
 * Record a failed login attempt and auto-lock if threshold exceeded.
 */
async function recordFailedLogin(usernameOrEmail, ipAddress, userAgent) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      isDeleted: false,
    },
  });

  if (!user) return; // Don't reveal if user exists

  const parsed = parseUserAgent(userAgent);

  // Record failed login in history
  await prisma.loginHistory.create({
    data: {
      userId: user.id,
      action: 'FAILED_LOGIN',
      browser: parsed.browser,
      os: parsed.os,
      device: parsed.device,
      ipAddress,
      userAgent,
    },
  });

  const newCount = user.failedLoginCount + 1;

  if (newCount >= MAX_FAILED_LOGINS && user.status === 'ACTIVE') {
    // Auto-lock account
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: newCount,
        status: 'LOCKED',
        lockedAt: new Date(),
        lockedReason: `Auto-locked after ${MAX_FAILED_LOGINS} failed login attempts`,
      },
    });

    await createAuditLog({
      action: 'ACCOUNT_AUTO_LOCKED',
      targetType: 'USER',
      targetId: user.id,
      targetUserId: user.id,
      performedById: user.id,
      details: { reason: `${MAX_FAILED_LOGINS} failed login attempts`, failedCount: newCount },
      ipAddress,
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: newCount },
    });
  }
}

/**
 * Record a successful login.
 */
async function recordSuccessfulLogin(userId, ipAddress, userAgent) {
  const parsed = parseUserAgent(userAgent);

  await Promise.all([
    prisma.loginHistory.create({
      data: {
        userId,
        action: 'LOGIN',
        browser: parsed.browser,
        os: parsed.os,
        device: parsed.device,
        ipAddress,
        userAgent,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        lastLogin: new Date(),
        lastActivity: new Date(),
        loginCount: { increment: 1 },
        failedLoginCount: 0,
      },
    }),
  ]);
}

/**
 * Record a logout event.
 */
async function recordLogout(userId, ipAddress, userAgent) {
  const parsed = parseUserAgent(userAgent);

  await prisma.loginHistory.create({
    data: {
      userId,
      action: 'LOGOUT',
      browser: parsed.browser,
      os: parsed.os,
      device: parsed.device,
      ipAddress,
      userAgent,
    },
  });
}

module.exports = {
  getUsers,
  getUserStats,
  getUserById,
  getUserLogins,
  getUserActivity,
  getUserSessions,
  createUser,
  updateUser,
  changeRole,
  changeStatus,
  resetPassword,
  transferDepartment,
  softDeleteUser,
  restoreUser,
  terminateSession,
  updatePermissions,
  getAuditLogs,
  recordFailedLogin,
  recordSuccessfulLogin,
  recordLogout,
  createAuditLog,
  getClientIp,
  parseUserAgent,
};
