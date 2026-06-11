import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

const FooterEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ visible: true, aboutText: '', socialLinks: {}, quickLinks: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('home');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['home.footer']) {
          setForm(JSON.parse(map['home.footer'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Footer data.' });
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
      if (sectionsMap['home.footer']) {
        await cmsService.updateSection(sectionsMap['home.footer'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Footer changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Footer data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ visible: true, aboutText: 'Empowering students with quality education and moral values since 1998.', socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '', youtube: '' }, quickLinks: [ { label: 'Admissions', path: '/admissions' }, { label: 'Departments', path: '/departments' }, { label: 'Placements', path: '/placements' }, { label: 'Contact Us', path: '/contact' } ] });
    toast({ type: 'info', title: 'Reset', message: 'Footer reverted to defaults.' });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...(form.quickLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    change('quickLinks', newLinks);
  };

  const addLink = () => change('quickLinks', [...(form.quickLinks || []), { label: 'New Link', path: '/' }]);
  const removeLink = (index) => change('quickLinks', (form.quickLinks || []).filter((_, i) => i !== index));

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Footer Editor"
      description="Manage the bottom footer section of the website, including links, social media, and branding."
      breadcrumb={['Admin', 'Homepage', 'Footer']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="General Settings" description="Visibility and basic branding.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the footer entirely."
          />
          <AdminTextarea
            label="About Text / Tagline"
            value={form.aboutText || ''}
            onChange={e => change('aboutText', e.target.value)}
            placeholder="Empowering students with quality education..."
            rows={3}
          />
        </div>
      </EditorCard>

      <EditorCard title="Social Media Links" description="Links to college social profiles. Leave blank to hide the icon.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map(platform => (
            <AdminInput
              key={platform}
              label={platform.charAt(0).toUpperCase() + platform.slice(1) + ' URL'}
              value={(form.socialLinks || {})[platform] || ''}
              onChange={e => change('socialLinks', { ...form.socialLinks, [platform]: e.target.value })}
              placeholder={`https://www.${platform}.com/cahcet`}
            />
          ))}
        </div>
      </EditorCard>

      <EditorCard title="Quick Links" description="Manage the navigation links shown in the footer columns.">
        <div className="space-y-3">
          {(form.quickLinks || []).map((link, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <GripVertical className="w-4 h-4 text-slate-300 cursor-move shrink-0" />
              <div className="grid grid-cols-2 gap-3 flex-1">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Link Label (e.g. Admissions)"
                  value={link.label}
                  onChange={e => handleLinkChange(index, 'label', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Path (e.g. /admissions)"
                  value={link.path}
                  onChange={e => handleLinkChange(index, 'path', e.target.value)}
                />
              </div>
              <button onClick={() => removeLink(index)} className="p-2 text-amber-400 hover:text-amber-500 hover:bg-primary-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addLink} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors w-max">
            <Plus className="w-4 h-4" /> Add Quick Link
          </button>
        </div>
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

export default FooterEditor;
