import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Upload, Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const HomeGalleryEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    visible: true, title: 'Life at CAHCET', subtitle: 'Visual Tour', images: []
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('home');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['home.gallery']) {
        const dataStr = map['home.gallery'].draftContent || map['home.gallery'].content || '{}';
        setForm(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Gallery data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['home.gallery']) {
        await cmsService.updateSection(sectionsMap['home.gallery'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId, sectionKey: 'home.gallery', title: 'Homepage Gallery', draftContent: content, _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'home.gallery': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Gallery changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Gallery draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    const res = await cmsService.getPage('home');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'home.gallery');
    setPreviewSection(updatedSec);
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

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.gallery', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Homepage Gallery Editor"
      description="Manage the images and texts displayed in the gallery section of the homepage."
      breadcrumb={['Admin', 'Homepage', 'Gallery']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
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
          <AnimatePresence>
          {(form.images || []).map((img, index) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={`img-${index}-${img.url}`} 
              className="p-4 bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow rounded-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Image {index + 1}</span>
                </div>
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
                    <img loading="lazy" decoding="async" src={img.url} alt={img.title} className="max-w-full max-h-full object-contain rounded" />
                  ) : (
                    <span className="text-xs text-slate-400">Preview</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>

          <button 
            type="button" 
            onClick={addImage} 
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl text-sm font-semibold text-slate-500 hover:text-amber-500 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Gallery Image
          </button>
        </div>
      </EditorCard>
        </div>

        {/* Lightweight Preview Card */}
        <div className="xl:col-span-4">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Monitor className="w-4 h-4" /> Live Preview</h3>
            
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
              {/* Browser/Device Chrome */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono flex-1 max-w-[200px] text-center truncate shadow-sm">
                  cahcet.edu.in
                </div>
              </div>

              {/* Preview Content */}
              <div className="bg-slate-50 p-6 text-center">
              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">{form.subtitle || 'Visual Tour'}</h4>
              <h3 className="text-xl font-bold text-slate-800 mb-6">{form.title || 'Life at CAHCET'}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(form.images || []).slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-xl overflow-hidden relative group">
                    {img.url ? (
                      <img loading="lazy" decoding="async" src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Empty</div>
                    )}
                    {img.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-white text-[10px] font-semibold truncate w-full text-left">{img.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {(form.images || []).length > 4 && (
                <button className="mt-6 px-5 py-2 border-2 border-amber-500 text-amber-600 font-bold text-xs rounded-xl uppercase tracking-wider hover:bg-amber-50 transition-colors">
                  View All {(form.images || []).length} Photos
                </button>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>

      {previewSection && (
        <SectionPreviewModal 
          section={previewSection}
          onClose={() => setPreviewSection(null)}
          onPublish={async (sec) => {
            await cmsService.publishSection(sec.id);
            setPreviewSection(null);
            fetchPage();
            toast({ type: 'success', title: 'Live', message: 'Changes pushed to production.' });
          }}
          onRestore={() => fetchPage()}
        />
      )}
    </EditorPage>
  );
};

export default HomeGalleryEditor;
