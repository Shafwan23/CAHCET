const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const page = await prisma.contentPage.findUnique({ where: { slug: 'home' } });
  
  const newVideos = {
    visible: true,
    title: 'Experience CAHCET',
    subtitle: 'Campus Media',
    description: 'Take a virtual tour of our sprawling campus and listen to the success stories of our students.',
    videos: [
      {
        url: 'https://youtu.be/BYDRoSM7b1Q',
        title: 'Campus Tour',
        desc: 'Explore our world-class infrastructure and campus life.'
      },
      {
        url: 'https://www.youtube.com/watch?v=Zj7UNw7SX2U',
        title: 'Success Story',
        desc: 'Hear from our alumni about their journey at CAHCET.'
      }
    ]
  };

  const existingSection = await prisma.contentSection.findFirst({
    where: { pageId: page.id, sectionKey: 'home.videos' }
  });

  if (existingSection) {
    await prisma.contentSection.update({
      where: { id: existingSection.id },
      data: { content: JSON.stringify(newVideos) }
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
