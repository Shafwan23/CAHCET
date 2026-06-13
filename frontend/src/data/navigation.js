export const navigationLinks = [
  { name: 'Home', href: '/' },
  {
    name: 'About',
    href: '/about/institution',
    dropdown: [
      { name: 'Institution', href: '/about/institution' },
      { name: "People's Messages", href: '/about/peoples-message' },
      { name: 'Anti Ragging Policy', href: '/about/anti-ragging-policy' },
      { name: 'Values and Philosophy', href: '/about/values-and-philosophy' },
      { name: 'Government Approval', href: '/about/government-approval' },
      { name: 'Governing Policy', href: '/about/governing-council' },
      { name: 'Refund Policy', href: '/about/refund-policy' },
      { name: 'Terms and Conditions', href: '/about/terms-and-conditions' },
      { name: 'Privacy Policy', href: '/about/privacy-policy' },
    ]
  },
  {
    name: 'Departments',
    href: '/departments',
    megaMenu: [
      {
        title: 'Engineering',
        links: [
          { name: 'CSE', href: '/departments/cse' },
          { name: 'AIDS', href: '/departments/aids' },
          { name: 'IT', href: '/departments/it' },
          { name: 'Mechanical', href: '/departments/mech' },
          { name: 'ECE', href: '/departments/ece' },
          { name: 'EEE', href: '/departments/eee' },
          { name: 'AIML', href: '/departments/aiml' },
          { name: 'Civil', href: '/departments/civil' },
        ]
      },
      {
        title: 'Standalone',
        links: [
          { name: 'MCA', href: '/departments/mca' },
          { name: 'Management', href: '/departments/management' },
          { name: 'Science & Humanities', href: '/departments/sh' },
        ]
      }
    ]
  },
  {
    name: 'Academics',
    href: '/academics/teaching-methodology',
    dropdown: [
      { name: 'Teaching Methodology', href: '/academics/teaching-methodology' },
      { name: 'Campus Facilities',    href: '/academics/campus-facility' },
      { name: 'Sports',               href: '/academics/sports' },
      { name: 'Campus Life',          href: '/academics/campus-life' },
      { name: 'Academic Calendar',    href: '/academics/academic-calendar' },
      { name: 'List of Holidays',     href: '/academics/list-of-holidays' },
      { name: 'Syllabus',             href: '/academics/syllabus' },
    ]
  },
  {
    name: 'Admissions',
    href: '/admissions/admission-procedure',
    dropdown: [
      { name: 'Admission 2026 Registration', href: '/admissions/registration-2026' },
      { name: 'Admission Procedure', href: '/admissions/admission-procedure' },
      { name: 'Scholarships and Awards', href: '/admissions/scholarship-and-awards' },
      { name: 'Education Loan', href: '/admissions/education-loan' },
      { name: 'Payments', href: '/admissions/payments' },
    ]
  },
  {
    name: 'Placements',
    href: '/placements/students-placed',
    dropdown: [
      { name: 'Recruiters', href: '/placements/recruiters' },
      { name: 'Students Placed', href: '/placements/students-placed' },
    ]
  },
  { name: 'Research', href: '/research' },
  { name: 'Contact Us', href: '/contact' },
];

export const footerLinks = {
  quickLinks: [
    { name: 'About Us', href: '/about/institution' },
    { name: 'Admissions', href: '/admissions/admission-procedure' },
    { name: 'Placements', href: '/placements/students-placed' },
    { name: 'Academic Calendar', href: '/academics/academic-calendar' },
  ],
  departments: [
    { name: 'Computer Science', href: '/departments/cse' },
    { name: 'Information Technology', href: '/departments/it' },
    { name: 'Electronics & Communication', href: '/departments/ece' },
    { name: 'Mechanical Engineering', href: '/departments/mech' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/about/privacy-policy' },
    { name: 'Terms of Service', href: '/about/terms-and-conditions' },
    { name: 'Refund Policy', href: '/about/refund-policy' },
  ]
};
