const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const homePage = await prisma.contentPage.findUnique({
    where: { slug: 'home' },
    include: { sections: true }
  });

  if (homePage) {
    const heroSection = homePage.sections.find(s => s.sectionKey === 'home.hero');
    if (heroSection) {
      const content = JSON.parse(heroSection.content);
      content.ctaLink = '/admissions/registration-2026#apply-process';
      await prisma.contentSection.update({
        where: { id: heroSection.id },
        data: { content: JSON.stringify(content) }
      });
      console.log('Updated home.hero ctaLink');
    }

    const ctaSection = homePage.sections.find(s => s.sectionKey === 'home.cta');
    if (ctaSection) {
      const content = JSON.parse(ctaSection.content);
      content.buttonLink = '/admissions/registration-2026#apply-process';
      await prisma.contentSection.update({
        where: { id: ctaSection.id },
        data: { content: JSON.stringify(content) }
      });
      console.log('Updated home.cta buttonLink');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
