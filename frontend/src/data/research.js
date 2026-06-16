import { 
  Lightbulb, Zap, Cpu, Briefcase, Atom, Compass, 
  Target, FileText, Share2, Award, Users, BookOpen, 
  Settings, TrendingUp, DollarSign, LightbulbIcon, Calendar
} from 'lucide-react';

export const functionalities = [
  { id: 1, text: 'To identify potential areas of research in various disciplines of engineering and form the faculty into various clusters based on their specialization.', icon: Target },
  { id: 2, text: 'To prepare and submit proposals to government agencies like AICTE, UGC, DST, IE(I) etc for obtaining funded projects.', icon: FileText },
  { id: 3, text: 'To encourage multi-disciplinary research internally within the institute and externally with other organizations.', icon: Share2 },
  { id: 4, text: 'Encourage staff to attend/publish papers in various National/International conferences of their specialised areas.', icon: Award },
  { id: 5, text: 'To coordinate the research activities among the various departments of the college.', icon: Users },
  { id: 6, text: 'Encourage the faculty to attend various research oriented Faculty development programmes.', icon: BookOpen },
  { id: 7, text: 'Encourage and motivate the staff to apply for Ph.D at various Universities.', icon: Lightbulb },
  { id: 8, text: 'To encourage the staff to publish their research works in reputed journals that have good impact factor and are Scopus indexed.', icon: FileText },
  { id: 9, text: 'To plan for resource mobilization through industry interaction, consultancy and Extramural funding.', icon: Briefcase },
  { id: 10, text: 'Scrutinize the student’s project proposals and send them to various agencies for financial support and recommend the suitable projects.', icon: DollarSign },
  { id: 11, text: 'In order to promote research activity in college, CAHCET promotes and encourages to prepare and submit a proposal for internal funding.', icon: Settings },
  { id: 12, text: 'To keep research and development active, R & D Cell organize meetings every start and end of the semesters and subsequently discuss about internal funding systems.', icon: Calendar },
  { id: 13, text: 'R & D cell receives the internal proposals, the committee evaluates and finally it approves or rejects based on the novelty or benefits to society or college.', icon: Award },
];

export const team = [
  { id: 1, role: 'Research & Development Coordinator', name: 'Dr. Gayathri Devi', designation: 'Associate Professor', department: 'MCA', icon: Users },
  { id: 2, role: 'Publications Coordinator', name: 'Dr. E. Parthiban', designation: 'Associate Professor', department: 'Chemistry', icon: BookOpen },
  { id: 3, role: 'Patents/IPR Coordinator', name: 'Mr. T.S. Kathick', designation: 'HOD', department: 'AI&DS', icon: LightbulbIcon },
  { id: 4, role: 'Grants Coordinator', name: 'Dr. S. Sudharsan & Dr. R. Senthil', designation: 'Associate/Assistant Professor', department: 'Maths & MECH', icon: DollarSign },
  { id: 5, role: 'Innovation Coordinator', name: 'Dr. R.Z. Inamul Hussain', designation: 'Associate Professor', department: 'CSE', icon: Zap },
  { id: 6, role: 'Institute Innovation Council (IIC)', name: 'Mrs. T.S. Sindhu', designation: 'Assistant Professor', department: 'ECE', icon: Compass },
  { id: 7, role: 'Hackathon Coordinator', name: 'Mr. M. Abdul Naseer', designation: 'Assistant Professor', department: 'CSE', icon: Cpu },
  { id: 8, role: 'Startup Coordinator', name: 'Dr. Y.J. Nazeer Ahmed', designation: 'Associate Professor', department: 'ECE', icon: Briefcase },
];

export const achievementsList = [
  "A Business Incubator proposal has been submitted to the Ministry of Micro, Small and Medium Enterprises (MSME).",
  "A Pre-Incubation Centre proposal has been submitted to the Tamil Nadu State Council for Science and Technology (TNSCST).",
  "A collaborative research proposal worth ₹3 Crores has been submitted to the Anusandhan National Research Foundation (ANRF) in association with SVCET.",
  "One faculty start-up has been successfully registered by Dr. B. A. Mohammad Hashim.",
  "Three Ph.D. scholars are currently pursuing their research under the ECE Department Research Centre of the institution.",
  "55 research papers have been published in refereed journals by faculty members.",
  "242 students have actively participated in regional and national-level hackathons, promoting innovation and problem-solving skills.",
  "Two student ideas have been shortlisted for the finals of Smart India Hackathon 2025: One team will present at IIT Kharagpur, and One team will present at Dharwad, Karnataka.",
  "Three patents have been successfully published.",
  "A research grant of ₹5 Lakhs has been sanctioned under the NIDHI-PRAYAS scheme to Dr. B. A. Mohammad Hashim.",
  "A student project grant of ₹7,500 has been received from TNSCST for the ECE Department under the guidance of Dr. B. A. Mohammad Hashim.",
  "Fourteen (14) research funding proposals have been submitted to various State and Central Government agencies.",
  "Fifteen faculty members are currently pursuing Ph.D. programmes, strengthening the institution’s research ecosystem."
];

export const achievementGroups = [
  {
    id: 'funding',
    title: 'Research Funding & Grants',
    description: 'Securing resources to drive impactful research and development.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    items: [
      '₹3 Crores ANRF collaborative proposal submitted',
      '₹5 Lakhs NIDHI-PRAYAS grant received',
      'MSME Business Incubator proposal approved',
      'TNSCST student project grant awarded',
      '14 research funding proposals submitted'
    ]
  },
  {
    id: 'innovation',
    title: 'Innovation & Hackathons',
    description: 'Nurturing student innovators and startup culture.',
    image: 'https://images.unsplash.com/photo-1504384308090-c564bd248275?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    items: [
      'Smart India Hackathon 2025 finalists at IIT Kharagpur & Dharwad',
      '242 hackathon participants across various events',
      'TNSCST Pre-Incubation Centre proposal in progress',
      'Faculty startup registration successfully completed'
    ]
  },
  {
    id: 'ip',
    title: 'Publications & Intellectual Property',
    description: 'Creating and sharing knowledge on a global scale.',
    image: 'https://images.unsplash.com/photo-1434030216411-0bb793f49412?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    items: [
      '55 published research papers in the academic year',
      '3 published patents in the field of engineering',
      'Ph.D scholars actively pursuing research under ECE Research Centre',
      '15 faculty members actively pursuing Ph.D'
    ]
  }
];

export const stats = [
  { id: 1, value: 55, suffix: '+', label: 'Research Papers', desc: 'Published in indexed journals' },
  { id: 2, value: 242, suffix: '+', label: 'Student Innovators', desc: 'Participated in hackathons' },
  { id: 3, value: 3, suffix: '+', label: 'Published Patents', desc: 'In engineering & technology' },
  { id: 4, value: 3, suffix: 'Cr', label: 'Research Proposals', desc: 'Submitted for collaboration' },
  { id: 5, value: 15, suffix: '+', label: 'Faculty Researchers', desc: 'Pursuing Ph.D' },
  { id: 6, value: 14, suffix: '+', label: 'Funding Proposals', desc: 'Submitted this year' },
];
