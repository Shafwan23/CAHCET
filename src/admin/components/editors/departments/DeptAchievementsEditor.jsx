/**
 * DeptAchievementsEditor.jsx — Achievements CMS Editor
 * Categories: Student / Faculty / Placement / Award / Research / Competition / Certification
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Upload, Trophy, CheckCircle, Filter } from 'lucide-react';
import { fileService } from '../../../services/fileService';

const CATEGORIES = ['All', 'Student', 'Faculty', 'Placement', 'Award', 'Research', 'Competition', 'Certification'];
const CAT_COLORS = {
  Student: 'bg-blue-100 text-blue-700', Faculty: 'bg-primary-100 text-purple-700',
  Placement: 'bg-primary-100 text-primary-700', Award: 'bg-amber-100 text-amber-700',
  Research: 'bg-primary-100 text-indigo-700', Competition: 'bg-primary-100 text-rose-700',
  Certification: 'bg-cyan-100 text-cyan-700',
};

const emptyItem = { title: '', category: 'Student', date: '', description: '', image: '' };
const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800";

/* ─── Achievement Card ─── */
const AchievementCard = ({ item, onEdit, onDelete }) => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all group">
    <div className="flex gap-3">
      {item.image && (
        <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[item.category] || 'bg-slate-100 text-slate-600'}`}>
            {item.category}
          </span>
          <span className="text-[10px] text-slate-400">{item.date}</span>
        </div>
        <p className="font-bold text-slate-800 text-sm leading-snug">{item.title}</p>
        {item.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>}
      </div>
    </div>
    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50">
        <Pencil className="w-3 h-3" /> Edit
      </button>
      <button onClick={() => onDelete(item)} className="px-3 py-1.5 text-xs text-amber-500 border border-primary-200 rounded-lg hover:bg-primary-50">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </motion.div>
);

/* ─── Modal ─── */
const AchievementModal = ({ initial, deptKey, onSave, onClose }) => {
  const [form, setForm] = useState({ ...emptyItem, ...initial });
  const [uploading, setUploading] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileService.compressImage(file, 800, 0.85);
      const rec = await fileService.upload(compressed, deptKey, 'achievements');
      update('image', rec.url);
    } catch {}
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit Achievement' : 'Add Achievement'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title *</label>
            <input className={inputCls} value={form.title} onChange={e => update('title', e.target.value)} placeholder="Achievement title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
              <select className={inputCls} value={form.category} onChange={e => update('category', e.target.value)}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date</label>
              <input className={inputCls} type="date" value={form.date} onChange={e => update('date', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
            <textarea className={`${inputCls} resize-none`} rows={4} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe the achievement..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Image / Certificate (optional)</label>
            <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 cursor-pointer hover:border-amber-400 hover:text-amber-500 transition-colors">
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload image or certificate'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
            </label>
            {form.image && (
              <div className="flex items-center gap-3 mt-2">
                <img src={form.image} alt="" className="w-16 h-12 rounded-lg object-cover border" />
                <button onClick={() => update('image', '')} className="text-xs text-amber-500 hover:text-amber-600">Remove</button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={() => form.title.trim() && onSave(form)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
            <Save className="w-4 h-4" /> {initial?.id ? 'Update' : 'Add Achievement'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main ─── */
const DeptAchievementsEditor = ({ deptKey, dept, cms, session }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [saved, setSaved] = useState(false);

  const achievements = cms.data?.achievements || [];
  const filtered = useMemo(() =>
    activeCategory === 'All' ? achievements : achievements.filter(a => a.category === activeCategory),
    [achievements, activeCategory]
  );

  const handleSave = (form) => {
    if (form.id) cms.updateItem('achievements', form.id, form, session?.username, session?.name);
    else cms.addItem('achievements', form, session?.username, session?.name);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Achievements</h2>
          <p className="text-sm text-slate-400 mt-0.5">{achievements.length} achievement{achievements.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" /> Saved!</div>}
          <button onClick={() => setEditing(emptyItem)} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all
              ${activeCategory === cat ? 'bg-amber-500 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
            {cat}
            {cat !== 'All' && <span className="ml-1 text-[10px] opacity-70">({achievements.filter(a => a.category === cat).length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Trophy className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium">No achievements {activeCategory !== 'All' ? `in ${activeCategory}` : 'yet'}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map(a => (
              <AchievementCard key={a.id} item={a} onEdit={setEditing} onDelete={setDeleting} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {editing && <AchievementModal initial={editing} deptKey={deptKey} onSave={handleSave} onClose={() => setEditing(null)} />}
        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
              <Trash2 className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">Delete Achievement?</h3>
              <p className="text-sm text-slate-500 mb-4"><strong>{deleting.title}</strong></p>
              <div className="flex gap-3">
                <button onClick={() => setDeleting(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
                <button onClick={() => { cms.deleteItem('achievements', deleting.id, session?.username, session?.name, deleting.title); setDeleting(null); }}
                  className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeptAchievementsEditor;
