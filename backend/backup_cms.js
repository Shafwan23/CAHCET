const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.contentSection.findMany();
  fs.writeFileSync('cms_backup.json', JSON.stringify(sections, null, 2));
  console.log(`Backed up ${sections.length} sections to cms_backup.json`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
