import React, { useState, useEffect } from 'react';
import { Monitor, Upload } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const HeroEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ 
    visible: true, enableAnimations: true, showTextOverlay: true, 
    title: '', subtitle: '', description: '', 
    primaryCtaText: '', primaryCtaLink: '', 
    secondaryCtaText: '', secondaryCtaLink: '', 
    bgImageUrl: '', videoUrl: '', overlayOpacity: 60 
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('home');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['home.hero']) {
          setForm(JSON.parse(map['home.hero'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Hero data.' });
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
      if (sectionsMap['home.hero']) {
        await cmsService.updateSection(sectionsMap['home.hero'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Hero changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Hero data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ visible: true, enableAnimations: true, showTextOverlay: true, title: '', subtitle: '', description: '', primaryCtaText: '', primaryCtaLink: '', secondaryCtaText: '', secondaryCtaLink: '', bgImageUrl: '', videoUrl: '', overlayOpacity: 60 });
    toast({ type: 'info', title: 'Reset', message: 'Hero section reverted to defaults.' });
  };

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'homepage', 'hero');
      change('bgImageUrl', rec.url);
    } catch {}
    setUploading(false);
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Hero Section Editor"
      description="Manage the main landing banner on the homepage. Change texts, call-to-actions, and background media."
      breadcrumb={['Admin', 'Homepage', 'Hero Section']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Hero Visibility & Behavior" description="Core settings for the hero section.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the entire hero section on the homepage."
          />
          <AdminToggle
            label="Enable Hero Animations"
            checked={form.enableAnimations ?? true}
            onChange={v => change('enableAnimations', v)}
            hint="Play entrance animations and parallax effects."
          />
        </div>
      </EditorCard>

      <EditorCard title="Hero Content" description="The main text overlay shown on the hero banner.">
        <AdminToggle
          label="Show Text Overlay"
          checked={form.showTextOverlay ?? true}
          onChange={v => change('showTextOverlay', v)}
          hint="Display the title, subtitle, and buttons over the media background."
        />
        
        {form.showTextOverlay && (
          <div className="mt-4 space-y-4 pt-4 border-t border-slate-50">
            <AdminInput
              label="Hero Title"
              value={form.title || ''}
              onChange={e => change('title', e.target.value)}
              placeholder="Transforming Education Through Innovation"
            />
            <AdminInput
              label="Hero Subtitle"
              value={form.subtitle || ''}
              onChange={e => change('subtitle', e.target.value)}
              placeholder="Join a world-class institution..."
            />
            <AdminTextarea
              label="Hero Description (Optional)"
              value={form.description || ''}
              onChange={e => change('description', e.target.value)}
              placeholder="Provide a longer description if needed..."
              rows={3}
            />
            
            <div className="pt-4 border-t border-slate-50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Primary Call to Action (CTA)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Button Text"
                  value={form.primaryCtaText || ''}
                  onChange={e => change('primaryCtaText', e.target.value)}
                  placeholder="Apply Now"
                />
                <AdminInput
                  label="Button Link"
                  value={form.primaryCtaLink || ''}
                  onChange={e => change('primaryCtaLink', e.target.value)}
                  placeholder="/admissions"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Secondary Call to Action (Optional)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Button Text"
                  value={form.secondaryCtaText || ''}
                  onChange={e => change('secondaryCtaText', e.target.value)}
                  placeholder="Virtual Tour"
                />
                <AdminInput
                  label="Button Link"
                  value={form.secondaryCtaLink || ''}
                  onChange={e => change('secondaryCtaLink', e.target.value)}
                  placeholder="/tour"
                />
              </div>
            </div>
          </div>
        )}
      </EditorCard>

      <EditorCard title="Background Media" description="Configure the background video or image for the hero.">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Background Image</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800"
                  value={form.bgImageUrl || ''}
                  onChange={e => change('bgImageUrl', e.target.value)}
                  placeholder="URL to image..."
                />
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors shrink-0 border border-slate-200">
                <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleBackgroundUpload} disabled={uploading} />
              </label>
            </div>
            {form.bgImageUrl && (
              <div className="mt-3 aspect-[21/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                 <img src={form.bgImageUrl} alt="Hero Background" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-50">
            <AdminInput
              label="Background Video URL (Optional overrides image)"
              value={form.videoUrl || ''}
              onChange={e => change('videoUrl', e.target.value)}
              placeholder="https://example.com/video.mp4"
              hint="If provided, the video will loop in the background instead of the image."
            />
          </div>

          <div className="pt-4 border-t border-slate-50">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dark Overlay Opacity (%)</label>
            <input 
              type="range" 
              min="0" max="100" 
              value={form.overlayOpacity || 60} 
              onChange={e => change('overlayOpacity', parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="text-xs text-slate-500 text-right mt-1">{form.overlayOpacity || 60}% Opacity</div>
          </div>
        </div>
      </EditorCard>

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">After publishing, visit the <a href="/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">home page</a> to see your changes live in a responsive layout.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default HeroEditor;
