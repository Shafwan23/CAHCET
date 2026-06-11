/**
 * homepageService.js — CMS backend for Homepage sections.
 */

const KEY_PREFIX = 'cahcet_homepage_';

export const HOMEPAGE_SECTIONS = {
  NAVBAR: 'navbar',
  HERO: 'hero',
  STATS: 'stats',
  ACADEMIC: 'academic',
  PLACEMENT_EXC: 'placement_exc',
  CONTACT: 'contact',
  FOOTER: 'footer'
};

export const defaultData = {
  [HOMEPAGE_SECTIONS.NAVBAR]: {
    visible: true,
    logoUrl: '/images/logo.png',
    announcementText: 'Admissions Open for 2026! Apply Now.',
    announcementVisible: true,
    announcementLink: '/admissions',
  },
  [HOMEPAGE_SECTIONS.HERO]: {
    visible: true,
    title: 'Transforming Education Through Innovation',
    subtitle: 'Join a world-class institution dedicated to shaping the future leaders of tomorrow.',
    description: 'We offer an array of programs to kickstart your career.',
    videoUrl: '',
    bgImageUrl: '',
    primaryCtaText: 'Apply Now',
    primaryCtaLink: '/admissions',
    secondaryCtaText: 'Virtual Tour',
    secondaryCtaLink: '/tour',
    overlayOpacity: 60,
    enableAnimations: true,
    showTextOverlay: true
  },
  [HOMEPAGE_SECTIONS.STATS]: {
    visible: true,
    title: 'By the Numbers',
    stats: [
      { id: 1, label: 'Students Enrolled', value: '5000', prefix: '', suffix: '+' },
      { id: 2, label: 'Faculty Members', value: '250', prefix: '', suffix: '+' },
      { id: 3, label: 'Placement Rate', value: '96', prefix: '', suffix: '%' },
      { id: 4, label: 'Acres Campus', value: '50', prefix: '', suffix: '+' },
    ]
  },
  [HOMEPAGE_SECTIONS.ACADEMIC]: {
    visible: true,
    title: 'Academic Excellence',
    subtitle: 'Explore our comprehensive range of undergraduate and postgraduate programs.',
    highlightedDepts: ['cse', 'ece', 'mech', 'civil'] // dept keys
  },
  [HOMEPAGE_SECTIONS.PLACEMENT_EXC]: {
    visible: true,
    title: 'Placement Excellence',
    subtitle: 'Our graduates are recruited by top global companies.',
    highestPackage: '24',
    companiesVisited: '200+',
    featuredLogos: [] // Array of URLs
  },
  [HOMEPAGE_SECTIONS.CONTACT]: {
    visible: true,
    title: 'Get in Touch',
    address: 'C. Abdul Hakeem College of Engineering & Technology, Melvisharam, Ranipet District, Tamil Nadu 632509',
    phone: '+91 4172 267 387',
    email: 'info@cahcet.edu.in',
    mapEmbedUrl: ''
  },
  [HOMEPAGE_SECTIONS.FOOTER]: {
    visible: true,
    aboutText: 'Empowering students with quality education and moral values since 1998.',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: ''
    },
    quickLinks: [
      { label: 'Admissions', path: '/admissions' },
      { label: 'Departments', path: '/departments' },
      { label: 'Placements', path: '/placements' },
      { label: 'Contact Us', path: '/contact' },
    ]
  }
};

import { cmsService } from '../../services/cmsService';

export const homepageService = {
  async getSection(sectionKey) {
    try {
      const res = await cmsService.getPage('home');
      const sections = res.data?.sections || [];
      const sec = sections.find(s => s.sectionKey === `home.${sectionKey}`);
      if (sec && sec.content) {
        return JSON.parse(sec.content);
      }
    } catch (err) {
      console.error(`Failed to load home.${sectionKey}`, err);
    }
    return defaultData[sectionKey] || {};
  },

  async updateSection(sectionKey, data) {
    try {
      const res = await cmsService.getPage('home');
      const sections = res.data?.sections || [];
      let sec = sections.find(s => s.sectionKey === `home.${sectionKey}`);
      const content = JSON.stringify(data);
      if (sec) {
        await cmsService.updateSection(sec.id, { content });
      } else if (res.data?.id) {
        await cmsService.createSection({
          pageId: res.data.id,
          sectionKey: `home.${sectionKey}`,
          title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
          type: 'json',
          content,
          orderIndex: 1
        });
      }
      return data;
    } catch (err) {
      console.error(`Failed to update home.${sectionKey}`, err);
      throw err;
    }
  },

  async resetSection(sectionKey) {
    const defaultSec = defaultData[sectionKey] || {};
    return await this.updateSection(sectionKey, defaultSec);
  }
};
