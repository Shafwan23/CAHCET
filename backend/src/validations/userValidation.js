/**
 * userValidation.js — Zod schemas for user management endpoints
 */
const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50)
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum([
    'SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_ADMIN', 'PLACEMENT_ADMIN',
    'ADMISSION_ADMIN', 'RESEARCH_ADMIN', 'EDITOR', 'CONTRIBUTOR', 'VIEWER',
    'FACULTY_EDITOR', 'PLACEMENT_CELL'
  ]),
  departmentId: z.string().uuid().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED']).optional().default('ACTIVE'),
  phone: z.string().max(20).nullable().optional(),
  employeeId: z.string().max(50).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  forcePasswordChange: z.boolean().optional().default(true),
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).nullable().optional(),
  employeeId: z.string().max(50).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  departmentId: z.string().uuid().nullable().optional(),
  avatar: z.string().nullable().optional(),
  mfaEnabled: z.boolean().optional(),
});

const changeRoleSchema = z.object({
  role: z.enum([
    'SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_ADMIN', 'PLACEMENT_ADMIN',
    'ADMISSION_ADMIN', 'RESEARCH_ADMIN', 'EDITOR', 'CONTRIBUTOR', 'VIEWER',
    'FACULTY_EDITOR', 'PLACEMENT_CELL'
  ]),
});

const changeStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED']),
  reason: z.string().max(255).optional(),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const transferDepartmentSchema = z.object({
  departmentId: z.string().uuid().nullable(),
});

const updatePermissionsSchema = z.object({
  permissions: z.array(z.object({
    resource: z.string(),
    action: z.string(),
    granted: z.boolean().optional().default(true),
  })),
});

/* ─── Validation Middleware Factory ─── */
const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

module.exports = {
  createUserSchema,
  updateUserSchema,
  changeRoleSchema,
  changeStatusSchema,
  resetPasswordSchema,
  transferDepartmentSchema,
  updatePermissionsSchema,
  validate,
  validateCreateUser: validate(createUserSchema),
  validateUpdateUser: validate(updateUserSchema),
  validateChangeRole: validate(changeRoleSchema),
  validateChangeStatus: validate(changeStatusSchema),
  validateResetPassword: validate(resetPasswordSchema),
  validateTransferDepartment: validate(transferDepartmentSchema),
  validateUpdatePermissions: validate(updatePermissionsSchema),
};
