const prisma = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Submit a new contact message
// @route   POST /api/v1/contact
// @access  Public
exports.submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please provide name, email, and message');
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone,
      subject,
      message,
    }
  });

  res.status(201).json({
    success: true,
    data: contactMessage,
    message: 'Your message has been sent successfully!'
  });
});
