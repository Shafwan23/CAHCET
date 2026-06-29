import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Upload, CheckCircle, ArrowLeft, X, UserCircle, Briefcase, GraduationCap, BarChart3, TrendingUp, Monitor, Filter, UploadCloud } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { PLACEMENT_TYPES, createEmptyPlacement } from '../../../services/placementsService';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const StudentCard = ({ item, onEdit, onDelete }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -4 }} className="group bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-slate-300 transition-all p-5 rounded-[24px] flex flex-col relative overflow-hidden">
    <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-10 bg-emerald-500 pointer-events-none" />
    <div className="flex gap-4 items-center mb-4 relative z-10">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
        <UserCircle className="w-8 h-8" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 leading-tight">{item.studentName || 'Unknown Student'}</h4>
        <span className="text-xs font-bold text-slate-500">{item.department || 'Any Dept'}</span>
      </div>
    </div>
    <div className="space-y-2 mb-4 relative z-10 flex-1">
      <div className="flex items-center gap-2 text-sm text-slate-600"><Briefcase className="w-4 h-4 text-slate-400" /> <b>{item.companyName || 'No Company'}</b></div>
      <div className="flex items-center gap-2 text-sm text-slate-600"><BarChart3 className="w-4 h-4 text-slate-400" /> <span className="px-2 py-0.5 bg-green-50 text-green-700 font-bold rounded-md">{item.package || 'TBD'} LPA</span></div>
      <div className="flex items-center gap-2 text-xs text-slate-500"><GraduationCap className="w-4 h-4 text-slate-400" /> Batch: {item.year || 'N/A'}</div>
    </div>
    <div className="mt-auto pt-4 flex items-center gap-2 border-t border-slate-100/60 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 relative z-10">
      <button onClick={() => onEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"><Pencil className="w-3.5 h-3.5" /> Edit</button>
      <button onClick={() => onDelete(item)} className="w-10 flex items-center justify-center py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  </motion.div>
);

const StudentsPlacedEditor = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [editingItem, setEditingItem] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('placements');
      setPageId(res.data?.id);
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);
      if (map['placements.students']) setItems(JSON.parse(map['placements.students'].draftContent || map['placements.students'].content || '[]'));
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load data.' }); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false, newItems = null) => {
    setLoading(true);
    try {
      const content = JSON.stringify(newItems || items);
      if (sectionsMap['placements.students']) {
        await cmsService.updateSection(sectionsMap['placements.students'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({ pageId, sectionKey: 'placements.students', title: 'Students Placed', type: 'json', draftContent: content, _isSilentDraft: isSilent });
        setSectionsMap(prev => ({ ...prev, 'placements.students': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: 'Students list saved to draft.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const saveItem = (updatedItem) => {
    let newItems;
    if (!updatedItem.id) { updatedItem.id = `students_${Date.now()}`; newItems = [updatedItem, ...items]; }
    else newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
    setItems(newItems); setEditingItem(null); handleSaveDraft(true, newItems);
  };

  const deleteItem = (itemToDelete) => {
    if (!window.confirm('Delete student?')) return;
    const newItems = items.filter(i => i.id !== itemToDelete.id);
    setItems(newItems); handleSaveDraft(true, newItems);
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
       toast({ type: 'info', title: 'Bulk Upload', message: 'CSV parser would process here in full impl.' });
    }
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'placements.students', items);
  const filtered = useMemo(() => items.filter(i => {
    const s = search.toLowerCase();
    return ((i.studentName||'').toLowerCase().includes(s) || (i.companyName||'').toLowerCase().includes(s)) &&
           (deptFilter === 'All' || i.department === deptFilter) &&
           (yearFilter === 'All' || i.year === yearFilter);
  }), [items, search, deptFilter, yearFilter]);

  const metrics = useMemo(() => ({
    total: items.length,
    avgPackage: (items.reduce((acc, i) => acc + (parseFloat(i.package)||0), 0) / (items.length||1)).toFixed(1),
    highest: Math.max(...items.map(i => parseFloat(i.package)||0), 0)
  }), [items]);

  if (loading && !items.length) return <div>Loading...</div>;

  return (
    <EditorPage title="Students Placed" description="Manage individual placement records, offers, and packages." breadcrumb={['Admin', 'Placements CRM', 'Students Placed']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['placements.students']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <AnimatePresence mode="wait">
        {!editingItem ? (
          <motion.div key="list" {...fadeUp} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border bg-blue-50 text-blue-700 border-blue-100"><span className="text-[10px] font-bold uppercase block mb-1">Total Placed</span><span className="text-3xl font-extrabold">{metrics.total}</span></div>
              <div className="p-5 rounded-2xl border bg-emerald-50 text-emerald-700 border-emerald-100"><span className="text-[10px] font-bold uppercase block mb-1">Avg. Package</span><span className="text-3xl font-extrabold">{metrics.avgPackage} LPA</span></div>
              <div className="p-5 rounded-2xl border bg-amber-50 text-amber-700 border-amber-100"><span className="text-[10px] font-bold uppercase block mb-1">Highest Package</span><span className="text-3xl font-extrabold">{metrics.highest} LPA</span></div>
              <div className="p-5 rounded-2xl border bg-purple-50 text-purple-700 border-purple-100"><span className="text-[10px] font-bold uppercase block mb-1">Success Rate</span><span className="text-3xl font-extrabold">94%</span></div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[132px] z-20">
              <div className="flex-1 flex gap-3 w-full">
                <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <select className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}><option value="All">All Departments</option><option value="CSE">CSE</option><option value="IT">IT</option></select>
                <select className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white" value={yearFilter} onChange={e => setYearFilter(e.target.value)}><option value="All">All Years</option><option value="2024">2024</option><option value="2023">2023</option></select>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl cursor-pointer hover:bg-slate-200"><UploadCloud className="w-4 h-4"/> CSV<input type="file" className="hidden" accept=".csv" onChange={handleBulkUpload} /></label>
                <button onClick={() => setEditingItem(createEmptyPlacement(PLACEMENT_TYPES.STUDENTS))} className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600"><Plus className="w-4 h-4" /> Add Student</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <AnimatePresence>{filtered.map(item => <StudentCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteItem} />)}</AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div key="editor" {...fadeUp} className="space-y-6">
             <div className="flex items-center justify-between mb-4 bg-white/80 p-3 rounded-2xl shadow-sm sticky top-[132px] z-10"><button onClick={() => setEditingItem(null)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"><ArrowLeft className="w-4 h-4"/> Back</button><button onClick={() => saveItem(editingItem)} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800"><CheckCircle className="w-4 h-4"/> Apply</button></div>
             <EditorCard title="Student Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <AdminInput label="Student Name *" value={editingItem.studentName} onChange={e=>setEditingItem(p=>({...p, studentName: e.target.value}))} />
                   <AdminInput label="Company Name *" value={editingItem.companyName} onChange={e=>setEditingItem(p=>({...p, companyName: e.target.value}))} />
                   <AdminInput label="Package (LPA)" type="number" value={editingItem.package} onChange={e=>setEditingItem(p=>({...p, package: e.target.value}))} />
                   <div><label className="block text-xs font-bold mb-1.5 text-slate-600 uppercase">Department</label><select className="w-full px-3 py-2.5 border rounded-xl" value={editingItem.department} onChange={e=>setEditingItem(p=>({...p, department:e.target.value}))}><option value="">Select</option><option value="CSE">CSE</option><option value="IT">IT</option></select></div>
                   <AdminInput label="Passing Year" value={editingItem.year} onChange={e=>setEditingItem(p=>({...p, year: e.target.value}))} />
                </div>
             </EditorCard>
          </motion.div>
        )}
      </AnimatePresence>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default StudentsPlacedEditor;
