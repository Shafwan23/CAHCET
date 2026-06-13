const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const page = await prisma.contentPage.findUnique({
    where: { slug: 'home' },
    include: { sections: true }
  });
  console.log('--- HOME PAGE SECTIONS ---');
  if (page) {
    page.sections.forEach(s => {
      console.log(`Key: ${s.sectionKey}, ID: ${s.id}`);
    });
  } else {
    console.log('Home page not found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
