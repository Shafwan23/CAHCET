import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, CheckCircle, ArrowLeft, Users, UserCircle, Briefcase, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const GoverningPolicyEditor = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('about');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['about.governing_council']) setItems(JSON.parse(map['about.governing_council'].draftContent || map['about.governing_council'].content || '[]'));
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load Governing Council data.' }); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false, newItems = null) => {
    setLoading(true);
    try {
      const content = JSON.stringify(newItems || items);
      if (sectionsMap['about.governing_council']) {
        await cmsService.updateSection(sectionsMap['about.governing_council'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({ pageId, sectionKey: 'about.governing_council', title: 'Governing Council', type: 'json', draftContent: content, _isSilentDraft: isSilent });
        setSectionsMap(prev => ({ ...prev, 'about.governing_council': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const saveItem = (updatedItem) => {
    let newItems;
    if (!updatedItem.id) { updatedItem.id = `gov_member_${Date.now()}`; newItems = [...items, updatedItem]; } // Append to end
    else newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
    setItems(newItems); setEditingItem(null); handleSaveDraft(true, newItems);
  };
  const deleteItem = (itemToDelete) => {
    if (!window.confirm('Remove council member?')) return;
    const newItems = items.filter(i => i.id !== itemToDelete.id);
    setItems(newItems); handleSaveDraft(true, newItems);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'about.governing_council', items);
  const filteredItems = useMemo(() => items.filter(i => (i.name || '').toLowerCase().includes(search.toLowerCase()) || (i.designation || '').toLowerCase().includes(search.toLowerCase())), [items, search]);

  if (loading && !items.length) return <div>Loading...</div>;

  return (
    <EditorPage title="Governing Council" description="Manage the members of the institution's governing body." breadcrumb={['Admin', 'About', 'Governing Council']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['about.governing_council']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <AnimatePresence mode="wait">
        {!editingItem ? (
          <motion.div key="list" {...fadeUp} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border bg-amber-50 text-amber-700 border-amber-100 relative overflow-hidden"><Users className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">Total Members</span><span className="text-3xl font-extrabold">{items.length}</span></div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[132px] z-20 shadow-sm">
              <div className="relative flex-1 max-w-sm"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} /></div>
              <button onClick={() => setEditingItem({ id: '', name: '', designation: '', position: '' })} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800"><Plus className="w-4 h-4" /> Add Member</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map(item => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -4 }} key={item.id} className="group bg-white/70 backdrop-blur-xl border border-slate-200/60 p-5 rounded-[24px] flex flex-col relative overflow-hidden shadow-sm hover:shadow-xl transition-all">
                    <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-10 bg-amber-500 pointer-events-none" />
                    <div className="flex gap-4 items-center mb-4 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center shrink-0"><UserCircle className="w-8 h-8" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{item.name || 'Unnamed Member'}</h4>
                        <span className="text-xs font-bold text-slate-500">{item.designation || 'No Designation'}</span>
                      </div>
                    </div>
                    <div className="mb-4 relative z-10 flex-1"><div className="flex items-center gap-2 text-sm text-slate-600"><Briefcase className="w-4 h-4 text-slate-400" /> <b>{item.position || 'No Position'}</b></div></div>
                    <div className="mt-4 pt-4 border-t border-slate-100/60 opacity-0 group-hover:opacity-100 flex gap-2 transition-all relative z-10 translate-y-2 group-hover:translate-y-0">
                      <button onClick={() => setEditingItem(item)} className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100">Edit Member</button>
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
                <EditorCard title="Member Details">
                  <div className="space-y-6">
                    <AdminInput label="Name *" value={editingItem.name || ''} onChange={e => setEditingItem(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Dr. A. P. J. Abdul Kalam" />
                    <AdminInput label="Designation" value={editingItem.designation || ''} onChange={e => setEditingItem(p => ({ ...p, designation: e.target.value }))} placeholder="e.g. Former President of India" />
                    <AdminInput label="Council Position" value={editingItem.position || ''} onChange={e => setEditingItem(p => ({ ...p, position: e.target.value }))} placeholder="e.g. Chairman / Member" />
                  </div>
                </EditorCard>
              </div>
              <div className="xl:col-span-4 hidden xl:block">
                <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500">Live Preview</span></div>
                  <div className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-4"><UserCircle className="w-10 h-10" /></div>
                    <h4 className="font-bold text-slate-900 text-lg">{editingItem.name || 'Member Name'}</h4>
                    <p className="text-sm text-slate-500 font-medium">{editingItem.designation || 'Designation'}</p>
                    <div className="mt-4 inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{editingItem.position || 'Council Position'}</div>
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
export default GoverningPolicyEditor;
