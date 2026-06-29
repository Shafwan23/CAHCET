const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Placements Sections...');
  
  const page = await prisma.contentPage.upsert({
    where: { slug: 'placements' },
    update: { title: 'Placements', status: 'PUBLISHED' },
    create: { title: 'Placements', slug: 'placements', description: 'Placement Cell', status: 'PUBLISHED' }
  });

  const recruitersData = [
    { id: 'rec_1', companyName: 'TCS', logoUrl: '', description: 'IT Services', packageRange: '3.5 - 7 LPA', rolesOffered: 'System Engineer', studentsSelected: 120, department: 'All', year: '2026', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'rec_2', companyName: 'Infosys', logoUrl: '', description: 'Consulting', packageRange: '4 - 8 LPA', rolesOffered: 'Systems Engineer', studentsSelected: 85, department: 'All', year: '2026', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

  const studentsData = [
    { id: 'stu_1', studentName: 'Adithya Rajan', photoUrl: '', companyName: 'TCS', package: '7 LPA', role: 'System Engineer', testimonial: 'Great experience', linkedinUrl: '', department: 'CSE', year: '2026', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'stu_2', studentName: 'Anjali Nair', photoUrl: '', companyName: 'Infosys', package: '8 LPA', role: 'Systems Engineer', testimonial: 'Excellent placement cell', linkedinUrl: '', department: 'ECE', year: '2026', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

  const placementSections = [
    { sectionKey: 'placements.recruiters', title: 'Recruiters', content: JSON.stringify(recruitersData), sortOrder: 1 },
    { sectionKey: 'placements.students', title: 'Students Placed', content: JSON.stringify(studentsData), sortOrder: 2 }
  ];

  for (const sec of placementSections) {
    await prisma.contentSection.upsert({
      where: { pageId_sectionKey: { pageId: page.id, sectionKey: sec.sectionKey } },
      update: { content: sec.content, title: sec.title, sortOrder: sec.sortOrder },
      create: { pageId: page.id, sectionKey: sec.sectionKey, content: sec.content, title: sec.title, sortOrder: sec.sortOrder }
    });
  }

  console.log('✅ Placements Sections seeded successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
