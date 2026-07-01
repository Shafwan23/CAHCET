import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Upload, X, Search } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { motion } from 'framer-motion';
import { ShieldAlert, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';

const CampusFacilitiesEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', content: '', facilities: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [previewSection, setPreviewSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [sectionId, setSectionId] = useState(null);
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await cmsService.getPage('academics');
      setPageId(res.data?.id);
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);
      if (map['academics.facilities']) {
        setSectionId(map['academics.facilities'].id);
        setForm(JSON.parse(map['academics.facilities'].draftContent || map['academics.facilities'].content || '{}') || { title: '', content: '', facilities: [] });
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load.' });
    } finally {
      setPageLoading(false);
    }
  };

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionId || sectionsMap['academics.facilities']) {
        const targetId = sectionId || sectionsMap['academics.facilities'].id;
        await cmsService.updateSection(targetId, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'academics.facilities',
          title: 'CampusFacilities',
          type: 'json',
          draftContent: content,
          _isSilentDraft: isSilent
        });
        setSectionId(newSec.data?.id);
        setSectionsMap(prev => ({ ...prev, ['academics.facilities']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };

  

  const addFacility = () => {
    const defaultCat = activeCategory !== 'All' ? activeCategory : 'Labs';
    change('facilities', [{ id: Date.now(), title: '', category: defaultCat, description: '', images: [] }, ...(form.facilities || [])]);
  };
  
  const updateFacility = (idx, f, v) => {
    const list = [...(form.facilities || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('facilities', list);
  };
  
  const removeFacility = (idx) => change('facilities', (form.facilities || []).filter((_, i) => i !== idx));

  const handleImageUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'academics', 'facility');
      const list = [...(form.facilities || [])];
      list[idx] = { ...list[idx], images: [...(list[idx].images || []), rec.url] };
      change('facilities', list);
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };

  const removeImage = (fIdx, imgIdx) => {
    const list = [...(form.facilities || [])];
    list[fIdx].images = list[fIdx].images.filter((_, i) => i !== imgIdx);
    change('facilities', list);
  };

  const categories = ['All', ...new Set((form.facilities || []).map(f => f.category).filter(Boolean))];

  const filteredFacilities = (form.facilities || []).map((f, i) => ({ ...f, _originalIndex: i })).filter(f => {
    const matchesSearch = (f.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'academics.facilities', form);

  return (
    <EditorPage
      title="Campus Facilities"
      description="Manage the university's laboratories, libraries, hostels, and other infrastructure."
      breadcrumb={['Admin', 'Academics', 'Campus Facilities']}
      onSave={() => handleSaveDraft(false)}
      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['academics.facilities'] || {id: sectionId}); }}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">academics.facilities</div></div>
        <EditorCard title="Page Header" description="Main title and introductory paragraph for the facilities page.">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
            <AdminTextarea label="Introduction Text" value={form.content || ''} onChange={e => change('content', e.target.value)} rows={3} />
          </div>
        </EditorCard>

        <EditorCard title="Facilities Database">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 -mb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" placeholder="Search facilities..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-48"
                />
              </div>
              <button onClick={addFacility} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-amber-600 rounded-lg hover:bg-primary-100 font-semibold text-sm whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Facility
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFacilities.map((facility) => {
              const idx = facility._originalIndex;
              return (
                <div key={facility.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:border-blue-300 transition-colors relative">
                  <div className="p-5 border-b border-slate-100 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <AdminInput label="Facility Name" value={facility.title} onChange={e => updateFacility(idx, 'title', e.target.value)} />
                        <AdminInput label="Category (e.g. Labs, Library)" value={facility.category} onChange={e => updateFacility(idx, 'category', e.target.value)} />
                      </div>
                      <button onClick={() => removeFacility(idx)} className="p-2 bg-white border border-slate-200 text-amber-500 rounded-lg hover:bg-primary-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <AdminTextarea label="Description" value={facility.description} onChange={e => updateFacility(idx, 'description', e.target.value)} rows={3} />
                  </div>
                  
                  <div className="p-4 bg-slate-50">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Facility Gallery Images</label>
                    <div className="flex flex-wrap gap-3">
                      {(facility.images || []).map((img, imgIdx) => (
                        <div key={imgIdx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group/img">
                          <img loading="lazy" decoding="async" src={img} alt="Facility" className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(idx, imgIdx)} className="absolute top-1 right-1 p-1 bg-amber-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-white hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-semibold">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(idx, e.target.files[0])} />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </EditorCard>
      </div>
          <div className="xl:col-span-4 hidden xl:block">
           <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>
             <div className="p-6 prose prose-sm max-w-none text-slate-600">
               <h3 className="text-xl font-bold text-slate-900 mb-1">{form.title || 'Module Title'}</h3>
               <div className="line-clamp-[12] whitespace-pre-wrap">{form.content || 'Start typing to see content preview here...'}</div>
               {form.methods && <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono">{form.methods.length} items configured</div>}
               {form.facilities && <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono">{form.facilities.length} items configured</div>}
             </div>
           </div>
        </div>
      </motion.div>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); loadData();}} onRestore={loadData} />}
    </EditorPage>
  );
};

export default CampusFacilitiesEditor;
