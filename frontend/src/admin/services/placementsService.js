/**
 * placementsService.js — Placements Module Service
 * Manages: Recruiters, Students Placed
 * Backend-ready abstraction over localStorage.
 */

import { cmsService } from '../../services/cmsService';

const MAX_ITEMS  = 1000;

export const PLACEMENT_TYPES = {
  RECRUITERS: 'recruiters',
  STUDENTS:   'students',
};

export function createEmptyPlacement(type) {
  const base = {
    id: '',
    department: '',
    year: new Date().getFullYear().toString(),
    createdAt: '',
    updatedAt: '',
  };

  if (type === PLACEMENT_TYPES.RECRUITERS) {
    return {
      ...base,
      companyName: '',
      logoUrl: '',
      rolesOffered: '',
    };
  }
  
  if (type === PLACEMENT_TYPES.STUDENTS) {
    return {
      ...base,
      studentName: '',
      companyName: '',
      package: '',
    };
  }

  return base;
}

/* ─── Internal helpers ─── */
async function load(type) {
  try {
    const res = await cmsService.getPage('placements');
    const sections = res.data?.sections || [];
    const sec = sections.find(s => s.sectionKey === `placements.${type}`);
    if (sec && sec.content) {
      const parsed = JSON.parse(sec.content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error('Failed to load placements', err);
  }
  return [];
}

async function save(type, items) {
  try {
    const res = await cmsService.getPage('placements');
    const sections = res.data?.sections || [];
    const sec = sections.find(s => s.sectionKey === `placements.${type}`);
    const content = JSON.stringify(items.slice(0, MAX_ITEMS));
    if (sec) {
      await cmsService.updateSection(sec.id, { content });
    } else if (res.data?.id) {
      await cmsService.createSection({
        pageId: res.data.id,
        sectionKey: `placements.${type}`,
        title: type === PLACEMENT_TYPES.STUDENTS ? 'Students Placed' : 'Recruiters',
        type: 'json',
        content,
        orderIndex: type === PLACEMENT_TYPES.STUDENTS ? 2 : 1
      });
    }
  } catch (err) {
    console.error('Failed to save placements', err);
  }
}

/* ─── Public API ─── */
export const placementsService = {
  async getAll(type, { year = null, department = null } = {}) {
    let items = await load(type);
    if (year) items = items.filter(i => i.year === year);
    if (department && department !== 'All') items = items.filter(i => !i.department || i.department === department || i.department === 'All');
    return items;
  },

  async search(type, query) {
    const q = query.toLowerCase();
    const items = await load(type);
    return items.filter(i => {
      if (type === PLACEMENT_TYPES.RECRUITERS) {
        return i.companyName?.toLowerCase().includes(q) || i.rolesOffered?.toLowerCase().includes(q);
      }
      return i.studentName?.toLowerCase().includes(q) || i.companyName?.toLowerCase().includes(q);
    });
  },

  async add(type, item) {
    const items = await load(type);
    const newItem = {
      ...createEmptyPlacement(type),
      ...item,
      id: `${type}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await save(type, [newItem, ...items]);
    return newItem;
  },

  async update(type, id, updates) {
    const items = await load(type);
    const updated = items.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i);
    await save(type, updated);
    return updated.find(i => i.id === id);
  },

  async delete(type, id) {
    const items = await load(type);
    await save(type, items.filter(i => i.id !== id));
  },

  async bulkAddStudents(students) {
    const items = await load(PLACEMENT_TYPES.STUDENTS);
    const newItems = students.map(s => ({
      ...createEmptyPlacement(PLACEMENT_TYPES.STUDENTS),
      ...s,
      id: `students_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    await save(PLACEMENT_TYPES.STUDENTS, [...newItems, ...items]);
    return newItems;
  },

  async getAnalytics() {
    const recruiters = await load(PLACEMENT_TYPES.RECRUITERS);
    const students = await load(PLACEMENT_TYPES.STUDENTS);

    const highestPackage = Math.max(...students.map(s => parseFloat(s.package) || 0), 0);
    const totalPlaced = students.length;
    const totalRecruiters = recruiters.length;

    // Dept wise
    const deptStats = {};
    students.forEach(s => {
      const d = s.department || 'Unknown';
      deptStats[d] = (deptStats[d] || 0) + 1;
    });

    // Year wise
    const yearStats = {};
    students.forEach(s => {
      const y = s.year;
      yearStats[y] = (yearStats[y] || 0) + 1;
    });

    return {
      highestPackage,
      totalPlaced,
      totalRecruiters,
      deptStats,
      yearStats,
    };
  }
};
