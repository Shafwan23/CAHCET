import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { ArrowRight } from 'lucide-react';

const CTAEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    visible: true,
    title: 'Ready to Start Your Journey?',
    buttonText: 'Apply Now',
    buttonLink: '/admissions'
  });
  const [loading, setLoading] = useState(true);
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

      if (map['home.cta']) {
        const dataStr = map['home.cta'].draftContent || map['home.cta'].content || '{}';
        setForm(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load CTA data.' });
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
      if (sectionsMap['home.cta']) {
        await cmsService.updateSection(sectionsMap['home.cta'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId, sectionKey: 'home.cta', title: 'Admissions CTA', draftContent: content, _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'home.cta': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `CTA changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save CTA draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    const res = await cmsService.getPage('home');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'home.cta');
    setPreviewSection(updatedSec);
  };

  const handleReset = () => {
    setForm({
      visible: true, title: 'Ready to Start Your Journey?', buttonText: 'Apply Now', buttonLink: '/admissions'
    });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.cta', form);

  return (
    <EditorPage
      title="Admissions CTA Editor"
      description="Manage the call-to-action section on the homepage."
      breadcrumb={['Admin', 'Homepage', 'CTA']}
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
          <EditorCard title="Section Settings" description="Visibility and titles.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the CTA section on the homepage."
          />
          <AdminInput
            label="Section Title"
            value={form.title || ''}
            onChange={e => change('title', e.target.value)}
            placeholder="Ready to Start Your Journey?"
          />
        </div>
      </EditorCard>

      <EditorCard title="Button Details" description="Configure the call-to-action button.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput
            label="Button Text"
            value={form.buttonText || ''}
            onChange={e => change('buttonText', e.target.value)}
            placeholder="Apply Now"
          />
          <AdminInput
            label="Button Link URL"
            value={form.buttonLink || ''}
            onChange={e => change('buttonLink', e.target.value)}
            placeholder="/admissions"
            hint="Use relative path like /admissions or absolute URL like https://..."
          />
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

              <div className="bg-amber-500 relative p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-5 rounded-full translate-y-8 -translate-x-8" />
              
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 relative z-10 leading-tight">
                {form.title || 'Ready to Start Your Journey?'}
              </h2>
              
              <button disabled className="relative z-10 bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm shadow-xl shadow-slate-900/20">
                {form.buttonText || 'Apply Now'} <ArrowRight className="w-4 h-4" />
              </button>
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

export default CTAEditor;
