import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Upload, User, Users, Building2, CheckCircle, Search, Filter, BarChart3 } from 'lucide-react';
import { placementsService, PLACEMENT_TYPES, createEmptyPlacement } from '../../../services/placementsService';
import { fileService } from '../../../services/fileService';
import { DEPARTMENTS } from '../../../services/departmentService';

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800";
const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

const StudentCard = ({ item, onEdit, onDelete }) => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all group flex gap-4">
    
    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-slate-400">
      <User className="w-6 h-6" />
    </div>

    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <h4 className="font-bold text-slate-800 text-sm leading-snug truncate">{item.studentName}</h4>
      <p className="text-[10px] text-slate-500 font-medium mb-1 truncate">{DEPARTMENTS.find(d => d.key === item.department)?.label || item.department}</p>
      
      <div className="flex items-center gap-1.5 mt-1">
        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-xs text-slate-700 font-semibold truncate">{item.companyName}</span>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] font-bold bg-primary-50 text-amber-600 px-2 py-0.5 rounded-full border border-primary-100">
          {item.package}
        </span>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          {item.year}
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-center shrink-0">
      <button onClick={() => onEdit(item)} className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onDelete(item)} className="p-1.5 text-amber-500 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </motion.div>
);

const StudentModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial?.id ? initial : createEmptyPlacement(PLACEMENT_TYPES.STUDENTS));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));



  const handleSave = async () => {
    if (!form.studentName.trim() || !form.companyName.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10 shrink-0">
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit Student Details' : 'Add Placed Student'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto min-h-0 flex-1">
          


          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Student Name *</label>
              <input className={inputCls} value={form.studentName} onChange={e => update('studentName', e.target.value)} placeholder="Full Name" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department *</label>
              <select className={inputCls} value={form.department} onChange={e => update('department', e.target.value)}>
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Batch / Year *</label>
              <select className={inputCls} value={form.year} onChange={e => update('year', e.target.value)}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Placed Company *</label>
              <input className={inputCls} value={form.companyName} onChange={e => update('companyName', e.target.value)} placeholder="Company Name" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Package (LPA) *</label>
              <input className={inputCls} value={form.package} onChange={e => update('package', e.target.value)} placeholder="e.g. 8.5 LPA" />
            </div>

          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={!form.studentName.trim() || !form.companyName.trim() || saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {initial?.id ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function StudentsPlacedEditor() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ highestPackage: 0, totalPlaced: 0, totalRecruiters: 0, deptStats: {}, yearStats: {} });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const refresh = async () => {
    setLoading(true);
    let result = await placementsService.getAll(PLACEMENT_TYPES.STUDENTS, { year: yearFilter || null, department: deptFilter || null });
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i => i.studentName?.toLowerCase().includes(q) || i.companyName?.toLowerCase().includes(q));
    }
    setItems(result);
    const analytics = await placementsService.getAnalytics();
    setStats(analytics);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [search, yearFilter, deptFilter]);

  const handleSave = async (form) => {
    if (form.id) await placementsService.update(PLACEMENT_TYPES.STUDENTS, form.id, form);
    else await placementsService.add(PLACEMENT_TYPES.STUDENTS, form);
    await refresh();
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async (item) => {
    setConfirmDelete(item);
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    await placementsService.delete(PLACEMENT_TYPES.STUDENTS, confirmDelete.id);
    await refresh();
    setConfirmDelete(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Students Placed</h2>
          <p className="text-sm text-slate-500 mt-1">Manage student placement records and success stories.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" /> Saved!</div>}
          <button onClick={() => setEditing({})} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Placed</p>
            <p className="text-2xl font-black text-slate-800">{stats.totalPlaced}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-amber-600 flex items-center justify-center"><BarChart3 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Highest Package</p>
            <p className="text-2xl font-black text-slate-800">{stats.highestPackage > 0 ? `${stats.highestPackage} LPA` : 'N/A'}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"><Building2 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Recruiters</p>
            <p className="text-2xl font-black text-slate-800">{stats.totalRecruiters}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className={`${inputCls} pl-10`} placeholder="Search student or company..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-4">
          <div className="relative w-40 shrink-0">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select className={`${inputCls} pl-10`} value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
              <option value="">All Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="relative w-48 shrink-0">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select className={`${inputCls} pl-10`} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading students...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <User className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium">No students found for selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {items.map(item => (
              <StudentCard key={item.id} item={item} onEdit={setEditing} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {editing && <StudentModal initial={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}
