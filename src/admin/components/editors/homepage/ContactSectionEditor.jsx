import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

const ContactSectionEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ visible: true, title: 'Get in Touch', address: '', phone: '', email: '', mapEmbedUrl: '' });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('home');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['home.contact']) {
          setForm(JSON.parse(map['home.contact'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Contact data.' });
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
      if (sectionsMap['home.contact']) {
        await cmsService.updateSection(sectionsMap['home.contact'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Contact changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Contact data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ visible: true, title: 'Get in Touch', address: 'C. Abdul Hakeem College of Engineering & Technology, Melvisharam, Ranipet District, Tamil Nadu 632509', phone: '+91 4172 267 387', email: 'info@cahcet.edu.in', mapEmbedUrl: '' });
    toast({ type: 'info', title: 'Reset', message: 'Contact section reverted to defaults.' });
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Contact Section Editor"
      description="Manage the main contact information, map embed, and inquiry settings shown on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Contact Section']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
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

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">After publishing, visit the <a href="/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">home page</a> to see your changes live.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default ContactSectionEditor;
