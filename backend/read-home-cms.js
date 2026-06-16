const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const page = await prisma.contentPage.findUnique({
    where: { slug: 'home' },
    include: { sections: true }
  });
  console.log(JSON.stringify(page, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
