import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const FacilitiesEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    visible: true,
    title: 'Infrastructure Built for Innovation',
    subtitle: 'World-Class Campus',
    description: 'Explore our sprawling 100-acre campus designed to provide the best learning and living experience.',
    items: [
      { title: 'Smart Classrooms', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800', description: 'Digitally enabled learning spaces for interactive sessions.' },
      { title: 'Advanced Labs', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', description: 'Industry-standard labs for hands-on technical training.' },
      { title: 'Central Library', image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800', description: 'Over 50,000+ volumes and digital resources access.' },
      { title: 'Campus Hostel', image: '', description: 'Safe and comfortable residential facilities for students.' },
      { title: 'Sports Arena', image: '', description: 'Extensive sports facilities for physical development.' },
      { title: 'Cafeteria', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=800', description: 'Hygienic and diverse dining options for all.' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('home');
        setPageId(res.data?.id);
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['home.facilities']) {
          setForm(JSON.parse(map['home.facilities'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Facilities data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['home.facilities']) {
        await cmsService.updateSection(sectionsMap['home.facilities'].id, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'home.facilities',
          title: 'Campus Facilities',
          content
        });
        setSectionsMap(prev => ({ ...prev, 'home.facilities': newSec.data }));
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Facilities changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Facilities data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      visible: true,
      title: 'Infrastructure Built for Innovation',
      subtitle: 'World-Class Campus',
      description: 'Explore our sprawling 100-acre campus designed to provide the best learning and living experience.',
      items: [
        { title: 'Smart Classrooms', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800', description: 'Digitally enabled learning spaces for interactive sessions.' },
        { title: 'Advanced Labs', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', description: 'Industry-standard labs for hands-on technical training.' },
        { title: 'Central Library', image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800', description: 'Over 50,000+ volumes and digital resources access.' },
        { title: 'Campus Hostel', image: '', description: 'Safe and comfortable residential facilities for students.' },
        { title: 'Sports Arena', image: '', description: 'Extensive sports facilities for physical development.' },
        { title: 'Cafeteria', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=800', description: 'Hygienic and diverse dining options for all.' }
      ]
    });
    toast({ type: 'info', title: 'Reset', message: 'Facilities section reverted to defaults.' });
  };

  const addFacility = () => {
    change('items', [...(form.items || []), { title: '', image: '', description: '' }]);
  };

  const removeFacility = (index) => {
    change('items', (form.items || []).filter((_, i) => i !== index));
  };

  const updateFacility = (index, field, value) => {
    const updated = (form.items || []).map((fac, i) => i === index ? { ...fac, [field]: value } : fac);
    change('items', updated);
  };

  const moveFacility = (index, direction) => {
    const items = [...(form.items || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const [moved] = items.splice(index, 1);
    items.splice(targetIdx, 0, moved);
    change('items', items);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'homepage', 'facilities');
      updateFacility(index, 'image', rec.url);
    } catch {}
    setUploading(false);
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Homepage Facilities Editor"
      description="Manage the campus facilities shown on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Facilities']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Section Overview" description="Manage the section texts.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the facilities section on the homepage."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Section Title"
              value={form.title || ''}
              onChange={e => change('title', e.target.value)}
              placeholder="Infrastructure Built for Innovation"
            />
            <AdminInput
              label="Section Subtitle"
              value={form.subtitle || ''}
              onChange={e => change('subtitle', e.target.value)}
              placeholder="World-Class Campus"
            />
          </div>
          <AdminTextarea
            label="Section Description"
            value={form.description || ''}
            onChange={e => change('description', e.target.value)}
            placeholder="Explore our sprawling..."
            rows={3}
          />
        </div>
      </EditorCard>

      <EditorCard title="Facilities Items" description="Add, remove, reorder and upload images for facility cards.">
        <div className="space-y-4">
          {(form.items || []).map((fac, index) => (
            <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Facility {index + 1}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => moveFacility(index, -1)} disabled={index === 0} className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveFacility(index, 1)} disabled={index === (form.items || []).length - 1} className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFacility(index)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <AdminInput
                    label="Facility Title"
                    value={fac.title || ''}
                    onChange={e => updateFacility(index, 'title', e.target.value)}
                    placeholder="e.g. Central Library"
                  />
                  <AdminTextarea
                    label="Facility Description"
                    value={fac.description || ''}
                    onChange={e => updateFacility(index, 'description', e.target.value)}
                    placeholder="Provide details..."
                    rows={2}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Image URL</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                        value={fac.image || ''}
                        onChange={e => updateFacility(index, 'image', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer hover:bg-slate-200 border border-slate-200 shrink-0">
                        <Upload className="w-3.5 h-3.5" /> Upload
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, index)} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center border border-dashed border-slate-200 rounded-xl p-2 bg-white aspect-video relative overflow-hidden">
                  {fac.image ? (
                    <img src={fac.image} alt={fac.title} className="max-w-full max-h-full object-contain rounded" />
                  ) : (
                    <span className="text-xs text-slate-400">Preview (falls back to local default image if empty)</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addFacility} 
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl text-sm font-semibold text-slate-500 hover:text-amber-500 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Facility
          </button>
        </div>
      </EditorCard>

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">Facilities will render dynamically in a responsive grid on the <a href="/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">homepage</a>.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default FacilitiesEditor;
