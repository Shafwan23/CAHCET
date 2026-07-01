import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const PrivacyPolicyEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: 'Privacy Policy', lastUpdated: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('about');
      setPageId(res.data?.id);
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);
      if (map['about.privacy']) setForm(JSON.parse(map['about.privacy'].draftContent || map['about.privacy'].content || '{}') || { title: 'Privacy Policy', lastUpdated: '', content: '' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load Privacy Policy.' }); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['about.privacy']) {
        await cmsService.updateSection(sectionsMap['about.privacy'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({ pageId, sectionKey: 'about.privacy', title: 'Privacy Policy', type: 'json', draftContent: content, _isSilentDraft: isSilent });
        setSectionsMap(prev => ({ ...prev, 'about.privacy': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'about.privacy', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage title="Privacy Policy" description="Manage the website privacy and data collection policy." breadcrumb={['Admin', 'About', 'Privacy Policy']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['about.privacy']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <motion.div key="main" {...fadeUp} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
           <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Legal Document Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">about.privacy</div></div>
           <EditorCard title="Document Content">
             <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <AdminInput label="Document Title" value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                   <AdminInput label="Last Updated Date" type="date" value={form.lastUpdated || ''} onChange={e => setForm(p => ({ ...p, lastUpdated: e.target.value }))} />
                </div>
                <AdminTextarea label="Policy Body Content (Markdown Supported)" value={form.content || ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={20} />
             </div>
           </EditorCard>
        </div>
        <div className="xl:col-span-4 hidden xl:block">
           <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>
             <div className="p-6 prose prose-sm max-w-none text-slate-600">
               <h3 className="text-xl font-bold text-slate-900 mb-1">{form.title || 'Privacy Policy'}</h3>
               {form.lastUpdated && <p className="text-xs font-semibold text-slate-400 mb-4">Last Updated: {form.lastUpdated}</p>}
               <div className="line-clamp-[12] whitespace-pre-wrap">{form.content || 'Start typing to see content preview here...'}</div>
             </div>
           </div>
        </div>
      </motion.div>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default PrivacyPolicyEditor;
