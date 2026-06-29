import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, FileText, Upload, Calendar as CalendarIcon } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { motion } from 'framer-motion';
import { ShieldAlert, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';

const AcademicCalendarEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', documents: [] });
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
      if (map['academics.calendar']) {
        setSectionId(map['academics.calendar'].id);
        setForm(JSON.parse(map['academics.calendar'].draftContent || map['academics.calendar'].content || '{}') || { title: '', documents: [] });
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
      if (sectionId || sectionsMap['academics.calendar']) {
        const targetId = sectionId || sectionsMap['academics.calendar'].id;
        await cmsService.updateSection(targetId, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'academics.calendar',
          title: 'AcademicCalendar',
          type: 'json',
          draftContent: content,
          _isSilentDraft: isSilent
        });
        setSectionId(newSec.data?.id);
        setSectionsMap(prev => ({ ...prev, ['academics.calendar']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };

  

  const addDocument = () => change('documents', [{ id: Date.now(), title: '', academicYear: '', type: 'Calendar', pdfUrl: '', description: '' }, ...(form.documents || [])]);
  const updateDocument = (idx, f, v) => {
    const list = [...(form.documents || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('documents', list);
  };
  const removeDocument = (idx) => change('documents', (form.documents || []).filter((_, i) => i !== idx));

  const handlePdfUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'academics', 'calendar-pdf');
      updateDocument(idx, 'pdfUrl', rec.url);
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };

  const years = ['All', ...new Set((form.documents || []).map(d => d.academicYear).filter(Boolean))];

  const filteredDocs = (form.documents || []).map((d, i) => ({ ...d, _origIdx: i })).filter(d => {
    const matchesSearch = (d.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === 'All' || d.academicYear === yearFilter;
    return matchesSearch && matchesYear;
  });

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'academics.calendar', form);

  return (
    <EditorPage
      title="Academic Calendars & Schedules"
      description="Manage official academic schedules, semester timetables, and calendars."
      breadcrumb={['Admin', 'Academics', 'Academic Calendar']}
      onSave={() => handleSaveDraft(false)}
      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['academics.calendar'] || {id: sectionId}); }}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">academics.calendar</div></div>
        <EditorCard title="Page Title">
          <AdminInput value={form.title || ''} onChange={e => change('title', e.target.value)} placeholder="e.g. Academic Calendars" />
        </EditorCard>

        <EditorCard title="PDF Documents Database">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 -mb-2">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${yearFilter === y ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {y === 'All' ? 'All Years' : y}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" placeholder="Search titles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 w-full md:w-48"
                />
              </div>
              <button onClick={addDocument} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 font-semibold text-sm whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Document
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => {
              const idx = doc._origIdx;
              return (
                <div key={doc.id} className="p-4 bg-white border border-slate-200 rounded-xl flex gap-4 group hover:border-indigo-300 transition-colors shadow-sm relative">
                  <div className="w-16 h-20 shrink-0 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden group/thumb">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="w-4 h-4 mb-1" />
                      <span className="text-[9px]">PDF</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={e => handlePdfUpload(idx, e.target.files[0])} />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <AdminInput value={doc.title} onChange={e => updateDocument(idx, 'title', e.target.value)} placeholder="Title (e.g. Odd Semester 2026)" />
                    <div className="grid grid-cols-2 gap-3">
                      <AdminInput value={doc.academicYear} onChange={e => updateDocument(idx, 'academicYear', e.target.value)} placeholder="Year (e.g. 2025-2026)" />
                      <AdminInput value={doc.type} onChange={e => updateDocument(idx, 'type', e.target.value)} placeholder="Type (e.g. Calendar, Timetable)" />
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={doc.pdfUrl} onChange={e => updateDocument(idx, 'pdfUrl', e.target.value)} placeholder="PDF URL..." className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono" />
                    </div>
                  </div>
                  
                  <button onClick={() => removeDocument(idx)} className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-amber-500 rounded-full hover:bg-primary-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {filteredDocs.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p>No documents found matching the filters.</p>
              </div>
            )}
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

export default AcademicCalendarEditor;
