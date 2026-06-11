/**
 * UserManagementEditor.jsx — Super Admin User Management
 * Full CRUD: create, edit, delete, reset passwords for all admin users.
 * Supports granular permissions and account statuses.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Save, Key, Shield, UserCircle,
  Building2, CheckCircle, AlertTriangle, Eye, EyeOff, Search, Ban
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DEPARTMENTS } from '../../services/departmentService';
import { roleService } from '../../services/roleService';
import { MODULES } from '../../services/permissionService';
import { ConfirmDialog } from '../ui/Modal';

const SECTIONS = ['overview', 'facilities', 'faculties', 'achievements', 'gallery', 'curriculum', 'contact'];

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800";

const ROLE_BADGE = {
  SUPER_ADMIN:    'bg-amber-100 text-amber-700 border-amber-200',
  DEPARTMENT_ADMIN:     'bg-blue-100 text-blue-700 border-blue-200',
  FACULTY_EDITOR: 'bg-primary-100 text-primary-700 border-primary-200',
  PLACEMENT_CELL: 'bg-primary-100 text-purple-700 border-purple-200',
};

const STATUS_BADGE = {
  ACTIVE: 'bg-primary-100 text-emerald-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
  LOCKED: 'bg-primary-100 text-primary-700',
  SUSPENDED: 'bg-primary-100 text-orange-700'
};

const emptyUser = { 
  username: '', password: '', name: '', email: '', 
  role: 'DEPARTMENT_ADMIN', deptKey: '', 
  granularAccess: false, allowedModules: [], assignedModules: [], 
  status: 'ACTIVE' 
};

/* ─── User Row ─── */
const UserRow = ({ user, onEdit, onDelete, onResetPwd }) => {
  const lastLoginFormatted = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never';
  return (
    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs">
            {user.initials || user.name?.slice(0, 2).toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              {user.name}
              {user.firstLoginRequired && <span className="w-2 h-2 rounded-full bg-amber-500" title="Password change required" />}
            </p>
            <p className="text-xs text-slate-400">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_BADGE[user.role] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
          {roleService.getRoleLabel(user.role)}
        </span>
      </td>
      <td className="px-4 py-3">
        {user.role === 'DEPARTMENT_ADMIN' && user.deptKey ? (
          <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
            {DEPARTMENTS.find(d => d.key === user.deptKey)?.label || user.deptKey.toUpperCase()}
            {user.granularAccess && <span className="ml-1 text-[9px] text-amber-600 font-bold">(Granular)</span>}
          </span>
        ) : user.role === 'FACULTY_EDITOR' ? (
          <span className="text-xs text-slate-500">{user.assignedModules?.length || 0} Modules</span>
        ) : user.role === 'PLACEMENT_CELL' ? (
          <span className="text-xs text-primary-600 font-medium">Placements</span>
        ) : (
          <span className="text-xs text-slate-400">All Departments</span>
        )}
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-xs text-slate-500">{lastLoginFormatted}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[user.status] || 'bg-slate-100 text-slate-500'}`}>
          {user.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onResetPwd(user)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Reset Password">
            <Key className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onEdit(user)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(user)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-primary-50 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

/* ─── User Modal ─── */
const UserModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState({ ...emptyUser, ...initial });
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  // For Dept Admin Granular
  const toggleDeptSection = (sec) => {
    const arr = form.allowedModules || [];
    update('allowedModules', arr.includes(sec) ? arr.filter(s => s !== sec) : [...arr, sec]);
  };

  // For Faculty Editor Granular Assignments
  const [facDept, setFacDept] = useState('');
  const [facMod, setFacMod] = useState('faculties');
  const addFacultyAssignment = () => {
    if (!facDept || !facMod) return;
    const arr = form.assignedModules || [];
    if (!arr.find(a => a.deptKey === facDept && a.module === facMod)) {
      update('assignedModules', [...arr, { deptKey: facDept, module: facMod }]);
    }
  };
  const removeFacultyAssignment = (idx) => {
    const arr = [...(form.assignedModules || [])];
    arr.splice(idx, 1);
    update('assignedModules', arr);
  };

  const handleSave = async () => {
    if (!form.username.trim() || !form.name.trim()) { setError('Username and name are required.'); return; }
    if (!initial?.id && !form.password) { setError('Password is required for new users.'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit User' : 'Create User'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="p-5 space-y-5 overflow-y-auto min-h-0 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-primary-50 border border-primary-200 rounded-xl text-sm text-amber-600">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
              <input className={inputCls} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Display name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username *</label>
              <input className={inputCls} value={form.username} onChange={e => update('username', e.target.value.toLowerCase().replace(/\s/g, '_'))} placeholder="admin_user" disabled={!!initial?.id} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <input className={inputCls} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="user@cahcet.edu.in" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Account Status</label>
              <select className={inputCls} value={form.status} onChange={e => update('status', e.target.value)}>
                {roleService.getAllStatuses().map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          
          {!initial?.id && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Temporary Password *</label>
              <div className="relative">
                <input className={`${inputCls} pr-10`} type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="Must change on first login" />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Role Assignment</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {roleService.getAllRoles().map(r => (
                <label key={r.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.role === r.value ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value={r.value} checked={form.role === r.value} 
                    onChange={e => { 
                      update('role', e.target.value); 
                      if (e.target.value === 'SUPER_ADMIN' || e.target.value === 'PLACEMENT_CELL') update('deptKey', null); 
                    }} 
                    className="mt-0.5 accent-amber-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{r.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Department Admin Granular Rules */}
          {form.role === 'DEPARTMENT_ADMIN' && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assigned Department</label>
                <select className={inputCls} value={form.deptKey || ''} onChange={e => update('deptKey', e.target.value || null)}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d.key} value={d.key}>{d.label} — {d.fullName}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Granular Module Access</p>
                  <p className="text-xs text-slate-400">Restrict admin to specific pages within their department</p>
                </div>
                <button onClick={() => update('granularAccess', !form.granularAccess)} className={`w-11 h-6 rounded-full transition-colors relative ${form.granularAccess ? 'bg-amber-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.granularAccess ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              {form.granularAccess && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  {SECTIONS.map(sec => (
                    <button key={sec} type="button" onClick={() => toggleDeptSection(sec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${(form.allowedModules || []).includes(sec) ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                      {sec}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Faculty Editor Granular Assignments */}
          {form.role === 'FACULTY_EDITOR' && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Faculty Assignments</h4>
              
              <div className="flex gap-2">
                <select className={`${inputCls} py-2 text-xs`} value={facDept} onChange={e=>setFacDept(e.target.value)}>
                  <option value="">Select Dept</option>
                  {DEPARTMENTS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                </select>
                <select className={`${inputCls} py-2 text-xs`} value={facMod} onChange={e=>setFacMod(e.target.value)}>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" onClick={addFacultyAssignment} className="bg-amber-500 hover:bg-amber-600 text-white px-3 rounded-xl shrink-0"><Plus className="w-4 h-4"/></button>
              </div>

              <div className="space-y-2">
                {(form.assignedModules || []).map((assignment, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium text-slate-700 capitalize">{assignment.deptKey.toUpperCase()} - {assignment.module}</span>
                    <button type="button" onClick={() => removeFacultyAssignment(idx)} className="text-slate-400 hover:text-amber-500"><X className="w-4 h-4"/></button>
                  </div>
                ))}
                {(!form.assignedModules || form.assignedModules.length === 0) && (
                  <p className="text-xs text-slate-400 italic">No modules assigned yet. User will have no access.</p>
                )}
              </div>
            </div>
          )}

        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100 shrink-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50 font-medium text-slate-600">Cancel</button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50 shadow-sm shadow-amber-500/20">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {initial?.id ? 'Update User' : 'Create User'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Reset Password Modal ─── */
const ResetPasswordModal = ({ user, onSave, onClose }) => {
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (password.length < 8) { setError('Temporary password must be at least 8 characters.'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    onSave(user.id, password);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-2.5 mb-4">
          <Key className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800">Admin Reset Password</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Provide a temporary password for <strong>@{user.username}</strong>. They will be forced to change it upon their next login.
        </p>
        {error && <div className="mb-3 p-2 bg-primary-50 border border-primary-200 rounded-lg text-xs text-amber-600">{error}</div>}
        <input className={inputCls} type="text" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="New temporary password" />
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-500 text-slate-900 rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50">
            {saving ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : 'Force Reset'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main ─── */
const UserManagementEditor = () => {
  const { isSuperAdmin, getAllUsers, createUser, updateUser, deleteUser, adminResetPassword, session } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [resetting, setResetting] = useState(null);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const refresh = () => setUsers(getAllUsers());
  useEffect(() => { refresh(); }, []);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Shield className="w-12 h-12 text-amber-500" />
        <p className="text-slate-600 font-semibold">Super Admin access required</p>
      </div>
    );
  }

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBulkDeactivate = () => {
    setConfirmDeactivate(true);
  };

  const executeBulkDeactivate = () => {
    filtered.forEach(u => {
      if (u.id !== session.userId) {
        updateUser(u.id, { status: 'INACTIVE' });
      }
    });
    refresh();
    setConfirmDeactivate(false);
  };

  const handleSave = (form) => {
    try {
      if (form.id) updateUser(form.id, form);
      else createUser(form, form.password); // pass temp password
      refresh();
      setEditing(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { alert(e.message); }
  };

  const handleDelete = (id) => {
    try {
      deleteUser(id);
      refresh();
      setDeleting(null);
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Enterprise User Management</h2>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">{users.length} registered system identities</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" /> Saved!</div>}
          <button onClick={() => setEditing(emptyUser)} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-slate-900 text-sm font-bold rounded-xl hover:bg-amber-600 shadow-sm shadow-amber-500/20">
            <Plus className="w-4 h-4" /> Add Identity
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400" placeholder="Search identities..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={handleBulkDeactivate} className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-amber-600 transition-colors bg-white border border-slate-200 px-3 py-2 rounded-xl">
          <Ban className="w-3.5 h-3.5" /> Bulk Deactivate Visble
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1 overflow-y-auto">
          <table className="w-full relative">
            <thead className="sticky top-0 z-10 bg-slate-50 backdrop-blur-md">
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50">Identity</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50">Role Level</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50">Scope / Assignments</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 hidden md:table-cell">Last Active</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50">Status</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50">Controls</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(user => (
                  <UserRow key={user.id} user={user} onEdit={setEditing} onDelete={setDeleting} onResetPwd={setResetting} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <UserCircle className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No identities found in directory.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editing && <UserModal initial={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
        {resetting && <ResetPasswordModal user={resetting} onSave={(id, pwd) => { adminResetPassword(id, pwd); refresh(); }} onClose={() => setResetting(null)} />}
        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-primary-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Obliterate Identity?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                You are about to permanently delete <strong>@{deleting.username}</strong>. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleting(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={() => handleDelete(deleting.id)} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        isOpen={confirmDeactivate} 
        onClose={() => setConfirmDeactivate(false)} 
        onConfirm={executeBulkDeactivate}
        title="Bulk Deactivate Users" 
        message="Are you sure you want to deactivate all users currently visible in the table? (Excludes your account)" 
        confirmText="Deactivate All" 
        confirmVariant="danger" 
      />
    </div>
  );
};

export default UserManagementEditor;
