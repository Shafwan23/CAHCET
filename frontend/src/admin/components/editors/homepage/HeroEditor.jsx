import React, { useState, useEffect } from 'react';
import { Monitor, Upload } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

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
  const [previewSection, setPreviewSection] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('home');
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['home.hero']) {
        const dataStr = map['home.hero'].draftContent || map['home.hero'].content || '{}';
        setForm(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Hero data.' });
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
      if (sectionsMap['home.hero']) {
        await cmsService.updateSection(sectionsMap['home.hero'].id, { draftContent: JSON.stringify(form), _isSilentDraft: isSilent });
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Hero changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Hero draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true); // silent save draft
    const res = await cmsService.getPage('home');
    const updatedHero = res.data.sections.find(s => s.sectionKey === 'home.hero');
    setPreviewSection(updatedHero);
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

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.hero', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Hero Section Editor"
      description="Manage the main landing banner on the homepage. Change texts, call-to-actions, and background media."
      breadcrumb={['Admin', 'Homepage', 'Hero Section']}
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
        </div>

        {/* Live Preview Panel */}
        <div className="xl:col-span-4">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Monitor className="w-4 h-4" /> Live Preview</h3>
            
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
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

              <div className="relative aspect-[4/5] sm:aspect-video xl:aspect-[3/4] bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-center p-6">
                {form.bgImageUrl && (
                  <img src={form.bgImageUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" style={{ opacity: 1 - (form.overlayOpacity || 60) / 100 }} />
                )}
                {form.showTextOverlay && (
                  <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-white font-bold text-2xl leading-tight mb-2 drop-shadow-md">{form.title || 'Hero Title'}</h3>
                    <p className="text-white/90 text-xs mb-6 max-w-[80%] drop-shadow">{form.subtitle || 'Hero Subtitle'}</p>
                    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-[200px]">
                      {form.primaryCtaText && (
                        <div className="px-4 py-2 bg-amber-500 text-slate-900 text-[10px] font-bold rounded shadow-sm w-full">{form.primaryCtaText}</div>
                      )}
                      {form.secondaryCtaText && (
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold rounded shadow-sm w-full">{form.secondaryCtaText}</div>
                      )}
                    </div>
                  </div>
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

export default HeroEditor;
