/**
 * researchService.js — CMS backend for Research section.
 */

const KEY_PREFIX = 'cahcet_research_';

export const RESEARCH_SECTIONS = {
  RESEARCH: 'research_main',
};

export const defaultData = {
  [RESEARCH_SECTIONS.RESEARCH]: {
    title: 'Research & Development',
    content: 'Our institution is committed to cutting-edge research.',
    stats: { publications: '500+', patents: '20+', grants: '₹5 Cr+', scholars: '100+' },
    highlights: ['AI & Machine Learning Lab', 'Renewable Energy Research'],
    sections: [
      { id: 1, title: 'Center of Excellence', description: 'Advanced research labs.', images: [] }
    ],
    publications: [
      { id: 1, title: 'Advancements in ML', authors: 'Dr. John Doe', journal: 'IEEE', year: '2025', link: '#' }
    ],
    labs: [
      { id: 1, name: 'Robotics Lab', description: 'State of the art robotics research.' }
    ],
    collaborations: [
      { id: 1, name: 'Tech Innovations Inc', logoUrl: '', description: 'Joint research programs.' }
    ],
    gallery: []
  }
};

import { cmsService } from '../../services/cmsService';

export const researchService = {
  async getSection(sectionKey) {
    try {
      const res = await cmsService.getPage('research');
      const sec = res.data?.sections?.find(s => s.sectionKey === `research.${sectionKey}`);
      if (sec && sec.content) {
        return JSON.parse(sec.content);
      }
    } catch (err) {
      console.error(`Failed to load research section ${sectionKey}`, err);
    }
    return defaultData[sectionKey] || {};
  },
  async updateSection(sectionKey, data) {
    try {
      const res = await cmsService.getPage('research');
      const content = JSON.stringify(data);
      const sec = res.data?.sections?.find(s => s.sectionKey === `research.${sectionKey}`);
      
      if (sec) {
        await cmsService.updateSection(sec.id, { content });
      } else if (res.data?.id) {
        await cmsService.createSection({
          pageId: res.data.id,
          sectionKey: `research.${sectionKey}`,
          title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace('_', ' '),
          content
        });
      }
    } catch (err) {
      console.error(`Failed to update research section ${sectionKey}`, err);
    }
    return data;
  },
  async resetSection(sectionKey) {
    const defaultSec = defaultData[sectionKey] || {};
    return await this.updateSection(sectionKey, defaultSec);
  }
};
