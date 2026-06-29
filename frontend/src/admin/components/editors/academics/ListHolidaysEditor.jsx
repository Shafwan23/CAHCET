import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Calendar as CalendarIcon } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { motion } from 'framer-motion';
import { ShieldAlert, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput } from '../../ui/AdminInput';

const ListHolidaysEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', holidays: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [previewSection, setPreviewSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

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
      if (map['academics.holidays']) {
        setSectionId(map['academics.holidays'].id);
        setForm(JSON.parse(map['academics.holidays'].draftContent || map['academics.holidays'].content || '{}') || { title: '', holidays: [] });
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
      if (sectionId || sectionsMap['academics.holidays']) {
        const targetId = sectionId || sectionsMap['academics.holidays'].id;
        await cmsService.updateSection(targetId, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'academics.holidays',
          title: 'ListHolidays',
          type: 'json',
          draftContent: content,
          _isSilentDraft: isSilent
        });
        setSectionId(newSec.data?.id);
        setSectionsMap(prev => ({ ...prev, ['academics.holidays']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };

  

  const addHoliday = () => {
    const today = new Date().toISOString().split('T')[0];
    change('holidays', [{ id: Date.now(), name: '', date: today, day: '', category: 'National', description: '' }, ...(form.holidays || [])]);
  };
  const updateHoliday = (idx, f, v) => {
    const list = [...(form.holidays || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('holidays', list);
  };
  const removeHoliday = (idx) => change('holidays', (form.holidays || []).filter((_, i) => i !== idx));

  // Extract years from dates (e.g. "2026-01-26" -> "2026")
  const years = ['All', ...new Set((form.holidays || []).map(h => h.date ? h.date.split('-')[0] : null).filter(Boolean))].sort().reverse();

  const filteredHolidays = (form.holidays || []).map((h, i) => ({ ...h, _origIdx: i })).filter(h => {
    const matchesSearch = (h.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const year = h.date ? h.date.split('-')[0] : null;
    const matchesYear = yearFilter === 'All' || year === yearFilter;
    return matchesSearch && matchesYear;
  });

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'academics.holidays', form);

  return (
    <EditorPage
      title="List of Holidays"
      description="Manage the official list of holidays observed by the institution."
      breadcrumb={['Admin', 'Academics', 'List of Holidays']}
      onSave={() => handleSaveDraft(false)}
      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['academics.holidays'] || {id: sectionId}); }}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">academics.holidays</div></div>
        <EditorCard title="Page Title">
          <AdminInput value={form.title || ''} onChange={e => change('title', e.target.value)} placeholder="e.g. Official Holidays" />
        </EditorCard>

        <EditorCard title="Holiday Database">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 -mb-2">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${yearFilter === y ? 'bg-amber-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {y === 'All' ? 'All Years' : y}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" placeholder="Search holidays..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 w-full md:w-48"
                />
              </div>
              <button onClick={addHoliday} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-amber-600 rounded-lg hover:bg-primary-100 font-semibold text-sm whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Holiday
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Holiday Name</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredHolidays.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No holidays found.</td></tr>
                ) : (
                  filteredHolidays.map((h) => {
                    const idx = h._origIdx;
                    return (
                      <tr key={h.id} className="hover:bg-slate-50/50 group">
                        <td className="p-2"><input type="text" value={h.name} onChange={e => updateHoliday(idx, 'name', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500" placeholder="Name" /></td>
                        <td className="p-2"><input type="date" value={h.date} onChange={e => updateHoliday(idx, 'date', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 text-slate-600" /></td>
                        <td className="p-2"><input type="text" value={h.day} onChange={e => updateHoliday(idx, 'day', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500" placeholder="e.g. Monday" /></td>
                        <td className="p-2"><input type="text" value={h.category} onChange={e => updateHoliday(idx, 'category', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500" placeholder="Category" /></td>
                        <td className="p-2"><input type="text" value={h.description} onChange={e => updateHoliday(idx, 'description', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500" placeholder="Optional desc..." /></td>
                        <td className="p-2 text-center">
                          <button onClick={() => removeHoliday(idx)} className="p-1.5 text-amber-400 hover:bg-primary-50 hover:text-amber-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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

export default ListHolidaysEditor;
