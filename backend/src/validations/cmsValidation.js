const { z } = require('zod');

const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

const updatePageSchema = createPageSchema.partial();

const createSectionSchema = z.object({
  pageId: z.string().uuid('Invalid Page ID'),
  sectionKey: z.string().min(1, 'Section Key is required'),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

const updateSectionSchema = createSectionSchema.omit({ pageId: true }).partial();

const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
};

module.exports = {
  validateCreatePage: validateBody(createPageSchema),
  validateUpdatePage: validateBody(updatePageSchema),
  validateCreateSection: validateBody(createSectionSchema),
  validateUpdateSection: validateBody(updateSectionSchema),
};
