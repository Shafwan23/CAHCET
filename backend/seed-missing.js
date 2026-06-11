const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding missing pages...');
  
  const pages = [
    { title: 'Updates', slug: 'updates', description: 'News, Events, and Announcements' },
    { title: 'System', slug: 'system', description: 'System Configuration' },
    { title: 'Gallery', slug: 'gallery', description: 'Image Gallery' },
    { title: 'Faculty', slug: 'faculty', description: 'Faculty Directory' },
    { title: 'SEO', slug: 'seo', description: 'Search Engine Optimization' },
    { title: 'Research', slug: 'research', description: 'Research Center' }
  ];

  for (const p of pages) {
    await prisma.contentPage.upsert({
      where: { slug: p.slug },
      update: {},
      create: { title: p.title, slug: p.slug, description: p.description, status: 'PUBLISHED' }
    });
  }

  // Find pages
  const updatesPage = await prisma.contentPage.findUnique({ where: { slug: 'updates' }});
  const systemPage = await prisma.contentPage.findUnique({ where: { slug: 'system' }});
  const galleryPage = await prisma.contentPage.findUnique({ where: { slug: 'gallery' }});
  const facultyPage = await prisma.contentPage.findUnique({ where: { slug: 'faculty' }});
  const seoPage = await prisma.contentPage.findUnique({ where: { slug: 'seo' }});
  const researchPage = await prisma.contentPage.findUnique({ where: { slug: 'research' }});

  // Updates Sections
  const updatesSections = [
    { sectionKey: 'updates.events', title: 'Events', content: '[]' },
    { sectionKey: 'updates.announcements', title: 'Announcements', content: '[]' },
    { sectionKey: 'updates.newsletters', title: 'Newsletters', content: '[]' },
    { sectionKey: 'updates.placements', title: 'Placements', content: '[]' }
  ];
  for (const sec of updatesSections) {
    await prisma.contentSection.upsert({
      where: { pageId_sectionKey: { pageId: updatesPage.id, sectionKey: sec.sectionKey } },
      update: {}, create: { pageId: updatesPage.id, ...sec }
    });
  }

  // Faculty Sections
  await prisma.contentSection.upsert({
    where: { pageId_sectionKey: { pageId: facultyPage.id, sectionKey: 'faculty.list' } },
    update: {}, create: { pageId: facultyPage.id, sectionKey: 'faculty.list', title: 'Faculty List', content: '[]' }
  });

  // Gallery Sections
  await prisma.contentSection.upsert({
    where: { pageId_sectionKey: { pageId: galleryPage.id, sectionKey: 'gallery.images' } },
    update: {}, create: { pageId: galleryPage.id, sectionKey: 'gallery.images', title: 'Images', content: '[]' }
  });

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
