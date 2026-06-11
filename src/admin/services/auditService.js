/**
 * auditService.js — Activity Log & Audit Trail
 * Tracks who edited what, when, and in which department.
 * Backend-ready: replace localStorage with API calls easily.
 */

const AUDIT_KEY = 'cahcet_audit_log';
const MAX_ENTRIES = 500;

export const AUDIT_ACTIONS = {
  CREATE: 'Created',
  UPDATE: 'Updated',
  DELETE: 'Deleted',
  PUBLISH: 'Published',
  DRAFT: 'Saved Draft',
  RESTORE: 'Restored Version',
  LOGIN: 'Logged In',
  LOGOUT: 'Logged Out',
  UPLOAD: 'Uploaded File',
  LOGIN_FAILED: 'Failed Login',
  PERMISSION_DENIED: 'Permission Denied',
  ROLE_CHANGE: 'Role Changed',
  PASSWORD_RESET: 'Password Reset',
};

/* ─── Internal helpers ─── */

function loadLog() {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLog(entries) {
  localStorage.setItem(AUDIT_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

/* ─── Public API ─── */

export const auditService = {
  /**
   * Log an action.
   * @param {object} params
   * @param {string} params.action - From AUDIT_ACTIONS
   * @param {string} params.section - e.g. 'faculties', 'facilities'
   * @param {string} params.deptKey - e.g. 'cse', null for global
   * @param {string} params.performedBy - username
   * @param {string} params.performedByName - display name
   * @param {string} params.itemTitle - optional description of item changed
   * @param {*}      params.oldValue - optional previous value snapshot
   * @param {*}      params.newValue - optional new value snapshot
   */
  log({ action, section, deptKey, performedBy, performedByName, itemTitle, oldValue, newValue }) {
    const entry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      action,
      section,
      deptKey: deptKey || null,
      performedBy,
      performedByName,
      itemTitle: itemTitle || '',
      oldValue: oldValue !== undefined ? JSON.stringify(oldValue).slice(0, 300) : null,
      newValue: newValue !== undefined ? JSON.stringify(newValue).slice(0, 300) : null,
      timestamp: new Date().toISOString(),
    };
    const log = [entry, ...loadLog()];
    saveLog(log);
    return entry;
  },

  /** Get all logs, optionally filtered */
  getLogs({ deptKey, section, performedBy, limit = 100 } = {}) {
    let entries = loadLog();
    if (deptKey) entries = entries.filter(e => e.deptKey === deptKey);
    if (section) entries = entries.filter(e => e.section === section);
    if (performedBy) entries = entries.filter(e => e.performedBy === performedBy);
    return entries.slice(0, limit);
  },

  /** Clear logs (super admin only) */
  clearLogs() {
    localStorage.removeItem(AUDIT_KEY);
  },

  /** Get summary stats */
  getStats() {
    const entries = loadLog();
    const today = new Date().toDateString();
    return {
      total: entries.length,
      today: entries.filter(e => new Date(e.timestamp).toDateString() === today).length,
      byDept: entries.reduce((acc, e) => {
        if (e.deptKey) acc[e.deptKey] = (acc[e.deptKey] || 0) + 1;
        return acc;
      }, {}),
    };
  },
};
