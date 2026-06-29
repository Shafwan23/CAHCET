const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const courses = [
  { id: 1, department: 'cse', name: 'B.E. Computer Science and Engineering', icon: 'Cpu', duration: '4 Years', description: 'Comprehensive study of computer systems and software development.', featured: true },
  { id: 2, department: 'ece', name: 'B.E. Electronics & Communication', icon: 'Radio', duration: '4 Years', description: 'Core electronics and modern communication systems.', featured: false },
  { id: 3, department: 'eee', name: 'B.E. Electrical & Electronics', icon: 'Zap', duration: '4 Years', description: 'Advanced electrical systems and power engineering.', featured: false },
  { id: 4, department: 'civil', name: 'B.E. Civil Engineering', icon: 'Compass', duration: '4 Years', description: 'Infrastructure, construction, and structural engineering.', featured: false },
  { id: 5, department: 'mech', name: 'B.E. Mechanical Engineering', icon: 'Wrench', duration: '4 Years', description: 'Design, manufacturing, and mechanics of machines.', featured: false },
  { id: 6, department: 'aids', name: 'B.Tech AI & Data Science', icon: 'Database', duration: '4 Years', description: 'Specialized program in artificial intelligence and data analytics.', featured: true },
  { id: 7, department: 'aiml', name: 'B.Tech AI & Machine Learning', icon: 'BrainCircuit', duration: '4 Years', description: 'Focus on machine learning models and intelligent systems.', featured: false },
  { id: 8, department: 'it', name: 'B.Tech Information Technology', icon: 'Network', duration: '4 Years', description: 'Modern software development and IT infrastructure.', featured: false },
  { id: 9, department: 'mca', name: 'Master of Computer Applications', icon: 'Terminal', duration: '2 Years', description: 'Advanced professional program in software applications.', featured: false },
  { id: 10, department: 'mba', name: 'Master of Business Administration', icon: 'Briefcase', duration: '2 Years', description: 'Professional management and leadership program.', featured: true },
];

const accreditations = [
  { id: 1, title: 'Anna University', description: 'Affiliated to Anna University', logoUrl: '' },
  { id: 2, title: 'NBA', description: 'National Board of Accreditation', logoUrl: '' },
  { id: 3, title: 'AICTE', description: 'Approved by AICTE', logoUrl: '' }
];

const steps = [
  { id: 1, stepNumber: '1', title: 'Create an Account', description: 'Sign up and verify your email to begin the application process', icon: 'UserPlus' },
  { id: 2, stepNumber: '2', title: 'Fill Personal Details', description: 'Provide your contact information and personal background', icon: 'User' },
  { id: 3, stepNumber: '3', title: 'Academic Information', description: 'Enter your educational history and academic achievements', icon: 'GraduationCap' },
  { id: 4, stepNumber: '4', title: 'Choose Courses', description: 'Select your preferred courses and specializations', icon: 'BookOpen' },
  { id: 5, stepNumber: '5', title: 'Make Payment', description: 'Pay the application fee securely through our portal', icon: 'CreditCard' },
];

async function main() {
  console.log('Seeding Admissions data...');
  
  const page = await prisma.contentPage.upsert({
    where: { slug: 'admissions' },
    update: { title: 'Admissions', status: 'PUBLISHED' },
    create: { title: 'Admissions', slug: 'admissions', description: 'Admissions Portal Data', status: 'PUBLISHED' }
  });

  const sections = [
    { sectionKey: 'admissions.programs', title: 'Programs Offered', content: JSON.stringify({ courses }) },
    { sectionKey: 'admissions.process', title: 'Application Process', content: JSON.stringify({ steps }) },
    { sectionKey: 'admissions.accreditations', title: 'Accreditations', content: JSON.stringify({ accreditations }) }
  ];

  for (const sec of sections) {
    await prisma.contentSection.upsert({
      where: { pageId_sectionKey: { pageId: page.id, sectionKey: sec.sectionKey } },
      update: { content: sec.content, title: sec.title },
      create: { pageId: page.id, sectionKey: sec.sectionKey, content: sec.content, title: sec.title }
    });
  }

  console.log('✅ Admissions data seeded successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
