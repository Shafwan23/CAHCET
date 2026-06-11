/**
 * contactService.js — CMS backend for Contact Us section.
 */

const KEY_PREFIX = 'cahcet_contact_';

export const CONTACT_SECTIONS = {
  CONTACT: 'contact_main',
};

export const defaultData = {
  [CONTACT_SECTIONS.CONTACT]: {
    title: 'Contact Us',
    address: 'C. Abdul Hakeem College of Engineering & Technology, Melvisharam - 632509, Vellore District, Tamil Nadu',
    phones: ['+91 4172 267 387', '+91 4172 267 388'],
    emails: ['info@cahcet.edu.in', 'admissions@cahcet.edu.in'],
    social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' },
    timings: 'Mon - Sat: 9:00 AM - 5:00 PM',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18...',
    departments: [
      { id: 1, name: 'Admissions Office', person: 'Mr. Admin', phone: '+91 9876543210', email: 'admissions@cahcet.edu.in' }
    ]
  }
};

import { cmsService } from '../../services/cmsService';

export const contactService = {
  async getSection(sectionKey) {
    try {
      const res = await cmsService.getPage('contact');
      const sec = res.data?.sections?.find(s => s.sectionKey === `contact.${sectionKey}`);
      if (sec && sec.content) {
        return JSON.parse(sec.content);
      }
    } catch (err) {
      console.error(`Failed to load contact section ${sectionKey}`, err);
    }
    return defaultData[sectionKey] || {};
  },
  async updateSection(sectionKey, data) {
    try {
      const res = await cmsService.getPage('contact');
      const content = JSON.stringify(data);
      const sec = res.data?.sections?.find(s => s.sectionKey === `contact.${sectionKey}`);
      
      if (sec) {
        await cmsService.updateSection(sec.id, { content });
      } else if (res.data?.id) {
        await cmsService.createSection({
          pageId: res.data.id,
          sectionKey: `contact.${sectionKey}`,
          title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace('_', ' '),
          content
        });
      }
    } catch (err) {
      console.error(`Failed to update contact section ${sectionKey}`, err);
    }
    return data;
  },
  async resetSection(sectionKey) {
    const defaultSec = defaultData[sectionKey] || {};
    return await this.updateSection(sectionKey, defaultSec);
  }
};
