const prisma = require('./src/config/database');

async function test() {
  const id = 'academics.sports';
  const section = await prisma.contentSection.findUnique({ where: { id } });
  console.log('Found by key as id:', section);
}

test().finally(() => prisma.$disconnect());
