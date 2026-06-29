import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Compass, Target, Clock, User, FileText, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import VersionHistoryModal from './shared/VersionHistoryModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import DepartmentHero from '../../../../components/departments/DepartmentHero';
import AboutSection from '../../../../components/departments/sections/AboutSection';

const DeptOverviewEditor = ({ deptKey, dept, cms, session }) => {
  const { addToast } = useToast?.() || { addToast: () => {} };
  
  // Base default state
  const defaultForm = {
    title: dept.fullName || '',
    tagline: 'Excellence in Engineering',
    established: '2001',
    hod: 'Dr. Head of Department',
    description: 'Describe the department...',
    vision: 'To be a globally recognized...',
    mission: '1. First mission point\n2. Second mission point',
    bannerImage: ''
  };

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (cms.data?.overview) {
      setForm({ ...defaultForm, ...cms.data.overview });
    }
  }, [deptKey, cms.data]);

  const update = (field, val) => {
    const newForm = { ...form, [field]: val };
    setForm(newForm);
    cms.setSection('overview', newForm); // updates the draft in CMS parent context
  };

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      await cms.saveSection('overview', session?.username, session?.name, isSilent);
      if (!isSilent) addToast({ type: 'success', title: 'Draft Saved', message: `Overview changes saved to draft.` });
    } catch(e) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    // Ideally we trigger a publish in CMS context here or show SectionPreviewModal
    // For department CMS, cms.publishSection handles this if implemented in parent
    if (cms.publishSection) {
       await cms.publishSection('overview');
       addToast({ type: 'success', title: 'Live', message: 'Overview published to production.' });
    }
  };

  const handleReset = () => {
    const fresh = cms.data?.overview || defaultForm;
    setForm(fresh);
    cms.setSection('overview', fresh);
    addToast({ type: 'info', title: 'Reset', message: 'Discarded unsaved changes.' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileService.compressImage(file, 1400, 0.85);
      const record = await fileService.upload(compressed, deptKey, 'banner');
      update('bannerImage', record.url);
      addToast({ type: 'success', title: 'Uploaded!', message: 'Image uploaded successfully.' });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Failed', message: 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const validationIssues = [];
  if (!form.title?.trim()) validationIssues.push('Title is required');
  if (!form.description?.trim()) validationIssues.push('Description is required');

  // Preview Data Mapping
  const previewHeroData = {
     title: form.title || dept.fullName,
     tagline: form.tagline || 'Excellence in Engineering',
     backgroundImage: form.bannerImage || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0'
  };

  const previewAboutData = {
     about: form.description || 'Department description...',
     vision: form.vision || 'Department vision...',
     mission: (form.mission || '').split('\n').filter(Boolean),
     peos: ['PEO 1: Example PEO'],
     pos: ['PO 1: Example PO']
  };

  return (
    <EditorPage
      title="Department Overview Editor"
      description="Basic information, vision, mission and banner displayed on the department home page."
      breadcrumb={['Admin', 'Departments', dept.abbr, 'Overview']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={cms.status?.overview || 'DRAFT'}
      lastModified={cms.lastModified?.overview}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Configuration Panel */}
        <div className="xl:col-span-7 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completeness</p>
                   <FileText className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {Math.round((Object.values(form).filter(Boolean).length / Object.keys(form).length) * 100)}%
                   </p>
                </div>
             </div>
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Version History</p>
                   <button onClick={() => setShowHistory(true)} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold hover:bg-blue-100 transition-colors">
                     VIEW
                   </button>
                </div>
                <div>
                   <p className="text-sm font-semibold text-slate-800">Available</p>
                </div>
             </div>
          </div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
            <EditorCard title="Hero & Banner" description="Manage the department landing section.">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department Banner Image</label>
                  <div className="relative group overflow-hidden rounded-xl bg-slate-50 border border-slate-200 aspect-[21/9] flex items-center justify-center mb-3">
                     {form.bannerImage ? (
                       <img src={form.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                     ) : (
                       <div className="flex flex-col items-center justify-center text-slate-400">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-xs font-medium">1400×500px Recommended</span>
                       </div>
                     )}
                     
                     <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                        <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                           <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload New Image'}
                           <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                     </div>
                  </div>
                  {form.bannerImage && (
                    <div className="flex justify-end">
                      <button onClick={() => update('bannerImage', '')} className="text-xs text-red-500 hover:text-red-600 font-semibold">Remove Image</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Department Title"
                    value={form.title || ''}
                    onChange={e => update('title', e.target.value)}
                    placeholder={dept.fullName}
                  />
                  <AdminInput
                    label="Tagline"
                    value={form.tagline || ''}
                    onChange={e => update('tagline', e.target.value)}
                    placeholder="Excellence in ..."
                  />
                </div>
              </div>
            </EditorCard>
          </motion.div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.1}}>
            <EditorCard title="Basic Information" description="Key department details and summary.">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Year Established"
                    icon={Clock}
                    type="number"
                    value={form.established || ''}
                    onChange={e => update('established', e.target.value)}
                    placeholder="2001"
                  />
                  <AdminInput
                    label="Head of Department (HOD)"
                    icon={User}
                    value={form.hod || ''}
                    onChange={e => update('hod', e.target.value)}
                    placeholder="Dr. Name"
                  />
                </div>
                <AdminTextarea
                  label="Department Description"
                  value={form.description || ''}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Describe the department..."
                  rows={5}
                />
              </div>
            </EditorCard>
          </motion.div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.2}}>
            <EditorCard title="Vision & Mission" description="Strategic goals of the department.">
              <div className="space-y-4">
                <AdminTextarea
                  label="Vision"
                  value={form.vision || ''}
                  onChange={e => update('vision', e.target.value)}
                  placeholder="To be a globally recognized..."
                  rows={3}
                  icon={Compass}
                />
                <AdminTextarea
                  label="Mission (One per line)"
                  value={form.mission || ''}
                  onChange={e => update('mission', e.target.value)}
                  placeholder="1. First mission point\n2. Second mission point"
                  rows={4}
                  icon={Target}
                />
              </div>
            </EditorCard>
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
                  cahcet.edu.in/departments/{deptKey}
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-primary-50/50 p-0 relative">
                 <div className="scale-[0.8] origin-top">
                    <DepartmentHero data={previewHeroData} />
                    <div className="p-8 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] mt-8 mx-4 border border-white/60 shadow-luxury">
                      <AboutSection data={previewAboutData} />
                    </div>
                 </div>
              </div>
            </div>
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
    </EditorPage>
  );
};

export default DeptOverviewEditor;
