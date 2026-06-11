/**
 * DeptFacilitiesEditor.jsx — Facilities CMS Editor
 * CRUD for labs, smart classrooms, libraries, research centers, etc.
 * Each facility supports multiple images, description, highlights, and type.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Save, Upload, ChevronDown, ChevronUp,
  Layers, Tag, Image as ImageIcon, CheckCircle,
} from 'lucide-react';
import { fileService } from '../../../services/fileService';

const FACILITY_TYPES = ['Laboratory', 'Smart Classroom', 'Library', 'Research Center', 'Seminar Hall', 'Workshop', 'Sports Facility', 'Computer Lab', 'Other'];

const emptyFacility = { name: '', type: '', description: '', highlights: [], images: [] };
const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white";

/* ─── Facility Card ─── */
const FacilityCard = ({ facility, onEdit, onDelete, expanded, onToggle }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
    {/* Main image preview */}
    {facility.images?.[0] && (
      <div className="h-36 overflow-hidden">
        <img src={facility.images[0]} alt={facility.name} className="w-full h-full object-cover" />
      </div>
    )}
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">{facility.type}</span>
          </div>
          <p className="font-bold text-slate-800 text-sm">{facility.name}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button onClick={() => onEdit(facility)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(facility)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-primary-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {facility.description && (
        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{facility.description}</p>
      )}
      {facility.highlights?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {facility.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{h}</span>
          ))}
          {facility.highlights.length > 3 && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{facility.highlights.length - 3}</span>
          )}
        </div>
      )}
      <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
        <span>{facility.images?.length || 0} image{facility.images?.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  </div>
);

/* ─── Facility Modal ─── */
const FacilityModal = ({ initial, deptKey, onSave, onClose }) => {
  const [form, setForm] = useState({ ...emptyFacility, ...initial });
  const [newHighlight, setNewHighlight] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const addHighlight = () => {
    const val = newHighlight.trim();
    if (val && !form.highlights.includes(val)) {
      update('highlights', [...form.highlights, val]);
      setNewHighlight('');
    }
  };

  const removeHighlight = (h) => update('highlights', form.highlights.filter(x => x !== h));

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      try {
        const compressed = await fileService.compressImage(file, 1000, 0.85);
        const record = await fileService.upload(compressed, deptKey, 'facilities');
        urls.push(record.url);
      } catch {}
    }
    update('images', [...form.images, ...urls]);
    setUploading(false);
  };

  const removeImage = (idx) => update('images', form.images.filter((_, i) => i !== idx));

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
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit Facility' : 'Add Facility'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Facility Name *</label>
              <input className={inputCls} value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Advanced Computing Lab" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
              <select className={inputCls} value={form.type} onChange={e => update('type', e.target.value)}>
                <option value="">Select type</option>
                {FACILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
            <textarea className={`${inputCls} resize-none`} rows={4} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe this facility..." />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Highlights / Key Features</label>
            <div className="flex gap-2 mb-2">
              <input
                className={`${inputCls} flex-1`}
                value={newHighlight}
                onChange={e => setNewHighlight(e.target.value)}
                placeholder="e.g. 50 workstations"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              />
              <button onClick={addHighlight} className="px-3 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600">Add</button>
            </div>
            {form.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.highlights.map((h, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3 text-slate-400" /> {h}
                    <button onClick={() => removeHighlight(h)} className="text-slate-400 hover:text-amber-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Images</label>
            <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 cursor-pointer hover:border-amber-400 hover:text-amber-500 transition-colors">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload images (multiple allowed)'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} disabled={uploading} />
            </label>
            {form.images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-20 h-14 object-cover rounded-xl border border-slate-200" />
                    <button onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={!form.name.trim() || saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {initial?.id ? 'Update' : 'Add Facility'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Delete Confirm ─── */
const DeleteConfirm = ({ item, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Trash2 className="w-5 h-5 text-amber-500" />
      </div>
      <h3 className="font-bold text-slate-800 mb-1">Delete Facility</h3>
      <p className="text-sm text-slate-500 mb-4">Delete <strong>{item.name}</strong>? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">Delete</button>
      </div>
    </motion.div>
  </div>
);

/* ─── Main ─── */
const DeptFacilitiesEditor = ({ deptKey, dept, cms, session }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saved, setSaved] = useState(false);
  const facilities = cms.data?.facilities || [];

  const handleSave = (form) => {
    if (form.id) cms.updateItem('facilities', form.id, form, session?.username, session?.name);
    else cms.addItem('facilities', form, session?.username, session?.name);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Facilities Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">{facilities.length} facilit{facilities.length !== 1 ? 'ies' : 'y'} in {dept.label}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> Saved!
            </div>
          )}
          <button onClick={() => setEditing(emptyFacility)} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> Add Facility
          </button>
        </div>
      </div>

      {facilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Layers className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium">No facilities added yet.</p>
          <p className="text-xs text-slate-400 mt-1">Add labs, classrooms, research centers, and more.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {facilities.map(f => (
              <motion.div key={f.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <FacilityCard facility={f} onEdit={setEditing} onDelete={setDeleting} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {editing && <FacilityModal initial={editing} deptKey={deptKey} onSave={handleSave} onClose={() => setEditing(null)} />}
        {deleting && <DeleteConfirm item={deleting} onConfirm={() => { cms.deleteItem('facilities', deleting.id, session?.username, session?.name, deleting.name); setDeleting(null); }} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default DeptFacilitiesEditor;
