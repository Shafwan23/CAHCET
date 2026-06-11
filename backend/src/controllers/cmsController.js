const prisma = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

// --- Pages ---
exports.getPages = asyncHandler(async (req, res) => {
  const pages = await prisma.contentPage.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json({ success: true, data: pages });
});

exports.getPageBySlug = asyncHandler(async (req, res) => {
  const page = await prisma.contentPage.findUnique({
    where: { slug: req.params.slug },
    include: {
      sections: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  res.status(200).json({ success: true, data: page });
});

exports.createPage = asyncHandler(async (req, res) => {
  const { title, slug, description, status } = req.body;

  // Check if slug exists
  const existing = await prisma.contentPage.findUnique({ where: { slug } });
  if (existing) {
    res.status(400);
    throw new Error('A page with this slug already exists');
  }

  const page = await prisma.contentPage.create({
    data: {
      title,
      slug,
      description,
      status: status || 'DRAFT',
      createdBy: req.user.id,
    }
  });

  res.status(201).json({ success: true, data: page });
});

exports.updatePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, slug, description, status } = req.body;

  // Verify exists
  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  // Check slug conflict
  if (slug && slug !== page.slug) {
    const existing = await prisma.contentPage.findUnique({ where: { slug } });
    if (existing) {
      res.status(400);
      throw new Error('A page with this slug already exists');
    }
  }

  const updatedPage = await prisma.contentPage.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      status,
      updatedBy: req.user.id
    }
  });

  res.status(200).json({ success: true, data: updatedPage });
});

exports.deletePage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  await prisma.contentPage.delete({ where: { id } });

  res.status(200).json({ success: true, message: 'Page deleted successfully' });
});

exports.publishPage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  const updatedPage = await prisma.contentPage.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      updatedBy: req.user.id
    }
  });

  res.status(200).json({ success: true, data: updatedPage });
});

// --- Sections ---
exports.getSectionsByPageId = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  const sections = await prisma.contentSection.findMany({
    where: { pageId },
    orderBy: { sortOrder: 'asc' }
  });
  res.status(200).json({ success: true, data: sections });
});

exports.createSection = asyncHandler(async (req, res) => {
  const { pageId, sectionKey, title, content, sortOrder } = req.body;

  // Check if page exists
  const page = await prisma.contentPage.findUnique({ where: { id: pageId } });
  if (!page) {
    res.status(404);
    throw new Error('Parent page not found');
  }

  // Check unique section key for this page
  const existing = await prisma.contentSection.findUnique({
    where: { pageId_sectionKey: { pageId, sectionKey } }
  });
  if (existing) {
    res.status(400);
    throw new Error('A section with this key already exists on this page');
  }

  const section = await prisma.contentSection.create({
    data: {
      pageId,
      sectionKey,
      title,
      content,
      sortOrder: sortOrder || 0
    }
  });

  res.status(201).json({ success: true, data: section });
});

exports.updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sectionKey, title, content, sortOrder } = req.body;

  const section = await prisma.contentSection.findUnique({ where: { id } });
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  if (sectionKey && sectionKey !== section.sectionKey) {
    const existing = await prisma.contentSection.findUnique({
      where: { pageId_sectionKey: { pageId: section.pageId, sectionKey } }
    });
    if (existing) {
      res.status(400);
      throw new Error('A section with this key already exists on this page');
    }
  }

  const updatedSection = await prisma.contentSection.update({
    where: { id },
    data: {
      sectionKey,
      title,
      content,
      sortOrder
    }
  });

  res.status(200).json({ success: true, data: updatedSection });
});

exports.deleteSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const section = await prisma.contentSection.findUnique({ where: { id } });
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  await prisma.contentSection.delete({ where: { id } });

  res.status(200).json({ success: true, message: 'Section deleted successfully' });
});
