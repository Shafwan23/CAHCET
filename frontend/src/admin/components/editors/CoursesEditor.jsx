import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../ui/AdminInput';
import { cmsService } from '../../../services/cmsService';
import SectionPreviewModal from '../ui/SectionPreviewModal';
import { useEditorStatus } from '../../utils/useEditorStatus';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const ItemCard = ({ item, onEdit, onDelete, Icon }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -4 }} className="group bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-sm p-5 rounded-[24px] flex flex-col hover:shadow-xl transition-all relative overflow-hidden">
    <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-10 bg-indigo-500 pointer-events-none" />
    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 relative z-10"><Icon className="w-6 h-6" /></div>
    <div className="relative z-10 flex-1">
      <h4 className="font-bold text-slate-900 mb-1">{item.title || item.name || 'Untitled'}</h4>
      <p className="text-xs text-slate-500 line-clamp-2">{item.description || item.subtitle || 'No description available'}</p>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100/60 opacity-0 group-hover:opacity-100 flex gap-2 transition-all relative z-10">
      <button onClick={() => onEdit(item)} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100"><Pencil className="w-3 h-3 inline mr-1" /> Edit</button>
      <button onClick={() => onDelete(item)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100"><Trash2 className="w-3 h-3" /></button>
    </div>
  </motion.div>
);

const CoursesEditor = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const Icon = BookOpen;

  const fetchPage = async () => {
    try {
      let res;
      try {
        res = await cmsService.getPage('institution');
      } catch (err) {
        if (err.response?.status === 404) {
          // Auto-create missing page
          res = await cmsService.createPage({ title: 'Institution', slug: 'institution', _isSilentDraft: true });
        } else {
          throw err;
        }
      }
      setPageId(res.data?.id);
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);
      if (map['institution.courses']) setItems(JSON.parse(map['institution.courses'].draftContent || map['institution.courses'].content || '[]'));
    } catch (err) { 
      console.error('Failed to load institution page', err);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false, newItems = null) => {
    setLoading(true);
    try {
      const content = JSON.stringify(newItems || items);
      if (sectionsMap['institution.courses']) {
        await cmsService.updateSection(sectionsMap['institution.courses'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({ pageId, sectionKey: 'institution.courses', title: 'Courses', type: 'json', draftContent: content, _isSilentDraft: isSilent });
        setSectionsMap(prev => ({ ...prev, ['institution.courses']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const saveItem = (updatedItem) => {
    let newItems;
    if (!updatedItem.id) { updatedItem.id = `item_${Date.now()}`; newItems = [updatedItem, ...items]; }
    else newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
    setItems(newItems); setEditingItem(null); handleSaveDraft(true, newItems);
  };

  const deleteItem = (itemToDelete) => {
    if (!window.confirm('Delete this item?')) return;
    const newItems = items.filter(i => i.id !== itemToDelete.id);
    setItems(newItems); handleSaveDraft(true, newItems);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'institution.courses', items);
  const filtered = items.filter(i => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

  if (loading && !items.length) return <div>Loading...</div>;

  return (
    <EditorPage title="Courses" description="Manage courses records." breadcrumb={['Admin', 'Institution Records', 'Courses']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['institution.courses']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <AnimatePresence mode="wait">
        {!editingItem ? (
          <motion.div key="list" {...fadeUp} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border bg-indigo-50 text-indigo-700 border-indigo-100"><span className="text-[10px] font-bold uppercase block mb-1">Total Records</span><span className="text-3xl font-extrabold">{items.length}</span></div>
            </div>
            <div className="bg-white/80 border border-slate-200 p-3 rounded-2xl flex items-center justify-between sticky top-[132px] z-20 shadow-sm backdrop-blur-md">
              <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"/><input className="w-full pl-9 pr-4 py-2 border rounded-xl" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
              <button onClick={() => setEditingItem({ id: '', title: '', description: '' })} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl font-bold"><Plus className="w-4 h-4"/> Add New</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6 relative">
              <AnimatePresence>{filtered.map(item => <ItemCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteItem} Icon={Icon}/>)}</AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div key="editor" {...fadeUp} className="space-y-6">
             <div className="flex items-center justify-between mb-4 bg-white/80 p-3 rounded-2xl shadow-sm sticky top-[132px] z-10"><button onClick={() => setEditingItem(null)} className="flex items-center gap-2 px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"><ArrowLeft className="w-4 h-4"/> Back</button><button onClick={() => saveItem(editingItem)} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white font-bold rounded-xl"><CheckCircle className="w-4 h-4"/> Apply</button></div>
             <EditorCard title="Details">
                <div className="space-y-4">
                   <AdminInput label="Title / Name *" value={editingItem.title || editingItem.name || ''} onChange={e=>setEditingItem(p=>({...p, title: e.target.value, name: e.target.value}))} />
                   <AdminTextarea label="Description / Details" value={editingItem.description || ''} onChange={e=>setEditingItem(p=>({...p, description: e.target.value}))} />
                </div>
             </EditorCard>
          </motion.div>
        )}
      </AnimatePresence>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default CoursesEditor;
