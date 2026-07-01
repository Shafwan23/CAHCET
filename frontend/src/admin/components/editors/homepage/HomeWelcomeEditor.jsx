import React, { useState, useEffect } from 'react';
import { Monitor, Upload } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const HomeWelcomeEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    visible: true,
    title: 'Welcome to CAHCET',
    subtitle: 'A Legacy of Excellence',
    principalName: '',
    principalTitle: 'Principal',
    description: '',
    principalImage: ''
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

      if (map['home.welcome']) {
        const dataStr = map['home.welcome'].draftContent || map['home.welcome'].content || '{}';
        setForm(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Welcome data.' });
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
      if (sectionsMap['home.welcome']) {
        await cmsService.updateSection(sectionsMap['home.welcome'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId, sectionKey: 'home.welcome', title: 'Welcome Message', draftContent: content, _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'home.welcome': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Welcome changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Welcome draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    const res = await cmsService.getPage('home');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'home.welcome');
    setPreviewSection(updatedSec);
  };

  const handleReset = () => {
    setForm({
      visible: true, title: 'Welcome to CAHCET', subtitle: 'A Legacy of Excellence', principalName: '', principalTitle: 'Principal', description: '', principalImage: ''
    });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'homepage', 'welcome-image');
      change('principalImage', rec.url);
    } catch {
      toast({ type: 'error', title: 'Upload Failed', message: 'Could not upload image.' });
    }
    setUploading(false);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.welcome', form);

  return (
    <EditorPage
      title="Welcome Section Editor"
      description="Manage the Principal's welcome message and photo on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Welcome']}
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
          <EditorCard title="Section Overview" description="Main text and visibility controls.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the welcome section on the homepage."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Section Title"
              value={form.title || ''}
              onChange={e => change('title', e.target.value)}
              placeholder="Welcome to CAHCET"
            />
            <AdminInput
              label="Section Subtitle"
              value={form.subtitle || ''}
              onChange={e => change('subtitle', e.target.value)}
              placeholder="A Legacy of Excellence"
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Message Content" description="Principal's message and details.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Principal Name"
              value={form.principalName || ''}
              onChange={e => change('principalName', e.target.value)}
              placeholder="Dr. John Doe"
            />
            <AdminInput
              label="Designation"
              value={form.principalTitle || ''}
              onChange={e => change('principalTitle', e.target.value)}
              placeholder="Principal"
            />
          </div>
          <AdminTextarea
            label="Welcome Description"
            value={form.description || ''}
            onChange={e => change('description', e.target.value)}
            placeholder="Write the welcome message here..."
            rows={5}
          />
        </div>
      </EditorCard>

      <EditorCard title="Principal Image" description="Upload a professional photo for the welcome section.">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-40 h-40 border border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 group relative">
              {form.principalImage ? (
                <>
                  <img loading="lazy" decoding="async" src={form.principalImage} alt="Principal" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer text-white text-xs font-semibold px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors">
                      Change
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </>
              ) : (
                <span className="text-xs text-slate-400 font-medium">No Image</span>
              )}
            </div>
            <div className="flex flex-col justify-center gap-3 flex-1">
              <AdminInput
                label="Image URL"
                value={form.principalImage || ''}
                onChange={e => change('principalImage', e.target.value)}
                placeholder="https://..."
                hint="Provide a direct image URL or upload a new file below."
              />
              <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-sm font-semibold text-slate-700 rounded-xl cursor-pointer transition-colors w-fit">
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading ? 'Uploading...' : 'Upload New Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
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

              <div className="bg-slate-50">
              <div className="p-4 flex gap-4 items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-slate-200 border border-white shadow-sm">
                  {form.principalImage ? (
                     <img loading="lazy" decoding="async" src={form.principalImage} className="w-full h-full object-cover" alt="Principal" />
                  ) : (
                     <div className="w-full h-full bg-slate-300" />
                  )}
                </div>
                <div>
                   <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{form.title || 'Title'}</p>
                   <h4 className="text-sm font-bold text-slate-800 mt-0.5">{form.subtitle || 'Subtitle'}</h4>
                   <p className="text-xs text-slate-900 font-semibold mt-2">{form.principalName || 'Principal Name'}</p>
                   <p className="text-[10px] text-slate-500">{form.principalTitle || 'Designation'}</p>
                </div>
              </div>
              <div className="px-4 pb-4">
                 <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{form.description || 'Welcome description preview...'}</p>
              </div>
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

export default HomeWelcomeEditor;
