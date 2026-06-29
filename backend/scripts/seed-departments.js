const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEPARTMENTS = [
  { key: 'cse',   label: 'CSE',              fullName: 'Computer Science & Engineering',         color: '#3b82f6' },
  { key: 'ece',   label: 'ECE',              fullName: 'Electronics & Communication Engineering', color: '#8b5cf6' },
  { key: 'eee',   label: 'EEE',              fullName: 'Electrical & Electronics Engineering',    color: '#f59e0b' },
  { key: 'civil', label: 'CIVIL',            fullName: 'Civil Engineering',                       color: '#10b981' },
  { key: 'mech',  label: 'MECHANICAL',       fullName: 'Mechanical Engineering',                  color: '#ef4444' },
  { key: 'aids',  label: 'AI & DS',          fullName: 'Artificial Intelligence & Data Science',  color: '#6366f1' },
  { key: 'aiml',  label: 'AI & ML',          fullName: 'Artificial Intelligence & Machine Learning', color: '#8b5cf6' },
  { key: 'mca',   label: 'MCA',              fullName: 'Master of Computer Applications',         color: '#14b8a6' },
  { key: 'mba',   label: 'MBA',              fullName: 'Master of Business Administration',       color: '#f97316' },
  { key: 'sh',    label: 'S & HUMANITIES',   fullName: 'Science & Humanities',                    color: '#06b6d4' },
  { key: 'it',    label: 'IT',               fullName: 'Information Technology',                  color: '#84cc16' },
];

function createDefaultDeptData(dept) {
  return {
    overview: {
      title: dept.fullName,
      tagline: `Excellence in ${dept.fullName}`,
      established: '2001',
      hod: '',
      description: 'Welcome to the ' + dept.fullName + ' department. We aim to provide world-class education.',
      vision: 'To be a center of excellence in ' + dept.fullName + '.',
      mission: 'To impart quality education and promote research.',
      bannerImage: '',
    },
    facilities: [],
    faculties: [],
    achievements: [],
    gallery: [],
    curriculum: [],
    contact: {
      hodName: 'Dr. Head of Department',
      email: dept.key + '@cahcet.edu',
      phone: '+91 1234567890',
      location: 'Main Block',
      timings: 'Mon-Fri: 9:00 AM - 5:00 PM',
      mapEmbed: '',
    },
  };
}

async function main() {
  console.log('Seeding Departments...');
  
  for (const dept of DEPARTMENTS) {
    const slug = `dept_${dept.key}`;
    const page = await prisma.contentPage.upsert({
      where: { slug },
      update: { title: dept.fullName, status: 'PUBLISHED' },
      create: { title: dept.fullName, slug, description: `${dept.fullName} Department`, status: 'PUBLISHED' }
    });

    const data = createDefaultDeptData(dept);
    
    const sections = Object.keys(data).map((sectionKey, index) => ({
      sectionKey: `${slug}.${sectionKey}`, // e.g. dept_cse.overview
      title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
      content: JSON.stringify(data[sectionKey]),
      sortOrder: index + 1
    }));

    for (const sec of sections) {
      await prisma.contentSection.upsert({
        where: { pageId_sectionKey: { pageId: page.id, sectionKey: sec.sectionKey } },
        update: { content: sec.content, title: sec.title, sortOrder: sec.sortOrder },
        create: { pageId: page.id, sectionKey: sec.sectionKey, content: sec.content, title: sec.title, sortOrder: sec.sortOrder }
      });
    }
  }

  console.log('✅ Departments seeded successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
