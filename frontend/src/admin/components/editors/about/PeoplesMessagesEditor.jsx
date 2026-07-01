import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, Monitor, MessageSquareQuote } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const PeoplesMessagesEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  
  const [formChairman, setFormChairman] = useState({});
  const [formPrincipal, setFormPrincipal] = useState({});

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('about');
      setPageId(res.data?.id);
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);
      if (map['about.chairman']) setFormChairman(JSON.parse(map['about.chairman'].draftContent || map['about.chairman'].content || '{}'));
      if (map['about.principal']) setFormPrincipal(JSON.parse(map['about.principal'].draftContent || map['about.principal'].content || '{}'));
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load data.' }); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const updates = [];
      const pushUpdate = async (key, title, content) => {
        if (sectionsMap[key]) updates.push(cmsService.updateSection(sectionsMap[key].id, { draftContent: content, _isSilentDraft: isSilent }));
        else {
          const res = await cmsService.createSection({ pageId, sectionKey: key, title, draftContent: content, _isSilentDraft: isSilent });
          setSectionsMap(prev => ({ ...prev, [key]: res.data }));
        }
      };
      await pushUpdate('about.chairman', "Chairman's Message", JSON.stringify(formChairman));
      await pushUpdate('about.principal', "Principal's Message", JSON.stringify(formPrincipal));
      await Promise.all(updates);
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Messages saved to draft.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const handleUpload = async (person, field, e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const rec = await fileService.upload(file, 'about', `${person}-${field}`);
      if (person === 'chairman') setFormChairman(p => ({ ...p, [field]: rec.url }));
      else if (person === 'principal') setFormPrincipal(p => ({ ...p, [field]: rec.url }));
      handleSaveDraft(true);
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'about.chairman', formChairman);

  const renderPerson = (title, data, setData, key) => (
    <EditorCard title={`${title} Message Block`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <AdminInput label="Full Name" value={data.name || ''} onChange={e => setData(p => ({ ...p, name: e.target.value }))} />
          <AdminInput label="Designation" value={data.designation || ''} onChange={e => setData(p => ({ ...p, designation: e.target.value }))} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Portrait Photo</label>
              <div className="flex flex-col gap-3">
                {data.photoUrl ? <img loading="lazy" decoding="async" src={data.photoUrl} className="w-24 h-32 object-cover rounded-xl border border-slate-200 shadow-sm" /> : <div className="w-24 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl" />}
                <label className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-200 w-max"><UploadCloud className="w-3.5 h-3.5 mr-2" /> Upload<input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(key, 'photoUrl', e)} /></label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Signature</label>
              <div className="flex flex-col gap-3">
                {data.signatureUrl ? <img loading="lazy" decoding="async" src={data.signatureUrl} className="h-16 object-contain rounded-xl border border-slate-200 bg-white shadow-sm p-2" /> : <div className="h-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl" />}
                <label className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-200 w-max"><UploadCloud className="w-3.5 h-3.5 mr-2" /> Upload<input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(key, 'signatureUrl', e)} /></label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <AdminTextarea label="Message Content (Use double line breaks for paragraphs)" value={Array.isArray(data.message) ? data.message.join('\n\n') : (data.message || '')} onChange={e => setData(p => ({ ...p, message: e.target.value.split('\n\n') }))} rows={12} />
        </div>
      </div>
    </EditorCard>
  );

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage title="People's Messages" description="Edit official messages from the Chairman and Principal." breadcrumb={['Admin', 'About', "People's Messages"]} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['about.chairman']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <motion.div key="main" {...fadeUp} className="space-y-6">
        {renderPerson('Chairman', formChairman, setFormChairman, 'chairman')}
        {renderPerson('Principal', formPrincipal, setFormPrincipal, 'principal')}
      </motion.div>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sectionsMap['about.chairman'].id); await cmsService.publishSection(sectionsMap['about.principal'].id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default PeoplesMessagesEditor;
