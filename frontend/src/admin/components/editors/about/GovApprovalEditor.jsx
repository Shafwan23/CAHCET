import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, CheckCircle, ArrowLeft, FileText, FileCheck, ShieldCheck, Monitor, UploadCloud } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const GovApprovalEditor = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('about');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['about.gov_approval']) setItems(JSON.parse(map['about.gov_approval'].draftContent || map['about.gov_approval'].content || '[]'));
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load Government Approval data.' }); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false, newItems = null) => {
    setLoading(true);
    try {
      const content = JSON.stringify(newItems || items);
      if (sectionsMap['about.gov_approval']) {
        await cmsService.updateSection(sectionsMap['about.gov_approval'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({ pageId, sectionKey: 'about.gov_approval', title: 'Government Approval', type: 'json', draftContent: content, _isSilentDraft: isSilent });
        setSectionsMap(prev => ({ ...prev, 'about.gov_approval': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const saveItem = (updatedItem) => {
    let newItems;
    if (!updatedItem.id) { updatedItem.id = `gov_${Date.now()}`; newItems = [updatedItem, ...items]; }
    else newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
    setItems(newItems); setEditingItem(null); handleSaveDraft(true, newItems);
  };
  const deleteItem = (itemToDelete) => {
    if (!window.confirm('Delete approval document?')) return;
    const newItems = items.filter(i => i.id !== itemToDelete.id);
    setItems(newItems); handleSaveDraft(true, newItems);
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'about', 'documents');
      setEditingItem(p => ({ ...p, fileUrl: rec.url }));
    } catch { toast({ type: 'error', title: 'Upload Failed' }); }
    setUploading(false);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'about.gov_approval', items);
  const filteredItems = useMemo(() => items.filter(i => (i.title || '').toLowerCase().includes(search.toLowerCase())), [items, search]);

  if (loading && !items.length) return <div>Loading...</div>;

  return (
    <EditorPage title="Government Approvals" description="Manage certificates, affiliations, and regulatory approvals." breadcrumb={['Admin', 'About', 'Government Approvals']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['about.gov_approval']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <AnimatePresence mode="wait">
        {!editingItem ? (
          <motion.div key="list" {...fadeUp} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border bg-indigo-50 text-indigo-700 border-indigo-100 relative overflow-hidden"><FileCheck className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">Total Approvals</span><span className="text-3xl font-extrabold">{items.length}</span></div>
              <div className="p-5 rounded-2xl border bg-emerald-50 text-emerald-700 border-emerald-100 relative overflow-hidden"><ShieldCheck className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">Active Certificates</span><span className="text-3xl font-extrabold">{items.filter(i=>i.fileUrl).length}</span></div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[132px] z-20 shadow-sm">
              <div className="relative flex-1 max-w-sm"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} /></div>
              <button onClick={() => setEditingItem({ id: '', title: '', description: '', fileUrl: '' })} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800"><Plus className="w-4 h-4" /> Add Document</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map(item => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -4 }} key={item.id} className="group bg-white/70 backdrop-blur-xl border border-slate-200/60 p-5 rounded-[24px] flex flex-col relative overflow-hidden shadow-sm hover:shadow-xl transition-all">
                    <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-10 bg-indigo-500 pointer-events-none" />
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 relative z-10"><FileText className="w-6 h-6" /></div>
                    <div className="relative z-10 flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">{item.title || 'Untitled Document'}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{item.description || 'No description available'}</p>
                      {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200">View Document</a>}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100/60 opacity-0 group-hover:opacity-100 flex gap-2 transition-all relative z-10 translate-y-2 group-hover:translate-y-0">
                      <button onClick={() => setEditingItem(item)} className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100">Edit Document</button>
                      <button onClick={() => deleteItem(item)} className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div key="editor" {...fadeUp} className="space-y-6">
            <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl sticky top-[132px] z-10 shadow-sm">
              <button onClick={() => setEditingItem(null)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"><ArrowLeft className="w-4 h-4" /> Back</button>
              <button onClick={() => saveItem(editingItem)} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800"><CheckCircle className="w-4 h-4" /> Apply Changes</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-8 space-y-6">
                <EditorCard title="Document Details">
                  <div className="space-y-6">
                    <AdminInput label="Document Title *" value={editingItem.title || ''} onChange={e => setEditingItem(p => ({ ...p, title: e.target.value }))} placeholder="e.g. AICTE Approval 2024-25" />
                    <AdminTextarea label="Description" value={editingItem.description || ''} onChange={e => setEditingItem(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Brief details about the approval." />
                  </div>
                </EditorCard>
                <EditorCard title="Document File">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-3 w-full">
                      <AdminInput label="File URL" value={editingItem.fileUrl || ''} onChange={e => setEditingItem(p => ({ ...p, fileUrl: e.target.value }))} placeholder="https://..." hint="Link to PDF or Document." />
                      <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl cursor-pointer transition-colors w-fit">
                        {uploading ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                        {uploading ? 'Uploading...' : 'Upload PDF/Doc'}
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleDocUpload} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                </EditorCard>
              </div>
              <div className="xl:col-span-4 hidden xl:block">
                <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500">Live Preview</span></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4"><FileText className="w-6 h-6" /></div>
                    <h4 className="font-bold text-slate-900 mb-2">{editingItem.title || 'Document Title'}</h4>
                    <p className="text-sm text-slate-500 mb-4">{editingItem.description || 'Description will appear here.'}</p>
                    {editingItem.fileUrl && <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold inline-block border border-slate-200">View Document Preview</div>}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default GovApprovalEditor;
