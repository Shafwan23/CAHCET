/**
 * aboutService.js — CMS backend for About section pages.
 */

const KEY_PREFIX = 'cahcet_about_';

export const ABOUT_SECTIONS = {
  INSTITUTION: 'institution',
  PEOPLES_MESSAGES: 'peoples_messages',
  ANTI_RAGGING: 'anti_ragging',
  VALUES: 'values',
  APPROVAL: 'approval',
  GOVERNING_POLICY: 'governing_policy',
  REFUND_POLICY: 'refund_policy',
  TERMS: 'terms',
  PRIVACY: 'privacy',
};

export const defaultData = {
  [ABOUT_SECTIONS.INSTITUTION]: {
    bannerUrl: '',
    title: 'C. Abdul Hakeem College of Engineering & Technology',
    overview: 'Established in 1998, CAHCET is committed to providing world-class technical education...',
    vision: 'To be a premier institution of choice...',
    mission: 'To impart quality education...',
    history: 'Founded by the Melvisharam Muslim Educational Society...',
    highlights: [
      { id: 1, title: '25+ Years of Excellence', description: 'Legacy of quality education.' }
    ],
    campusImages: []
  },
  [ABOUT_SECTIONS.PEOPLES_MESSAGES]: {
    chairman: { name: '', designation: 'Chairman', photoUrl: '', message: '', signatureUrl: '' },
    correspondent: { name: '', designation: 'Correspondent', photoUrl: '', message: '', signatureUrl: '' },
    principal: { name: '', designation: 'Principal', photoUrl: '', message: '', signatureUrl: '' },
  },
  [ABOUT_SECTIONS.ANTI_RAGGING]: {
    committee: [],
    squads: [],
    members: [],
  },
  [ABOUT_SECTIONS.VALUES]: {
    title: 'Values & Philosophy',
    philosophyText: 'At CAHCET, we believe in holistic development...',
    quotes: [
      { id: 1, text: 'Education is the most powerful weapon...', author: 'Nelson Mandela' }
    ],
    cards: [
      { id: 1, title: 'Integrity', description: 'We uphold the highest ethical standards.' }
    ]
  },
  [ABOUT_SECTIONS.APPROVAL]: {
    aicteReports: [],
    accreditations: [],
  },
  [ABOUT_SECTIONS.GOVERNING_POLICY]: {
    members: [
      { id: 1, name: 'John Doe', designation: 'Member', position: '1', photoUrl: '' }
    ]
  },
  [ABOUT_SECTIONS.REFUND_POLICY]: {
    email: 'admissions@cahcet.edu.in',
    phone: '+91 4172 267 387',
    officeAddress: 'Main Administrative Block, CAHCET Campus',
    content: '<p>Standard refund policy text...</p>'
  },
  [ABOUT_SECTIONS.TERMS]: {
    content: '<h2>Terms & Conditions</h2><p>Welcome to CAHCET...</p>'
  },
  [ABOUT_SECTIONS.PRIVACY]: {
    content: '<h2>Privacy Policy</h2><p>Your privacy is important to us...</p>'
  }
};

import { cmsService } from '../../services/cmsService';

export const aboutService = {
  async getSection(sectionKey) {
    try {
      const res = await cmsService.getPage('about');
      const sec = res.data?.sections?.find(s => s.sectionKey === `about.${sectionKey}`);
      if (sec && sec.content) {
        return JSON.parse(sec.content);
      }
    } catch (err) {
      console.error(`Failed to load about section ${sectionKey}`, err);
    }
    return defaultData[sectionKey] || {};
  },

  async updateSection(sectionKey, data) {
    try {
      const res = await cmsService.getPage('about');
      const content = JSON.stringify(data);
      const sec = res.data?.sections?.find(s => s.sectionKey === `about.${sectionKey}`);
      
      if (sec) {
        await cmsService.updateSection(sec.id, { content });
      } else if (res.data?.id) {
        await cmsService.createSection({
          pageId: res.data.id,
          sectionKey: `about.${sectionKey}`,
          title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace('_', ' '),
          content
        });
      }
    } catch (err) {
      console.error(`Failed to update about section ${sectionKey}`, err);
    }
    return data;
  },

  async resetSection(sectionKey) {
    const defaultSec = defaultData[sectionKey] || {};
    return await this.updateSection(sectionKey, defaultSec);
  }
};
