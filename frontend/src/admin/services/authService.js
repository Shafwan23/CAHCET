/**
 * authService.js — Enterprise RBAC Authentication Service
 * Implements password policies, locking, hashing, and status control.
 */
import { ROLES, ACCOUNT_STATUSES } from './roleService';

const USERS_KEY      = 'cahcet_users_v4';
const SESSION_KEY    = 'cahcet_admin_session_v4';
const ATTEMPTS_KEY   = 'cahcet_login_attempts_v4';
const LOCK_KEY       = 'cahcet_locked_until_v4';

export const MAX_ATTEMPTS       = 5;
export const LOCKOUT_MS         = 15 * 60 * 1000; // 15 min
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// Mock Hash Function (For LocalStorage DB mock. Replace with bcrypt in node backend)
const hashPwd = (pwd) => btoa(pwd).split('').reverse().join('');

const DEFAULT_USERS = [
  {
    id: 'u1', username: 'superadmin', passwordHash: hashPwd('Admin123!'),
    role: ROLES.SUPER_ADMIN, deptKey: null, name: 'Super Admin', initials: 'SA', email: 'admin@cahcet.edu.in',
    status: ACCOUNT_STATUSES.ACTIVE, firstLoginRequired: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u2', username: 'cse_admin', passwordHash: hashPwd('CSE@Admin2026'),
    role: ROLES.DEPARTMENT_ADMIN, deptKey: 'cse', name: 'CSE Admin', initials: 'CA', email: 'cse@cahcet.edu.in',
    status: ACCOUNT_STATUSES.ACTIVE, firstLoginRequired: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u3', username: 'ece_admin', passwordHash: hashPwd('ECE@Admin2026'),
    role: ROLES.DEPARTMENT_ADMIN, deptKey: 'ece', name: 'ECE Admin', initials: 'EA', email: 'ece@cahcet.edu.in',
    status: ACCOUNT_STATUSES.ACTIVE, firstLoginRequired: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u4', username: 'aiml_admin', passwordHash: hashPwd('AIML@2026'),
    role: ROLES.DEPARTMENT_ADMIN, deptKey: 'aiml', name: 'AIML Admin', initials: 'AM', email: 'aiml@cahcet.edu.in',
    status: ACCOUNT_STATUSES.ACTIVE, firstLoginRequired: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u5', username: 'mca_admin', passwordHash: hashPwd('MCA@2026'),
    role: ROLES.DEPARTMENT_ADMIN, deptKey: 'mca', name: 'MCA Admin', initials: 'MA', email: 'mca@cahcet.edu.in',
    status: ACCOUNT_STATUSES.ACTIVE, firstLoginRequired: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u6', username: 'placement_admin', passwordHash: hashPwd('Placement@2026'),
    role: ROLES.PLACEMENT_CELL, deptKey: null, name: 'Placement Admin', initials: 'PA', email: 'placements@cahcet.edu.in',
    status: ACCOUNT_STATUSES.ACTIVE, firstLoginRequired: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u7', username: 'faculty_editor', passwordHash: hashPwd('Faculty@2026'),
    role: ROLES.FACULTY_EDITOR, deptKey: null, name: 'Faculty Editor', initials: 'FE', email: 'faculty@cahcet.edu.in',
    status: ACCOUNT_STATUSES.ACTIVE, firstLoginRequired: true,
    assignedModules: [
      { deptKey: 'cse', module: 'faculties' }
    ],
    createdAt: new Date().toISOString(),
  }
];

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {}
  return null;
}

function saveSession(user, rememberMe = false) {
  const session = {
    userId: user.id,
    username: user.username,
    name: user.name,
    initials: user.initials,
    email: user.email,
    role: user.role,
    deptKey: user.deptKey,
    status: user.status,
    firstLoginRequired: user.firstLoginRequired,
    granularAccess: user.granularAccess,
    allowedModules: user.allowedModules,
    assignedModules: user.assignedModules,
    loginAt: new Date().toISOString(),
    expiresAt: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : SESSION_DURATION_MS),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export const authService = {
  seed() {
    if (!localStorage.getItem(USERS_KEY)) saveUsers(DEFAULT_USERS);
  },

  getSession() { return loadSession(); },

  async login(username, password, rememberMe = false) {
    const lockedUntil = parseInt(localStorage.getItem(LOCK_KEY) || '0', 10);
    if (Date.now() < lockedUntil) {
      const mins = Math.ceil((lockedUntil - Date.now()) / 60000);
      throw new Error(`Account locked due to brute force protection. Try again in ${mins} minute(s).`);
    }

    const users = loadUsers();
    const hash = hashPwd(password.trim());
    const user = users.find(u => u.username === username.trim() && u.passwordHash === hash);

    if (!user) {
      const prev = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10);
      const next = prev + 1;
      localStorage.setItem(ATTEMPTS_KEY, String(next));
      if (next >= MAX_ATTEMPTS) {
        localStorage.setItem(LOCK_KEY, String(Date.now() + LOCKOUT_MS));
        localStorage.removeItem(ATTEMPTS_KEY);
        throw new Error('Too many failed attempts. Security cooldown active for 15 minutes.');
      }
      const remaining = MAX_ATTEMPTS - next;
      throw new Error(`Invalid credentials. ${remaining} attempt(s) remaining.`);
    }

    if (user.status !== ACCOUNT_STATUSES.ACTIVE) {
      throw new Error(`Account login denied. Status is: ${user.status}`);
    }

    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCK_KEY);
    
    const updatedUsers = [...users];
    const idx = updatedUsers.findIndex(u => u.id === user.id);
    updatedUsers[idx].lastLogin = new Date().toISOString();
    saveUsers(updatedUsers);

    return saveSession(updatedUsers[idx], rememberMe);
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getAttempts() { return parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10); },
  
  getLockMinutes() {
    const lockedUntil = parseInt(localStorage.getItem(LOCK_KEY) || '0', 10);
    if (Date.now() < lockedUntil) return Math.ceil((lockedUntil - Date.now()) / 60000);
    return 0;
  },

  validatePasswordPolicy(pwd) {
    const reqs = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    };
    const valid = Object.values(reqs).every(v => v);
    return { valid, reqs };
  },

  async updatePassword(userId, currentPwd, newPwd) {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found.');
    
    // Ignore current password check if currentPwd is null (Admin forced reset)
    if (currentPwd !== null) {
      const currHash = hashPwd(currentPwd);
      if (users[idx].passwordHash !== currHash) throw new Error('Incorrect current password.');
    }

    const { valid } = this.validatePasswordPolicy(newPwd);
    if (!valid) throw new Error('Password does not meet complexity requirements.');

    users[idx].passwordHash = hashPwd(newPwd);
    users[idx].firstLoginRequired = false;
    users[idx].updatedAt = new Date().toISOString();
    saveUsers(users);
    
    const sess = loadSession();
    if (sess && sess.userId === userId) {
      sess.firstLoginRequired = false;
      localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
    }
  },

  getAllUsers() {
    return loadUsers().map(u => {
      const { passwordHash, ...safeUser } = u;
      return safeUser;
    });
  },

  createUser(userData, adminPassword) {
    const users = loadUsers();
    if (users.find(u => u.username === userData.username)) throw new Error('Username already exists.');
    
    const newUser = {
      ...userData,
      id: `u${Date.now()}`,
      passwordHash: hashPwd(adminPassword),
      firstLoginRequired: true,
      status: userData.status || ACCOUNT_STATUSES.ACTIVE,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    return this.getAllUsers().find(u => u.id === newUser.id);
  },

  updateUser(id, updates) {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found.');
    
    // Prevent changing own role or locking own account
    const sess = loadSession();
    if (sess && sess.userId === id) {
      if (updates.role && updates.role !== users[idx].role) throw new Error('Cannot change your own role.');
      if (updates.status && updates.status !== users[idx].status) throw new Error('Cannot lock or suspend your own account.');
    }

    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveUsers(users);
  },

  deleteUser(id) {
    const users = loadUsers();
    const sess = loadSession();
    if (sess && sess.userId === id) throw new Error('Cannot delete your own active account.');
    
    saveUsers(users.filter(u => u.id !== id));
  },
  
  adminResetPassword(id, newPassword) {
    return this.updatePassword(id, null, newPassword);
  }
};
