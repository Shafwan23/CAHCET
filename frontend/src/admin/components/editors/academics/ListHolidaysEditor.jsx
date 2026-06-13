import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Calendar as CalendarIcon } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput } from '../../ui/AdminInput';

const ListHolidaysEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', holidays: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  const [sectionId, setSectionId] = useState(null);
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const page = await cmsService.getPage('academics');
      setPageId(page.data?.id);
      const section = page.data?.sections?.find(s => s.sectionKey === 'academics.holidays');
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
          sectionKey: 'academics.holidays',
          title: 'List of Holidays',
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

  return (
    <EditorPage
      title="List of Holidays"
      description="Manage the official list of holidays observed by the institution."
      breadcrumb={['Admin', 'Academics', 'List of Holidays']}
      onSave={handleSave}
      onPublish={handlePublish}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <div className="space-y-6">
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
    </EditorPage>
  );
};

export default ListHolidaysEditor;
