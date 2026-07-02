/**
 * userRoutes.js — Enterprise User Management API Routes
 * All routes protected by auth + SUPER_ADMIN middleware.
 */
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { requireSuperAdmin } = require('../middleware/superAdminMiddleware');
const userController = require('../controllers/userController');
const {
  validateCreateUser,
  validateUpdateUser,
  validateChangeRole,
  validateChangeStatus,
  validateResetPassword,
  validateTransferDepartment,
  validateUpdatePermissions,
} = require('../validations/userValidation');

const router = express.Router();

// All routes require authentication + SUPER_ADMIN
router.use(protect);
router.use(requireSuperAdmin);

// Stats & Audit
router.get('/stats', userController.getUserStats);
router.get('/audit-logs', userController.getAuditLogs);

// User CRUD
router.get('/', userController.getUsers);
router.post('/', validateCreateUser, userController.createUser);

// Single user operations
router.get('/:id', userController.getUserById);
router.put('/:id', validateUpdateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/restore', userController.restoreUser);

// Role, Status, Password, Department
router.put('/:id/role', validateChangeRole, userController.changeRole);
router.put('/:id/status', validateChangeStatus, userController.changeStatus);
router.put('/:id/reset-password', validateResetPassword, userController.resetPassword);
router.put('/:id/transfer-department', validateTransferDepartment, userController.transferDepartment);

// Permissions
router.put('/:id/permissions', validateUpdatePermissions, userController.updatePermissions);

// Activity & History
router.get('/:id/activity', userController.getUserActivity);
router.get('/:id/logins', userController.getUserLogins);
router.get('/:id/sessions', userController.getUserSessions);
router.delete('/:id/sessions/:sessionId', userController.terminateSession);

module.exports = router;
