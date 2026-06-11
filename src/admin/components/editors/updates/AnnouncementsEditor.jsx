import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Save, Megaphone, Clock,
  CheckCircle, Search, Pin, Eye, EyeOff
} from 'lucide-react';
import { updatesService, UPDATE_TYPES, ANNOUNCEMENT_CATEGORIES, createEmptyItem } from '../../../services/updatesService';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { ConfirmDialog } from '../../ui/Modal';

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800";

const AnnouncementCard = ({ item, onEdit, onDelete, onTogglePin, onTogglePublish }) => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className={`bg-white rounded-2xl border ${item.pinned ? 'border-amber-300 shadow-sm' : 'border-slate-200'} p-4 hover:shadow-md transition-all group relative overflow-hidden`}>
    
    {!item.published && (
      <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg">DRAFT</div>
    )}

    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 shrink-0 flex items-center justify-center text-primary-600 relative">
        <Megaphone className="w-6 h-6" />
        {item.pinned && (
          <div className="absolute -top-1.5 -left-1.5 bg-amber-500 text-white p-1 rounded-full shadow-sm">
            <Pin className="w-3 h-3" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
          </span>
          {item.lastEditedBy && (
            <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1 bg-amber-50 px-1.5 rounded border border-amber-100">
              <Pencil className="w-2.5 h-2.5" /> Edited by {item.lastEditedBy} {item.lastEditedByDept ? `(${item.lastEditedByDept.toUpperCase()})` : (item.lastEditedByRole === 'SUPER_ADMIN' ? '(Super Admin)' : '')}
            </span>
          )}
        </div>
        <h4 className="font-bold text-slate-800 text-sm leading-snug">{item.title}</h4>
      </div>
    </div>
    
    {item.description && <p className="mt-3 text-xs text-slate-500 line-clamp-3">{item.description}</p>}

    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onTogglePublish(item)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${item.published ? 'text-amber-600 bg-primary-50 hover:bg-primary-100' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>
        {item.published ? <><Eye className="w-3.5 h-3.5" /> Published</> : <><EyeOff className="w-3.5 h-3.5" /> Draft</>}
      </button>
      <button onClick={() => onTogglePin(item)} className={`flex items-center justify-center p-1.5 rounded-lg transition-colors ${item.pinned ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`} title={item.pinned ? 'Unpin' : 'Pin to top'}>
        <Pin className="w-3.5 h-3.5" />
      </button>
      <div className="flex-1" />
      <button onClick={() => onEdit(item)} className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onDelete(item)} className="p-1.5 text-amber-500 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </motion.div>
);

const AnnouncementModal = ({ initial, onSave, onClose }) => {
  const { admin } = useAdminAuth();
  const [form, setForm] = useState(initial?.id ? initial : { ...createEmptyItem(UPDATE_TYPES.ANNOUNCEMENTS), author: admin || '' });
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10 shrink-0">
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit Announcement' : 'New Announcement'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto min-h-0 flex-1">
          
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Announcement Title *</label>
            <input className={inputCls} value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. End Semester Exam Timetable" />
          </div>

          
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Details</label>
            <textarea className={`${inputCls} resize-none`} rows={4} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Full notice details..." />
          </div>

          <div className="flex items-center gap-4 py-3 border-y border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} className="w-4 h-4 accent-emerald-500 rounded" />
              Publish immediately
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.pinned} onChange={e => update('pinned', e.target.checked)} className="w-4 h-4 accent-amber-500 rounded" />
              Pin to top (Ticker)
            </label>
          </div>

        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={!form.title.trim() || saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {initial?.id ? 'Save Changes' : 'Create Announcement'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function AnnouncementsEditor() {
  const { admin } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const refresh = async () => {
    setLoading(true);
    if (search) setItems(await updatesService.search(UPDATE_TYPES.ANNOUNCEMENTS, search));
    else setItems(await updatesService.getAll(UPDATE_TYPES.ANNOUNCEMENTS));
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [search]);

  const handleSave = async (form) => {
    if (form.id) await updatesService.update(UPDATE_TYPES.ANNOUNCEMENTS, form.id, form, admin);
    else await updatesService.add(UPDATE_TYPES.ANNOUNCEMENTS, form, admin);
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
    await updatesService.delete(UPDATE_TYPES.ANNOUNCEMENTS, confirmDelete.id);
    await refresh();
    setConfirmDelete(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Announcements</h2>
          <p className="text-sm text-slate-500 mt-1">Manage college notices, circulars, and alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" /> Saved!</div>}
          <button onClick={() => setEditing({})} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> Add Announcement
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input className={`${inputCls} pl-10`} placeholder="Search announcements..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Megaphone className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium">No announcements found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {items.map(item => (
              <AnnouncementCard
                key={item.id}
                item={item}
                onEdit={setEditing}
                onDelete={handleDelete}
                onTogglePin={async (i) => { await updatesService.togglePin(UPDATE_TYPES.ANNOUNCEMENTS, i.id, admin); await refresh(); }}
                onTogglePublish={async (i) => { await updatesService.togglePublish(UPDATE_TYPES.ANNOUNCEMENTS, i.id, admin); await refresh(); }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {editing && <AnnouncementModal initial={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      </AnimatePresence>

      <ConfirmDialog 
        isOpen={!!confirmDelete} 
        onClose={() => setConfirmDelete(null)} 
        onConfirm={executeDelete}
        title="Delete Announcement" 
        message={`Are you sure you want to delete "${confirmDelete?.title}"?`} 
        confirmText="Delete" 
        confirmVariant="danger" 
      />
    </div>
  );
}
