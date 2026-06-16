const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sec = await prisma.contentSection.findFirst({
    where: { sectionKey: 'dept_cse.faculties' }
  });
  if (sec) {
    await prisma.contentSection.update({
      where: { id: sec.id },
      data: { content: '[]' }
    });
    console.log('dept_cse.faculties cleared to empty array');
  } else {
    console.log('Not found');
  }
}
main().finally(() => prisma.$disconnect());
