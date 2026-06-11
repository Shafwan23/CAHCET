/**
 * DeptOverviewEditor.jsx — Department Overview CMS Editor
 * Edits: title, tagline, established, HOD, description, vision, mission, banner image
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Upload, X, CheckCircle, History } from 'lucide-react';
import { AUDIT_ACTIONS } from '../../../services/auditService';
import { fileService } from '../../../services/fileService';
import VersionHistoryModal from './shared/VersionHistoryModal';
import { useToast } from '../../ui/Toast';

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white";
const textareaCls = `${inputCls} resize-none`;

const DeptOverviewEditor = ({ deptKey, dept, cms, session }) => {
  const { addToast } = useToast?.() || { addToast: () => {} };
  const [form, setForm] = useState(cms.data?.overview || {});
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (cms.data?.overview) setForm(cms.data.overview);
  }, [deptKey]);

  const update = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    cms.setSection('overview', { ...form, [field]: val });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      cms.saveSection('overview', session?.username, session?.name);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const fresh = cms.data?.overview;
    if (fresh) setForm(fresh);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileService.compressImage(file, 1400, 0.85);
      const record = await fileService.upload(compressed, deptKey, 'banner');
      update('bannerImage', record.url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Department Overview</h2>
          <p className="text-sm text-slate-400 mt-0.5">Basic information displayed on the department home page</p>
        </div>
        <button onClick={() => setShowHistory(true)} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <History className="w-3.5 h-3.5" /> Version History
        </button>
      </div>

      {/* Banner image */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Department Banner</h3>
        <div className="flex gap-4 items-start">
          <div className="w-48 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            {form.bannerImage ? (
              <img src={form.bannerImage} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Upload className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Recommended: 1400×500px, JPG or PNG, max 5MB</p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl cursor-pointer hover:bg-amber-600 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {form.bannerImage && (
              <button onClick={() => update('bannerImage', '')} className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-600">
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-slate-700">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Department Title" hint="Displayed as the main heading">
            <input className={inputCls} value={form.title || ''} onChange={e => update('title', e.target.value)} placeholder={dept.fullName} />
          </Field>
          <Field label="Tagline" hint="Short tagline below the title">
            <input className={inputCls} value={form.tagline || ''} onChange={e => update('tagline', e.target.value)} placeholder="Excellence in ..." />
          </Field>
          <Field label="Year Established">
            <input className={inputCls} type="number" value={form.established || ''} onChange={e => update('established', e.target.value)} placeholder="2001" />
          </Field>
          <Field label="Head of Department (HOD)">
            <input className={inputCls} value={form.hod || ''} onChange={e => update('hod', e.target.value)} placeholder="Dr. Name" />
          </Field>
        </div>
        <Field label="Department Description" hint="Main description paragraph shown on the overview page">
          <textarea className={textareaCls} rows={5} value={form.description || ''} onChange={e => update('description', e.target.value)} placeholder="Describe the department..." />
        </Field>
      </div>

      {/* Vision & Mission */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-slate-700">Vision & Mission</h3>
        <Field label="Vision" hint="Long-term aspiration of the department">
          <textarea className={textareaCls} rows={3} value={form.vision || ''} onChange={e => update('vision', e.target.value)} placeholder="To be a globally recognized..." />
        </Field>
        <Field label="Mission" hint="What the department does to achieve its vision">
          <textarea className={textareaCls} rows={4} value={form.mission || ''} onChange={e => update('mission', e.target.value)} placeholder="To provide quality education..." />
        </Field>
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            {cms.lastSaved ? `Last saved: ${new Date(cms.lastSaved).toLocaleTimeString()}` : 'No changes saved yet'}
          </p>
          <div className="flex gap-2">
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all
                ${saved ? 'bg-amber-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 shadow-lg'}`}
            >
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </div>

      {showHistory && (
        <VersionHistoryModal
          deptKey={deptKey}
          section="overview"
          cms={cms}
          session={session}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default DeptOverviewEditor;
