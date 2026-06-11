/**
 * admissionsService.js — CMS backend for Admissions section pages.
 */

const KEY_PREFIX = 'cahcet_admissions_';

export const ADMISSIONS_SECTIONS = {
  REGISTRATION: 'registration',
  PROCEDURE: 'procedure',
  SCHOLARSHIPS: 'scholarships',
  LOAN: 'education_loan',
  PAYMENTS: 'payments',
};

export const defaultData = {
  [ADMISSIONS_SECTIONS.REGISTRATION]: {
    courses: [
      { id: 1, name: 'B.E. Computer Science', duration: '4 Years', eligibility: '10+2 with Physics, Chemistry, Math', intake: '120', description: 'Core CS degree.', icon: 'Laptop', featured: true, department: 'CSE' }
    ],
    accreditations: [
      { id: 1, title: 'AICTE Approved', description: 'Approved by AICTE New Delhi', logoUrl: '', pdfUrl: '' }
    ],
    steps: [
      { id: 1, stepNumber: '01', title: 'Online Registration', description: 'Fill the form online.', icon: 'Edit3' }
    ]
  },
  [ADMISSIONS_SECTIONS.PROCEDURE]: {
    title: 'Admission Procedure',
    description: 'Follow these steps to complete your admission.',
    procedures: [
      { id: 1, stepNumber: '1', title: 'Eligibility Check', description: 'Ensure you meet the criteria.', icon: 'CheckSquare', visible: true }
    ]
  },
  [ADMISSIONS_SECTIONS.SCHOLARSHIPS]: {
    title: 'Scholarships & Awards',
    description: 'Financial assistance for meritorious students.',
    scholarships: [
      { id: 1, title: 'Merit Scholarship', eligibility: 'Above 90% in 12th', description: 'Fee waiver for top students.', amount: '50% Tuition Fee', images: [], pdfUrl: '', featured: true }
    ]
  },
  [ADMISSIONS_SECTIONS.LOAN]: {
    title: 'Education Loans',
    description: 'We partner with leading banks to provide easy education loans.',
    providers: [
      { id: 1, bankName: 'State Bank of India', logoUrl: '', eligibility: 'All admitted students', interest: '7.5% p.a.', process: 'Apply via Vidya Lakshmi portal.', contact: '1800-11-2211', documents: [] }
    ]
  },
  [ADMISSIONS_SECTIONS.PAYMENTS]: {
    title: 'Fee Payments',
    description: 'Secure and easy fee payment options.',
    instructions: 'Please ensure you pay before the due date to avoid late fees.',
    notices: ['Last date for even semester fee is 15th April 2026.'],
    methods: [
      { id: 1, type: 'Online Gateway', description: 'Pay via Netbanking/UPI', link: '#', qrUrl: '', details: '' },
      { id: 2, type: 'Bank Transfer', description: 'NEFT/RTGS details', link: '', qrUrl: '', details: 'A/C: 1234567890, IFSC: SBIN0001234' }
    ]
  }
};

import { cmsService } from '../../services/cmsService';

export const admissionsService = {
  async getSection(sectionKey) {
    try {
      const res = await cmsService.getPage('admissions');
      const sec = res.data?.sections?.find(s => s.sectionKey === `admissions.${sectionKey}`);
      if (sec && sec.content) {
        return JSON.parse(sec.content);
      }
    } catch (err) {
      console.error(`Failed to load admissions section ${sectionKey}`, err);
    }
    return defaultData[sectionKey] || {};
  },
  async updateSection(sectionKey, data) {
    try {
      const res = await cmsService.getPage('admissions');
      const content = JSON.stringify(data);
      const sec = res.data?.sections?.find(s => s.sectionKey === `admissions.${sectionKey}`);
      
      if (sec) {
        await cmsService.updateSection(sec.id, { content });
      } else if (res.data?.id) {
        await cmsService.createSection({
          pageId: res.data.id,
          sectionKey: `admissions.${sectionKey}`,
          title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace('_', ' '),
          content
        });
      }
    } catch (err) {
      console.error(`Failed to update admissions section ${sectionKey}`, err);
    }
    return data;
  },
  async resetSection(sectionKey) {
    const defaultSec = defaultData[sectionKey] || {};
    return await this.updateSection(sectionKey, defaultSec);
  }
};
