import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Upload, Building2, Users, Briefcase, CheckCircle, Search, Filter, Calendar } from 'lucide-react';
import { placementsService, PLACEMENT_TYPES, createEmptyPlacement } from '../../../services/placementsService';
import { cmsService } from '../../../../services/cmsService';
import { fileService } from '../../../services/fileService';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800";

const RecruiterCard = ({ item, onEdit, onDelete }) => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all group flex flex-col">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center p-2 shrink-0">
        {item.logoUrl ? (
          <img src={item.logoUrl} alt={item.companyName} className="max-w-full max-h-full object-contain" />
        ) : (
          <Building2 className="w-6 h-6 text-slate-300" />
        )}
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-base">{item.companyName}</h4>
      </div>
    </div>
    <div className="space-y-2 mb-4 flex-1">
      <div className="flex items-start gap-2 text-xs text-slate-600">
        <Briefcase className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
        <span className="line-clamp-2">{item.rolesOffered || 'Various Roles'}</span>
      </div>
    </div>
    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
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

const RecruiterModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial?.id ? initial : createEmptyPlacement(PLACEMENT_TYPES.RECRUITERS));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogo = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileService.compressImage(file, 400, 0.9);
      const rec = await fileService.upload(compressed, 'placements', 'recruiters');
      update('logoUrl', rec.url);
    } catch {}
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.companyName.trim()) return;
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
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit Recruiter' : 'Add Recruiter'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto min-h-0 flex-1">
          <div className="flex gap-4 items-center mb-2">
            <div className="w-20 h-20 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center p-2 shrink-0">
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="" className="max-w-full max-h-full object-contain" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-300" />
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                <Upload className="w-3.5 h-3.5" /> {uploading ? 'Uploading...' : 'Upload Logo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogo} disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name *</label>
              <input className={inputCls} value={form.companyName} onChange={e => update('companyName', e.target.value)} placeholder="e.g. Zoho Corporation" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Roles Offered</label>
              <input className={inputCls} value={form.rolesOffered} onChange={e => update('rolesOffered', e.target.value)} placeholder="e.g. Member Technical Staff, QA Engineer" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={!form.companyName.trim() || saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {initial?.id ? 'Save Changes' : 'Add Recruiter'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Activities Editor ──

const ActivitiesEditor = ({ onSaved }) => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await cmsService.getPage('placements');
        const sections = res.data?.sections || [];
        const actSec = sections.find(s => s.sectionKey === 'placements.activities');
        if (actSec && actSec.content) {
          setSectionId(actSec.id);
          setActivitiesData(JSON.parse(actSec.content));
        } else if (res.data?.id) {
          // Create the section if it doesn't exist
          const newSec = await cmsService.createSection({
            pageId: res.data.id,
            sectionKey: 'placements.activities',
            title: 'Placement Activities',
            type: 'json',
            content: '[]'
          });
          setSectionId(newSec.data.id);
          setActivitiesData([]);
        }
      } catch (err) {
        console.error('Failed to fetch activities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const saveActivities = async (newData) => {
    setLoading(true);
    try {
      await cmsService.updateSection(sectionId, { content: JSON.stringify(newData) });
      setActivitiesData(newData);
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addYear = () => {
    const newYear = { year: '2026-2027', label: 'AY 2026–2027', activities: [''] };
    saveActivities([newYear, ...activitiesData]);
  };

  const updateYear = (idx, field, val) => {
    const newData = [...activitiesData];
    newData[idx] = { ...newData[idx], [field]: val };
    saveActivities(newData);
  };

  const removeYear = (idx) => {
    const newData = activitiesData.filter((_, i) => i !== idx);
    saveActivities(newData);
  };

  const addActivity = (yearIdx) => {
    const newData = [...activitiesData];
    newData[yearIdx].activities.push('');
    setActivitiesData(newData); // Don't save immediately to avoid jumping focus
  };

  const updateActivity = (yearIdx, actIdx, val) => {
    const newData = [...activitiesData];
    newData[yearIdx].activities[actIdx] = val;
    setActivitiesData(newData);
  };

  const removeActivity = (yearIdx, actIdx) => {
    const newData = [...activitiesData];
    newData[yearIdx].activities = newData[yearIdx].activities.filter((_, i) => i !== actIdx);
    saveActivities(newData);
  };

  if (loading && activitiesData.length === 0) {
    return <div className="py-20 text-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800">Academic Years & Timeline</h3>
          <p className="text-xs text-slate-500 mt-1">Manage placement activities for each academic year.</p>
        </div>
        <button onClick={addYear} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Academic Year
        </button>
      </div>

      <div className="space-y-6">
        {activitiesData.map((yearData, yIdx) => (
          <div key={yIdx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative">
            <button onClick={() => removeYear(yIdx)} className="absolute top-4 right-4 p-2 text-amber-500 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex gap-4 mb-6 pr-12">
              <div className="flex-1">
                <AdminInput label="Year Key" value={yearData.year} onChange={e => updateYear(yIdx, 'year', e.target.value)} onBlur={() => saveActivities(activitiesData)} placeholder="e.g. 2025-2026" />
              </div>
              <div className="flex-1">
                <AdminInput label="Display Label" value={yearData.label} onChange={e => updateYear(yIdx, 'label', e.target.value)} onBlur={() => saveActivities(activitiesData)} placeholder="e.g. AY 2025–2026" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Placement Activities</label>
              {(yearData.activities || []).map((act, aIdx) => (
                <div key={aIdx} className="flex gap-2 items-start relative">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 mt-2">{aIdx + 1}</div>
                  <AdminTextarea value={act} onChange={e => updateActivity(yIdx, aIdx, e.target.value)} onBlur={() => saveActivities(activitiesData)} rows={2} placeholder="Activity description..." />
                  <button onClick={() => removeActivity(yIdx, aIdx)} className="p-2 mt-1 text-slate-400 hover:text-amber-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => addActivity(yIdx)} className="ml-8 mt-2 flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Activity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Editor ──

export default function RecruitersEditor() {
  const [activeTab, setActiveTab] = useState('recruiters'); // 'recruiters' | 'activities'
  
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const refresh = async () => {
    if (activeTab !== 'recruiters') return;
    setLoading(true);
    let result = await placementsService.getAll(PLACEMENT_TYPES.RECRUITERS);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i => i.companyName?.toLowerCase().includes(q) || i.rolesOffered?.toLowerCase().includes(q));
    }
    setItems(result);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [search, activeTab]);

  const handleSaveRecruiter = async (form) => {
    if (form.id) await placementsService.update(PLACEMENT_TYPES.RECRUITERS, form.id, form);
    else await placementsService.add(PLACEMENT_TYPES.RECRUITERS, form);
    await refresh();
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    await placementsService.delete(PLACEMENT_TYPES.RECRUITERS, confirmDelete.id);
    await refresh();
    setConfirmDelete(null);
  };

  const handleSavedNotify = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Placements & Recruiters</h2>
          <p className="text-sm text-slate-500 mt-1">Manage recruiting companies and placement activities timeline.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" /> Saved!</div>}
          {activeTab === 'recruiters' && (
            <button onClick={() => setEditing({})} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/25">
              <Plus className="w-4 h-4" /> Add Recruiter
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-xl w-max">
        <button onClick={() => setActiveTab('recruiters')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'recruiters' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
          Top Recruiters
        </button>
        <button onClick={() => setActiveTab('activities')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'activities' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
          Activities Timeline
        </button>
      </div>

      {activeTab === 'recruiters' ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className={`${inputCls} pl-10`} placeholder="Search company..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading recruiters...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Briefcase className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">No recruiters found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {items.map(item => (
                  <RecruiterCard key={item.id} item={item} onEdit={setEditing} onDelete={setConfirmDelete} />
                ))}
              </AnimatePresence>
            </div>
          )}

          <AnimatePresence>
            {editing && <RecruiterModal initial={editing} onSave={handleSaveRecruiter} onClose={() => setEditing(null)} />}
          </AnimatePresence>

          <AnimatePresence>
            {confirmDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Recruiter?</h3>
                  <p className="text-sm text-slate-500 mb-6">Are you sure you want to remove {confirmDelete.companyName}? This cannot be undone.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors">Cancel</button>
                    <button onClick={executeDelete} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/25">Delete</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <ActivitiesEditor onSaved={handleSavedNotify} />
      )}
    </div>
  );
}
