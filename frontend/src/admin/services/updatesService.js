/**
 * updatesService.js — Updates CMS Service
 * Manages: Latest Events, Placement Updates, Announcements, Newsletters
 * Backend-ready abstraction over localStorage.
 */

import { cmsService } from '../../services/cmsService';

const MAX_ITEMS  = 500;

export const UPDATE_TYPES = {
  EVENTS:        'events',
  PLACEMENTS:    'placements',
  ANNOUNCEMENTS: 'announcements',
  NEWSLETTERS:   'newsletters',
};

export const ANNOUNCEMENT_CATEGORIES = [
  'Exam', 'Holiday', 'Circular', 'Notice', 'Academic', 'Sports', 'Cultural', 'Placement', 'General',
];

export const EVENT_CATEGORIES = [
  'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Webinar', 'Placement', 'Competition', 'General',
];

export function createEmptyItem(type) {
  const base = {
    id: '',
    title: '',
    description: '',
    richContent: '',
    image: '',
    author: '',
    tags: [],
    pinned: false,
    published: true,
    createdAt: '',
    updatedAt: '',
  };

  switch (type) {
    case UPDATE_TYPES.EVENTS:
      return { ...base, eventDate: '', venue: '' };
    case UPDATE_TYPES.ANNOUNCEMENTS:
      return { ...base };
    case UPDATE_TYPES.PLACEMENTS:
      return { ...base, company: '', packageRange: '', driveDate: '' };
    case UPDATE_TYPES.NEWSLETTERS:
      return { ...base, month: '', year: new Date().getFullYear().toString(), pdfUrl: '', thumbnailUrl: '' };
    default:
      return base;
  }
}

/* ─── Internal helpers ─── */
async function load(type) {
  try {
    const res = await cmsService.getPage('updates');
    const sections = res.data?.sections || [];
    const sec = sections.find(s => s.sectionKey === `updates.${type}`);
    if (sec && sec.content) {
      const parsed = JSON.parse(sec.content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error('Failed to load updates', err);
  }
  return [];
}

async function save(type, items) {
  try {
    const res = await cmsService.getPage('updates');
    const sections = res.data?.sections || [];
    const sec = sections.find(s => s.sectionKey === `updates.${type}`);
    if (sec) {
      await cmsService.updateSection(sec.id, { content: JSON.stringify(items.slice(0, MAX_ITEMS)) });
    }
  } catch (err) {
    console.error('Failed to save updates', err);
  }
}

/* ─── Public API ─── */
export const updatesService = {
  async getAll(type, { publishedOnly = false, pinnedFirst = true } = {}) {
    let items = await load(type);
    if (publishedOnly) items = items.filter(i => i.published);
    if (pinnedFirst) items = [...items.filter(i => i.pinned), ...items.filter(i => !i.pinned)];
    return items;
  },

  async search(type, query) {
    const q = query.toLowerCase();
    const items = await load(type);
    return items.filter(i =>
      i.title?.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q) ||
      i.author?.toLowerCase().includes(q) ||
      i.tags?.some(t => t.toLowerCase().includes(q))
    );
  },

  async add(type, item, admin = null) {
    const items = await load(type);
    const adminName = admin?.name || 'Admin';
    const adminRole = admin?.role || 'Unknown';
    const adminDept = admin?.deptKey || null;
    
    const newItem = {
      ...createEmptyItem(type),
      ...item,
      id: `${type}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEditedBy: adminName,
      lastEditedByRole: adminRole,
      lastEditedByDept: adminDept,
    };
    await save(type, [newItem, ...items]);
    return newItem;
  },

  async update(type, id, updates, admin = null) {
    const items = await load(type);
    const adminName = admin?.name || 'Admin';
    const adminRole = admin?.role || 'Unknown';
    const adminDept = admin?.deptKey || null;

    const updated = items.map(i => i.id === id
      ? { ...i, ...updates, updatedAt: new Date().toISOString(), lastEditedBy: adminName, lastEditedByRole: adminRole, lastEditedByDept: adminDept }
      : i
    );
    await save(type, updated);
    return updated.find(i => i.id === id);
  },

  async delete(type, id) {
    const items = await load(type);
    await save(type, items.filter(i => i.id !== id));
  },

  async togglePin(type, id, admin = null) {
    const items = await load(type);
    const adminName = admin?.name || 'Admin';
    const adminRole = admin?.role || 'Unknown';
    const adminDept = admin?.deptKey || null;
    
    const updated = items.map(i => i.id === id ? { ...i, pinned: !i.pinned, updatedAt: new Date().toISOString(), lastEditedBy: adminName, lastEditedByRole: adminRole, lastEditedByDept: adminDept } : i);
    await save(type, updated);
  },

  async togglePublish(type, id, admin = null) {
    const items = await load(type);
    const adminName = admin?.name || 'Admin';
    const adminRole = admin?.role || 'Unknown';
    const adminDept = admin?.deptKey || null;
    
    const updated = items.map(i => i.id === id ? { ...i, published: !i.published, updatedAt: new Date().toISOString(), lastEditedBy: adminName, lastEditedByRole: adminRole, lastEditedByDept: adminDept } : i);
    await save(type, updated);
  },

  async getStats(type) {
    const items = await load(type);
    return {
      total: items.length,
      published: items.filter(i => i.published).length,
      pinned: items.filter(i => i.pinned).length,
      drafts: items.filter(i => !i.published).length,
    };
  },
};
