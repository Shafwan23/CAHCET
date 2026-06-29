import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSectionEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ visible: true, title: "We're Here to Help You Grow", address: 'Hakeem Nagar, Melvisharam - 632 509, Ranipet District, Tamil Nadu, India.', phone: '+91 4172 267387 / 266487', email: 'info@cahcet.in', mapEmbedUrl: '' });
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

      if (map['home.contact']) {
        const dataStr = map['home.contact'].draftContent || map['home.contact'].content || '{}';
        setForm(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Contact data.' });
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
      if (sectionsMap['home.contact']) {
        await cmsService.updateSection(sectionsMap['home.contact'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId, sectionKey: 'home.contact', title: 'Contact Section', draftContent: content, _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'home.contact': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Contact changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Contact draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    const res = await cmsService.getPage('home');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'home.contact');
    setPreviewSection(updatedSec);
  };

  const handleReset = () => {
    setForm({ visible: true, title: "We're Here to Help You Grow", address: 'Hakeem Nagar, Melvisharam - 632 509, Ranipet District, Tamil Nadu, India.', phone: '+91 4172 267387 / 266487', email: 'info@cahcet.in', mapEmbedUrl: '' });
    toast({ type: 'info', title: 'Reset', message: 'Contact section reverted to defaults.' });
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.contact', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Contact Section Editor"
      description="Manage the main contact information, map embed, and inquiry settings shown on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Contact Section']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 space-y-6">
          <EditorCard title="Section Settings" description="Visibility and titles.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the contact section on the homepage."
          />
          <AdminInput
            label="Section Title"
            value={form.title || ''}
            onChange={e => change('title', e.target.value)}
            placeholder="Get in Touch"
          />
        </div>
      </EditorCard>

      <EditorCard title="Contact Details" description="The primary ways for people to reach the college.">
        <div className="space-y-4">
          <AdminTextarea
            label="Physical Address"
            value={form.address || ''}
            onChange={e => change('address', e.target.value)}
            placeholder="C. Abdul Hakeem College..."
            rows={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Phone Number"
              value={form.phone || ''}
              onChange={e => change('phone', e.target.value)}
              placeholder="+91 4172 267 387"
            />
            <AdminInput
              label="Email Address"
              value={form.email || ''}
              onChange={e => change('email', e.target.value)}
              placeholder="info@cahcet.edu.in"
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Map Settings" description="Google Maps iframe embed URL.">
        <AdminTextarea
          label="Google Maps Embed URL (src attribute)"
          value={form.mapEmbedUrl || ''}
          onChange={e => change('mapEmbedUrl', e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=..."
          rows={3}
          hint="Go to Google Maps, click Share -> Embed a map, and copy the link inside the src attribute."
        />
        {form.mapEmbedUrl && (
          <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <iframe src={form.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
      </EditorCard>
        </div>

        {/* Lightweight Preview Card */}
        <div className="xl:col-span-5">
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
              {form.mapEmbedUrl ? (
                <div className="w-full h-48 bg-slate-200 border-b border-slate-200">
                  <iframe src={form.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              ) : (
                <div className="w-full h-48 bg-slate-200 border-b border-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 text-sm font-medium">Map Preview</span>
                </div>
              )}
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4">{form.title || 'Get in Touch'}</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{form.address || 'Address goes here...'}</p>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{form.phone || '+91 ...'}</p>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-amber-600 font-medium">{form.email || 'email@...'}</p>
                  </div>
                </div>
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

export default ContactSectionEditor;
