const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');

const login = async (usernameOrEmail, password) => {
  // Find user by username OR email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check status
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
  const { passwordHash, ...sanitizedUser } = user;

  return {
    user: sanitizedUser,
    token,
  };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    return null;
  }

  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
};

module.exports = {
  login,
  getUserById,
};
