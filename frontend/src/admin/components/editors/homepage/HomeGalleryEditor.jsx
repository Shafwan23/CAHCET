import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const HomeGalleryEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    visible: true,
    title: 'Life at CAHCET',
    subtitle: 'Visual Tour',
    images: [
      { url: 'https://images.unsplash.com/photo-1523050338691-c1e53d076efd?auto=format&fit=crop&w=800', title: 'Main Block' },
      { url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800', title: 'Campus View' },
      { url: 'https://images.unsplash.com/photo-1498243639359-2ceeae4b0c67?auto=format&fit=crop&w=800', title: 'Library' },
      { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800', title: 'Workshop' },
      { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800', title: 'Graduation Day' },
      { url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800', title: 'Smart Class' }
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

        if (map['home.gallery']) {
          setForm(JSON.parse(map['home.gallery'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Gallery data.' });
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
      if (sectionsMap['home.gallery']) {
        await cmsService.updateSection(sectionsMap['home.gallery'].id, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'home.gallery',
          title: 'Homepage Gallery',
          content
        });
        setSectionsMap(prev => ({ ...prev, 'home.gallery': newSec.data }));
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Gallery changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Gallery data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      visible: true,
      title: 'Life at CAHCET',
      subtitle: 'Visual Tour',
      images: [
        { url: 'https://images.unsplash.com/photo-1523050338691-c1e53d076efd?auto=format&fit=crop&w=800', title: 'Main Block' },
        { url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800', title: 'Campus View' },
        { url: 'https://images.unsplash.com/photo-1498243639359-2ceeae4b0c67?auto=format&fit=crop&w=800', title: 'Library' },
        { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800', title: 'Workshop' },
        { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800', title: 'Graduation Day' },
        { url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800', title: 'Smart Class' }
      ]
    });
    toast({ type: 'info', title: 'Reset', message: 'Gallery section reverted to defaults.' });
  };

  const addImage = () => {
    change('images', [...(form.images || []), { url: '', title: '' }]);
  };

  const removeImage = (index) => {
    change('images', (form.images || []).filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    const updated = (form.images || []).map((img, i) => i === index ? { ...img, [field]: value } : img);
    change('images', updated);
  };

  const moveImage = (index, direction) => {
    const images = [...(form.images || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const [moved] = images.splice(index, 1);
    images.splice(targetIdx, 0, moved);
    change('images', images);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'homepage', 'gallery');
      updateImage(index, 'url', rec.url);
    } catch {}
    setUploading(false);
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Homepage Gallery Editor"
      description="Manage the images and texts displayed in the gallery section of the homepage."
      breadcrumb={['Admin', 'Homepage', 'Gallery']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Section Overview" description="Title and subtitle customization.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the gallery section on the homepage."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Section Title"
              value={form.title || ''}
              onChange={e => change('title', e.target.value)}
              placeholder="Life at CAHCET"
            />
            <AdminInput
              label="Section Subtitle"
              value={form.subtitle || ''}
              onChange={e => change('subtitle', e.target.value)}
              placeholder="Visual Tour"
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Gallery Images" description="Manage gallery images, titles, ordering, and uploads.">
        <div className="space-y-4">
          {(form.images || []).map((img, index) => (
            <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Image {index + 1}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => moveImage(index, -1)} disabled={index === 0} className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveImage(index, 1)} disabled={index === (form.images || []).length - 1} className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeImage(index)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <AdminInput
                    label="Image Caption/Title"
                    value={img.title || ''}
                    onChange={e => updateImage(index, 'title', e.target.value)}
                    placeholder="e.g. Graduation Day"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Image URL</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                        value={img.url || ''}
                        onChange={e => updateImage(index, 'url', e.target.value)}
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
                  {img.url ? (
                    <img src={img.url} alt={img.title} className="max-w-full max-h-full object-contain rounded" />
                  ) : (
                    <span className="text-xs text-slate-400">Preview</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addImage} 
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl text-sm font-semibold text-slate-500 hover:text-amber-500 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Gallery Image
          </button>
        </div>
      </EditorCard>

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">Images will render dynamically in a responsive grid on the <a href="/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">homepage</a>.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default HomeGalleryEditor;
