import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Upload, X, Search } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';

const CampusFacilitiesEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', content: '', facilities: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const page = await cmsService.getPage('academics');
      const section = page.sections?.find(s => s.sectionKey === 'academics.facilities');
      if (section && section.content) {
        setForm(section.content);
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
      await cmsService.updateSection('academics.facilities', form);
      toast({ type: 'success', title: 'Changes published' });
    } catch (err) {
      toast({ type: 'error', title: 'Failed to save' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = handleSave;

  const addFacility = () => {
    const defaultCat = activeCategory !== 'All' ? activeCategory : 'Labs';
    change('facilities', [{ id: Date.now(), title: '', category: defaultCat, description: '', images: [] }, ...(form.facilities || [])]);
  };
  
  const updateFacility = (idx, f, v) => {
    const list = [...(form.facilities || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('facilities', list);
  };
  
  const removeFacility = (idx) => change('facilities', (form.facilities || []).filter((_, i) => i !== idx));

  const handleImageUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'academics', 'facility');
      const list = [...(form.facilities || [])];
      list[idx] = { ...list[idx], images: [...(list[idx].images || []), rec.url] };
      change('facilities', list);
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };

  const removeImage = (fIdx, imgIdx) => {
    const list = [...(form.facilities || [])];
    list[fIdx].images = list[fIdx].images.filter((_, i) => i !== imgIdx);
    change('facilities', list);
  };

  const categories = ['All', ...new Set((form.facilities || []).map(f => f.category).filter(Boolean))];

  const filteredFacilities = (form.facilities || []).map((f, i) => ({ ...f, _originalIndex: i })).filter(f => {
    const matchesSearch = (f.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <EditorPage
      title="Campus Facilities"
      description="Manage the university's laboratories, libraries, hostels, and other infrastructure."
      breadcrumb={['Admin', 'Academics', 'Campus Facilities']}
      onSave={handleSave}
      onPublish={handlePublish}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <div className="space-y-6">
        <EditorCard title="Page Header" description="Main title and introductory paragraph for the facilities page.">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
            <AdminTextarea label="Introduction Text" value={form.content || ''} onChange={e => change('content', e.target.value)} rows={3} />
          </div>
        </EditorCard>

        <EditorCard title="Facilities Database">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 -mb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" placeholder="Search facilities..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-48"
                />
              </div>
              <button onClick={addFacility} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-amber-600 rounded-lg hover:bg-primary-100 font-semibold text-sm whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Facility
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFacilities.map((facility) => {
              const idx = facility._originalIndex;
              return (
                <div key={facility.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:border-blue-300 transition-colors relative">
                  <div className="p-5 border-b border-slate-100 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <AdminInput label="Facility Name" value={facility.title} onChange={e => updateFacility(idx, 'title', e.target.value)} />
                        <AdminInput label="Category (e.g. Labs, Library)" value={facility.category} onChange={e => updateFacility(idx, 'category', e.target.value)} />
                      </div>
                      <button onClick={() => removeFacility(idx)} className="p-2 bg-white border border-slate-200 text-amber-500 rounded-lg hover:bg-primary-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <AdminTextarea label="Description" value={facility.description} onChange={e => updateFacility(idx, 'description', e.target.value)} rows={3} />
                  </div>
                  
                  <div className="p-4 bg-slate-50">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Facility Gallery Images</label>
                    <div className="flex flex-wrap gap-3">
                      {(facility.images || []).map((img, imgIdx) => (
                        <div key={imgIdx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group/img">
                          <img src={img} alt="Facility" className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(idx, imgIdx)} className="absolute top-1 right-1 p-1 bg-amber-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-white hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-semibold">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(idx, e.target.files[0])} />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default CampusFacilitiesEditor;
