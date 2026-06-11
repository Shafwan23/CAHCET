// src/services/chatbotKnowledgeBase.js

export const INTENTS = {
  GREETING: 'GREETING',
  ADMISSIONS: 'ADMISSIONS',
  COURSES: 'COURSES',
  PLACEMENTS: 'PLACEMENTS',
  SCHOLARSHIPS: 'SCHOLARSHIPS',
  FACILITIES: 'FACILITIES',
  FEES: 'FEES',
  HOSTEL: 'HOSTEL',
  CONTACT: 'CONTACT',
  CAMPUS_LIFE: 'CAMPUS_LIFE',
  FAQ: 'FAQ',
  LEAD_CAPTURE: 'LEAD_CAPTURE',
  UNKNOWN: 'UNKNOWN'
};

export const CHATBOT_KNOWLEDGE_BASE = [
  {
    intent: INTENTS.GREETING,
    keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening'],
    exactMatch: false,
    generateResponse: (cmsData, botName) => [
      `Hello! I'm ${botName}. How can I assist you today?`,
      `Hi there! Welcome to CAHCET. What can I help you with?`
    ],
    suggestedFollowUps: ['Admissions', 'Courses Offered', 'Placements']
  },
  {
    intent: INTENTS.ADMISSIONS,
    keywords: ['admission', 'apply', 'join', 'register', 'enroll', 'process', 'eligibility', 'deadline', 'when', 'how to'],
    exactMatch: false,
    generateResponse: (cmsData) => {
      // Dynamic logic from CMS
      let lastDate = 'announced soon';
      let applicationFee = '₹500';
      if (cmsData?.admissions?.procedure) {
        // Procedure could contain dates or fee info if seeded
        const proc = Array.isArray(cmsData.admissions.procedure) ? cmsData.admissions.procedure : [];
        if (proc.length > 0 && proc[0].title) {
          lastDate = "currently ongoing";
        }
      }
      return [
        `Admissions for the current academic year are open! The application process is ${lastDate}. You can apply via the 'Apply Now' button on our homepage.`,
        `To join CAHCET, you need a 10+2 passing certificate with required subjects. The application fee is typically ${applicationFee}. Would you like the link to register?`
      ];
    },
    suggestedFollowUps: ['Fee Structure', 'Courses Offered', 'Contact Office']
  },
  {
    intent: INTENTS.COURSES,
    keywords: ['course', 'branch', 'department', 'engineering', 'study', 'program', 'ug', 'pg', 'cse', 'ece', 'eee', 'mech', 'civil', 'it', 'aids', 'aiml', 'mba', 'mca', 'computer', 'software', 'coding', 'ai'],
    exactMatch: false,
    generateResponse: (cmsData, botName, context) => {
      // Smart recommendation based on context
      if (context.includes('computer') || context.includes('coding') || context.includes('software') || context.includes('ai')) {
        return [`Based on your interest, I highly recommend checking out our B.E. Computer Science (CSE), B.Tech IT, B.Tech AI & Data Science (AIDS), or B.Tech AI & ML (AIML) programs. We have excellent placements in these fields!`, `You might love our CSE or AIML departments. They feature state-of-the-art labs and amazing software company placements.`];
      }
      
      return [
        `We offer specialized Undergraduate engineering programs (including CSE, IT, ECE, EEE, MECH, CIVIL, AIDS, AIML) and Postgraduate programs like MCA and MBA.`,
        `CAHCET provides excellent B.E./B.Tech programs as well as MCA and MBA. Which field are you interested in?`
      ];
    },
    suggestedFollowUps: ['Placements', 'Admissions', 'Hostel Facilities']
  },
  {
    intent: INTENTS.PLACEMENTS,
    keywords: ['placement', 'job', 'salary', 'package', 'company', 'recruiter', 'hire', 'internship', 'training'],
    exactMatch: false,
    generateResponse: (cmsData) => {
      let rate = '95%';
      if (cmsData?.system?.stats) {
         const stats = Array.isArray(cmsData.system.stats) ? cmsData.system.stats : [];
         const placementStat = stats.find(s => s.label.toLowerCase().includes('placement'));
         if (placementStat) rate = placementStat.value + placementStat.suffix;
      }
      
      let highestPackage = 0;
      let topRecruiters = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Zoho'];
      
      if (cmsData?.placements?.students) {
        const students = Array.isArray(cmsData.placements.students) ? cmsData.placements.students : [];
        highestPackage = students.reduce((max, s) => {
          const pkgStr = s.package ? s.package.replace(/[^0-9.]/g, '') : '0';
          const pkg = parseFloat(pkgStr);
          return pkg > max ? pkg : max;
        }, 0);
      }
      
      if (cmsData?.placements?.recruiters) {
        const recruiters = Array.isArray(cmsData.placements.recruiters) ? cmsData.placements.recruiters : [];
        if (recruiters.length > 0) {
          topRecruiters = recruiters.map(r => r.companyName).slice(0, 5);
        }
      }

      const highestStr = highestPackage > 0 ? `${highestPackage} LPA` : '24 LPA';
      const recruitersStr = topRecruiters.join(', ');

      return [
        `Our live placement record is phenomenal with a ${rate} placement rate! Top recruiters currently hiring from us include ${recruitersStr}.`,
        `We provide extensive placement training. According to our latest database, the highest package recently offered is ${highestStr}!`
      ];
    },
    suggestedFollowUps: ['Top Recruiters', 'Courses Offered', 'Admissions']
  },
  {
    intent: INTENTS.FEES,
    keywords: ['fee', 'cost', 'payment', 'pay', 'how much', 'installment', 'price', 'amount'],
    exactMatch: false,
    generateResponse: (cmsData) => [
      `Our tuition fees follow government norms and vary by department. We offer flexible payment options and installments. Would you like to know about Scholarships or Education Loans?`,
      `Fee structures depend on whether you join via counseling or management quota. We also assist with educational loans from top banks.`
    ],
    suggestedFollowUps: ['Scholarships', 'Education Loans', 'Admissions']
  },
  {
    intent: INTENTS.SCHOLARSHIPS,
    keywords: ['scholarship', 'concession', 'merit', 'free', 'discount', 'financial aid'],
    exactMatch: false,
    generateResponse: (cmsData) => {
      let scholarshipList = "Merit Scholarships, First Graduate Scholarships, and Government schemes";
      if (cmsData?.admissions?.scholarships) {
        const sch = Array.isArray(cmsData.admissions.scholarships) ? cmsData.admissions.scholarships : [];
        if (sch.length > 0) {
          scholarshipList = sch.slice(0, 3).map(s => s.name).join(', ');
        }
      }
      return [
        `We actively support students with multiple financial aids, including ${scholarshipList}.`,
        `Yes! We offer attractive merit scholarships for high-scoring students and full support for processing government scholarships.`
      ];
    },
    suggestedFollowUps: ['Fee Structure', 'Admissions', 'Education Loans']
  },
  {
    intent: INTENTS.HOSTEL,
    keywords: ['hostel', 'stay', 'accommodation', 'room', 'food', 'mess', 'bed'],
    exactMatch: false,
    generateResponse: (cmsData) => [
      `We provide safe, hygienic, and comfortable residential facilities with separate hostels for boys and girls. The mess serves delicious and nutritious food.`,
      `Our campus has excellent hostel facilities with Wi-Fi, study halls, and 24/7 security. Would you like to know about the campus life?`
    ],
    suggestedFollowUps: ['Campus Facilities', 'Fees', 'Contact Office']
  },
  {
    intent: INTENTS.FACILITIES,
    keywords: ['facility', 'lab', 'library', 'campus', 'sport', 'wifi', 'transport', 'bus', 'hospital', 'medical'],
    exactMatch: false,
    generateResponse: (cmsData) => [
      `Our lush green campus features Smart Classrooms, Industry 4.0 Labs, a Central Library with over 50,000 books, a massive Sports Complex, and a hygienic cafeteria.`,
      `We have an extensive transport fleet covering a 100km radius, high-speed Wi-Fi across the campus, and advanced research labs.`
    ],
    suggestedFollowUps: ['Hostel Facilities', 'Courses Offered', 'Campus Tour']
  },
  {
    intent: INTENTS.CONTACT,
    keywords: ['contact', 'phone', 'email', 'address', 'location', 'where', 'reach', 'number', 'call'],
    exactMatch: false,
    generateResponse: (cmsData) => {
      let phone = '+91 4172 267387';
      let email = 'info@cahcet.in';
      if (cmsData?.contact?.info && Array.isArray(cmsData.contact.info)) {
        const p = cmsData.contact.info.find(i => i.type === 'phone');
        const e = cmsData.contact.info.find(i => i.type === 'email');
        if (p) phone = p.value;
        if (e) email = e.value;
      }
      return [
        `You can reach our admission office directly at ${phone} or email us at ${email}. Our campus is located in Melvisharam, Tamil Nadu.`,
        `Need to speak with someone? Call us at ${phone} during office hours. We'd love to help!`
      ];
    },
    suggestedFollowUps: ['Admissions', 'Apply Now']
  },
  {
    intent: INTENTS.FAQ,
    keywords: ['aicte', 'approved', 'autonomous', 'ragging', 'affiliation'],
    exactMatch: false,
    generateResponse: (cmsData) => [
      `CAHCET is approved by AICTE, New Delhi, and affiliated to Anna University, Chennai. We maintain a strictly ragging-free campus.`,
      `We are an AICTE approved institution with NAAC accreditation. Our campus environment is extremely safe and student-friendly.`
    ],
    suggestedFollowUps: ['Placements', 'Courses', 'Campus Life']
  }
];
