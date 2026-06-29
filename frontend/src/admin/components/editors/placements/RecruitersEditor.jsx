import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Building2, Briefcase, Search, Upload, CheckCircle, ArrowLeft, TrendingUp, BarChart3, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { fileService } from '../../../services/fileService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { PLACEMENT_TYPES, createEmptyPlacement } from '../../../services/placementsService';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const RecruiterCard = ({ item, onEdit, onDelete }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="group relative bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col p-5 rounded-[24px] h-full"
  >
    <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-20 pointer-events-none bg-blue-500" />
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 bg-white shadow-sm overflow-hidden p-2">
        {item.logoUrl ? <img src={item.logoUrl} alt={item.companyName} className="w-full h-full object-contain" /> : <Building2 className="w-8 h-8 text-slate-300" />}
      </div>
    </div>
    <div className="flex-1 flex flex-col relative z-10">
      <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-amber-600 transition-colors">{item.companyName || 'Untitled Company'}</h4>
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 leading-relaxed">
        <Briefcase className="w-4 h-4 shrink-0 text-slate-400" />
        <span className="line-clamp-2">{item.rolesOffered || 'Various Roles'}</span>
      </div>
      <div className="mt-auto pt-4 flex items-center gap-2 border-t border-slate-100/60 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <button onClick={() => onEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
        <button onClick={() => onDelete(item)} className="w-10 flex items-center justify-center py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </motion.div>
);

const RecruitersEditor = () => {
  const toast = useToast();
  const { admin } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  
  const [activeTab, setActiveTab] = useState('recruiters'); // 'recruiters' | 'activities'
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('placements');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['placements.recruiters']) {
        const dataStr = map['placements.recruiters'].draftContent || map['placements.recruiters'].content || '[]';
        setItems(JSON.parse(dataStr));
      }
      if (map['placements.activities']) {
        const dataStr = map['placements.activities'].draftContent || map['placements.activities'].content || '[]';
        setActivities(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Placements data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false, newItems = null, newActivities = null) => {
    setLoading(true);
    const dataToSaveItems = newItems || items;
    const dataToSaveActs = newActivities || activities;
    try {
      if (activeTab === 'recruiters') {
        const content = JSON.stringify(dataToSaveItems);
        if (sectionsMap['placements.recruiters']) {
          await cmsService.updateSection(sectionsMap['placements.recruiters'].id, { draftContent: content, _isSilentDraft: isSilent });
        } else {
          const newSec = await cmsService.createSection({ pageId, sectionKey: 'placements.recruiters', title: 'Recruiters', draftContent: content, _isSilentDraft: isSilent });
          setSectionsMap(prev => ({ ...prev, 'placements.recruiters': newSec.data }));
        }
      } else {
        const content = JSON.stringify(dataToSaveActs);
        if (sectionsMap['placements.activities']) {
          await cmsService.updateSection(sectionsMap['placements.activities'].id, { draftContent: content, _isSilentDraft: isSilent });
        } else {
          const newSec = await cmsService.createSection({ pageId, sectionKey: 'placements.activities', title: 'Placement Activities', draftContent: content, _isSilentDraft: isSilent });
          setSectionsMap(prev => ({ ...prev, 'placements.activities': newSec.data }));
        }
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `${activeTab === 'recruiters' ? 'Recruiters' : 'Activities'} saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSaveDraft(true);
    const res = await cmsService.getPage('placements');
    const updatedSec = res.data.sections.find(s => s.sectionKey === (activeTab === 'recruiters' ? 'placements.recruiters' : 'placements.activities'));
    setPreviewSection(updatedSec);
  };

  const handleReset = () => {
    fetchPage();
    toast({ type: 'info', title: 'Reset', message: 'Reverted to last saved draft.' });
  };

  // --- Recruiters Functions ---
  const saveRecruiter = (updatedItem) => {
    let newItems;
    if (!updatedItem.id) {
      updatedItem.id = `recruiters_${Date.now()}`;
      newItems = [updatedItem, ...items];
    } else {
      newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
    }
    setItems(newItems);
    setEditingItem(null);
    handleSaveDraft(true, newItems, null);
    toast({ type: 'success', title: 'Applied', message: 'Recruiter applied to draft.' });
  };

  const deleteRecruiter = (itemToDelete) => {
    if (!window.confirm(`Delete recruiter "${itemToDelete.companyName}"?`)) return;
    const newItems = items.filter(i => i.id !== itemToDelete.id);
    setItems(newItems);
    handleSaveDraft(true, newItems, null);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileService.compressImage(file, 400, 0.9);
      const rec = await fileService.upload(compressed, 'placements', 'recruiters');
      setEditingItem(p => ({ ...p, logoUrl: rec.url }));
    } catch {
      toast({ type: 'error', title: 'Upload Failed', message: 'Could not upload logo.' });
    }
    setUploading(false);
  };

  // --- Activities Functions ---
  const saveActivitiesList = (newData) => {
    setActivities(newData);
    handleSaveDraft(true, null, newData);
  };
  const addYear = () => saveActivitiesList([{ year: '2026-2027', label: 'AY 2026–2027', activities: [''] }, ...activities]);
  const removeYear = (idx) => saveActivitiesList(activities.filter((_, i) => i !== idx));
  const updateYear = (idx, field, val) => {
    const newData = [...activities];
    newData[idx] = { ...newData[idx], [field]: val };
    saveActivitiesList(newData);
  };
  const addActivity = (yearIdx) => {
    const newData = [...activities];
    newData[yearIdx].activities.push('');
    setActivities(newData); // Save on blur
  };
  const updateActivity = (yearIdx, actIdx, val) => {
    const newData = [...activities];
    newData[yearIdx].activities[actIdx] = val;
    setActivities(newData);
  };
  const removeActivity = (yearIdx, actIdx) => {
    const newData = [...activities];
    newData[yearIdx].activities = newData[yearIdx].activities.filter((_, i) => i !== actIdx);
    saveActivitiesList(newData);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(
    sectionsMap, 
    activeTab === 'recruiters' ? 'placements.recruiters' : 'placements.activities', 
    activeTab === 'recruiters' ? items : activities
  );

  const filteredItems = useMemo(() => items.filter(i => (i.companyName || '').toLowerCase().includes(search.toLowerCase()) || (i.rolesOffered || '').toLowerCase().includes(search.toLowerCase())), [items, search]);

  const metrics = useMemo(() => ({
    total: items.length,
    active: items.length,
    hiringDrives: activities.reduce((acc, y) => acc + (y.activities?.length || 0), 0),
  }), [items, activities]);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Recruiters & Activities"
      description="Manage top recruiting companies and academic year placement activities."
      breadcrumb={['Admin', 'Placements CRM', 'Recruiters']}
      onSave={() => handleSaveDraft(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
    >
      <AnimatePresence mode="wait">
        {!editingItem ? (
          <motion.div key="list" {...fadeUp} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Recruiters', value: metrics.total, color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Building2 },
                { label: 'Active Companies', value: metrics.active, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: Briefcase },
                { label: 'Hiring Drives', value: metrics.hiringDrives, color: 'bg-amber-50 text-amber-700 border-amber-100', icon: TrendingUp },
                { label: 'Avg. Package', value: '4.5LPA', color: 'bg-purple-50 text-purple-700 border-purple-100', icon: BarChart3 }
              ].map((stat, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${stat.color} flex flex-col justify-center relative overflow-hidden group`}>
                  <stat.icon className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1 z-10">{stat.label}</span>
                  <span className="text-3xl font-extrabold tracking-tight z-10">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm sticky top-[132px] z-20">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button onClick={() => setActiveTab('recruiters')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'recruiters' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>Recruiters</button>
                <button onClick={() => setActiveTab('activities')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'activities' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>Activities Timeline</button>
              </div>
              
              {activeTab === 'recruiters' && (
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 bg-white" placeholder="Search recruiters..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <button onClick={() => setEditingItem(createEmptyPlacement(PLACEMENT_TYPES.RECRUITERS))} className="flex items-center justify-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgb(245,158,11,0.39)] hover:-translate-y-0.5 transition-all">
                    <Plus className="w-4 h-4" /> Add Recruiter
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'recruiters' ? (
              filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white/50 border border-slate-200 border-dashed rounded-3xl">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"><Building2 className="w-8 h-8 text-slate-300" /></div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No recruiters found</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {filteredItems.map(item => <RecruiterCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteRecruiter} />)}
                  </AnimatePresence>
                </div>
              )
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="font-bold text-slate-800">Academic Years & Timeline</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage placement activities for each academic year.</p>
                  </div>
                  <button onClick={addYear} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors text-sm">
                    <Plus className="w-4 h-4" /> Add Academic Year
                  </button>
                </div>
                {activities.map((yearData, yIdx) => (
                  <div key={yIdx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative group overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-10 pointer-events-none bg-amber-500" />
                    <button onClick={() => removeYear(yIdx)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    <div className="flex gap-6 mb-6 pr-12 relative z-10">
                      <div className="flex-1"><AdminInput label="Year Key" value={yearData.year} onChange={e => updateYear(yIdx, 'year', e.target.value)} placeholder="e.g. 2025-2026" /></div>
                      <div className="flex-1"><AdminInput label="Display Label" value={yearData.label} onChange={e => updateYear(yIdx, 'label', e.target.value)} placeholder="e.g. AY 2025–2026" /></div>
                    </div>
                    <div className="space-y-4 relative z-10">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Placement Activities</label>
                      {(yearData.activities || []).map((act, aIdx) => (
                        <div key={aIdx} className="flex gap-3 items-start group/act">
                          <div className="w-8 h-8 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 mt-1 border border-slate-200 shadow-sm">{aIdx + 1}</div>
                          <div className="flex-1"><AdminTextarea value={act} onChange={e => updateActivity(yIdx, aIdx, e.target.value)} onBlur={() => saveActivitiesList(activities)} rows={2} placeholder="Activity description..." /></div>
                          <button onClick={() => removeActivity(yIdx, aIdx)} className="p-2 mt-2 text-slate-300 hover:text-red-500 rounded-xl opacity-0 group-hover/act:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => addActivity(yIdx)} className="ml-11 flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors text-xs shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Add Activity
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="editor" {...fadeUp} className="space-y-6">
            <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl sticky top-[132px] z-10 shadow-sm">
              <button onClick={() => setEditingItem(null)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => saveRecruiter(editingItem)} className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all">
                <CheckCircle className="w-4 h-4" /> Apply Changes
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-8 space-y-6">
                <EditorCard title="Company Details" description="Core information for this recruiter.">
                  <div className="space-y-6">
                    <AdminInput label="Company Name *" value={editingItem.companyName} onChange={e => setEditingItem(p => ({ ...p, companyName: e.target.value }))} placeholder="e.g. Zoho Corporation" />
                    <AdminInput label="Roles Offered" value={editingItem.rolesOffered} onChange={e => setEditingItem(p => ({ ...p, rolesOffered: e.target.value }))} placeholder="e.g. Member Technical Staff, QA Engineer" />
                  </div>
                </EditorCard>
                <EditorCard title="Company Logo" description="Upload a high-quality logo for the placement grid.">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                      {editingItem.logoUrl ? (
                        <>
                          <img src={editingItem.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <label className="cursor-pointer text-white text-xs font-bold px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30"><Upload className="w-4 h-4" /><input type="file" className="hidden" onChange={handleLogoUpload} disabled={uploading} /></label>
                          </div>
                        </>
                      ) : <Building2 className="w-10 h-10 text-slate-300" />}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <AdminInput label="Logo URL" value={editingItem.logoUrl || ''} onChange={e => setEditingItem(p => ({ ...p, logoUrl: e.target.value }))} placeholder="https://..." hint="Direct link or upload a file." />
                      <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl cursor-pointer transition-colors w-fit">
                        {uploading ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Uploading...' : 'Upload Logo'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                </EditorCard>
              </div>

              <div className="xl:col-span-4">
                <div className="sticky top-40">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600"><Monitor className="w-3.5 h-3.5" /></div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Live Preview</h3>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-300" /><div className="w-2.5 h-2.5 rounded-full bg-slate-300" /><div className="w-2.5 h-2.5 rounded-full bg-slate-300" /></div></div>
                    <div className="p-6">
                      <div className="w-16 h-16 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center p-2 mb-4">
                        {editingItem.logoUrl ? <img src={editingItem.logoUrl} className="max-w-full max-h-full object-contain" /> : <Building2 className="w-6 h-6 text-slate-300" />}
                      </div>
                      <h4 className="font-bold text-slate-800 text-base mb-2">{editingItem.companyName || 'Company Name'}</h4>
                      <div className="flex items-start gap-2 text-xs text-slate-600"><Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>{editingItem.rolesOffered || 'Various Roles'}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {previewSection && (
        <SectionPreviewModal 
          section={previewSection} onClose={() => setPreviewSection(null)}
          onPublish={async (sec) => { await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage(); toast({ type: 'success', title: 'Live', message: 'Changes pushed to production.' }); }}
          onRestore={() => fetchPage()}
        />
      )}
    </EditorPage>
  );
};
export default RecruitersEditor;
