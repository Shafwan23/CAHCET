import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import DepartmentTimelineSection from '../../../../components/sections/DepartmentTimelineSection';

const DepartmentsOverviewEditor = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [sectionsMap, setSectionsMap] = useState({});
  const [previewSection, setPreviewSection] = useState(null);

  const [formHero, setFormHero] = useState({
    title: 'Colleges & Departments',
    subtitle: 'Academic Excellence',
    description: 'Discover our world-class facilities, industry-integrated curriculum, and the visionary faculty shaping the next generation of global innovators.'
  });

  const [formEngineering, setFormEngineering] = useState([]);
  const [formStandalone, setFormStandalone] = useState([]);

  const fetchPage = async () => {
    try {
      let res;
      try {
        res = await cmsService.getPage('departments_overview');
      } catch {
        res = await cmsService.createPage({
          title: 'Departments Overview',
          slug: 'departments_overview',
          description: 'Engineering and Standalone Departments Directory Overview',
          status: 'PUBLISHED',
          _isSilentDraft: true
        });
      }

      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['departments_overview.hero']) {
        setFormHero(JSON.parse(map['departments_overview.hero'].draftContent || map['departments_overview.hero'].content || '{}'));
      }
      if (map['departments_overview.engineering']) {
        setFormEngineering(JSON.parse(map['departments_overview.engineering'].draftContent || map['departments_overview.engineering'].content || '[]'));
      }
      if (map['departments_overview.standalone']) {
        setFormStandalone(JSON.parse(map['departments_overview.standalone'].draftContent || map['departments_overview.standalone'].content || '[]'));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load page data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      const updates = [];

      const sectionsToSave = [
        { key: 'departments_overview.hero', title: 'Hero Text', data: formHero },
        { key: 'departments_overview.engineering', title: 'Engineering Timeline', data: formEngineering },
        { key: 'departments_overview.standalone', title: 'Standalone Courses Timeline', data: formStandalone }
      ];

      for (const item of sectionsToSave) {
        const draftContent = JSON.stringify(item.data);
        if (sectionsMap[item.key]) {
          updates.push(cmsService.updateSection(sectionsMap[item.key].id, { draftContent, _isSilentDraft: isSilent }));
        } else {
          const newSec = await cmsService.createSection({
            pageId,
            sectionKey: item.key,
            title: item.title,
            draftContent
          });
          setSectionsMap(prev => ({ ...prev, [item.key]: newSec.data }));
        }
      }

      await Promise.all(updates);
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Departments Overview changes saved to draft.` });
      // Re-fetch to update status mappings
      await fetchPage();
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save drafts.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true); // silent save draft
    
    // Create a composite dummy section for preview to show everything
    const compositeSection = {
       id: 'composite',
       sectionKey: 'departments_overview.composite',
       draftContent: JSON.stringify({ hero: formHero, engineering: formEngineering, standalone: formStandalone }),
       _publishAll: true // custom flag we can intercept if needed, or just rely on multiple publish calls
    };
    setPreviewSection(compositeSection);
  };
  
  const executePublishAll = async () => {
     try {
       setLoading(true);
       const promises = [];
       if (sectionsMap['departments_overview.hero']) promises.push(cmsService.publishSection(sectionsMap['departments_overview.hero'].id));
       if (sectionsMap['departments_overview.engineering']) promises.push(cmsService.publishSection(sectionsMap['departments_overview.engineering'].id));
       if (sectionsMap['departments_overview.standalone']) promises.push(cmsService.publishSection(sectionsMap['departments_overview.standalone'].id));
       
       await Promise.all(promises);
       toast({ type: 'success', title: 'Live', message: 'Departments overview pushed to production.' });
       setPreviewSection(null);
       fetchPage();
     } catch(e) {
       toast({ type: 'error', title: 'Error', message: 'Failed to publish sections.' });
     } finally {
       setLoading(false);
     }
  }

  const handleReset = () => {
    fetchPage();
    toast({ type: 'info', title: 'Reset', message: 'Discarded unsaved changes.' });
  };

  const updateItem = (type, index, field, value) => {
    if (type === 'engineering') {
      const updated = [...formEngineering];
      updated[index][field] = value;
      setFormEngineering(updated);
    } else {
      const updated = [...formStandalone];
      updated[index][field] = value;
      setFormStandalone(updated);
    }
  };

  const handleImageUpload = async (e, type, index) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'departments_overview', type);
      updateItem(type, index, 'image', rec.url);
      toast({ type: 'success', title: 'Uploaded!', message: 'Image uploaded successfully.' });
    } catch {
      toast({ type: 'error', title: 'Failed', message: 'Upload failed.' });
    }
    setUploading(false);
  };

  const moveItem = (type, index, direction) => {
    const list = type === 'engineering' ? [...formEngineering] : [...formStandalone];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    if (type === 'engineering') setFormEngineering(list);
    else setFormStandalone(list);
  };

  const removeItem = (type, index) => {
    if (window.confirm("Are you sure you want to delete this program timeline card?")) {
      if (type === 'engineering') {
        setFormEngineering(formEngineering.filter((_, i) => i !== index));
      } else {
        setFormStandalone(formStandalone.filter((_, i) => i !== index));
      }
    }
  };

  const addItem = (type) => {
    const newItem = {
      id: `prog_${Date.now()}`,
      title: 'New Program',
      abbr: 'NP',
      description: 'Provide program description here.',
      highlights: ['Accredited', 'Smart Labs'],
      image: '',
      link: '/departments/new-program'
    };
    if (type === 'engineering') setFormEngineering([...formEngineering, newItem]);
    else setFormStandalone([...formStandalone, newItem]);
  };

  // We check status based on hero since they usually move together
  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'departments_overview.hero', formHero);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Departments Overview Editor"
      description="Manage the timeline programs, descriptions, logos, highlights and links on the departments catalog page."
      breadcrumb={['Admin', 'Departments', 'Catalog Page']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Side: Configuration Panel */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Dashboard/KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Engineering Programs</p>
                   <p className="text-2xl font-bold text-slate-800">{formEngineering.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                   <ArrowUp className="w-5 h-5 text-blue-500" />
                </div>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Standalone Programs</p>
                   <p className="text-2xl font-bold text-slate-800">{formStandalone.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                   <ArrowUp className="w-5 h-5 text-amber-500" />
                </div>
             </div>
          </div>

          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('hero')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'hero' ? 'border-amber-500 text-amber-500 bg-amber-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Hero Text
            </button>
            <button
              onClick={() => setActiveTab('engineering')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'engineering' ? 'border-amber-500 text-amber-500 bg-amber-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Engineering
            </button>
            <button
              onClick={() => setActiveTab('standalone')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'standalone' ? 'border-amber-500 text-amber-500 bg-amber-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Stand-Alone
            </button>
          </div>

          {activeTab === 'hero' && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
              <EditorCard title="Catalog Hero Section" description="Manage the cinematic landing text on the departments index.">
                <div className="space-y-4">
                  <AdminInput
                    label="Hero Subtitle"
                    value={formHero.subtitle || ''}
                    onChange={e => setFormHero(p => ({ ...p, subtitle: e.target.value }))}
                    placeholder="Academic Excellence"
                  />
                  <AdminInput
                    label="Hero Title"
                    value={formHero.title || ''}
                    onChange={e => setFormHero(p => ({ ...p, title: e.target.value }))}
                    placeholder="Colleges & Departments"
                  />
                  <AdminTextarea
                    label="Hero Description"
                    value={formHero.description || ''}
                    onChange={e => setFormHero(p => ({ ...p, description: e.target.value }))}
                    placeholder="Discover our world-class..."
                    rows={4}
                  />
                </div>
              </EditorCard>
            </motion.div>
          )}

          {(activeTab === 'engineering' || activeTab === 'standalone') && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {activeTab === 'engineering' ? 'Engineering Programs Timeline' : 'Stand-Alone Courses Timeline'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Manage the vertical scroll cards.</p>
                </div>
                <button
                  onClick={() => addItem(activeTab)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add Program
                </button>
              </div>

              <AnimatePresence>
                {(activeTab === 'engineering' ? formEngineering : formStandalone).map((item, index) => (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                    key={item.id || index} 
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-5 hover:border-slate-300 transition-colors group"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">{index + 1}</div>
                         <span className="text-sm font-bold text-slate-700">
                           {item.abbr || 'New Program'}
                         </span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveItem(activeTab, index, -1)} disabled={index === 0} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 transition-colors">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveItem(activeTab, index, 1)}
                          disabled={index === (activeTab === 'engineering' ? formEngineering : formStandalone).length - 1}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <button onClick={() => removeItem(activeTab, index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl hover:shadow-sm transition-all duration-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      <div className="md:col-span-7 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <AdminInput
                              label="Full Title"
                              value={item.title || ''}
                              onChange={e => updateItem(activeTab, index, 'title', e.target.value)}
                              placeholder="Computer Science..."
                            />
                          </div>
                          <div>
                            <AdminInput
                              label="Abbr"
                              value={item.abbr || ''}
                              onChange={e => updateItem(activeTab, index, 'abbr', e.target.value)}
                              placeholder="CSE"
                            />
                          </div>
                        </div>

                        <AdminTextarea
                          label="Overview Description"
                          value={item.description || ''}
                          onChange={e => updateItem(activeTab, index, 'description', e.target.value)}
                          placeholder="Provide highlights..."
                          rows={2}
                        />

                        <AdminInput
                          label="Highlights (Comma Separated)"
                          value={Array.isArray(item.highlights) ? item.highlights.join(', ') : item.highlights || ''}
                          onChange={e => updateItem(activeTab, index, 'highlights', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          placeholder="Accredited, Smart Labs..."
                        />
                        
                        <AdminInput
                          label="Explore Link Path"
                          value={item.link || ''}
                          onChange={e => updateItem(activeTab, index, 'link', e.target.value)}
                          placeholder="/departments/cse"
                        />
                      </div>

                      <div className="md:col-span-5 space-y-3">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program Image</label>
                        <div className="relative group overflow-hidden rounded-xl bg-slate-50 border border-slate-200 aspect-[4/3] flex items-center justify-center">
                           {item.image ? (
                             <img loading="lazy" decoding="async" src={item.image} alt={item.title} className="w-full h-full object-cover" />
                           ) : (
                             <div className="flex flex-col items-center justify-center text-slate-400">
                                <Upload className="w-6 h-6 mb-2 opacity-50" />
                                <span className="text-xs font-medium">No image</span>
                             </div>
                           )}
                           
                           <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                              <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5">
                                 <Upload className="w-3.5 h-3.5" /> Upload Image
                                 <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, activeTab, index)} />
                              </label>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Right Side: Live Preview Panel */}
        <div className="xl:col-span-5">
          <div className="sticky top-24 max-h-[calc(100vh-140px)] flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4" /> Live Preview ({activeTab})
            </h3>
            
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex-1 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono flex-1 max-w-[200px] text-center truncate shadow-sm">
                  cahcet.edu.in/departments
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-primary-950 p-0 relative">
                 {activeTab === 'hero' && (
                    <div className="relative overflow-hidden flex items-center justify-center min-h-[300px] py-12">
                      <div className="absolute inset-0 bg-primary-950 z-0" />
                      <div className="relative z-10 text-center px-4">
                        <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block">
                          {formHero.subtitle || 'Subtitle'}
                        </span>
                        <h1 className="text-2xl font-display font-extrabold text-white mb-4 leading-tight">
                          {formHero.title || 'Hero Title'}
                        </h1>
                        <p className="text-xs text-white/70 leading-relaxed max-w-sm mx-auto">
                          {formHero.description || 'Hero description...'}
                        </p>
                      </div>
                    </div>
                 )}
                 {(activeTab === 'engineering' || activeTab === 'standalone') && (
                    <div className="scale-[0.8] origin-top bg-primary-950">
                       <DepartmentTimelineSection 
                          title={activeTab === 'engineering' ? 'Engineering Programs' : 'Stand Alone Courses'} 
                          data={activeTab === 'engineering' ? formEngineering : formStandalone} 
                       />
                    </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewSection && (
        <SectionPreviewModal 
          section={previewSection}
          onClose={() => setPreviewSection(null)}
          onPublish={executePublishAll}
          onRestore={() => fetchPage()}
        />
      )}
    </EditorPage>
  );
};

export default DepartmentsOverviewEditor;
