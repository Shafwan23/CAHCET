import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, CheckCircle, ArrowLeft, Shield, Users, AlertTriangle, Monitor, UploadCloud } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { antiRaggingData } from '../../../../data/antiRagging';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const AntiRaggingEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    committee: antiRaggingData.committee.map(c => ({ id: `c_${Date.now()}_${Math.random()}`, ...c })),
    squads: antiRaggingData.squads.map(s => ({ id: `s_${Date.now()}_${Math.random()}`, ...s })),
    members: antiRaggingData.generalCommittee.map(m => ({ id: `m_${Date.now()}_${Math.random()}`, ...m })),
    instructions: antiRaggingData.instructions || [],
    objectives: antiRaggingData.objectives || [],
    functions: antiRaggingData.functions || []
  });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  const [activeTab, setActiveTab] = useState('committee'); // 'committee', 'squads', 'members'
  const [search, setSearch] = useState('');

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('about');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['about.anti_ragging']) {
        const parsed = JSON.parse(map['about.anti_ragging'].draftContent || map['about.anti_ragging'].content || '{}');
        if(parsed.committee) setForm(parsed);
      }
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load Anti Ragging data.' }); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false, newForm = null) => {
    setLoading(true);
    try {
      const content = JSON.stringify(newForm || form);
      if (sectionsMap['about.anti_ragging']) {
        await cmsService.updateSection(sectionsMap['about.anti_ragging'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({ pageId, sectionKey: 'about.anti_ragging', title: 'Anti Ragging Policy', type: 'json', draftContent: content, _isSilentDraft: isSilent });
        setSectionsMap(prev => ({ ...prev, 'about.anti_ragging': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const updateField = (listName, index, field, value) => {
    const newList = [...form[listName]];
    newList[index] = { ...newList[index], [field]: value };
    const newForm = { ...form, [listName]: newList };
    setForm(newForm);
    handleSaveDraft(true, newForm);
  };
  const addRow = (listName) => {
    const newForm = { ...form, [listName]: [...form[listName], { id: `${listName}_${Date.now()}`, name: '', designation: '', role: '', department: '', phone: '' }] };
    setForm(newForm); handleSaveDraft(true, newForm);
  };
  const removeRow = (listName, index) => {
    const newList = form[listName].filter((_, i) => i !== index);
    const newForm = { ...form, [listName]: newList };
    setForm(newForm); handleSaveDraft(true, newForm);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'about.anti_ragging', form);
  const currentList = form[activeTab] || [];
  const filtered = currentList.filter(item => (item.name || '').toLowerCase().includes(search.toLowerCase()) || (item.department || '').toLowerCase().includes(search.toLowerCase()));

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage title="Anti Ragging Policy" description="Manage the Anti Ragging Committee, Squads, and General Members." breadcrumb={['Admin', 'About', 'Anti Ragging']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['about.anti_ragging']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <AnimatePresence mode="wait">
        <motion.div key="main" {...fadeUp} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border bg-red-50 text-red-700 border-red-100 relative overflow-hidden"><Shield className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">Committee Members</span><span className="text-3xl font-extrabold">{form.committee.length}</span></div>
            <div className="p-5 rounded-2xl border bg-amber-50 text-amber-700 border-amber-100 relative overflow-hidden"><AlertTriangle className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">Anti-Ragging Squads</span><span className="text-3xl font-extrabold">{form.squads.length}</span></div>
            <div className="p-5 rounded-2xl border bg-blue-50 text-blue-700 border-blue-100 relative overflow-hidden"><Users className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">General Members</span><span className="text-3xl font-extrabold">{form.members.length}</span></div>
            <div className="p-5 rounded-2xl border bg-emerald-50 text-emerald-700 border-emerald-100 relative overflow-hidden"><CheckCircle className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">Policies Active</span><span className="text-3xl font-extrabold">3</span></div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[132px] z-20 shadow-sm">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button onClick={() => setActiveTab('committee')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'committee' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}>Committee</button>
              <button onClick={() => setActiveTab('squads')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'squads' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}>Squads</button>
              <button onClick={() => setActiveTab('members')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'members' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}>General Members</button>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 max-w-xs"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} /></div>
              <button onClick={() => addRow(activeTab)} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800"><Plus className="w-4 h-4" /> Add Row</button>
            </div>
          </div>

          <EditorCard title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Roster`} description="Manage personnel for this section.">
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <div className="w-full overflow-x-auto">
<table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3 w-16 text-center">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <AnimatePresence>
                    {filtered.length === 0 ? <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-medium">No records found.</td></tr> : filtered.map((item, i) => {
                      const origIndex = form[activeTab].findIndex(x => x.id === item.id);
                      return (
                        <motion.tr layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2"><input type="text" value={item.name} onChange={e => updateField(activeTab, origIndex, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20" placeholder="Name" /></td>
                          <td className="p-2"><input type="text" value={item.designation} onChange={e => updateField(activeTab, origIndex, 'designation', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20" placeholder="Designation" /></td>
                          <td className="p-2"><input type="text" value={item.role} onChange={e => updateField(activeTab, origIndex, 'role', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20" placeholder="Role" /></td>
                          <td className="p-2"><input type="text" value={item.department} onChange={e => updateField(activeTab, origIndex, 'department', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20" placeholder="Department" /></td>
                          <td className="p-2"><input type="text" value={item.phone} onChange={e => updateField(activeTab, origIndex, 'phone', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20" placeholder="Phone" /></td>
                          <td className="p-2 text-center"><button onClick={() => removeRow(activeTab, origIndex)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
</div>
            </div>
          </EditorCard>
        </motion.div>
      </AnimatePresence>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default AntiRaggingEditor;
