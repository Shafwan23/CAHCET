/**
 * userController.js — Enterprise User Management Controller
 * Handles all user management HTTP endpoints.
 */
const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const { search, role, status, departmentId, includeDeleted, sortBy, sortOrder, page, limit } = req.query;
  
  const result = await userService.getUsers({
    search,
    role,
    status,
    departmentId,
    includeDeleted: includeDeleted === 'true',
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 100,
  });

  res.status(200).json({ success: true, ...result });
});

const getUserStats = asyncHandler(async (req, res) => {
  const stats = await userService.getUserStats();
  res.status(200).json({ success: true, stats });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, user });
});

const getUserLogins = asyncHandler(async (req, res) => {
  const logins = await userService.getUserLogins(req.params.id, parseInt(req.query.limit) || 50);
  res.status(200).json({ success: true, logins });
});

const getUserActivity = asyncHandler(async (req, res) => {
  const activity = await userService.getUserActivity(req.params.id, parseInt(req.query.limit) || 50);
  res.status(200).json({ success: true, activity });
});

const getUserSessions = asyncHandler(async (req, res) => {
  const sessions = await userService.getUserSessions(req.params.id);
  res.status(200).json({ success: true, sessions });
});

const createUser = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const user = await userService.createUser(req.body, req.user, ip);
  res.status(201).json({ success: true, user, message: 'User created successfully' });
});

const updateUser = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const user = await userService.updateUser(req.params.id, req.body, req.user, ip);
  res.status(200).json({ success: true, user, message: 'User updated successfully' });
});

const changeRole = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const user = await userService.changeRole(req.params.id, req.body.role, req.user, ip);
  res.status(200).json({ success: true, user, message: 'Role changed successfully' });
});

const changeStatus = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const user = await userService.changeStatus(req.params.id, req.body.status, req.user, ip, req.body.reason);
  res.status(200).json({ success: true, user, message: 'Status changed successfully' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const result = await userService.resetPassword(req.params.id, req.body.password, req.user, ip);
  res.status(200).json({ success: true, ...result });
});

const transferDepartment = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const user = await userService.transferDepartment(req.params.id, req.body.departmentId, req.user, ip);
  res.status(200).json({ success: true, user, message: 'Department transferred successfully' });
});

const deleteUser = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const user = await userService.softDeleteUser(req.params.id, req.user, ip);
  res.status(200).json({ success: true, user, message: 'User deleted successfully' });
});

const restoreUser = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const user = await userService.restoreUser(req.params.id, req.user, ip);
  res.status(200).json({ success: true, user, message: 'User restored successfully' });
});

const terminateSession = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const result = await userService.terminateSession(req.params.sessionId, req.user, ip);
  res.status(200).json({ success: true, ...result });
});

const updatePermissions = asyncHandler(async (req, res) => {
  const ip = userService.getClientIp(req);
  const permissions = await userService.updatePermissions(req.params.id, req.body.permissions, req.user, ip);
  res.status(200).json({ success: true, permissions, message: 'Permissions updated successfully' });
});

const getAuditLogs = asyncHandler(async (req, res) => {
  const { userId, action, targetType, limit, page } = req.query;
  const result = await userService.getAuditLogs({
    userId,
    action,
    targetType,
    limit: parseInt(limit) || 100,
    page: parseInt(page) || 1,
  });
  res.status(200).json({ success: true, ...result });
});

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
  deleteUser,
  restoreUser,
  terminateSession,
  updatePermissions,
  getAuditLogs,
};
