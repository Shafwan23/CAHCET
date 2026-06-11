const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { permissionMiddleware } = require('../middleware/permissionMiddleware');
const cmsController = require('../controllers/cmsController');
const {
  validateCreatePage,
  validateUpdatePage,
  validateCreateSection,
  validateUpdateSection
} = require('../validations/cmsValidation');

const router = express.Router();

// Public routes for fetching published content could be added here in the future,
// but for now, we assume all API routes require some form of access. 
// We will allow `cms:view` to read.

// Public routes for fetching published content
router.get('/pages', cmsController.getPages);
router.get('/pages/:slug', cmsController.getPageBySlug);
router.post('/pages', protect, permissionMiddleware('cms:create'), validateCreatePage, cmsController.createPage);
router.put('/pages/:id', protect, permissionMiddleware('cms:update'), validateUpdatePage, cmsController.updatePage);
router.delete('/pages/:id', protect, permissionMiddleware('cms:delete'), cmsController.deletePage);
router.patch('/pages/:id/publish', protect, permissionMiddleware('cms:publish'), cmsController.publishPage);

// Sections
router.get('/sections/:pageId', cmsController.getSectionsByPageId);
router.post('/sections', protect, permissionMiddleware('cms:update'), validateCreateSection, cmsController.createSection);
router.put('/sections/:id', protect, permissionMiddleware('cms:update'), validateUpdateSection, cmsController.updateSection);
router.delete('/sections/:id', protect, permissionMiddleware('cms:update'), cmsController.deleteSection);

module.exports = router;
