import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, ArrowUp, ArrowDown, FileText, Download, X, Search, BookOpenCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../ui/Toast';
import EditorPage from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { fileService } from '../../../services/fileService';
import VersionHistoryModal from './shared/VersionHistoryModal';
import CurriculumSection from '../../../../components/departments/sections/CurriculumSection';

const REGULATIONS = ['2021', '2020', '2019', '2017', 'R2021', 'R2020', 'R2019', 'R2017'];
const SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const emptyCurriculum = {
  id: '',
  semester: 'I',
  regulation: '2021',
  title: '',
  description: '',
  downloadUrl: ''
};

const DeptCurriculumEditor = ({ deptKey, dept, cms, session }) => {
  const { addToast } = useToast?.() || { addToast: () => {} };
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (cms.data?.curriculum) {
      setCurriculum(Array.isArray(cms.data.curriculum) ? cms.data.curriculum : []);
    } else {
      setCurriculum([]);
    }
  }, [deptKey, cms.data]);

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      cms.setSection('curriculum', curriculum);
      await cms.saveSection('curriculum', session?.username, session?.name, isSilent);
      if (!isSilent) addToast({ type: 'success', title: 'Draft Saved', message: `Curriculum changes saved to draft.` });
    } catch(e) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    if (cms.publishSection) {
       await cms.publishSection('curriculum');
       addToast({ type: 'success', title: 'Live', message: 'Curriculum published to production.' });
    }
  };

  const handleReset = () => {
    const fresh = cms.data?.curriculum || [];
    setCurriculum(Array.isArray(fresh) ? fresh : []);
    cms.setSection('curriculum', fresh);
    addToast({ type: 'info', title: 'Reset', message: 'Discarded unsaved changes.' });
  };

  const updateItem = (index, field, value) => {
    const updated = [...curriculum];
    updated[index][field] = value;
    setCurriculum(updated);
    cms.setSection('curriculum', updated);
  };

  const moveItem = (index, direction) => {
    const list = [...curriculum];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    setCurriculum(list);
    cms.setSection('curriculum', list);
  };

  const removeItem = (index) => {
    if (window.confirm("Are you sure you want to delete this curriculum entry?")) {
      const updated = curriculum.filter((_, i) => i !== index);
      setCurriculum(updated);
      cms.setSection('curriculum', updated);
    }
  };

  const addItem = () => {
    const newItem = { ...emptyCurriculum, id: `curr_${Date.now()}` };
    const updated = [newItem, ...curriculum];
    setCurriculum(updated);
    cms.setSection('curriculum', updated);
    setSearch('');
  };

  const handlePDFUpload = async (e, index) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, deptKey, 'curriculum');
      updateItem(index, 'downloadUrl', rec.url);
      addToast({ type: 'success', title: 'Uploaded!', message: 'PDF uploaded successfully.' });
    } catch {
      addToast({ type: 'error', title: 'Failed', message: 'Upload failed.' });
    }
    setUploading(false);
  };

  const validationIssues = [];
  curriculum.forEach((curr, idx) => {
     if (!curr.downloadUrl?.trim()) validationIssues.push(`Semester ${curr.semester || idx+1} is missing a PDF URL.`);
  });

  const filtered = search
    ? curriculum.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.semester?.toLowerCase().includes(search.toLowerCase()))
    : curriculum;

  const previewData = curriculum.map(c => ({
    id: c.id,
    title: c.title || `Semester ${c.semester} Syllabus`,
    fileSize: `Regulation ${c.regulation}`,
    fileUrl: c.downloadUrl
  }));

  return (
    <EditorPage
      title="Curriculum Editor"
      description="Manage semester-wise syllabus, academic regulations, and downloadable resources."
      breadcrumb={['Admin', 'Departments', dept.abbr, 'Curriculum']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={cms.status?.curriculum || 'DRAFT'}
      lastModified={cms.lastModified?.curriculum}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Configuration Panel */}
        <div className="xl:col-span-7 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syllabus Entries</p>
                   <BookOpenCheck className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {curriculum.length}
                   </p>
                </div>
             </div>
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PDFs Uploaded</p>
                   <FileText className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {curriculum.filter(c => c.downloadUrl).length}
                   </p>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="relative max-w-sm flex-1">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input
                 className="w-full pl-10 pr-4 py-3 border border-slate-200/70 rounded-xl text-sm bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-300"
                 placeholder="Search curriculum..."
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
               {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-slate-400" /></button>}
             </div>
             <button
               onClick={addItem}
               className="flex items-center justify-center gap-1.5 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all shrink-0"
             >
               <Plus className="w-4 h-4" /> Add Entry
             </button>
          </div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
            <AnimatePresence>
              {filtered.map((item) => {
                const actualIndex = curriculum.findIndex(c => c.id === item.id);
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
                         <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center shadow-sm shrink-0">
                           <p className="text-[8px] font-bold text-amber-600 leading-none mb-0.5">SEM</p>
                           <p className="text-sm font-black text-amber-700 leading-none">{item.semester}</p>
                         </div>
                         <div>
                            <span className="text-base font-extrabold text-slate-900 block leading-tight tracking-tight">
                              {item.title || `Semester ${item.semester} Curriculum`}
                            </span>
                            <span className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase">REG {item.regulation}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {!search && (
                           <>
                              <button onClick={() => moveItem(actualIndex, -1)} disabled={actualIndex === 0} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 transition-all duration-300">
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveItem(actualIndex, 1)}
                                disabled={actualIndex === curriculum.length - 1}
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
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Semester</label>
                          <select 
                             className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white"
                             value={item.semester} 
                             onChange={e => updateItem(actualIndex, 'semester', e.target.value)}
                          >
                            {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Regulation</label>
                          <select 
                             className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white"
                             value={item.regulation} 
                             onChange={e => updateItem(actualIndex, 'regulation', e.target.value)}
                          >
                            {REGULATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                           <AdminInput
                             label="Title (Optional)"
                             value={item.title || ''}
                             onChange={e => updateItem(actualIndex, 'title', e.target.value)}
                             placeholder={`Semester ${item.semester} Curriculum`}
                           />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-50">
                         <label className="block text-xs font-semibold text-slate-600 mb-1.5">Syllabus PDF File</label>
                         <div className="flex flex-col sm:flex-row gap-3">
                           <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-100 border border-slate-200 transition-colors shrink-0">
                              <Upload className="w-4 h-4" />
                              {uploading ? 'Uploading...' : 'Upload PDF'}
                              <input type="file" accept="application/pdf" className="hidden" onChange={e => handlePDFUpload(e, actualIndex)} disabled={uploading} />
                           </label>
                           <div className="flex-1">
                              <AdminInput
                                value={item.downloadUrl || ''}
                                onChange={e => updateItem(actualIndex, 'downloadUrl', e.target.value)}
                                placeholder="https://... OR upload a file"
                              />
                           </div>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {curriculum.length === 0 && !search && (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                   <BookOpenCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                   <h3 className="text-sm font-bold text-slate-700">No Curriculum Entries</h3>
                   <p className="text-xs text-slate-500 mt-1 mb-4">Start adding semester-wise syllabus PDFs.</p>
                   <button onClick={addItem} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">Add Entry</button>
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
                  cahcet.edu.in/departments/{deptKey}/curriculum
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-primary-50/50 p-6 relative">
                 <div className="scale-[0.8] origin-top">
                    <CurriculumSection data={previewData} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHistory && (
        <VersionHistoryModal
          deptKey={deptKey}
          section="curriculum"
          cms={cms}
          session={session}
          onClose={() => setShowHistory(false)}
        />
      )}
    </EditorPage>
  );
};

export default DeptCurriculumEditor;
