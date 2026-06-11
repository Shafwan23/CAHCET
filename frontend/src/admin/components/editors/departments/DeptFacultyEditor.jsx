/**
 * DeptFacultyEditor.jsx — Faculty CMS Editor
 * Full CRUD: Add / Edit / Delete faculty members with image upload, rich fields,
 * search, responsive card grid, and modal editing.
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Search, X, Save, Upload,
  Mail, Phone, Linkedin, BookOpen, Award, UserCircle, CheckCircle,
} from 'lucide-react';
import { fileService } from '../../../services/fileService';

const DESIGNATIONS = [
  'Professor & Head', 'Professor', 'Associate Professor', 'Assistant Professor',
  'Lecturer', 'Visiting Faculty', 'Adjunct Professor',
];

const emptyFaculty = {
  name: '', designation: '', qualification: '', specialization: '',
  experience: '', email: '', phone: '', linkedin: '', image: '', publications: '',
};

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white";

/* ─── Faculty Card ─── */
const FacultyCard = ({ faculty, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all group"
  >
    <div className="flex gap-3">
      <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
        {faculty.image ? (
          <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <UserCircle className="w-8 h-8" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-800 text-sm truncate">{faculty.name || '—'}</p>
        <p className="text-xs text-amber-600 font-medium">{faculty.designation}</p>
        <p className="text-xs text-slate-400 truncate">{faculty.qualification}</p>
      </div>
    </div>
    {faculty.specialization && (
      <div className="mt-3 flex items-center gap-1.5">
        <BookOpen className="w-3 h-3 text-slate-400 shrink-0" />
        <p className="text-[11px] text-slate-500 truncate">{faculty.specialization}</p>
      </div>
    )}
    {faculty.experience && (
      <div className="flex items-center gap-1.5 mt-1">
        <Award className="w-3 h-3 text-slate-400 shrink-0" />
        <p className="text-[11px] text-slate-500">{faculty.experience} years experience</p>
      </div>
    )}
    {faculty.email && (
      <div className="flex items-center gap-1.5 mt-1">
        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
        <p className="text-[11px] text-slate-500 truncate">{faculty.email}</p>
      </div>
    )}
    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => onEdit(faculty)}
        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
      >
        <Pencil className="w-3 h-3" /> Edit
      </button>
      <button
        onClick={() => onDelete(faculty)}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-500 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </motion.div>
);

/* ─── Faculty Modal (Add / Edit) ─── */
const FacultyModal = ({ initial, deptKey, onSave, onClose }) => {
  const [form, setForm] = useState(initial || emptyFaculty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileService.compressImage(file, 400, 0.85);
      const record = await fileService.upload(compressed, deptKey, 'faculty');
      update('image', record.url);
    } catch {}
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit Faculty' : 'Add New Faculty'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Photo */}
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <UserCircle className="w-10 h-10" />
                </div>
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl cursor-pointer hover:bg-amber-600 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
              </label>
              <p className="text-[10px] text-slate-400 mt-1">JPG/PNG, max 2MB, square recommended</p>
            </div>
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
              <input className={inputCls} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Dr. / Prof. Full Name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Designation</label>
              <select className={inputCls} value={form.designation} onChange={e => update('designation', e.target.value)}>
                <option value="">Select designation</option>
                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Qualification</label>
              <input className={inputCls} value={form.qualification} onChange={e => update('qualification', e.target.value)} placeholder="Ph.D., M.Tech., etc." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Specialization</label>
              <input className={inputCls} value={form.specialization} onChange={e => update('specialization', e.target.value)} placeholder="Area of specialization" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Experience (years)</label>
              <input className={inputCls} type="number" value={form.experience} onChange={e => update('experience', e.target.value)} placeholder="15" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input className={`${inputCls} pl-9`} value={form.email} onChange={e => update('email', e.target.value)} placeholder="faculty@cahcet.edu.in" type="email" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input className={`${inputCls} pl-9`} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">LinkedIn URL</label>
              <div className="relative">
                <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input className={`${inputCls} pl-9`} value={form.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Publications / Research (optional)</label>
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.publications} onChange={e => update('publications', e.target.value)} placeholder="List notable publications or research areas..." />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={!form.name.trim() || saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : initial?.id ? 'Update Faculty' : 'Add Faculty'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Delete Confirm ─── */
const DeleteConfirm = ({ faculty, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
    >
      <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-6 h-6 text-amber-500" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">Delete Faculty</h3>
      <p className="text-sm text-slate-500 mb-5">Are you sure you want to delete <strong>{faculty.name}</strong>? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">Delete</button>
      </div>
    </motion.div>
  </div>
);

/* ─── Main Editor ─── */
const DeptFacultyEditor = ({ deptKey, dept, cms, session }) => {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saved, setSaved] = useState(false);

  const faculties = cms.data?.faculties || [];

  const filtered = useMemo(() =>
    faculties.filter(f =>
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.designation?.toLowerCase().includes(search.toLowerCase()) ||
      f.specialization?.toLowerCase().includes(search.toLowerCase())
    ), [faculties, search]
  );

  const handleSave = (formData) => {
    if (formData.id) {
      cms.updateItem('faculties', formData.id, formData, session?.username, session?.name);
    } else {
      cms.addItem('faculties', formData, session?.username, session?.name);
    }
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (deleting) {
      cms.deleteItem('faculties', deleting.id, session?.username, session?.name, deleting.name);
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">{faculties.length} faculty member{faculties.length !== 1 ? 's' : ''} in {dept.label}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-amber-600 text-xs font-medium bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> Saved!
            </motion.div>
          )}
          <button
            onClick={() => setEditing(emptyFaculty)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
          placeholder="Search faculty..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-slate-400" /></button>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <UserCircle className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium">{search ? 'No faculty match your search.' : 'No faculty added yet.'}</p>
          {!search && <p className="text-xs text-slate-400 mt-1">Click "Add Faculty" to get started.</p>}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map(f => (
              <FacultyCard key={f.id} faculty={f} onEdit={setEditing} onDelete={setDeleting} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {editing && (
          <FacultyModal initial={editing} deptKey={deptKey} onSave={handleSave} onClose={() => setEditing(null)} />
        )}
        {deleting && (
          <DeleteConfirm faculty={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeptFacultyEditor;
