/**
 * DeptContactEditor.jsx — Department Contact CMS Editor
 * HOD info, email, phone, location, timings, and Google Map embed.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save, RotateCcw, MapPin, Mail, Phone, Clock, User,
  Map, CheckCircle, Eye, EyeOff,
} from 'lucide-react';

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800";
const textareaCls = `${inputCls} resize-none`;

const Field = ({ label, hint, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
      {label}
    </label>
    {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const DeptContactEditor = ({ deptKey, dept, cms, session }) => {
  const [form, setForm] = useState(cms.data?.contact || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(false);

  useEffect(() => {
    if (cms.data?.contact) setForm(cms.data.contact);
  }, [deptKey]);

  const update = (k, v) => {
    const next = { ...form, [k]: v };
    setForm(next);
    cms.setSection('contact', next);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    cms.saveSection('contact', session?.username, session?.name);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const fresh = cms.data?.contact || {};
    setForm(fresh);
  };

  // Extract src from iframe embed code if pasted
  const mapSrcFromEmbed = (embed) => {
    if (!embed) return null;
    if (embed.startsWith('http')) return embed;
    const match = embed.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };

  const mapSrc = mapSrcFromEmbed(form.mapEmbed);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Contact Information</h2>
        <p className="text-sm text-slate-400 mt-0.5">Department contact details shown on the Contact Us page</p>
      </div>

      {/* HOD & Basic Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">Head of Department</h3>
        <Field label="HOD Name" icon={User}>
          <input className={inputCls} value={form.hodName || ''} onChange={e => update('hodName', e.target.value)} placeholder="Dr. / Prof. Full Name" />
        </Field>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Department Email" icon={Mail}>
            <input className={inputCls} type="email" value={form.email || ''} onChange={e => update('email', e.target.value)} placeholder={`${deptKey}@cahcet.edu.in`} />
          </Field>
          <Field label="Phone Number" icon={Phone}>
            <input className={inputCls} value={form.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
          </Field>
        </div>
        <Field label="Office Location" icon={MapPin} hint="Room number, block, floor, etc.">
          <input className={inputCls} value={form.location || ''} onChange={e => update('location', e.target.value)} placeholder="Room 101, Block A, Ground Floor" />
        </Field>
        <Field label="Office Timings" icon={Clock}>
          <input className={inputCls} value={form.timings || ''} onChange={e => update('timings', e.target.value)} placeholder="Mon–Fri: 9:00 AM – 5:00 PM" />
        </Field>
      </div>

      {/* Google Map */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-semibold text-slate-700">Google Map Embed</h3>
          {mapSrc && (
            <button onClick={() => setShowMapPreview(p => !p)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
              {showMapPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showMapPreview ? 'Hide' : 'Preview'} Map
            </button>
          )}
        </div>
        <Field label="Embed Code or URL" hint='Paste the full <iframe> embed code from Google Maps or just the URL'>
          <textarea
            className={textareaCls}
            rows={3}
            value={form.mapEmbed || ''}
            onChange={e => update('mapEmbed', e.target.value)}
            placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
          />
        </Field>
        {showMapPreview && mapSrc && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 260 }} className="rounded-xl overflow-hidden border border-slate-200">
            <iframe
              src={mapSrc}
              width="100%"
              height="260"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map Preview"
            />
          </motion.div>
        )}
      </div>

      {/* Live Preview Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Preview</p>
        <h4 className="text-lg font-bold mb-1">{dept.fullName}</h4>
        <p className="text-sm text-amber-400 mb-4">{dept.label} Department</p>
        <div className="space-y-2.5">
          {form.hodName && <div className="flex items-center gap-2.5 text-sm text-slate-300"><User className="w-4 h-4 text-slate-500" /> HOD: {form.hodName}</div>}
          {form.email && <div className="flex items-center gap-2.5 text-sm text-slate-300"><Mail className="w-4 h-4 text-slate-500" /> {form.email}</div>}
          {form.phone && <div className="flex items-center gap-2.5 text-sm text-slate-300"><Phone className="w-4 h-4 text-slate-500" /> {form.phone}</div>}
          {form.location && <div className="flex items-center gap-2.5 text-sm text-slate-300"><MapPin className="w-4 h-4 text-slate-500" /> {form.location}</div>}
          {form.timings && <div className="flex items-center gap-2.5 text-sm text-slate-300"><Clock className="w-4 h-4 text-slate-500" /> {form.timings}</div>}
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            {cms.lastSaved ? `Last saved: ${new Date(cms.lastSaved).toLocaleTimeString()}` : 'No changes saved yet'}
          </p>
          <div className="flex gap-2">
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all
                ${saved ? 'bg-amber-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 shadow-lg'}`}>
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeptContactEditor;
