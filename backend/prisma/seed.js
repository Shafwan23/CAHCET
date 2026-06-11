const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science and Engineering' },
  { code: 'ECE', name: 'Electronics and Communication Engineering' },
  { code: 'EEE', name: 'Electrical and Electronics Engineering' },
  { code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
  { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'CIVIL', name: 'Civil Engineering' },
  { code: 'MECH', name: 'Mechanical Engineering' },
  { code: 'MBA', name: 'Master of Business Administration' },
  { code: 'MCA', name: 'Master of Computer Applications' },
  { code: 'SH', name: 'Science and Humanities' },
];

async function main() {
  console.log('Start seeding...');

  // 1. Seed Departments
  console.log('Seeding Departments...');
  const departmentMap = {};
  for (const dept of DEPARTMENTS) {
    const createdDept = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name },
      create: { code: dept.code, name: dept.name },
    });
    departmentMap[dept.code] = createdDept.id;
  }
  console.log(`✅ ${DEPARTMENTS.length} departments seeded successfully.`);

  // 2. Generate secure default passwords
  const superAdminPassword = 'Super@Admin#2026';
  const placementAdminPassword = 'Placements#Secure!55';
  const facultyEditorPassword = 'Faculty#Secure!44';

  // 3. Hash passwords
  const superAdminHash = await bcrypt.hash(superAdminPassword, 10);
  const placementAdminHash = await bcrypt.hash(placementAdminPassword, 10);
  const facultyEditorHash = await bcrypt.hash(facultyEditorPassword, 10);

  // 4. Seed Users
  console.log('Seeding Default Users...');
  const usersToSeed = [
    {
      username: 'superadmin',
      email: 'superadmin@cahcet.edu',
      name: 'System Super Admin',
      passwordHash: superAdminHash,
      role: 'SUPER_ADMIN',
      plainTextPasswordForReport: superAdminPassword,
      departmentId: null
    },
    {
      username: 'placement_admin',
      email: 'placement@cahcet.edu',
      name: 'Placement Administrator',
      passwordHash: placementAdminHash,
      role: 'PLACEMENT_CELL',
      plainTextPasswordForReport: placementAdminPassword,
      departmentId: null
    },
    {
      username: 'faculty_editor',
      email: 'faculty@cahcet.edu',
      name: 'General Faculty Editor',
      passwordHash: facultyEditorHash,
      role: 'FACULTY_EDITOR',
      plainTextPasswordForReport: facultyEditorPassword,
      departmentId: departmentMap['CSE']
    }
  ];

  // Add all 11 department admins
  const deptPasswords = {
    'CSE': 'Cse#SecureAdmin!99',
    'ECE': 'Ece#SecureAdmin!88',
    'AIML': 'Aiml#SecureAdmin!77',
    'MCA': 'Mca#SecureAdmin!66',
  };

  for (const dept of DEPARTMENTS) {
    const code = dept.code;
    const pwd = deptPasswords[code] || `${code.charAt(0).toUpperCase() + code.slice(1).toLowerCase()}#SecureAdmin!11`;
    const hash = await bcrypt.hash(pwd, 10);
    usersToSeed.push({
      username: `${code.toLowerCase()}_admin`,
      email: `${code.toLowerCase()}_admin@cahcet.edu`,
      name: `${code} Department Admin`,
      passwordHash: hash,
      role: 'DEPARTMENT_ADMIN',
      plainTextPasswordForReport: pwd,
      departmentId: departmentMap[code]
    });
  }

  console.log('\n=======================================');
  console.log('DEFAULT ADMINISTRATIVE ACCOUNTS');
  console.log('=======================================');

  for (const user of usersToSeed) {
    const { plainTextPasswordForReport, ...userData } = user;
    
    await prisma.user.upsert({
      where: { username: user.username },
      update: {
        email: user.email,
        name: user.name,
        role: user.role,
        departmentId: user.departmentId,
        passwordHash: user.passwordHash,
        status: 'ACTIVE'
      },
      create: {
        ...userData,
        status: 'ACTIVE'
      },
    });

    console.log(`Username   : ${user.username}`);
    console.log(`Role       : ${user.role}`);
    console.log(`Password   : ${plainTextPasswordForReport}`);
    console.log('---------------------------------------');
  }

  console.log('Seeding Default CMS Pages...');
  const defaultPages = [
    { title: 'Home', slug: 'home', description: 'Homepage of CAHCET' },
    { title: 'About', slug: 'about', description: 'About CAHCET' },
    { title: 'Admissions', slug: 'admissions', description: 'Admissions Information' },
    { title: 'Academics', slug: 'academics', description: 'Academics Information' },
    { title: 'Placements', slug: 'placements', description: 'Placement Cell' },
    { title: 'Contact', slug: 'contact', description: 'Contact Information' },
  ];

  for (const p of defaultPages) {
    await prisma.contentPage.upsert({
      where: { slug: p.slug },
      update: { title: p.title, description: p.description, status: 'PUBLISHED' },
      create: { title: p.title, slug: p.slug, description: p.description, status: 'PUBLISHED' }
    });
  }
  console.log('✅ CMS Pages seeded successfully.');

  console.log('Seeding Homepage Sections...');
  const homePage = await prisma.contentPage.findUnique({ where: { slug: 'home' }});
  
  if (homePage) {
    const homeSections = [
      {
        sectionKey: 'home.hero',
        title: 'Hero Section',
        content: JSON.stringify({
          title: 'Engineering Excellence',
          subtitle: "Shaping tomorrow's leaders and innovators today",
          ctaText: 'Apply Now 2026',
          ctaLink: '/admissions',
          showTextOverlay: true
        }),
        sortOrder: 1
      },
      {
        sectionKey: 'home.welcome',
        title: 'Welcome Section',
        content: JSON.stringify({
          title: 'Welcome to CAHCET',
          subtitle: 'A Legacy of Engineering Excellence Since 1998',
          description: 'C. Abdul Hakeem College of Engineering and Technology (CAHCET) has been at the forefront of technical education for over two decades. Our institution is dedicated to providing a holistic learning environment that fosters innovation, critical thinking, and practical expertise.',
          mission: 'Our mission is to nurture engineers who are not only technically proficient but also socially responsible leaders.'
        }),
        sortOrder: 2
      },
      {
        sectionKey: 'home.statistics',
        title: 'Statistics Section',
        content: JSON.stringify([
          { label: 'Successful Placements', value: '95', suffix: '%', icon: '🎯' },
          { label: 'Expert Faculty', value: '250', suffix: '+', icon: '👨‍🏫' },
          { label: 'Companies Visited', value: '150', suffix: '+', icon: '🏢' },
          { label: 'Highest Package', value: '24', suffix: ' LPA', icon: '💰' }
        ]),
        sortOrder: 3
      },
      {
        sectionKey: 'home.departments',
        title: 'Departments Section',
        content: JSON.stringify({
          subtitle: 'Academic Departments',
          title: 'Future-Ready Engineering Programs',
          description: 'Our departments are equipped with state-of-the-art laboratories and led by industry experts to provide a comprehensive learning experience.',
          items: [
            { name: 'Computer Science', code: 'CSE', icon: 'Code', color: 'from-blue-500 to-primary-600' },
            { name: 'AI & Data Science', code: 'AIDS', icon: 'Database', color: 'from-primary-500 to-pink-600' },
            { name: 'Information Technology', code: 'IT', icon: 'Cpu', color: 'from-cyan-500 to-blue-600' },
            { name: 'Mechanical Engineering', code: 'MECH', icon: 'Settings', color: 'from-amber-500 to-amber-600' },
            { name: 'Electronics & Comm.', code: 'ECE', icon: 'Radio', color: 'from-amber-500 to-primary-600' },
            { name: 'Electrical & Electronics', code: 'EEE', icon: 'Zap', color: 'from-yellow-500 to-amber-600' },
            { name: 'AI & Machine Learning', code: 'AIML', icon: 'BrainCircuit', color: 'from-violet-500 to-primary-600' },
            { name: 'Civil Engineering', code: 'CIVIL', icon: 'Building2', color: 'from-slate-500 to-slate-700' }
          ]
        }),
        sortOrder: 4
      },
      {
        sectionKey: 'home.facilities',
        title: 'Facilities Section',
        content: JSON.stringify({
          title: 'World-Class Infrastructure',
          items: [
            { title: 'Advanced Labs', description: 'State-of-the-art laboratories with modern equipment.' },
            { title: 'Smart Classrooms', description: 'Interactive learning spaces with modern teaching aids.' },
            { title: 'Central Library', description: 'Vast collection of books and digital resources.' },
            { title: 'Sports Complex', description: 'Excellent facilities for indoor and outdoor sports.' }
          ]
        }),
        sortOrder: 5
      },
      {
        sectionKey: 'home.placements',
        title: 'Placements Section',
        content: JSON.stringify({
          title: 'Placement Excellence',
          description: 'Top recruiters trust CAHCET for quality engineering talent.',
          recruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Tech Mahindra']
        }),
        sortOrder: 6
      },
      {
        sectionKey: 'home.dynamicinfo',
        title: 'Dynamic Info Section',
        content: JSON.stringify({
          events: {
            title: 'Latest Events',
            items: [
              { date: 'May 15, 2026', title: 'Annual Tech Symposium', desc: 'A national level technical symposium.' },
              { date: 'May 10, 2026', title: 'Workshop on Quantum Computing', desc: 'Industry experts from IBM delivered hands-on training.' }
            ]
          },
          placements: {
            title: 'Placement Updates',
            items: [
              { date: 'May 12, 2026', title: '150+ Students Placed in TCS', desc: 'Mass recruitment drive yields excellent results.' }
            ]
          },
          announcements: {
            title: 'Announcements',
            items: [
              { date: 'May 14, 2026', title: 'Odd Semester Results Published', desc: 'Students can check their results on the college portal.' }
            ]
          },
          newsletters: {
            title: 'Newsletters',
            items: [
              { date: 'April 2026', title: 'CAHCET Chronicle - Issue 45', desc: 'Quarterly newsletter covering campus achievements.' }
            ]
          }
        }),
        sortOrder: 7
      },
      {
        sectionKey: 'home.cta',
        title: 'CTA Section',
        content: JSON.stringify({
          title: 'Ready to Engineer Your Future?',
          subtitle: 'Join CAHCET and transform your dreams into reality.',
          buttonText: 'Apply for 2026 Admissions',
          buttonLink: '/admissions'
        }),
        sortOrder: 8
      }
    ];

    for (const sec of homeSections) {
      await prisma.contentSection.upsert({
        where: { pageId_sectionKey: { pageId: homePage.id, sectionKey: sec.sectionKey } },
        update: { content: sec.content, title: sec.title, sortOrder: sec.sortOrder },
        create: { pageId: homePage.id, sectionKey: sec.sectionKey, content: sec.content, title: sec.title, sortOrder: sec.sortOrder }
      });
    }
    console.log('✅ Homepage Sections seeded successfully.');
  }

  console.log('Seeding About Sections...');
  const aboutPage = await prisma.contentPage.findUnique({ where: { slug: 'about' }});
  if (aboutPage) {
    const aboutSections = [
      {
        sectionKey: 'about.hero',
        title: 'Hero Banner',
        content: JSON.stringify({
          title: 'Nurturing Excellence, <br />Empowering Futures',
          subtitle: 'Discover the legacy, values, and vision of C. Abdul Hakeem College of Engineering and Technology.',
          bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1986&q=80'
        }),
        sortOrder: 1
      },
      {
        sectionKey: 'about.college',
        title: 'About College Content',
        content: JSON.stringify({
          title: 'An Education That Inspires',
          overview: 'C. Abdul Hakeem College of Engineering and Technology is more than just a place of learning. It is a community where ideas are born, leaders are forged, and futures are shaped. We are dedicated to providing a transformative educational experience.'
        }),
        sortOrder: 2
      },
      {
        sectionKey: 'about.history',
        title: 'History',
        content: JSON.stringify({
          sections: [
            {
              id: 1,
              title: 'A Legacy of Excellence',
              text: 'Founded with a vision to empower minds and transform futures, our institution has been at the forefront of technical education for over two decades. We combine rigorous academics with a vibrant campus culture to create an environment where students can thrive.',
              image: 'https://images.unsplash.com/photo-1541339907198-e08756defe12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              align: 'left'
            },
            {
              id: 2,
              title: 'Innovative Learning Spaces',
              text: 'Our campus features state-of-the-art laboratories, modern classrooms, and collaborative spaces designed to foster innovation and creativity. We believe that the right environment plays a crucial role in shaping the learning experience.',
              image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              align: 'right'
            }
          ]
        }),
        sortOrder: 3
      },
      {
        sectionKey: 'about.parentOrganization',
        title: 'Parent Organization',
        content: JSON.stringify({
          title: 'Melvisharam Muslim Educational Society',
          description: 'Founded in 1918, MMES has been a pioneer in education for over a century. The society is dedicated to raising the standard of education in the region and providing opportunities for all sections of society to excel in various fields.',
          shortName: 'MMES',
          since: 'Since 1918'
        }),
        sortOrder: 4
      },
      {
        sectionKey: 'about.vision',
        title: 'Vision',
        content: JSON.stringify({
          title: 'Institution Vision',
          statement: 'To be a premier institution of academic excellence, research, and innovation, producing globally competent and socially responsible leaders who contribute to the progress of society.',
          author: 'Founding Vision'
        }),
        sortOrder: 5
      },
      {
        sectionKey: 'about.mission',
        title: 'Mission',
        content: JSON.stringify({
          title: 'Institution Mission',
          statements: [
            { id: 1, title: 'Academic Excellence', desc: 'To provide high-quality education through innovative teaching methodologies, state-of-the-art infrastructure, and continuous curriculum enhancement.', icon: 'Target' },
            { id: 2, title: 'Research & Innovation', desc: 'To foster a culture of research, creativity, and entrepreneurship among students and faculty to solve real-world problems.', icon: 'Lightbulb' },
            { id: 3, title: 'Holistic Development', desc: 'To nurture the physical, mental, and emotional well-being of students through sports, cultural activities, and value-based education.', icon: 'Heart' },
            { id: 4, title: 'Social Responsibility', desc: 'To instill a sense of ethics, integrity, and social responsibility in our students to make them responsible global citizens.', icon: 'Users' }
          ]
        }),
        sortOrder: 6
      },
      {
        sectionKey: 'about.chairman',
        title: 'Chairman Message',
        content: JSON.stringify({
          id: 'chairman',
          name: 'Dr. S. Ziauddin Ahmed, B.A.',
          designation: 'Chairman',
          image: '/src/assets/images/chairman.png',
          message: [
            'Welcome to CAHCET. Our vision is to provide world-class technical education that empowers students to become leaders and innovators in their fields. We are committed to fostering an environment of excellence, research, and holistic development.',
            'We believe that education is not just about acquiring knowledge but also about developing character and a sense of responsibility towards society. Our state-of-the-art infrastructure and dedicated faculty ensure that our students receive the best possible preparation for their future careers.',
            'I invite you to explore our campus and discover the opportunities that await you at CAHCET.'
          ],
          signature: 'S. Ziauddin Ahmed'
        }),
        sortOrder: 7
      },
      {
        sectionKey: 'about.principal',
        title: 'Principal Message',
        content: JSON.stringify({
          id: 'principal',
          name: 'Dr. M. Sasikumar',
          designation: 'Principal',
          image: '/src/assets/images/principal.png',
          message: [
            'It is my privilege to lead CAHCET, an institution known for its academic rigour and vibrant campus life. Our faculty are experts in their fields and are dedicated to providing a high-quality learning experience.',
            'We emphasize practical learning, industry interaction, and research from the very beginning. Our students are encouraged to innovate and think critically to solve real-world problems.',
            'I am confident that our students will continue to excel and bring laurels to the institution. I wish them all the very best in their endeavours.'
          ],
          signature: 'M. Sasikumar'
        }),
        sortOrder: 8
      },
      {
        sectionKey: 'about.accreditation',
        title: 'Accreditation',
        content: JSON.stringify({
          documents: [
            { id: 1, title: 'Extension of Approval (EOA) 2025-2026', desc: 'AICTE approval for the academic year 2025-2026 for all engineering and management courses.', url: '#' },
            { id: 2, title: 'Extension of Approval (EOA) 2024-2025', desc: 'AICTE approval for the academic year 2024-2025 for all engineering and management courses.', url: '#' },
            { id: 3, title: 'Extension of Approval (EOA) 2023-2024', desc: 'AICTE approval for the academic year 2023-2024 for all engineering and management courses.', url: '#' },
            { id: 4, title: 'Extension of Approval (EOA) 2022-2023', desc: 'AICTE approval for the academic year 2022-2023 for all engineering and management courses.', url: '#' },
            { id: 5, title: 'Extension of Approval (EOA) 1998-2022', desc: 'Archive of AICTE approvals from inception year 1998 to 2022.', url: '#' }
          ]
        }),
        sortOrder: 9
      },
      {
        sectionKey: 'about.recognition',
        title: 'Recognition',
        content: JSON.stringify({
          documents: [
            { id: 1, title: 'NBA Accreditation', desc: 'National Board of Accreditation for eligible B.E. / B.Tech programs.', status: 'Accredited', url: '#' },
            { id: 2, title: 'NAAC Accreditation', desc: 'National Assessment and Accreditation Council accreditation with premium grade.', status: 'Accredited', url: '#' },
            { id: 3, title: 'Student Admission Approval - DOTE', desc: 'Directorate of Technical Education approval for student admissions.', status: 'Approved', url: '#' },
            { id: 5, title: 'Minority Approval', desc: 'Government order recognizing the institution as a linguistic minority institution.', status: 'Approved', url: '#' },
            { id: 6, title: 'EPFO FORM 5A', desc: "Employees' Provident Fund Organization registration and compliance document.", status: 'Filed', url: '#' }
          ]
        }),
        sortOrder: 10
      },
      {
        sectionKey: 'about.affiliation',
        title: 'Affiliation',
        content: JSON.stringify({
          documents: [
            { id: 4, title: 'Anna University Affiliation', desc: 'Permanent and provisional affiliation orders from Anna University, Chennai.', status: 'Affiliated', url: '#' }
          ]
        }),
        sortOrder: 11
      }
    ];

    for (const sec of aboutSections) {
      await prisma.contentSection.upsert({
        where: { pageId_sectionKey: { pageId: aboutPage.id, sectionKey: sec.sectionKey } },
        update: { content: sec.content, title: sec.title, sortOrder: sec.sortOrder },
        create: { pageId: aboutPage.id, sectionKey: sec.sectionKey, content: sec.content, title: sec.title, sortOrder: sec.sortOrder }
      });
    }
    console.log('✅ About Sections seeded successfully.');
  }

  console.log('Seeding Admissions Sections...');
  const admissionsPage = await prisma.contentPage.findUnique({ where: { slug: 'admissions' }});
  if (admissionsPage) {
    const admissionsSections = [
      {
        sectionKey: 'admissions.hero',
        title: 'Hero Banner',
        content: JSON.stringify({
          title: 'Admissions 2026',
          subtitle: 'Join CAHCET and transform your dreams into reality.',
          showTextOverlay: true,
          ctaText: 'Apply Now 2026',
          ctaLink: '/admissions/registration-2026'
        }),
        sortOrder: 1
      },
      {
        sectionKey: 'admissions.eligibility',
        title: 'Eligibility Criteria',
        content: JSON.stringify({
          eligibility: '10+2 with Physics, Chemistry, Mathematics with minimum 45% marks'
        }),
        sortOrder: 2
      },
      {
        sectionKey: 'admissions.programs',
        title: 'Programs Offered',
        content: JSON.stringify({
          courses: [
            { id: 1, name: 'B.E. Computer Science', duration: '4 Years', eligibility: '10+2 with Physics, Chemistry, Math', intake: '120', description: 'Core CS degree.', icon: 'Laptop', featured: true, department: 'CSE' },
            { id: 2, name: 'B.E. Electronics & Communication', duration: '4 Years', eligibility: '10+2 PCM', intake: '60', description: 'Electronics and Communication', icon: 'Cpu', featured: false, department: 'ECE' }
          ]
        }),
        sortOrder: 3
      },
      {
        sectionKey: 'admissions.process',
        title: 'Admission Process',
        content: JSON.stringify({
          steps: [
            { id: '1', stepNumber: '01', title: 'Online Registration', description: 'Fill and submit the online application form with required details.', icon: 'Edit3' },
            { id: '2', stepNumber: '02', title: 'Document Verification', description: 'Upload scanned copies of required documents for verification.', icon: 'CheckSquare' },
            { id: '3', stepNumber: '03', title: 'Counseling', description: 'Attend the scheduled counseling session for seat allotment.', icon: 'Users' },
            { id: '4', stepNumber: '04', title: 'Fee Payment', description: 'Pay the admission fee to confirm your seat.', icon: 'CreditCard' }
          ]
        }),
        sortOrder: 4
      },
      {
        sectionKey: 'admissions.documents',
        title: 'Required Documents',
        content: JSON.stringify({
          documents: [
            '10th Mark Sheet',
            '12th Mark Sheet',
            'Transfer Certificate',
            'Community Certificate',
            'Passport Size Photographs'
          ]
        }),
        sortOrder: 5
      },
      {
        sectionKey: 'admissions.fees',
        title: 'Fee Structure',
        content: JSON.stringify({
          instructions: 'Please ensure you pay before the due date to avoid late fees.',
          notices: ['Last date for even semester fee is 15th April 2026.'],
          methods: [
            { id: 1, type: 'Online Gateway', description: 'Pay via Netbanking/UPI', link: '#', qrUrl: '', details: '' },
            { id: 2, type: 'Bank Transfer', description: 'NEFT/RTGS details', link: '', qrUrl: '', details: 'A/C: 1234567890, IFSC: SBIN0001234' }
          ]
        }),
        sortOrder: 6
      },
      {
        sectionKey: 'admissions.scholarships',
        title: 'Scholarships',
        content: JSON.stringify({
          title: 'Scholarships & Awards',
          description: 'Financial assistance for meritorious students.',
          scholarships: [
            { id: 1, title: 'Merit Scholarship', eligibility: 'Above 90% in 12th', description: 'Fee waiver for top students.', amount: '50% Tuition Fee', images: [], pdfUrl: '', featured: true }
          ]
        }),
        sortOrder: 7
      },
      {
        sectionKey: 'admissions.loans',
        title: 'Education Loans',
        content: JSON.stringify({
          title: 'Education Loans',
          description: 'We partner with leading banks to provide easy education loans.',
          providers: [
            { id: 1, bankName: 'State Bank of India', logoUrl: '', eligibility: 'All admitted students', interest: '7.5% p.a.', process: 'Apply via Vidya Lakshmi portal.', contact: '1800-11-2211', documents: [] }
          ]
        }),
        sortOrder: 8
      },
      {
        sectionKey: 'admissions.dates',
        title: 'Important Dates',
        content: JSON.stringify({
          lastDate: 'July 15, 2026',
          events: [
            { event: 'Application Starts', date: 'April 1, 2026' },
            { event: 'Last Date to Apply', date: 'July 15, 2026' }
          ]
        }),
        sortOrder: 9
      },
      {
        sectionKey: 'admissions.faq',
        title: 'FAQ',
        content: JSON.stringify({
          faqs: [
            { question: 'What is the eligibility for B.E. courses?', answer: '10+2 with Physics, Chemistry, Math and minimum 45% marks.' }
          ]
        }),
        sortOrder: 10
      },
      {
        sectionKey: 'admissions.contact',
        title: 'Contact Information',
        content: JSON.stringify({
          email: 'admission@cahcet.edu',
          phone: '+91 1234567890',
          address: 'Melvisharam, Ranipet, Tamil Nadu'
        }),
        sortOrder: 11
      }
    ];

    for (const sec of admissionsSections) {
      await prisma.contentSection.upsert({
        where: { pageId_sectionKey: { pageId: admissionsPage.id, sectionKey: sec.sectionKey } },
        update: { content: sec.content, title: sec.title, sortOrder: sec.sortOrder },
        create: { pageId: admissionsPage.id, sectionKey: sec.sectionKey, content: sec.content, title: sec.title, sortOrder: sec.sortOrder }
      });
    }
    console.log('✅ Admissions Sections seeded successfully.');
  }

  console.log('Seeding Academics Sections...');
  const academicsPage = await prisma.contentPage.findUnique({ where: { slug: 'academics' }});
  if (academicsPage) {
    const academicsSections = [
      {
        sectionKey: 'academics.teachingMethodology',
        title: 'Teaching Methodology',
        content: JSON.stringify({
          title: 'Our Educational Pedagogy',
          content: 'We believe in a holistic, industry-aligned pedagogy that prepares students for the future. Our approach is designed to foster critical thinking, innovation, and practical skills.',
          methods: [
            { id: 1, title: 'Creativity', icon: 'Lightbulb', description: 'Fostering out-of-the-box thinking and creative problem solving in every discipline.' },
            { id: 2, title: 'Innovation', icon: 'Zap', description: 'Encouraging students to develop new ideas, products, and solutions for real-world challenges.' },
            { id: 3, title: 'Practical Learning', icon: 'Cpu', description: 'Hands-on experience in state-of-the-art labs and workshops to bridge theory and practice.' },
            { id: 4, title: 'Industry Exposure', icon: 'Briefcase', description: 'Regular industrial visits, internships, and guest lectures from industry experts.' },
            { id: 5, title: 'Research-Oriented', icon: 'Atom', description: 'Promoting research culture and inquiry-based learning from the undergraduate level.' },
            { id: 6, title: 'Skill Development', icon: 'Compass', description: 'Soft skills, coding bootcamps, and value-added courses to ensure career readiness.' }
          ],
          highlights: []
        }),
        sortOrder: 1
      },
      {
        sectionKey: 'academics.facilities',
        title: 'Campus Facilities',
        content: JSON.stringify({
          title: 'World-Class Facilities',
          content: 'Our campus provides state-of-the-art infrastructure for comprehensive learning and research.',
          facilities: [
            { id: 1, title: 'Central Library', category: 'Library', description: 'A massive collection of physical books, journals, and digital resources.', images: [] },
            { id: 2, title: 'Computer Labs', category: 'Labs', description: 'High-performance computing facilities equipped with the latest software.', images: [] }
          ]
        }),
        sortOrder: 2
      },
      {
        sectionKey: 'academics.sports',
        title: 'Sports',
        content: JSON.stringify({
          title: 'Sports & Athletics',
          description: 'We encourage physical fitness and competitive sports through excellent facilities.',
          stats: { grounds: '5+', players: '500+', tournaments: '20+', medals: '150+' },
          achievements: [
            { id: 1, title: 'Inter-College Champions', year: '2025', description: 'Won the overall championship trophy in the zonal sports meet.' }
          ],
          gallery: []
        }),
        sortOrder: 3
      },
      {
        sectionKey: 'academics.campusLife',
        title: 'Campus Life',
        content: JSON.stringify({
          title: 'Vibrant Campus Life',
          content: 'Experience a rich and diverse student life filled with events, clubs, and activities.',
          clubs: [
            { id: 1, name: 'Coding Club', category: 'Technical', description: 'For passionate programmers and developers.' },
            { id: 2, name: 'Cultural Society', category: 'Cultural', description: 'Promoting arts, dance, and music.' }
          ],
          events: [
            { id: 1, title: 'Annual Fest', date: 'March 2026', description: 'The biggest cultural and technical festival of the year.' }
          ],
          gallery: []
        }),
        sortOrder: 4
      },
      {
        sectionKey: 'academics.calendar',
        title: 'Academic Calendar',
        content: JSON.stringify({
          title: 'Academic Calendar 2025-2026',
          description: 'Stay updated with important academic dates and schedules.',
          pdfUrl: '',
          events: [
            { id: 1, date: 'August 1, 2025', title: 'Odd Semester Begins', type: 'Academic' },
            { id: 2, date: 'November 15, 2025', title: 'End Semester Exams', type: 'Exam' }
          ]
        }),
        sortOrder: 5
      },
      {
        sectionKey: 'academics.holidays',
        title: 'List of Holidays',
        content: JSON.stringify({
          title: 'Holiday Schedule 2025-2026',
          description: 'Official list of public and institutional holidays.',
          holidays: [
            { id: 1, date: 'January 1, 2026', name: 'New Year', type: 'Public Holiday' },
            { id: 2, date: 'January 15, 2026', name: 'Pongal', type: 'Festival' }
          ]
        }),
        sortOrder: 6
      },
      {
        sectionKey: 'academics.syllabus',
        title: 'Syllabus',
        content: JSON.stringify({
          title: 'Curriculum & Syllabus',
          description: 'Download the detailed syllabus for all programs.',
          documents: [
            { id: 1, department: 'CSE', program: 'B.E. Computer Science', regulation: 'R2021', url: '#' },
            { id: 2, department: 'ECE', program: 'B.E. Electronics', regulation: 'R2021', url: '#' }
          ]
        }),
        sortOrder: 7
      }
    ];

    for (const sec of academicsSections) {
      await prisma.contentSection.upsert({
        where: { pageId_sectionKey: { pageId: academicsPage.id, sectionKey: sec.sectionKey } },
        update: { content: sec.content, title: sec.title, sortOrder: sec.sortOrder },
        create: { pageId: academicsPage.id, sectionKey: sec.sectionKey, content: sec.content, title: sec.title, sortOrder: sec.sortOrder }
      });
    }
    console.log('✅ Academics Sections seeded successfully.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
