const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Research Sections...');
  
  // Create or get the Research page
  const page = await prisma.contentPage.upsert({
    where: { slug: 'research' },
    update: { title: 'Research & Development', status: 'PUBLISHED' },
    create: { title: 'Research & Development', slug: 'research', description: 'Research Center', status: 'PUBLISHED' }
  });

  const researchSections = [
    {
      sectionKey: 'research.main',
      title: 'Research Main',
      content: JSON.stringify({
        title: 'Research & Development',
        content: 'Our institution is committed to cutting-edge research. Pushing the boundaries of knowledge, fostering innovation, and creating solutions for a better tomorrow.',
        stats: { publications: '55+', patents: '3+', grants: '3Cr+', scholars: '15+' },
        sections: [
          {
            id: 1,
            title: 'Funding & Grants',
            description: 'Securing resources to drive impactful research and development. ₹3 Crores ANRF collaborative proposal submitted. ₹5 Lakhs NIDHI-PRAYAS grant received.',
            images: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80']
          },
          {
            id: 2,
            title: 'Innovation & Hackathons',
            description: 'Nurturing student innovators and startup culture. Smart India Hackathon 2025 finalists at IIT Kharagpur & Dharwad.',
            images: ['https://images.unsplash.com/photo-1504384308090-c564bd248275?auto=format&fit=crop&w=1000&q=80']
          }
        ],
        publications: [
          { id: 1, title: 'Advancements in Machine Learning for Healthcare', authors: 'Dr. S. Priya', journal: 'IEEE Transactions', year: '2025', link: '#' },
          { id: 2, title: 'IoT based Smart Grid Optimization', authors: 'Dr. K. Sarah', journal: 'Energy Reports', year: '2024', link: '#' }
        ],
        labs: [
          { id: 1, name: 'AI & Data Science Lab', description: 'Equipped with High Performance Computing clusters for deep learning research.' },
          { id: 2, name: 'Renewable Energy Center', description: 'Research facility focusing on solar grid integration and microgrids.' }
        ],
        collaborations: [
          { id: 1, name: 'Tech Innovations Inc', logoUrl: '', description: 'Joint research programs in AI.' },
          { id: 2, name: 'National Instruments', logoUrl: '', description: 'LabVIEW academy and IoT research.' }
        ],
        gallery: []
      }),
      sortOrder: 1
    }
  ];

  for (const sec of researchSections) {
    await prisma.contentSection.upsert({
      where: { pageId_sectionKey: { pageId: page.id, sectionKey: sec.sectionKey } },
      update: { content: sec.content, title: sec.title, sortOrder: sec.sortOrder },
      create: { pageId: page.id, sectionKey: sec.sectionKey, content: sec.content, title: sec.title, sortOrder: sec.sortOrder }
    });
  }

  console.log('✅ Research Sections seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
