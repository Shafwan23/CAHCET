import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Upload, X } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { motion } from 'framer-motion';
import { ShieldAlert, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';

const CampusLifeEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', content: '', sections: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [previewSection, setPreviewSection] = useState(null);

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
      if (map['academics.campusLife']) {
        setSectionId(map['academics.campusLife'].id);
        setForm(JSON.parse(map['academics.campusLife'].draftContent || map['academics.campusLife'].content || '{}') || { title: '', content: '', sections: [] });
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
      if (sectionId || sectionsMap['academics.campusLife']) {
        const targetId = sectionId || sectionsMap['academics.campusLife'].id;
        await cmsService.updateSection(targetId, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'academics.campusLife',
          title: 'CampusLife',
          type: 'json',
          draftContent: content,
          _isSilentDraft: isSilent
        });
        setSectionId(newSec.data?.id);
        setSectionsMap(prev => ({ ...prev, ['academics.campusLife']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };

  

  const addSection = () => change('sections', [...(form.sections || []), { id: Date.now(), title: '', description: '', images: [] }]);
  const updateSectionData = (idx, f, v) => {
    const list = [...(form.sections || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('sections', list);
  };
  const removeSection = (idx) => change('sections', (form.sections || []).filter((_, i) => i !== idx));

  const handleImageUpload = async (secIdx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'academics', 'campus-life');
      const list = [...(form.sections || [])];
      list[secIdx] = { ...list[secIdx], images: [...(list[secIdx].images || []), rec.url] };
      change('sections', list);
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };
  const removeImage = (secIdx, imgIdx) => {
    const list = [...(form.sections || [])];
    list[secIdx].images = list[secIdx].images.filter((_, i) => i !== imgIdx);
    change('sections', list);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'academics.campusLife', form);

  return (
    <EditorPage
      title="Campus Life"
      description="Manage cultural events, student activities, and campus environment."
      breadcrumb={['Admin', 'Academics', 'Campus Life']}
      onSave={() => handleSaveDraft(false)}
      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['academics.campusLife'] || {id: sectionId}); }}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">academics.campusLife</div></div>
        <EditorCard title="Page Introduction">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
            <AdminTextarea label="Introduction Text" value={form.content || ''} onChange={e => change('content', e.target.value)} rows={3} />
          </div>
        </EditorCard>

        <EditorCard title="Activities & Events" description="Manage different sections like Cultural Fests, Clubs, and Tech Events.">
          <div className="space-y-6">
            {(form.sections || []).map((sec, idx) => (
              <div key={sec.id} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm group hover:border-indigo-300 transition-colors">
                <GripVertical className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex-1 space-y-4">
                    <AdminInput label="Section Title" value={sec.title} onChange={e => updateSectionData(idx, 'title', e.target.value)} placeholder="e.g. Cultural Extravaganza" />
                    <AdminTextarea label="Description" value={sec.description} onChange={e => updateSectionData(idx, 'description', e.target.value)} rows={3} />
                  </div>
                  <button onClick={() => removeSection(idx)} className="p-2 text-amber-500 bg-primary-50 hover:bg-primary-100 rounded-lg shrink-0 mt-1"><Trash2 className="w-5 h-5" /></button>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Event Gallery</label>
                  <div className="flex flex-wrap gap-3">
                    {(sec.images || []).map((img, imgIdx) => (
                      <div key={imgIdx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group/img shadow-sm">
                        <img loading="lazy" decoding="async" src={img} alt="Campus Life" className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(idx, imgIdx)} className="absolute top-1 right-1 p-1 bg-amber-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-white hover:border-primary-400 hover:text-primary-500 transition-colors">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-semibold">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(idx, e.target.files[0])} />
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addSection} className="flex items-center gap-2 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 font-semibold text-sm w-full justify-center transition-colors">
              <Plus className="w-4 h-4" /> Add Activity Section
            </button>
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

export default CampusLifeEditor;
