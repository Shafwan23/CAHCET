const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Helper function to upsert section data
    const updateSection = async (pageSlug, sectionKey, title, contentObj) => {
      const page = await prisma.contentPage.findUnique({ where: { slug: pageSlug } });
      if (!page) {
        console.log(`Page '${pageSlug}' not found.`);
        return;
      }
      const existing = await prisma.contentSection.findFirst({
        where: { pageId: page.id, sectionKey: sectionKey }
      });
      if (existing) {
        await prisma.contentSection.update({
          where: { id: existing.id },
          data: { content: JSON.stringify(contentObj) }
        });
      } else {
        await prisma.contentSection.create({
          data: {
            pageId: page.id,
            sectionKey: sectionKey,
            title: title,
            type: 'json',
            content: JSON.stringify(contentObj)
          }
        });
      }
      console.log(`Upserted ${sectionKey} on ${pageSlug}`);
    };

    // 1. Contact Us Centers
    const contactCenters = [
      {
        title: 'Office of Correspondent',
        name: 'Correspondent',
        email: 'correspondent@cahcet.edu.in',
        phone: '+91 4172-267387 #102'
      },
      {
        title: 'Office of Principal',
        name: 'Dr. Sasikumar',
        email: 'principal@cahcet.edu.in',
        phone: '+91 4172-267387 #105'
      },
      {
        title: 'Office of COE',
        name: 'COE',
        email: 'coe@cahcet.edu.in',
        phone: '+91 4172-267387 #109'
      },
      {
        title: 'Anti-Ragging committee',
        name: 'Dr. Sasikumar',
        email: 'principal@cahcet.edu.in',
        phone: '+91 4172-267387 #105'
      },
      {
        title: 'Placement and training cell',
        name: 'Mr. Palanisamy B, Mr. I. Abdulla, Mr. D.L. Jaseer Ahmed',
        email: 'pat@cahcet.edu.in',
        phone: ''
      },
      {
        title: 'Background student verification',
        name: 'Mr. Palanisamy B, Mr. D.L. Jaseer Ahmed',
        email: 'jaseer@cahcet.edu.in',
        phone: ''
      }
    ];

    await updateSection('contact', 'contact.centers', 'Contact Centers', contactCenters);

    // 2. Research Data
    const researchFunctionalities = [
      'To identify potential areas of research in various disciplines of engineering and form the faculty into various clusters based on their specialization.',
      'To prepare and submit proposals to government agencies like AICTE, UGC, DST, IE(I) etc for obtaining funded projects.',
      'To encourage multi-disciplinary research internally within the institute and externally with other organizations.',
      'Encourage staff to attend/publish papers in various National/International conferences of their specialised areas.',
      'To coordinate the research activities among the various departments of the college.',
      'Encourage the faculty to attend various research oriented Faculty development programmes.',
      'Encourage and motivate the staff to apply for Ph.D at various Universities.',
      'To encourage the staff to publish their research work in reputed journals that have good impact factor and are Scopus indexed.',
      'To scrutinize the student’s project proposals and send them to various agencies for financial support and recommend the suitable projects for exhibition / working models.',
      'To initiate and promote MoU with industries and R & D organizations; for consultancy, collaborative research, sponsored projects, industry institute interactions etc.',
      'To arrange brainstorming sessions through talks by eminent personalities from industry, R& D organizations and institutions of repute for the better understanding of research methodology and practices currently followed.',
      'To keep everyone informed about announcements by various funding agencies like DST, DAE, DRDO, ISRO, CSIR, AICTE, UGC, University etc.',
      'To motivate students to present technical papers in National and International conferences and display projects in competitions and exhibitions.'
    ];

    const researchAchievements = [
      'Design of "Smart Wearable Device for the Visually Impaired" under the supervision of Dr. R. Muthu.',
      'AI-based early detection system for diabetic retinopathy utilizing deep learning techniques.',
      'Development of a lightweight concrete block using industrial by-products for sustainable construction.',
      'Prototype of a cost-effective solar tracking system boosting panel efficiency by 25%.',
      'Integration of IoT for real-time monitoring of agricultural soil moisture and automated irrigation.',
      'Blockchain-based secure voting system framework for local body elections.',
      'Optimization of hybrid wind-solar energy systems for remote off-grid rural areas.',
      'Design of an automated multi-level car parking model with smart allocation algorithms.',
      'Extraction of biodiesel from waste cooking oil and its performance analysis on CI engines.',
      'Machine learning model for predicting student academic performance and identifying at-risk individuals.',
      'Development of an advanced drone for pesticide spraying with precise crop targeting capabilities.',
      'Smart water quality monitoring system using low-cost sensors and cloud data logging.',
      'Implementation of a secure text steganography technique using advanced encryption standards.'
    ];

    const researchTeam = [
      { name: 'Dr. Sasikumar', role: 'Principal & Head of R&D', image: '' },
      { name: 'Dr. A. Ramesh', role: 'Coordinator - AI & DS', image: '' },
      { name: 'Dr. S. Meenakshi', role: 'Coordinator - Civil', image: '' },
      { name: 'Dr. K. Venkatesh', role: 'Coordinator - CSE', image: '' },
      { name: 'Dr. P. Karthikeyan', role: 'Coordinator - ECE', image: '' },
      { name: 'Dr. M. Suresh', role: 'Coordinator - EEE', image: '' },
      { name: 'Dr. R. Dinesh', role: 'Coordinator - IT', image: '' },
      { name: 'Dr. V. Prakash', role: 'Coordinator - Mechanical', image: '' }
    ];

    await updateSection('research', 'research.functionalities', 'Functionalities', researchFunctionalities);
    await updateSection('research', 'research.achievements', 'Achievements', researchAchievements);
    await updateSection('research', 'research.team', 'Research Team', researchTeam);

    // 3. Placements Recruiters
    const topRecruiters = [
      { companyName: 'Cognizant', logoUrl: '/images/recruiters/cognizant.png', rolesOffered: 'Cognizant Technology Solutions' },
      { companyName: 'Accenture', logoUrl: '/images/recruiters/accenture.png', rolesOffered: 'Accenture' },
      { companyName: 'Wipro', logoUrl: '/images/recruiters/wipro.png', rolesOffered: 'Wipro Technologies' },
      { companyName: 'Zoho', logoUrl: '/images/recruiters/zoho.png', rolesOffered: 'Zoho Corporation' },
      { companyName: 'Tech Mahindra', logoUrl: '/images/recruiters/techmahindra.png', rolesOffered: 'Tech Mahindra Limited' },
      { companyName: 'E2E', logoUrl: '', rolesOffered: 'E2E Networks / E2E Solutions' },
      { companyName: 'TCS', logoUrl: '/images/recruiters/tcs.png', rolesOffered: 'Tata Consultancy Services' },
      { companyName: 'Infosys', logoUrl: '/images/recruiters/infosys.png', rolesOffered: 'Infosys Limited' },
    ].map((r, i) => ({ id: `rec_${i}`, ...r, year: '2026', department: 'All' }));

    await updateSection('placements', 'placements.recruiters', 'Recruiters', topRecruiters);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
