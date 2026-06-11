import { cmsService } from '../../services/cmsService';

const DEPT_KEY_PREFIX = 'cahcet_dept_';
const VERSION_KEY_PREFIX = 'cahcet_dept_versions_';
const MAX_VERSIONS = 20;

export const DEPARTMENTS = [
  { key: 'cse',   label: 'CSE',              fullName: 'Computer Science & Engineering',         color: '#3b82f6' },
  { key: 'ece',   label: 'ECE',              fullName: 'Electronics & Communication Engineering', color: '#8b5cf6' },
  { key: 'eee',   label: 'EEE',              fullName: 'Electrical & Electronics Engineering',    color: '#f59e0b' },
  { key: 'civil', label: 'CIVIL',            fullName: 'Civil Engineering',                       color: '#10b981' },
  { key: 'mech',  label: 'MECHANICAL',       fullName: 'Mechanical Engineering',                  color: '#ef4444' },
  { key: 'aids',  label: 'AI & DS',          fullName: 'Artificial Intelligence & Data Science',  color: '#6366f1' },
  { key: 'aiml',  label: 'AI & ML',          fullName: 'Artificial Intelligence & Machine Learning', color: '#8b5cf6' },
  { key: 'mca',   label: 'MCA',              fullName: 'Master of Computer Applications',         color: '#14b8a6' },
  { key: 'mba',   label: 'MBA',              fullName: 'Master of Business Administration',       color: '#f97316' },
  { key: 'sh',    label: 'S & HUMANITIES',   fullName: 'Science & Humanities',                    color: '#06b6d4' },
  { key: 'it',    label: 'IT',               fullName: 'Information Technology',                  color: '#84cc16' },
];

export function createDefaultDeptData(key) {
  const dept = DEPARTMENTS.find(d => d.key === key) || { key, fullName: key.toUpperCase() };
  return {
    overview: {
      title: dept.fullName,
      tagline: `Excellence in ${dept.fullName}`,
      established: '2001',
      hod: '',
      description: 'Welcome to the ' + dept.fullName + ' department.',
      vision: 'To be a center of excellence in ' + dept.fullName + '.',
      mission: 'To impart quality education and promote research.',
      bannerImage: '',
    },
    facilities: [],
    faculties: [],
    achievements: [],
    gallery: [],
    curriculum: [],
    contact: {
      hodName: 'Dr. Head of Department',
      email: dept.key + '@cahcet.edu',
      phone: '+91 1234567890',
      location: 'Main Block',
      timings: 'Mon-Fri: 9:00 AM - 5:00 PM',
      mapEmbed: '',
    },
  };
}

function storageKey(deptKey) { return `${DEPT_KEY_PREFIX}${deptKey}`; }
function versionKey(deptKey, section) { return `${VERSION_KEY_PREFIX}${deptKey}_${section}`; }

async function loadDeptData(deptKey) {
  try {
    const res = await cmsService.getPage(`dept_${deptKey}`);
    if (res.data && res.data.sections) {
      const parsed = { ...createDefaultDeptData(deptKey) };
      res.data.sections.forEach(sec => {
        const sectionKey = sec.sectionKey.replace(`dept_${deptKey}.`, '');
        try {
          parsed[sectionKey] = JSON.parse(sec.content);
        } catch {}
      });
      return parsed;
    }
  } catch (err) {
    console.error(`Failed to load dept ${deptKey} from CMS`, err);
  }
  return createDefaultDeptData(deptKey);
}

function loadVersions(deptKey, section) {
  try {
    const raw = localStorage.getItem(versionKey(deptKey, section));
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function pushVersion(deptKey, section, oldData, savedBy) {
  const versions = loadVersions(deptKey, section);
  const entry = { id: `v${Date.now()}`, savedBy, savedAt: new Date().toISOString(), snapshot: oldData };
  const updated = [entry, ...versions].slice(0, MAX_VERSIONS);
  localStorage.setItem(versionKey(deptKey, section), JSON.stringify(updated));
}

export const departmentService = {
  async getData(deptKey) {
    return await loadDeptData(deptKey);
  },

  async getSection(deptKey, section) {
    const data = await loadDeptData(deptKey);
    return data[section];
  },

  async updateSection(deptKey, section, newData, performedBy = 'unknown') {
    const current = await loadDeptData(deptKey);
    pushVersion(deptKey, section, current[section], performedBy);
    
    try {
      let page;
      try {
        const res = await cmsService.getPage(`dept_${deptKey}`);
        page = res.data;
      } catch {
        const dept = DEPARTMENTS.find(d => d.key === deptKey) || { key: deptKey, fullName: deptKey.toUpperCase() };
        const newPageRes = await cmsService.createPage({
          title: dept.fullName,
          slug: `dept_${deptKey}`,
          description: `${dept.fullName} Department`,
          status: 'PUBLISHED'
        });
        page = newPageRes.data;
      }
      
      const content = JSON.stringify(newData);
      const secKey = `dept_${deptKey}.${section}`;
      
      // We must fetch sections explicitly or use the page's sections
      const sec = page.sections?.find(s => s.sectionKey === secKey);
      if (sec) {
        await cmsService.updateSection(sec.id, { content });
      } else {
        await cmsService.createSection({
          pageId: page.id,
          sectionKey: secKey,
          title: section.charAt(0).toUpperCase() + section.slice(1),
          content
        });
      }
      
      const updated = { ...current, [section]: newData };
      return updated;
    } catch (err) {
      console.error(`Failed to update ${deptKey} ${section}`, err);
      throw err;
    }
  },

  saveDraft(deptKey, section, draftData) {
    const draftKey = `${storageKey(deptKey)}_draft_${section}`;
    localStorage.setItem(draftKey, JSON.stringify({ data: draftData, savedAt: new Date().toISOString() }));
  },

  loadDraft(deptKey, section) {
    try {
      const raw = localStorage.getItem(`${storageKey(deptKey)}_draft_${section}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  },

  discardDraft(deptKey, section) {
    localStorage.removeItem(`${storageKey(deptKey)}_draft_${section}`);
  },

  getVersions(deptKey, section) {
    return loadVersions(deptKey, section);
  },

  async restoreVersion(deptKey, section, versionId, performedBy = 'unknown') {
    const versions = loadVersions(deptKey, section);
    const version = versions.find(v => v.id === versionId);
    if (!version) throw new Error('Version not found.');
    return await this.updateSection(deptKey, section, version.snapshot, performedBy);
  },

  async addItem(deptKey, section, item, performedBy) {
    const current = await loadDeptData(deptKey);
    const arr = Array.isArray(current[section]) ? current[section] : [];
    const newItem = { ...item, id: `${section}_${Date.now()}`, createdAt: new Date().toISOString() };
    return await this.updateSection(deptKey, section, [...arr, newItem], performedBy);
  },

  async updateItem(deptKey, section, itemId, updates, performedBy) {
    const current = await loadDeptData(deptKey);
    const arr = Array.isArray(current[section]) ? current[section] : [];
    const updated = arr.map(item => item.id === itemId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item);
    return await this.updateSection(deptKey, section, updated, performedBy);
  },

  async deleteItem(deptKey, section, itemId, performedBy) {
    const current = await loadDeptData(deptKey);
    const arr = Array.isArray(current[section]) ? current[section] : [];
    const updated = arr.filter(item => item.id !== itemId);
    return await this.updateSection(deptKey, section, updated, performedBy);
  },

  async reorderItems(deptKey, section, orderedIds, performedBy) {
    const current = await loadDeptData(deptKey);
    const arr = Array.isArray(current[section]) ? current[section] : [];
    const map = Object.fromEntries(arr.map(i => [i.id, i]));
    const reordered = orderedIds.map(id => map[id]).filter(Boolean);
    return await this.updateSection(deptKey, section, reordered, performedBy);
  },

  async getActiveDepts() {
    return DEPARTMENTS.map(d => d.key); // With backend, we'll assume all are active, or we could fetch pages.
  },

  async exportData(deptKey) {
    const data = await loadDeptData(deptKey);
    return JSON.stringify(data, null, 2);
  },

  async importData(deptKey, jsonString, performedBy) {
    try {
      const data = JSON.parse(jsonString);
      const merged = { ...createDefaultDeptData(deptKey), ...data };
      for (const key of Object.keys(merged)) {
        await this.updateSection(deptKey, key, merged[key], performedBy);
      }
    } catch {
      throw new Error('Invalid JSON data.');
    }
  },
};
