import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, BookOpen } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { motion } from 'framer-motion';
import { ShieldAlert, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';

const TeachingMethodologyEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', content: '', methods: [], highlights: [] });
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
      if (map['academics.teachingMethodology']) {
        setSectionId(map['academics.teachingMethodology'].id);
        setForm(JSON.parse(map['academics.teachingMethodology'].draftContent || map['academics.teachingMethodology'].content || '{}') || { title: '', content: '', methods: [], highlights: [] });
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
      if (sectionId || sectionsMap['academics.teachingMethodology']) {
        const targetId = sectionId || sectionsMap['academics.teachingMethodology'].id;
        await cmsService.updateSection(targetId, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'academics.teachingMethodology',
          title: 'TeachingMethodology',
          type: 'json',
          draftContent: content,
          _isSilentDraft: isSilent
        });
        setSectionId(newSec.data?.id);
        setSectionsMap(prev => ({ ...prev, ['academics.teachingMethodology']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };

  

  const addMethod = () => change('methods', [...(form.methods || []), { id: Date.now(), title: '', description: '', icon: 'BookOpen' }]);
  const updateMethod = (idx, f, v) => {
    const list = [...(form.methods || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('methods', list);
  };
  const removeMethod = (idx) => change('methods', (form.methods || []).filter((_, i) => i !== idx));

  const addHighlight = () => change('highlights', [...(form.highlights || []), '']);
  const updateHighlight = (idx, v) => {
    const list = [...(form.highlights || [])];
    list[idx] = v;
    change('highlights', list);
  };
  const removeHighlight = (idx) => change('highlights', (form.highlights || []).filter((_, i) => i !== idx));

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'academics.teachingMethodology', form);

  return (
    <EditorPage
      title="Teaching Methodology"
      description="Edit the educational approaches, learning methodologies, and smart classroom strategies."
      breadcrumb={['Admin', 'Academics', 'Teaching Methodology']}
      onSave={() => handleSaveDraft(false)}
      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['academics.teachingMethodology'] || {id: sectionId}); }}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">academics.teachingMethodology</div></div>
        <EditorCard title="Main Introduction" description="The primary overview text displayed at the top.">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
            <AdminTextarea label="Introduction Text" value={form.content || ''} onChange={e => change('content', e.target.value)} rows={4} />
          </div>
        </EditorCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EditorCard title="Methodology Cards" description="Interactive cards showcasing specific teaching techniques.">
              <div className="space-y-4">
                {(form.methods || []).map((method, idx) => (
                  <div key={method.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 relative">
                    <GripVertical className="w-5 h-5 text-slate-300 mt-2 shrink-0 cursor-move" />
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AdminInput label="Title" value={method.title} onChange={e => updateMethod(idx, 'title', e.target.value)} />
                        <AdminInput label="Icon Name (Lucide)" value={method.icon} onChange={e => updateMethod(idx, 'icon', e.target.value)} placeholder="e.g. Monitor, Users" />
                      </div>
                      <AdminTextarea label="Description" value={method.description} onChange={e => updateMethod(idx, 'description', e.target.value)} rows={2} />
                    </div>
                    <button onClick={() => removeMethod(idx)} className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-amber-400 rounded-full shadow-sm hover:bg-primary-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addMethod} className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold w-max">
                  <Plus className="w-4 h-4" /> Add Method Card
                </button>
              </div>
            </EditorCard>
          </div>

          <div className="lg:col-span-1">
            <EditorCard title="Key Highlights" description="Bullet points summarizing the core focus.">
              <div className="space-y-3">
                {(form.highlights || []).map((highlight, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <input 
                      type="text" 
                      value={highlight} 
                      onChange={e => updateHighlight(idx, e.target.value)} 
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                      placeholder="Highlight point..."
                    />
                    <button onClick={() => removeHighlight(idx)} className="p-1.5 text-amber-400 hover:bg-primary-50 rounded-lg h-max mt-0.5"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addHighlight} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  <Plus className="w-4 h-4" /> Add Highlight
                </button>
              </div>
            </EditorCard>
          </div>
        </div>
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

export default TeachingMethodologyEditor;
