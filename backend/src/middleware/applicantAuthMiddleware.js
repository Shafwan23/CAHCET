const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/database');

const protectApplicant = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route. Missing token.');
  }

  try {
    const decoded = verifyToken(token);
    
    // Ensure it's an applicant token and not a staff token (we can just check existence in applicant table)
    const applicant = await prisma.applicant.findUnique({
      where: { id: decoded.id }
    });

    if (!applicant) {
      res.status(401);
      throw new Error('Applicant no longer exists.');
    }

    req.applicant = applicant;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized. Invalid token.');
  }
});

module.exports = { protectApplicant };
