import React, { useState, useEffect, useMemo } from 'react';
import { Monitor, Upload, Plus, Trash2, Trophy, ArrowUp, ArrowDown, Search, X, Award, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { fileService } from '../../../services/fileService';
import VersionHistoryModal from './shared/VersionHistoryModal';
import AchievementsSection from '../../../../components/departments/sections/AchievementsSection';

const CATEGORIES = [
  'International Journal',
  'International Conference',
  'National Conference',
  'Faculty Training Program',
  'Co-Curricular Achievements',
  'Extra-Curricular Achievements',
  'Internship',
  'MOOC Courses'
];

const emptyItem = {
  id: '',
  title: '',
  category: 'International Journal',
  author: '',
  journal: '',
  conference: '',
  location: '',
  organizer: '',
  company: '',
  topic: '',
  date: '',
  year: new Date().getFullYear().toString(),
  description: '',
  image: ''
};

const DeptAchievementsEditor = ({ deptKey, dept, cms, session }) => {
  const { addToast } = useToast?.() || { addToast: () => {} };
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (cms.data?.achievements) {
      setAchievements(Array.isArray(cms.data.achievements) ? cms.data.achievements : []);
    } else {
      setAchievements([]);
    }
  }, [deptKey, cms.data]);

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      cms.setSection('achievements', achievements);
      await cms.saveSection('achievements', session?.username, session?.name, isSilent);
      if (!isSilent) addToast({ type: 'success', title: 'Draft Saved', message: `Achievements changes saved to draft.` });
    } catch(e) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    if (cms.publishSection) {
       await cms.publishSection('achievements');
       addToast({ type: 'success', title: 'Live', message: 'Achievements published to production.' });
    }
  };

  const handleReset = () => {
    const fresh = cms.data?.achievements || [];
    setAchievements(Array.isArray(fresh) ? fresh : []);
    cms.setSection('achievements', fresh);
    addToast({ type: 'info', title: 'Reset', message: 'Discarded unsaved changes.' });
  };

  const updateItem = (index, field, value) => {
    const updated = [...achievements];
    updated[index][field] = value;
    setAchievements(updated);
    cms.setSection('achievements', updated);
  };

  const moveItem = (index, direction) => {
    const list = [...achievements];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    setAchievements(list);
    cms.setSection('achievements', list);
  };

  const removeItem = (index) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      const updated = achievements.filter((_, i) => i !== index);
      setAchievements(updated);
      cms.setSection('achievements', updated);
    }
  };

  const addItem = () => {
    const newItem = { ...emptyItem, id: `ach_${Date.now()}` };
    const updated = [newItem, ...achievements]; // add to top
    setAchievements(updated);
    cms.setSection('achievements', updated);
    setSearch('');
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileService.compressImage(file, 600, 0.85);
      const rec = await fileService.upload(compressed, deptKey, 'achievements');
      updateItem(index, 'image', rec.url);
      addToast({ type: 'success', title: 'Uploaded!', message: 'Image uploaded successfully.' });
    } catch {
      addToast({ type: 'error', title: 'Failed', message: 'Upload failed.' });
    }
    setUploading(false);
  };

  const validationIssues = [];
  achievements.forEach((ach, idx) => {
     if (!ach.title?.trim()) validationIssues.push(`Achievement ${idx + 1} is missing a title.`);
  });

  const filtered = achievements.filter(a => {
    const matchesSearch = search === '' || a.title?.toLowerCase().includes(search.toLowerCase()) || a.author?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <EditorPage
      title="Achievements Editor"
      description="Manage the student and faculty achievements, publications, and awards."
      breadcrumb={['Admin', 'Departments', dept.abbr, 'Achievements']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={cms.status?.achievements || 'DRAFT'}
      lastModified={cms.lastModified?.achievements}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Configuration Panel */}
        <div className="xl:col-span-7 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Achievements</p>
                   <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {achievements.length}
                   </p>
                </div>
             </div>
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publications / Papers</p>
                   <Award className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {achievements.filter(a => ['International Journal', 'International Conference', 'National Conference'].includes(a.category)).length}
                   </p>
                </div>
             </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
               <div className="relative max-w-sm flex-1">
                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input
                   className="w-full pl-10 pr-4 py-3 border border-slate-200/70 rounded-xl text-sm bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-300"
                   placeholder="Search achievements..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
                 {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-slate-400" /></button>}
               </div>
               <button
                 onClick={addItem}
                 className="flex items-center justify-center gap-1.5 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all shrink-0"
               >
                 <Plus className="w-4 h-4" /> Add Record
               </button>
             </div>
             
             <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {['All', ...CATEGORIES].map(cat => (
                  <button key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border
                      ${activeCategory === cat ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
            <AnimatePresence>
              {filtered.map((item) => {
                const actualIndex = achievements.findIndex(a => a.id === item.id);
                return (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -40 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    key={item.id} 
                    className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:border-indigo-500/30 transition-all duration-300 group overflow-visible relative"
                  >
                    {/* Premium Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500 pointer-events-none -z-10" />
                  >
                    <div className="p-5 bg-white/60 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between rounded-t-3xl relative z-10">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 flex items-center justify-center text-indigo-500 overflow-hidden shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                           {item.image ? (
                             <img src={item.image} alt="pic" className="w-full h-full object-cover" />
                           ) : (
                             <Trophy className="w-5 h-5 opacity-40 text-amber-500" />
                           )}
                         </div>
                         <div>
                            <span className="text-base font-extrabold text-slate-900 block leading-tight tracking-tight">
                              {item.title || 'New Achievement'}
                            </span>
                            <span className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase">{item.category}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {!search && activeCategory === 'All' && (
                           <>
                              <button onClick={() => moveItem(actualIndex, -1)} disabled={actualIndex === 0} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 transition-all duration-300">
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveItem(actualIndex, 1)}
                                disabled={actualIndex === achievements.length - 1}
                                className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 transition-all duration-300"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <div className="w-px h-4 bg-slate-300 mx-1"></div>
                           </>
                        )}
                        <button onClick={() => removeItem(actualIndex)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl hover:shadow-sm transition-all duration-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdminInput
                          label="Title / Topic"
                          value={item.title || ''}
                          onChange={e => updateItem(actualIndex, 'title', e.target.value)}
                          placeholder="Title of achievement or paper"
                        />
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                          <select 
                             className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white"
                             value={item.category} 
                             onChange={e => updateItem(actualIndex, 'category', e.target.value)}
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <AdminInput
                          label="Author / Organizer / Student Name"
                          value={item.author || ''}
                          onChange={e => updateItem(actualIndex, 'author', e.target.value)}
                          placeholder="Dr. John Doe"
                        />
                        <div className="grid grid-cols-2 gap-2">
                           <AdminInput
                             label="Academic Year"
                             value={item.year || ''}
                             onChange={e => updateItem(actualIndex, 'year', e.target.value)}
                             placeholder="2023-2024"
                           />
                           <AdminInput
                             label="Date (Optional)"
                             type="date"
                             value={item.date || ''}
                             onChange={e => updateItem(actualIndex, 'date', e.target.value)}
                           />
                        </div>
                        
                        {/* Dynamic fields based on category */}
                        {['International Journal'].includes(item.category) && (
                           <AdminInput label="Journal Name" value={item.journal || ''} onChange={e => updateItem(actualIndex, 'journal', e.target.value)} />
                        )}
                        {['International Conference', 'National Conference'].includes(item.category) && (
                           <AdminInput label="Conference Name" value={item.conference || ''} onChange={e => updateItem(actualIndex, 'conference', e.target.value)} />
                        )}
                        {['International Conference', 'National Conference', 'Faculty Training Program', 'Extra-Curricular Achievements'].includes(item.category) && (
                           <AdminInput label="Location" value={item.location || ''} onChange={e => updateItem(actualIndex, 'location', e.target.value)} />
                        )}
                        {['Internship', 'MOOC Courses'].includes(item.category) && (
                           <AdminInput label="Company Name / Platform" value={item.company || ''} onChange={e => updateItem(actualIndex, 'company', e.target.value)} />
                        )}
                      </div>

                      <AdminTextarea
                        label="Description (Optional)"
                        value={item.description || ''}
                        onChange={e => updateItem(actualIndex, 'description', e.target.value)}
                        placeholder="Brief summary..."
                        rows={2}
                      />

                      <div className="pt-2 border-t border-slate-50">
                         <label className="block text-xs font-semibold text-slate-600 mb-1.5">Certificate / Photo</label>
                         <label className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-100 border border-slate-200 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                            <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, actualIndex)} disabled={uploading} />
                         </label>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                   <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                   <h3 className="text-sm font-bold text-slate-700">No Records Found</h3>
                   <p className="text-xs text-slate-500 mt-1 mb-4">Start adding records to build the achievements timeline.</p>
                   {!search && activeCategory === 'All' && (
                     <button onClick={addItem} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">Add Record</button>
                   )}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side: Live Preview Panel */}
        <div className="xl:col-span-5">
          <div className="sticky top-24 max-h-[calc(100vh-140px)] flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4" /> Live Preview
            </h3>
            
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex-1 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono flex-1 max-w-[200px] text-center truncate shadow-sm">
                  cahcet.edu.in/departments/{deptKey}/achievements
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-primary-50/50 p-6 relative">
                 <div className="scale-[0.8] origin-top">
                    <AchievementsSection data={achievements} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHistory && (
        <VersionHistoryModal
          deptKey={deptKey}
          section="achievements"
          cms={cms}
          session={session}
          onClose={() => setShowHistory(false)}
        />
      )}
    </EditorPage>
  );
};

export default DeptAchievementsEditor;
