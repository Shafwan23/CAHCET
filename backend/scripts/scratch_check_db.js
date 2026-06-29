const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  const keys = ['home.gallery', 'home.videos', 'departments.overview'];
  const results = {};
  
  for (const key of keys) {
    const section = await prisma.contentSection.findFirst({
      where: { sectionKey: key }
    });
    results[key] = section ? section.content : null;
  }
  
  // also check department achievements
  const cseAchievements = await prisma.contentSection.findFirst({
    where: { sectionKey: 'departments.cse.achievements' }
  });
  results['departments.cse.achievements'] = cseAchievements ? cseAchievements.content : null;
  
  console.log(JSON.stringify(results, null, 2));
  
  await prisma.$disconnect();
}

checkDb().catch(console.error);
