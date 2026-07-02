/**
 * UserManagementEditor.jsx — Enterprise User & Access Management
 * Super Admin Only — Complete CRUD, KPIs, Profile Details Modal, Activity Timeline
 * Replaced side drawer with a rich, modern, glassmorphic central modal with deep interactions.
 * Positioned forms/modals in the center of the viewport relative to the scroll container.
 * Fixed real-time statistics, logins, and session details from actual database records.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, UserPlus, Search, RefreshCw, Download,
  Filter, ChevronDown, X, MoreVertical, Eye, Pencil,
  Trash2, Key, Lock, Unlock, UserCheck, UserX, ArrowRightLeft,
  Activity, Clock, Globe, Monitor, Smartphone, RotateCcw,
  AlertTriangle, CheckCircle, TrendingUp, UserCircle, Building2,
  Mail, Phone, Hash, FileText, Save, Copy, Zap, Settings,
  ChevronRight, ChevronLeft, SlidersHorizontal, BarChart3, LogIn,
  LogOut as LogOutIcon, XCircle, ShieldCheck, ShieldAlert, CalendarDays,
  Wifi, WifiOff, Fingerprint, History, ExternalLink, Ban, Terminal
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { userManagementService } from '../../services/userManagementService';
import { roleService, ROLE_COLORS, STATUS_COLORS, ROLES } from '../../services/roleService';
import { DEPARTMENTS } from '../../services/departmentService';
import { useToast } from '../ui/Toast';

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════ */
const AnimatedCounter = ({ value, duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const target = typeof value === 'number' ? value : 0;
    const start = display;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (target - start) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
};

/* ═══════════════════════════════════════════════════════════
   KPI CARDS
   ═══════════════════════════════════════════════════════════ */
const KPICard = ({ icon: Icon, label, value, color, subLabel, subValue }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}
    transition={{ duration: 0.2 }}
    className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" style={{ backgroundImage: `linear-gradient(135deg, ${color}, transparent)` }} />
    <div className="flex items-start justify-between relative">
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-1.5 tracking-tight">
          <AnimatedCounter value={value} />
        </p>
        {subLabel && (
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
            {subLabel}: <span className="text-slate-600 font-bold">{subValue}</span>
          </p>
        )}
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  </motion.div>
);

const KPISection = ({ stats }) => {
  if (!stats) return null;
  const cards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#6366f1', subLabel: 'New today', subValue: stats.newUsersToday },
    { icon: UserCheck, label: 'Active Users', value: stats.activeUsers, color: '#10b981', subLabel: 'Online now', subValue: stats.onlineUsers },
    { icon: LogIn, label: "Today's Logins", value: stats.todayLogins, color: '#3b82f6', subLabel: 'Failed', subValue: stats.failedLoginsToday },
    { icon: Lock, label: 'Locked Accounts', value: stats.lockedUsers, color: '#ef4444', subLabel: 'Inactive', subValue: stats.inactiveUsers },
    { icon: Wifi, label: 'Online Now', value: stats.onlineUsers, color: '#06b6d4' },
    { icon: Shield, label: 'Super Admins', value: stats.roleStats?.SUPER_ADMIN || 0, color: '#f59e0b', subLabel: 'Admins', subValue: stats.roleStats?.ADMIN || 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c, i) => <KPICard key={i} {...c} />)}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   USER AVATAR
   ═══════════════════════════════════════════════════════════ */
const UserAvatar = ({ user, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-[10px]', md: 'w-10 h-10 text-xs', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7'];
  const colorIdx = (user?.name?.charCodeAt(0) || 0) % colors.length;

  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-sm`}
      style={{ backgroundColor: colors[colorIdx] }}>
      {initials}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROLE & STATUS BADGES
   ═══════════════════════════════════════════════════════════ */
const RoleBadge = ({ role }) => {
  const c = ROLE_COLORS[role] || ROLE_COLORS.VIEWER;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {roleService.getRoleLabel(role)}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const c = STATUS_COLORS[status] || STATUS_COLORS.INACTIVE;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'ACTIVE' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════
   SMART TOOLBAR
   ═══════════════════════════════════════════════════════════ */
const SmartToolbar = ({ filters, setFilters, onRefresh, onExport, onCreateUser, refreshing, departments }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-4 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200/70 rounded-xl text-sm bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder-slate-400"
            placeholder="Search users by name, email, or ID..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
          {filters.search && (
            <button onClick={() => setFilters(f => ({ ...f, search: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowFilters(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${showFilters ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            {(filters.role || filters.status || filters.departmentId) && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
          </button>

          <motion.button whileTap={{ rotate: 360 }} transition={{ duration: 0.5 }} onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </motion.button>

          <button onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onCreateUser}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-900 hover:bg-amber-600 shadow-sm shadow-amber-500/20 transition-all">
            <UserPlus className="w-3.5 h-3.5" /> Create User
          </motion.button>
        </div>
      </div>

      {/* Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-slate-100">
              <select value={filters.role} onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
                className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30">
                <option value="">All Roles</option>
                {roleService.getAllRoles().map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30">
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="LOCKED">Locked</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              <select value={filters.departmentId} onChange={e => setFilters(f => ({ ...f, departmentId: e.target.value }))}
                className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30">
                <option value="">All Departments</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30">
                <option value="createdAt">Recently Created</option>
                <option value="lastLogin">Last Login</option>
                <option value="lastActivity">Last Activity</option>
                <option value="name">Name A-Z</option>
                <option value="loginCount">Most Logins</option>
              </select>
              <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                <input type="checkbox" checked={filters.includeDeleted} onChange={e => setFilters(f => ({ ...f, includeDeleted: e.target.checked }))}
                  className="rounded accent-amber-500" />
                Show deleted
              </label>
              {(filters.role || filters.status || filters.departmentId) && (
                <button onClick={() => setFilters(f => ({ ...f, role: '', status: '', departmentId: '' }))}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold underline">
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   USER TABLE ROW
   ═══════════════════════════════════════════════════════════ */
const UserTableRow = ({ user, onView, onEdit, onAction, index }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isOnline = user.lastActivity && (new Date() - new Date(user.lastActivity)) < 5 * 60 * 1000;
  const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never';

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      className={`border-b border-slate-100/60 hover:bg-amber-50/30 transition-colors group cursor-pointer ${user.isDeleted ? 'opacity-50' : ''}`}
      onClick={() => onView(user)}
    >
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar user={user} size="md" />
            {isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate flex items-center gap-1.5">
              {user.name}
              {user.isDeleted && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">DELETED</span>}
              {user.forcePasswordChange && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Password change required" />}
            </p>
            <p className="text-[11px] text-slate-400 truncate">@{user.username} · {user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell"><RoleBadge role={user.role} /></td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <span className="text-xs text-slate-600 font-medium">{user.department?.name || '—'}</span>
      </td>
      <td className="px-4 py-3.5"><StatusBadge status={user.status} /></td>
      <td className="px-4 py-3.5 hidden xl:table-cell">
        <p className="text-[11px] text-slate-500">{lastLogin}</p>
      </td>
      <td className="px-4 py-3.5 hidden xl:table-cell">
        <p className="text-xs font-medium text-slate-600">{user.loginCount || 0}</p>
      </td>
      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(o => !o)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-30 py-1 overflow-hidden">
                <button onClick={() => { onView(user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><Eye className="w-3.5 h-3.5" /> View Profile</button>
                <button onClick={() => { onEdit(user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><Pencil className="w-3.5 h-3.5" /> Edit User</button>
                <button onClick={() => { onAction('resetPassword', user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><Key className="w-3.5 h-3.5" /> Reset Password</button>
                <div className="border-t border-slate-100 my-1" />
                {user.status === 'ACTIVE' && (
                  <button onClick={() => { onAction('deactivate', user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><UserX className="w-3.5 h-3.5" /> Deactivate</button>
                )}
                {user.status === 'INACTIVE' && (
                  <button onClick={() => { onAction('activate', user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><UserCheck className="w-3.5 h-3.5" /> Activate</button>
                )}
                {user.status !== 'LOCKED' && (
                  <button onClick={() => { onAction('lock', user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-orange-600 hover:bg-orange-50"><Lock className="w-3.5 h-3.5" /> Lock Account</button>
                )}
                {user.status === 'LOCKED' && (
                  <button onClick={() => { onAction('unlock', user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-600 hover:bg-emerald-50"><Unlock className="w-3.5 h-3.5" /> Unlock Account</button>
                )}
                <div className="border-t border-slate-100 my-1" />
                {user.isDeleted ? (
                  <button onClick={() => { onAction('restore', user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50"><RotateCcw className="w-3.5 h-3.5" /> Restore User</button>
                ) : (
                  <button onClick={() => { onAction('delete', user); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /> Delete User</button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
};

/* ═══════════════════════════════════════════════════════════
   CREATE / EDIT USER MODAL (Centered relative to container)
   ═══════════════════════════════════════════════════════════ */
const CreateEditModal = ({ user, departments, onSave, onClose }) => {
  const isEdit = !!user?.id;
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', role: 'DEPARTMENT_ADMIN',
    departmentId: '', status: 'ACTIVE', phone: '', employeeId: '', notes: '',
    forcePasswordChange: true,
    ...(user || {}),
  });
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const u = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const reqs = {
    length: form.password?.length >= 8,
    upper: /[A-Z]/.test(form.password || ''),
    lower: /[a-z]/.test(form.password || ''),
    number: /[0-9]/.test(form.password || ''),
    special: /[^A-Za-z0-9]/.test(form.password || ''),
  };
  const strength = Object.values(reqs).filter(Boolean).length;

  const generatePassword = () => {
    const pwd = userManagementService.generatePassword(16);
    u('password', pwd);
    setShowPwd(true);
  };

  const handleSave = async () => {
    if (!form.name?.trim()) { setError('Full name is required'); return; }
    if (!isEdit && !form.username?.trim()) { setError('Username is required'); return; }
    if (!form.email?.trim()) { setError('Email is required'); return; }
    if (!isEdit && !form.password) { setError('Password is required'); return; }
    if (!isEdit && strength < 5) { setError('Password does not meet complexity requirements'); return; }

    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || err.message);
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-slate-200/70 rounded-xl text-sm bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all text-slate-800 placeholder-slate-400";

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90%] flex flex-col my-auto z-10 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              {isEdit ? <Pencil className="w-5 h-5 text-amber-600" /> : <UserPlus className="w-5 h-5 text-amber-600" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{isEdit ? 'Edit User' : 'Create New User'}</h3>
              <p className="text-[11px] text-slate-400 font-medium">{isEdit ? `Editing @${user.username}` : 'Add a new system identity'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto min-h-0 flex-1">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
              <input className={inputCls} value={form.name} onChange={e => u('name', e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username *</label>
              <input className={inputCls} value={form.username} disabled={isEdit}
                onChange={e => u('username', e.target.value.toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_]/g, ''))}
                placeholder="john_doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
              <input className={inputCls} type="email" value={form.email} onChange={e => u('email', e.target.value)} placeholder="john@cahcet.edu.in" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
              <input className={inputCls} value={form.phone || ''} onChange={e => u('phone', e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Employee ID</label>
              <input className={inputCls} value={form.employeeId || ''} onChange={e => u('employeeId', e.target.value)} placeholder="EMP-001" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select className={inputCls} value={form.status} onChange={e => u('status', e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Password */}
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input className={`${inputCls} pr-10`} type={showPwd ? 'text' : 'password'}
                    value={form.password} onChange={e => u('password', e.target.value)} placeholder="Secure password" />
                  <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <span className="text-[10px] font-bold">HIDE</span> : <span className="text-[10px] font-bold">SHOW</span>}
                  </button>
                </div>
                <button onClick={generatePassword} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition-colors shrink-0 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Generate
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex gap-1 h-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`flex-1 rounded-full transition-all ${i <= strength ? strength <= 2 ? 'bg-red-400' : strength <= 4 ? 'bg-amber-400' : 'bg-emerald-500' : 'bg-slate-100'}`} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Role Assignment</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roleService.getAssignableRoles().map(r => (
                <label key={r.value} className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-left ${form.role === r.value ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200/70 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value={r.value} checked={form.role === r.value}
                    onChange={e => u('role', e.target.value)} className="mt-0.5 accent-amber-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{r.label}</p>
                    {r.description && <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">{r.description}</p>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department</label>
            <select className={inputCls} value={form.departmentId || ''} onChange={e => u('departmentId', e.target.value || null)}>
              <option value="">No Department (Global)</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={form.notes || ''} onChange={e => u('notes', e.target.value)} placeholder="Internal notes about this user..." />
          </div>

          {!isEdit && (
            <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
              <input type="checkbox" checked={form.forcePasswordChange} onChange={e => u('forcePasswordChange', e.target.checked)} className="rounded accent-amber-500" />
              Force password change on first login
            </label>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-slate-100 shrink-0 bg-slate-50/50 rounded-b-2xl">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-white font-medium text-slate-600 transition-colors">Cancel</button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-slate-900 rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50 shadow-sm shadow-amber-500/20 transition-all">
            {saving ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Update User' : 'Create User'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   RESET PASSWORD MODAL
   ═══════════════════════════════════════════════════════════ */
const ResetPasswordModal = ({ user, onSave, onClose }) => {
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSave = async () => {
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      await onSave(user.id, password);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setSaving(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100 z-10 my-auto">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Key className="w-5 h-5 text-amber-600" /></div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Reset Password</h3>
            <p className="text-[11px] text-slate-400">For @{user?.username}</p>
          </div>
        </div>
        {error && <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {error}</div>}
        <div className="flex gap-2 mb-1">
          <input className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30" type={showPwd ? 'text' : 'password'}
            value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="New temporary password" />
          <button onClick={() => { setPassword(userManagementService.generatePassword()); setShowPwd(true); }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 shrink-0"><Zap className="w-3.5 h-3.5" /></button>
        </div>
        {password && <button onClick={() => navigator.clipboard.writeText(password)} className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 mb-3"><Copy className="w-3 h-3" /> Copy</button>}
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2 bg-amber-500 text-slate-900 rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : 'Force Reset'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CONFIRM DIALOG
   ═══════════════════════════════════════════════════════════ */
const ConfirmActionDialog = ({ action, user, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);
  const configs = {
    delete: { icon: Trash2, title: 'Delete User', message: `This will soft-delete @${user?.username}. The account can be restored later.`, btn: 'Delete', color: 'bg-red-500 hover:bg-red-600 text-white' },
    restore: { icon: RotateCcw, title: 'Restore User', message: `This will restore @${user?.username} and set their status to Active.`, btn: 'Restore', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
    activate: { icon: UserCheck, title: 'Activate Account', message: `Activate @${user?.username}'s account?`, btn: 'Activate', color: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
    deactivate: { icon: UserX, title: 'Deactivate Account', message: `Deactivate @${user?.username}'s account? They will be unable to log in.`, btn: 'Deactivate', color: 'bg-amber-500 hover:bg-amber-600 text-white' },
    lock: { icon: Lock, title: 'Lock Account', message: `Lock @${user?.username}'s account? Only a Super Admin can unlock it.`, btn: 'Lock', color: 'bg-red-500 hover:bg-red-600 text-white' },
    unlock: { icon: Unlock, title: 'Unlock Account', message: `Unlock @${user?.username}'s account and reset failed login counter?`, btn: 'Unlock', color: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
  };
  const cfg = configs[action] || {};
  const Icon = cfg.icon || AlertTriangle;

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(); } catch { setLoading(false); }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center z-10 my-auto border border-slate-100">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{cfg.title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{cfg.message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleConfirm} disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors ${cfg.color}`}>
            {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" /> : cfg.btn}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   RICH DETAILED IDENTITY MODAL (Central UI/UX Popup)
   ═══════════════════════════════════════════════════════════ */
const UserDetailModal = ({ userId, onClose, onEdit, onAction }) => {
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [logins, setLogins] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadRealTimeData = useCallback(() => {
    if (!userId) return;
    Promise.all([
      userManagementService.getUserById(userId),
      userManagementService.getUserActivity(userId, 40),
      userManagementService.getUserLogins(userId, 40),
      userManagementService.getUserSessions(userId),
    ]).then(([u, a, l, s]) => {
      setUser(u);
      setActivity(a || []);
      setLogins(l || []);
      setSessions(s || []);
    }).catch(err => {
      toast({ type: 'error', title: 'Data synchronization failed', message: err.message });
    }).finally(() => setLoading(false));
  }, [userId, toast]);

  useEffect(() => {
    setLoading(true);
    loadRealTimeData();
  }, [userId]);

  if (!userId) return null;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: UserCircle },
    { key: 'activity', label: 'Activity Log', icon: Activity },
    { key: 'logins', label: 'Logins & Devices', icon: LogIn },
    { key: 'sessions', label: 'Active Sessions', icon: Monitor },
  ];

  const isOnline = user?.lastActivity && (new Date() - new Date(user.lastActivity)) < 5 * 60 * 1000;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85%] flex flex-col overflow-hidden border border-slate-100 z-10 my-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <UserAvatar user={user} size="lg" />
              {isOnline && <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                {loading ? 'Synchronizing profile...' : user?.name}
                {user?.isDeleted && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">DELETED</span>}
              </h2>
              <p className="text-sm text-slate-500">@{user?.username} · {user?.email}</p>
              {!loading && (
                <div className="flex items-center gap-2 mt-1.5">
                  <RoleBadge role={user?.role} />
                  <StatusBadge status={user?.status} />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!loading && (
              <>
                <button onClick={() => onEdit(user)} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-900 hover:bg-amber-600 shadow-sm transition-all flex items-center gap-1.5"><Pencil className="w-3.5 h-3.5" /> Edit Profile</button>
                <button onClick={() => onAction('resetPassword', user)} className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Reset</button>
              </>
            )}
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors ml-2"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 shrink-0 bg-slate-50/50">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold border-b-2 transition-colors ${tab === t.key ? 'border-amber-500 text-amber-700 bg-white/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
            </div>
          ) : user && (
            <>
              {tab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoRow icon={Mail} label="Primary Email Address" value={user.email} />
                  <InfoRow icon={Phone} label="Contact Phone Number" value={user.phone || '—'} />
                  <InfoRow icon={Hash} label="Employee Reference ID" value={user.employeeId || '—'} />
                  <InfoRow icon={Building2} label="Assigned Department" value={user.department?.name || 'Global Access'} />
                  <InfoRow icon={Shield} label="Access Role Authorization" value={roleService.getRoleLabel(user.role)} />
                  <InfoRow icon={Fingerprint} label="Multi-Factor Auth (MFA)" value={user.mfaEnabled ? 'Secured / Enabled' : 'Disabled'} />
                  <InfoRow icon={Clock} label="System Last Login Date" value={user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'No records logged'} />
                  <InfoRow icon={Activity} label="System Last Seen" value={user.lastActivity ? new Date(user.lastActivity).toLocaleString('en-IN') : 'No records logged'} />
                  <InfoRow icon={BarChart3} label="Total Successful Logins" value={user.loginCount || 0} />
                  <InfoRow icon={CalendarDays} label="Account Registration Date" value={new Date(user.createdAt).toLocaleDateString('en-IN')} />
                  <InfoRow icon={UserCircle} label="Created By Account" value={user.createdBy?.name || 'System Auto-Seed'} />
                  {user.notes && <div className="col-span-1 md:col-span-2 mt-2"><InfoRow icon={FileText} label="Administrative Notes" value={user.notes} /></div>}
                  {user.lockedReason && <div className="col-span-1 md:col-span-2 mt-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex gap-2"><Lock className="w-4 h-4 mt-0.5 shrink-0" /><div><p className="text-xs font-bold">Account Lockout Active</p><p className="text-[11px] mt-0.5">{user.lockedReason}</p></div></div>}

                  {/* Overridden Permission Summary */}
                  {user.permissions && user.permissions.length > 0 && (
                    <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Overridden Permissions Matrix</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {user.permissions.map(p => (
                          <span key={p.id} className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${p.granted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {p.granted ? '✓' : '✗'} {p.resource}:{p.action}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 'activity' && (
                <div className="space-y-3">
                  {activity.length === 0 ? (
                    <EmptyState icon={Activity} label="No activity history found in database" />
                  ) : activity.map(a => (
                    <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-start gap-3.5 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                        <ActivityIcon action={a.action} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold text-slate-800">{formatAction(a.action)}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">{new Date(a.createdAt).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Performed by: <span className="font-semibold">{a.performedBy?.name || 'System Process'}</span>
                        </p>
                        {a.details && typeof a.details === 'object' && Object.keys(a.details).length > 0 && (
                          <div className="mt-2 text-[10px] bg-slate-100/50 rounded-lg p-2 font-mono text-slate-600 border border-slate-200/40">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(a.details, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {tab === 'logins' && (
                <div className="space-y-2">
                  {logins.length === 0 ? (
                    <EmptyState icon={LogIn} label="No login records available" />
                  ) : logins.map(l => (
                    <div key={l.id} className="flex items-center gap-3.5 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${l.action === 'LOGIN' ? 'bg-emerald-50' : l.action === 'LOGOUT' ? 'bg-blue-50' : 'bg-red-50'}`}>
                        {l.action === 'LOGIN' ? <LogIn className="w-4 h-4 text-emerald-600" /> :
                          l.action === 'LOGOUT' ? <LogOutIcon className="w-4 h-4 text-blue-600" /> :
                            <XCircle className="w-4 h-4 text-red-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800">{l.action.replace(/_/g, ' ')}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">{new Date(l.createdAt).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{l.browser || 'Browser'} on {l.os || 'OS'} ({l.device || 'Device'})</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono font-bold text-slate-600">{l.ipAddress || '0.0.0.0'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'sessions' && (
                <div className="space-y-2">
                  {sessions.length === 0 ? (
                    <EmptyState icon={Monitor} label="No active system sessions found" />
                  ) : sessions.map(s => (
                    <div key={s.id} className="flex items-center gap-3.5 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 shadow-sm">
                        {s.device === 'Mobile' ? <Smartphone className="w-4 h-4 text-blue-600" /> : <Monitor className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800">{s.browser || 'Web Browser'} on {s.os || 'OS System'}</p>
                          {s.isActive && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">CURRENT</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Last Checked: {new Date(s.lastSeen).toLocaleString('en-IN')} · IP: {s.ipAddress || 'Unknown'}</p>
                      </div>
                      <button onClick={async () => {
                        try {
                          await userManagementService.terminateSession(user.id, s.id);
                          setSessions(prev => prev.filter(x => x.id !== s.id));
                          toast({ type: 'success', title: 'Active session revoked successfully' });
                          loadRealTimeData();
                        } catch (err) { toast({ type: 'error', title: 'Revocation failed', message: err.message }); }
                      }}
                        className="px-3 py-1.5 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all">
                        Revoke Access
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Detail Helpers ─── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2 bg-slate-50/50 hover:bg-slate-50 rounded-xl px-3 border border-slate-100 transition-colors">
    <Icon className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-sm text-slate-700 font-semibold truncate mt-0.5">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
    <Icon className="w-12 h-12 mb-3 opacity-20" />
    <p className="text-sm font-semibold">{label}</p>
  </div>
);

const ActivityIcon = ({ action }) => {
  const icons = {
    CREATED_USER: <UserPlus className="w-4 h-4 text-emerald-600" />,
    UPDATED_USER: <Pencil className="w-4 h-4 text-blue-600" />,
    USER_DELETED: <Trash2 className="w-4 h-4 text-red-600" />,
    USER_RESTORED: <RotateCcw className="w-4 h-4 text-blue-600" />,
    ROLE_CHANGED: <Shield className="w-4 h-4 text-violet-600" />,
    PASSWORD_RESET: <Key className="w-4 h-4 text-amber-600" />,
    ACCOUNT_LOCKED: <Lock className="w-4 h-4 text-red-600" />,
    ACCOUNT_AUTO_LOCKED: <ShieldAlert className="w-4 h-4 text-red-600" />,
    ACCOUNT_UNLOCKED: <Unlock className="w-4 h-4 text-emerald-600" />,
    ACCOUNT_ACTIVATED: <UserCheck className="w-4 h-4 text-emerald-600" />,
    ACCOUNT_DEACTIVATED: <UserX className="w-4 h-4 text-slate-500" />,
    PERMISSIONS_UPDATED: <Settings className="w-4 h-4 text-cyan-600" />,
    DEPARTMENT_TRANSFERRED: <ArrowRightLeft className="w-4 h-4 text-blue-600" />,
    SESSION_TERMINATED: <Ban className="w-4 h-4 text-orange-600" />,
    LOGIN: <LogIn className="w-4 h-4 text-emerald-600" />,
    LOGOUT: <LogOutIcon className="w-4 h-4 text-slate-500" />,
  };
  return icons[action] || <Activity className="w-4 h-4 text-slate-400" />;
};

function formatAction(action) {
  return action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ═══════════════════════════════════════════════════════════
   403 FORBIDDEN PAGE
   ═══════════════════════════════════════════════════════════ */
const ForbiddenPage = () => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center h-full min-h-[60vh] p-8">
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-50 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-red-100/50">
      <ShieldAlert className="w-12 h-12 text-red-500" />
    </motion.div>
    <h2 className="text-3xl font-black text-slate-800 mb-2">403 Forbidden</h2>
    <p className="text-slate-500 text-center max-w-md leading-relaxed">
      You do not have permission to access the User Management module.<br />
      Only <span className="font-bold text-amber-600">Super Administrators</span> can manage users and access controls.
    </p>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
const UserManagementEditor = () => {
  const { isSuperAdmin, session } = useAdminAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({ search: '', role: '', status: '', departmentId: '', sortBy: 'createdAt', sortOrder: 'desc', includeDeleted: false });

  // Modals
  const [editingUser, setEditingUser] = useState(null);
  const [resetPwdUser, setResetPwdUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ─── Data Loading ───
  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        userManagementService.getUsers(filters),
        userManagementService.getUserStats(),
      ]);
      setUsers(usersRes.users || []);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast({ type: 'error', title: 'Failed to load users', message: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, toast]);

  const loadDepartments = useCallback(async () => {
    setDepartments(DEPARTMENTS.map(d => ({ id: d.key, name: d.fullName, code: d.key.toUpperCase() })));
  }, []);

  useEffect(() => { if (isSuperAdmin) { loadData(); loadDepartments(); } }, [isSuperAdmin]);

  // Debounce search
  useEffect(() => {
    if (!isSuperAdmin) return;
    const timeout = setTimeout(() => loadData(false), 400);
    return () => clearTimeout(timeout);
  }, [filters.search, filters.role, filters.status, filters.departmentId, filters.sortBy, filters.includeDeleted]);

  // ─── RBAC Guard ───
  if (!isSuperAdmin) return <ForbiddenPage />;

  // ─── Handlers ───
  const handleCreateUser = async (form) => {
    const data = {
      name: form.name,
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
      departmentId: form.departmentId || null,
      status: form.status || 'ACTIVE',
      phone: form.phone || null,
      employeeId: form.employeeId || null,
      notes: form.notes || null,
      forcePasswordChange: form.forcePasswordChange,
    };
    await userManagementService.createUser(data);
    toast({ type: 'success', title: 'User Created', message: `@${form.username} has been created successfully` });
    setEditingUser(null);
    loadData(false);
  };

  const handleUpdateUser = async (form) => {
    const data = {};
    if (form.name) data.name = form.name;
    if (form.email) data.email = form.email;
    if (form.phone !== undefined) data.phone = form.phone;
    if (form.employeeId !== undefined) data.employeeId = form.employeeId;
    if (form.notes !== undefined) data.notes = form.notes;
    if (form.departmentId !== undefined) data.departmentId = form.departmentId;

    await userManagementService.updateUser(form.id, data);

    const original = users.find(u => u.id === form.id);
    if (original && form.role && form.role !== original.role) {
      await userManagementService.changeRole(form.id, form.role);
    }

    toast({ type: 'success', title: 'User Updated', message: `@${form.username} has been updated` });
    setEditingUser(null);
    loadData(false);
  };

  const handleResetPassword = async (userId, password) => {
    await userManagementService.resetPassword(userId, password);
    toast({ type: 'success', title: 'Password Reset', message: 'Temporary password set. User must change it on next login.' });
    setResetPwdUser(null);
    loadData(false);
  };

  const handleAction = (action, user) => {
    if (action === 'resetPassword') { setResetPwdUser(user); return; }
    setConfirmAction({ action, user });
  };

  const executeAction = async () => {
    const { action, user } = confirmAction;
    try {
      switch (action) {
        case 'delete': await userManagementService.deleteUser(user.id); break;
        case 'restore': await userManagementService.restoreUser(user.id); break;
        case 'activate': await userManagementService.changeStatus(user.id, 'ACTIVE'); break;
        case 'deactivate': await userManagementService.changeStatus(user.id, 'INACTIVE'); break;
        case 'lock': await userManagementService.changeStatus(user.id, 'LOCKED', 'Locked by administrator'); break;
        case 'unlock': await userManagementService.changeStatus(user.id, 'ACTIVE'); break;
      }
      toast({ type: 'success', title: 'Success', message: `Action "${action}" completed on @${user.username}` });
    } catch (err) {
      toast({ type: 'error', title: 'Action Failed', message: err.response?.data?.message || err.message });
    }
    setConfirmAction(null);
    loadData(false);
  };

  const handleExport = () => {
    const csvRows = ['Name,Username,Email,Role,Department,Status,Last Login,Login Count,Created'];
    users.forEach(u => {
      csvRows.push([
        u.name, u.username, u.email, u.role,
        u.department?.name || '', u.status,
        u.lastLogin || '', u.loginCount || 0, u.createdAt,
      ].map(v => `"${v}"`).join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `user-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast({ type: 'success', title: 'Exported', message: `${users.length} users exported to CSV` });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl" />)}
        </div>
        <div className="h-14 bg-white border border-slate-100 rounded-2xl" />
        <div className="h-96 bg-white border border-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">User & Access Management</h1>
            <p className="text-sm text-slate-500 font-medium">{users.length} registered identities · Enterprise Directory</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <KPISection stats={stats} />

      {/* Smart Toolbar */}
      <SmartToolbar
        filters={filters}
        setFilters={setFilters}
        onRefresh={() => loadData(false)}
        onExport={handleExport}
        onCreateUser={() => setEditingUser({})}
        refreshing={refreshing}
        departments={departments}
      />

      {/* User Table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/60 overflow-hidden flex-1 flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-md">
              <tr className="border-b border-slate-200/60">
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Identity</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Role</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden lg:table-cell">Department</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden xl:table-cell">Last Login</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden xl:table-cell">Logins</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((user, index) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    index={index}
                    onView={(u) => setSelectedUserId(u.id)}
                    onEdit={setEditingUser}
                    onAction={handleAction}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Users className="w-14 h-14 mb-4 opacity-20" />
              </motion.div>
              <p className="text-sm font-semibold mb-1">No users found</p>
              <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Central viewport relative modal layers */}
      <AnimatePresence>
        {selectedUserId && (
          <UserDetailModal
            key="details-modal"
            userId={selectedUserId}
            onClose={() => setSelectedUserId(null)}
            onEdit={(u) => { setSelectedUserId(null); setEditingUser(u); }}
            onAction={(action, user) => { setSelectedUserId(null); handleAction(action, user); }}
          />
        )}
        {editingUser !== null && (
          <CreateEditModal
            key="create-edit"
            user={editingUser.id ? editingUser : null}
            departments={departments}
            onSave={editingUser.id ? handleUpdateUser : handleCreateUser}
            onClose={() => setEditingUser(null)}
          />
        )}
        {resetPwdUser && (
          <ResetPasswordModal
            key="reset-pwd"
            user={resetPwdUser}
            onSave={handleResetPassword}
            onClose={() => setResetPwdUser(null)}
          />
        )}
        {confirmAction && (
          <ConfirmActionDialog
            key="confirm"
            action={confirmAction.action}
            user={confirmAction.user}
            onConfirm={executeAction}
            onClose={() => setConfirmAction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementEditor;
