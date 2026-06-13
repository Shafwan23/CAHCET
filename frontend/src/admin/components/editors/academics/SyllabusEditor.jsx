import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, FileText, Upload, BookOpen } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { fileService } from '../../../services/fileService';
import { DEPARTMENTS } from '../../../services/departmentService';

const SyllabusEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', items: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [deptFilter, setDeptFilter] = useState('All');
  const [regFilter, setRegFilter] = useState('All');
  const [semFilter, setSemFilter] = useState('All');

  const [sectionId, setSectionId] = useState(null);
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const page = await cmsService.getPage('academics');
      setPageId(page.data?.id);
      const section = page.data?.sections?.find(s => s.sectionKey === 'academics.syllabus');
      if (section) {
        setSectionId(section.id);
        if (section.content) {
          setForm(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
        }
      }
    } catch (err) {
      toast({ type: 'error', title: 'Failed to load data' });
    } finally {
      setPageLoading(false);
    }
  };

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionId) {
        await cmsService.updateSection(sectionId, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'academics.syllabus',
          title: 'Syllabus Archive',
          content
        });
        setSectionId(newSec.data?.id);
      }
      toast({ type: 'success', title: 'Changes published' });
    } catch (err) {
      toast({ type: 'error', title: 'Failed to save' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = handleSave;

  const addItem = () => change('items', [{ id: Date.now(), department: 'CSE', regulation: '2021', semester: '1', course: '', pdfUrl: '', description: '' }, ...(form.items || [])]);
  const updateItem = (idx, f, v) => {
    const list = [...(form.items || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('items', list);
  };
  const removeItem = (idx) => change('items', (form.items || []).filter((_, i) => i !== idx));

  const handlePdfUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'academics', 'syllabus');
      updateItem(idx, 'pdfUrl', rec.url);
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };

  // Unique values for filters
  const depts = ['All', ...new Set((form.items || []).map(i => i.department).filter(Boolean))].sort();
  const regs = ['All', ...new Set((form.items || []).map(i => i.regulation).filter(Boolean))].sort().reverse();
  const sems = ['All', ...new Set((form.items || []).map(i => i.semester).filter(Boolean))].sort((a,b) => Number(a)-Number(b));

  const filteredItems = (form.items || []).map((item, i) => ({ ...item, _origIdx: i })).filter(item => {
    const searchMatch = (item.course || '').toLowerCase().includes(searchTerm.toLowerCase());
    const deptMatch = deptFilter === 'All' || item.department === deptFilter;
    const regMatch = regFilter === 'All' || item.regulation === regFilter;
    const semMatch = semFilter === 'All' || item.semester === semFilter;
    return searchMatch && deptMatch && regMatch && semMatch;
  });

  return (
    <EditorPage
      title="Syllabus Archive"
      description="Manage the central syllabus repository across all departments, regulations, and semesters."
      breadcrumb={['Admin', 'Academics', 'Syllabus Archive']}
      onSave={handleSave}
      onPublish={handlePublish}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <div className="space-y-6">
        <EditorCard title="Syllabus Database">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-700">Filter & Search Matrix</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Department</label>
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
                  {depts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Regulation Year</label>
                <select value={regFilter} onChange={e => setRegFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
                  {regs.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Semester</label>
                <select value={semFilter} onChange={e => setSemFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
                  {sems.map(s => <option key={s} value={s}>{s === 'All' ? 'All' : `Sem ${s}`}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Search Course</label>
                <input 
                  type="text" placeholder="Course name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-500 font-medium">Showing {filteredItems.length} records</p>
            <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-sm transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add Syllabus Record
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const idx = item._origIdx;
              return (
                <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-xl flex gap-4 group hover:border-blue-400 transition-colors shadow-sm relative">
                  <div className="w-16 h-20 shrink-0 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center relative overflow-hidden group/thumb">
                    <FileText className="w-8 h-8 text-blue-300" />
                    <label className="absolute inset-0 bg-blue-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                      <Upload className="w-4 h-4 mb-1" />
                      <span className="text-[9px]">PDF</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={e => handlePdfUpload(idx, e.target.files[0])} />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <select value={item.department} onChange={e => updateItem(idx, 'department', e.target.value)} className="col-span-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs">
                        <option value="">Dept</option>
                        {Object.values(DEPARTMENTS).map(d => <option key={d.key} value={d.short}>{d.short}</option>)}
                      </select>
                      <input type="text" value={item.regulation} onChange={e => updateItem(idx, 'regulation', e.target.value)} placeholder="Reg (e.g. 2021)" className="col-span-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs" />
                      <input type="number" min="1" max="8" value={item.semester} onChange={e => updateItem(idx, 'semester', e.target.value)} placeholder="Sem (1-8)" className="col-span-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs" />
                    </div>
                    <input type="text" value={item.course} onChange={e => updateItem(idx, 'course', e.target.value)} placeholder="Course Name (e.g. Programming in C)" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800" />
                    <div className="flex gap-2">
                      <input type="text" value={item.pdfUrl} onChange={e => updateItem(idx, 'pdfUrl', e.target.value)} placeholder="PDF URL..." className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-500" />
                    </div>
                  </div>
                  
                  <button onClick={() => removeItem(idx)} className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-amber-500 rounded-full hover:bg-primary-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            
            {filteredItems.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center">
                <BookOpen className="w-10 h-10 text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-700">No Syllabus Records</h4>
                <p className="text-sm mt-1 max-w-sm">No syllabus records match your current filter matrix. Adjust your filters or add a new record.</p>
              </div>
            )}
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default SyllabusEditor;
