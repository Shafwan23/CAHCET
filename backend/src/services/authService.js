const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');

const login = async (usernameOrEmail, password) => {
  // Find user by username OR email, exclude soft-deleted
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ],
      isDeleted: false,
    },
    include: {
      department: { select: { id: true, name: true, code: true } },
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check status
  if (user.status === 'LOCKED') {
    throw new Error('Account is locked. Please contact your administrator.');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error(`Account is ${user.status.toLowerCase()}`);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    role: user.role,
    departmentId: user.departmentId,
  });

  // Return sanitized user (exclude passwordHash)
  const { passwordHash, failedLoginCount, lockedAt, lockedReason, deletedById, deletedAt, isDeleted, ...sanitizedUser } = user;

  return {
    user: sanitizedUser,
    token,
  };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, name: true, code: true } },
    },
  });

  if (!user || user.isDeleted) {
    return null;
  }

  const { passwordHash, failedLoginCount, lockedAt, lockedReason, deletedById, deletedAt, isDeleted, ...sanitizedUser } = user;
  return sanitizedUser;
};

module.exports = {
  login,
  getUserById,
};
