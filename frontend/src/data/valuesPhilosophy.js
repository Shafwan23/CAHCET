import { Shield, Star, Lightbulb, Users, Heart, Target, Award } from 'lucide-react';

export const valuesPhilosophyData = {
  vision: {
    title: 'Institution Vision',
    statement: 'To be a premier institution of academic excellence, research, and innovation, producing globally competent and socially responsible leaders who contribute to the progress of society.',
    author: 'Founding Vision'
  },
  mission: {
    title: 'Institution Mission',
    statements: [
      {
        id: 1,
        title: 'Academic Excellence',
        desc: 'To provide high-quality education through innovative teaching methodologies, state-of-the-art infrastructure, and continuous curriculum enhancement.',
        icon: Target
      },
      {
        id: 2,
        title: 'Research & Innovation',
        desc: 'To foster a culture of research, creativity, and entrepreneurship among students and faculty to solve real-world problems.',
        icon: Lightbulb
      },
      {
        id: 3,
        title: 'Holistic Development',
        desc: 'To nurture the physical, mental, and emotional well-being of students through sports, cultural activities, and value-based education.',
        icon: Heart
      },
      {
        id: 4,
        title: 'Social Responsibility',
        desc: 'To instill a sense of ethics, integrity, and social responsibility in our students to make them responsible global citizens.',
        icon: Users
      }
    ]
  },
  qualityPolicy: {
    title: 'Quality Policy',
    content: 'CAHCET is committed to providing quality education and training in engineering and technology to students by continuous improvement of the teaching-learning process, infrastructure, and faculty competence, aiming at the satisfaction of students, parents, and industry.',
    focusAreas: [
      'Excellence in Teaching and Learning',
      'Continuous Improvement of Infrastructure',
      'Faculty Development and Competence',
      'Industry Readiness of Students',
      'Stakeholder Satisfaction'
    ]
  },
  coreValues: [
    {
      title: 'Integrity',
      desc: 'We uphold the highest standards of honesty and ethical behavior in all our endeavors.',
      icon: Shield
    },
    {
      title: 'Excellence',
      desc: 'We strive for excellence in academic pursuits, research, and administration.',
      icon: Award
    },
    {
      title: 'Innovation',
      desc: 'We encourage creativity, critical thinking, and a spirit of inquiry.',
      icon: Lightbulb
    },
    {
      title: 'Leadership',
      desc: 'We develop leadership qualities, teamwork, and a sense of responsibility.',
      icon: Target
    },
    {
      title: 'Inclusiveness',
      desc: 'We promote a diverse, inclusive, and supportive campus community.',
      icon: Users
    },
    {
      title: 'Social Responsibility',
      desc: 'We contribute positively to the community and environment.',
      icon: Heart
    }
  ],
  philosophy: {
    title: 'Educational Philosophy',
    content: [
      'Our educational philosophy is rooted in the belief that every student has the potential to excel. We provide a student-centric learning environment that encourages curiosity, critical thinking, and practical application of knowledge.',
      'We blend traditional academic rigour with modern, technology-driven teaching methods. Our faculty act as mentors, guiding students through their academic journey and helping them discover their true potential.',
      'We believe in holistic education that goes beyond textbooks, preparing students for the challenges of the professional world and life itself.'
    ]
  },
  studentCentric: [
    {
      title: 'Mentorship Program',
      desc: 'Dedicated faculty mentors guide students in their academic and personal growth.',
      icon: Users
    },
    {
      title: 'Skill Development',
      desc: 'Regular workshops and training sessions to enhance technical and soft skills.',
      icon: Target
    },
    {
      title: 'Placement Training',
      desc: 'Comprehensive training to prepare students for corporate recruitment drives.',
      icon: Award
    }
  ],
  ethics: {
    title: 'Ethics & Social Responsibility',
    content: 'We believe that education is incomplete without a strong ethical foundation. We instill values of integrity, empathy, and social awareness in our students. Our community outreach programs and NSS activities encourage students to contribute to the welfare of society and work towards sustainable development.'
  }
};
