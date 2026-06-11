const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { permissionMiddleware } = require('../middleware/permissionMiddleware');
const { canAccessDepartment } = require('../utils/authorization');

const router = express.Router();

// Required permission: anything that only Super Admin can do, or checking the role directly
router.get('/super-admin', protect, permissionMiddleware('some:global:permission'), (req, res) => {
  res.status(200).json({ success: true, message: 'Super admin access granted' });
});

router.get('/department', protect, permissionMiddleware('department:view'), (req, res) => {
  res.status(200).json({ success: true, message: 'Department access granted' });
});

router.get('/faculty', protect, permissionMiddleware('faculty:create'), (req, res) => {
  res.status(200).json({ success: true, message: 'Faculty access granted' });
});

router.get('/placement', protect, permissionMiddleware('placement:create'), (req, res) => {
  res.status(200).json({ success: true, message: 'Placement access granted' });
});

// Extra route to test department scoping dynamically
router.get('/department/:deptId', protect, (req, res) => {
  if (!canAccessDepartment(req.user, req.params.deptId)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Department access restricted' });
  }
  res.status(200).json({ success: true, message: 'Department content access granted' });
});

module.exports = router;
