import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, Monitor, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const RefundPolicyEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ email: '', phone: '', officeAddress: '', content: '' });
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
      if (map['about.refund_policy']) setForm(JSON.parse(map['about.refund_policy'].draftContent || map['about.refund_policy'].content || '{}') || { email: '', phone: '', officeAddress: '', content: '' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load Refund Policy.' }); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['about.refund_policy']) {
        await cmsService.updateSection(sectionsMap['about.refund_policy'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({ pageId, sectionKey: 'about.refund_policy', title: 'Refund Policy', type: 'json', draftContent: content, _isSilentDraft: isSilent });
        setSectionsMap(prev => ({ ...prev, 'about.refund_policy': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'about.refund_policy', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage title="Refund Policy" description="Manage the institution's refund policies and contact details." breadcrumb={['Admin', 'About', 'Refund Policy']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['about.refund_policy']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <motion.div key="main" {...fadeUp} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
           <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Legal Document Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">about.refund_policy</div></div>
           
           <EditorCard title="Contact Information" description="Contact details for refund inquiries.">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <AdminInput label="Email Address" value={form.email || ''} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                <AdminInput label="Phone Number" value={form.phone || ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
             </div>
             <AdminTextarea label="Office Address" value={form.officeAddress || ''} onChange={e => setForm(p => ({ ...p, officeAddress: e.target.value }))} rows={2} />
           </EditorCard>

           <EditorCard title="Policy Content">
             <AdminTextarea label="Policy Body Content (HTML/Markdown Supported)" value={form.content || ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={15} />
           </EditorCard>
        </div>
        <div className="xl:col-span-4 hidden xl:block">
           <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>
             <div className="p-6">
                <div className="mb-6 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <h4 className="font-bold text-slate-800 text-sm mb-2">Contact Desk</h4>
                   <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="w-4 h-4 text-slate-400"/> {form.email || 'N/A'}</div>
                   <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="w-4 h-4 text-slate-400"/> {form.phone || 'N/A'}</div>
                   <div className="flex items-start gap-2 text-sm text-slate-600"><MapPin className="w-4 h-4 text-slate-400 shrink-0"/> <span className="line-clamp-2">{form.officeAddress || 'N/A'}</span></div>
                </div>
               <div className="prose prose-sm max-w-none text-slate-600 line-clamp-[10]">{form.content || 'Content preview here...'}</div>
             </div>
           </div>
        </div>
      </motion.div>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default RefundPolicyEditor;
