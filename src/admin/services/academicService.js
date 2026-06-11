/**
 * academicService.js — CMS backend for Academics section pages.
 */

const KEY_PREFIX = 'cahcet_academic_';

export const ACADEMIC_SECTIONS = {
  TEACHING_METHOD: 'teaching_methodology',
  FACILITIES: 'facilities',
  SPORTS: 'sports',
  CAMPUS_LIFE: 'campus_life',
  CALENDAR: 'academic_calendar',
  HOLIDAYS: 'holidays',
  SYLLABUS: 'syllabus',
};

export const defaultData = {
  [ACADEMIC_SECTIONS.TEACHING_METHOD]: {
    title: 'Teaching Methodology',
    content: 'Our teaching methodology focuses on experiential learning...',
    methods: [
      { id: 1, title: 'Project-Based Learning', description: 'Students engage in real-world projects.', icon: 'Briefcase' },
      { id: 2, title: 'Smart Classrooms', description: 'Interactive learning using digital tools.', icon: 'Monitor' },
    ],
    highlights: ['Industry Collaborations', 'Research Focus', 'Hands-on Labs']
  },
  [ACADEMIC_SECTIONS.FACILITIES]: {
    title: 'Campus Facilities',
    content: 'We provide state-of-the-art facilities for our students.',
    facilities: [
      { id: 1, title: 'Central Library', category: 'Libraries', description: 'Extensive collection of books and journals.', images: [] },
      { id: 2, title: 'Advanced Computer Labs', category: 'Labs', description: 'High-end computing resources.', images: [] },
    ]
  },
  [ACADEMIC_SECTIONS.SPORTS]: {
    title: 'Sports & Athletics',
    description: 'Fostering physical fitness and competitive spirit.',
    stats: { grounds: '5', players: '500+', tournaments: '20+', medals: '150+' },
    sections: [
      { id: 1, title: 'Annual Sports Meet', content: 'Our biggest sporting event of the year.' }
    ],
    gallery: [],
    achievements: []
  },
  [ACADEMIC_SECTIONS.CAMPUS_LIFE]: {
    title: 'Campus Life',
    content: 'Experience a vibrant and engaging student life at CAHCET.',
    sections: [
      { id: 1, title: 'Cultural Fests', description: 'Annual cultural extravaganzas.', images: [] }
    ]
  },
  [ACADEMIC_SECTIONS.CALENDAR]: {
    title: 'Academic Calendar',
    documents: [
      { id: 1, title: 'Odd Semester Calendar 2026', academicYear: '2025-2026', type: 'Calendar', pdfUrl: '', description: 'Schedule for ODD sem.' }
    ]
  },
  [ACADEMIC_SECTIONS.HOLIDAYS]: {
    title: 'List of Holidays',
    holidays: [
      { id: 1, name: 'Republic Day', date: '2026-01-26', day: 'Monday', category: 'National', description: 'National Holiday' }
    ]
  },
  [ACADEMIC_SECTIONS.SYLLABUS]: {
    title: 'Syllabus Archive',
    items: [
      { id: 1, department: 'CSE', regulation: '2021', semester: '1', course: 'Programming in C', pdfUrl: '', description: 'Core CS subject' }
    ]
  }
};

import { cmsService } from '../../services/cmsService';

export const academicService = {
  async getSection(sectionKey) {
    try {
      const res = await cmsService.getPage('academics');
      const sec = res.data?.sections?.find(s => s.sectionKey === `academics.${sectionKey}`);
      if (sec && sec.content) {
        return JSON.parse(sec.content);
      }
    } catch (err) {
      console.error(`Failed to load academic section ${sectionKey}`, err);
    }
    return defaultData[sectionKey] || {};
  },

  async updateSection(sectionKey, data) {
    try {
      const res = await cmsService.getPage('academics');
      const content = JSON.stringify(data);
      const sec = res.data?.sections?.find(s => s.sectionKey === `academics.${sectionKey}`);
      
      if (sec) {
        await cmsService.updateSection(sec.id, { content });
      } else if (res.data?.id) {
        await cmsService.createSection({
          pageId: res.data.id,
          sectionKey: `academics.${sectionKey}`,
          title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace('_', ' '),
          content
        });
      }
    } catch (err) {
      console.error(`Failed to update academic section ${sectionKey}`, err);
    }
    return data;
  },

  async resetSection(sectionKey) {
    const defaultSec = defaultData[sectionKey] || {};
    return await this.updateSection(sectionKey, defaultSec);
  }
};
