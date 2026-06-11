import { 
  Lightbulb, Zap, Cpu, Briefcase, Atom, Compass, 
  Target, FileText, Share2, Award, Users, BookOpen, 
  Settings, TrendingUp, DollarSign, LightbulbIcon, Calendar
} from 'lucide-react';

export const functionalities = [
  { id: 1, text: 'Identifying potential research areas across engineering disciplines', icon: Target },
  { id: 2, text: 'Preparing proposals for AICTE, UGC, DST, IE(I), etc.', icon: FileText },
  { id: 3, text: 'Encouraging multidisciplinary research collaborations', icon: Share2 },
  { id: 4, text: 'Supporting publication in National/International conferences', icon: Award },
  { id: 5, text: 'Coordinating research activities across departments', icon: Users },
  { id: 6, text: 'Encouraging participation in FDPs', icon: BookOpen },
  { id: 7, text: 'Motivating faculty for Ph.D. programs', icon: Lightbulb },
  { id: 8, text: 'Promoting publication in Scopus indexed journals', icon: FileText },
  { id: 9, text: 'Resource mobilization through industry collaboration', icon: Briefcase },
  { id: 10, text: 'Supporting student project funding proposals', icon: DollarSign },
  { id: 11, text: 'Encouraging internal funding proposals', icon: Settings },
  { id: 12, text: 'Organizing semester R&D meetings', icon: Calendar },
  { id: 13, text: 'Evaluating and approving research proposals', icon: Award },
];

export const team = [
  { id: 1, role: 'Research & Development Coordinator', name: 'Dr. A. Rajesh', designation: 'Professor', department: 'ECE', icon: Users },
  { id: 2, role: 'Publications Coordinator', name: 'Dr. S. Priya', designation: 'Associate Professor', department: 'CSE', icon: BookOpen },
  { id: 3, role: 'Patents/IPR Coordinator', name: 'Dr. M. Kumar', designation: 'Professor', department: 'MECH', icon: LightbulbIcon },
  { id: 4, role: 'Grants Coordinator', name: 'Dr. K. Sarah', designation: 'Associate Professor', department: 'EEE', icon: DollarSign },
  { id: 5, role: 'Innovation Coordinator', name: 'Dr. R. Anand', designation: 'Professor', department: 'IT', icon: Zap },
  { id: 6, role: 'Institute Innovation Council', name: 'Dr. V. Lakshmi', designation: 'Professor', department: 'S&H', icon: Compass },
  { id: 7, role: 'Hackathon Coordinator', name: 'Mr. J. David', designation: 'Assistant Professor', department: 'CSE', icon: Cpu },
  { id: 8, role: 'Startup Coordinator', name: 'Mr. K. Suresh', designation: 'Assistant Professor', department: 'ECE', icon: Briefcase },
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
