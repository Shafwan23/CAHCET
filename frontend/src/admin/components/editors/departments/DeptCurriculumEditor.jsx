/**
 * DeptCurriculumEditor.jsx — Curriculum CMS Editor
 * Semester-wise syllabus management with PDF uploads, downloadable resources, regulations.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Save, Upload, BookOpenCheck,
  Download, FileText, ExternalLink, CheckCircle,
} from 'lucide-react';
import { fileService } from '../../../services/fileService';

const REGULATIONS = ['2021', '2020', '2019', '2017', 'R2021', 'R2020', 'R2019', 'R2017'];
const SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const emptyCurriculum = { semester: 'I', regulation: '2021', title: '', description: '', downloadUrl: '', resources: [] };
const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800";

/* ─── Curriculum Card ─── */
const CurriculumCard = ({ item, onEdit, onDelete }) => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all group">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold text-amber-600 leading-none">SEM</p>
          <p className="text-base font-black text-amber-700 leading-none">{item.semester}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Reg. {item.regulation}</span>
          </div>
          <p className="font-bold text-slate-800 text-sm">{item.title || `Semester ${item.semester} Curriculum`}</p>
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(item)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onDelete(item)} className="p-1.5 text-amber-500 hover:bg-primary-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
    {item.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.description}</p>}
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {item.downloadUrl && (
        <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
          <Download className="w-3 h-3" /> Download Syllabus
        </a>
      )}
      {item.resources?.length > 0 && (
        <span className="text-xs text-slate-400">{item.resources.length} resource{item.resources.length !== 1 ? 's' : ''}</span>
      )}
    </div>
  </motion.div>
);

/* ─── Curriculum Modal ─── */
const CurriculumModal = ({ initial, deptKey, onSave, onClose }) => {
  const [form, setForm] = useState({ ...emptyCurriculum, ...initial });
  const [newResource, setNewResource] = useState({ title: '', url: '' });
  const [uploading, setUploading] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addResource = () => {
    if (!newResource.title.trim()) return;
    update('resources', [...(form.resources || []), { ...newResource, id: `res_${Date.now()}` }]);
    setNewResource({ title: '', url: '' });
  };

  const removeResource = (id) => update('resources', form.resources.filter(r => r.id !== id));

  const handlePDFUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, deptKey, 'curriculum');
      update('downloadUrl', rec.url);
    } catch {}
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit Curriculum' : 'Add Curriculum'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Semester</label>
              <select className={inputCls} value={form.semester} onChange={e => update('semester', e.target.value)}>
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Regulation</label>
              <select className={inputCls} value={form.regulation} onChange={e => update('regulation', e.target.value)}>
                {REGULATIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title (optional)</label>
            <input className={inputCls} value={form.title} onChange={e => update('title', e.target.value)} placeholder={`Semester ${form.semester} Curriculum`} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Brief about the semester curriculum..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Syllabus PDF</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 cursor-pointer hover:border-amber-400 hover:text-amber-500 transition-colors">
                <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload PDF'}
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePDFUpload} disabled={uploading} />
              </label>
              <p className="text-xs text-slate-400 text-center">— or paste a URL —</p>
              <div className="relative">
                <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input className={`${inputCls} pl-9`} value={form.downloadUrl} onChange={e => update('downloadUrl', e.target.value)} placeholder="https://..." />
              </div>
              {form.downloadUrl && (
                <a href={form.downloadUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700">
                  <FileText className="w-3 h-3" /> Preview file
                </a>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Additional Resources</label>
            <div className="flex gap-2 mb-2">
              <input className={`${inputCls} flex-1`} value={newResource.title} onChange={e => setNewResource(r => ({ ...r, title: e.target.value }))} placeholder="Resource title" />
              <input className={`${inputCls} flex-1`} value={newResource.url} onChange={e => setNewResource(r => ({ ...r, url: e.target.value }))} placeholder="URL" />
              <button onClick={addResource} className="px-3 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600 whitespace-nowrap">Add</button>
            </div>
            {form.resources?.map(r => (
              <div key={r.id} className="flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-700 flex-1">{r.title}</span>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500"><ExternalLink className="w-3 h-3" /></a>
                <button onClick={() => removeResource(r.id)} className="text-amber-400 hover:text-amber-600"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={() => onSave(form)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">
            <Save className="w-4 h-4" /> {initial?.id ? 'Update' : 'Add Curriculum'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main ─── */
const DeptCurriculumEditor = ({ deptKey, dept, cms, session }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saved, setSaved] = useState(false);
  const curriculum = cms.data?.curriculum || [];

  const grouped = SEMESTERS.reduce((acc, s) => {
    acc[s] = curriculum.filter(c => c.semester === s);
    return acc;
  }, {});

  const handleSave = (form) => {
    if (form.id) cms.updateItem('curriculum', form.id, form, session?.username, session?.name);
    else cms.addItem('curriculum', form, session?.username, session?.name);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Curriculum Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">{curriculum.length} syllabus entr{curriculum.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" /> Saved!</div>}
          <button onClick={() => setEditing(emptyCurriculum)} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> Add Curriculum
          </button>
        </div>
      </div>

      {curriculum.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpenCheck className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium">No curriculum added yet.</p>
          <p className="text-xs text-slate-400 mt-1">Add semester-wise syllabus and downloadable resources.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {SEMESTERS.filter(s => grouped[s]?.length > 0).map(s => (
            <div key={s}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Semester {s}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AnimatePresence>
                  {grouped[s].map(item => (
                    <CurriculumCard key={item.id} item={item} onEdit={setEditing} onDelete={setDeleting} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && <CurriculumModal initial={editing} deptKey={deptKey} onSave={handleSave} onClose={() => setEditing(null)} />}
        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
              <Trash2 className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">Delete Curriculum Entry?</h3>
              <p className="text-sm text-slate-500 mb-4">Semester <strong>{deleting.semester}</strong> – Reg. {deleting.regulation}</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleting(null)} className="flex-1 py-2.5 border rounded-xl text-sm hover:bg-slate-50">Cancel</button>
                <button onClick={() => { cms.deleteItem('curriculum', deleting.id, session?.username, session?.name, `Sem ${deleting.semester}`); setDeleting(null); }}
                  className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeptCurriculumEditor;
