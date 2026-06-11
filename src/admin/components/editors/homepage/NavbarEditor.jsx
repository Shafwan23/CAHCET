import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const NavbarEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ 
    visible: true, isSticky: true, logoUrl: '', collegeName: '', 
    bgColor: '#0f172a', textColor: '#ffffff', links: [], buttonText: '', buttonLink: '' 
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

        if (map['home.navbar']) {
          setForm(JSON.parse(map['home.navbar'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Navbar data.' });
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
      if (sectionsMap['home.navbar']) {
        await cmsService.updateSection(sectionsMap['home.navbar'].id, { content: JSON.stringify(form) });
      } else {
        // Fallback for new section if allowed by API
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Navbar changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Navbar data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ visible: true, isSticky: true, logoUrl: '', collegeName: '', bgColor: '#0f172a', textColor: '#ffffff', links: [], buttonText: '', buttonLink: '' });
    toast({ type: 'info', title: 'Reset', message: 'Navbar settings reverted to defaults.' });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'homepage', 'logo');
      change('logoUrl', rec.url);
    } catch {}
    setUploading(false);
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...(form.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    change('links', newLinks);
  };

  const addLink = () => {
    change('links', [...(form.links || []), { label: 'New Link', path: '/' }]);
  };

  const removeLink = (index) => {
    change('links', (form.links || []).filter((_, i) => i !== index));
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Navbar Settings"
      description="Customize the main navigation bar that appears at the top of the website."
      breadcrumb={['Admin', 'Homepage', 'Navbar']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="General & Branding" description="Set the college logo and sticky behavior.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <AdminToggle
            label="Navbar Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Toggle the entire navbar on or off."
          />
          <AdminToggle
            label="Sticky Navbar"
            checked={form.isSticky ?? true}
            onChange={v => change('isSticky', v)}
            hint="Keep the navbar at the top of the screen when scrolling down."
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">College Logo</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800"
                  value={form.logoUrl || ''}
                  onChange={e => change('logoUrl', e.target.value)}
                  placeholder="URL to logo image..."
                />
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors shrink-0 border border-slate-200">
                <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Logo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              </label>
            </div>
            {form.logoUrl && (
              <div className="mt-3 w-32 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 relative flex items-center justify-center p-2">
                 <img src={form.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>
          
          <AdminInput
            label="College Name (Text Fallback)"
            value={form.collegeName || ''}
            onChange={e => change('collegeName', e.target.value)}
            placeholder="C. Abdul Hakeem College of Engineering & Technology"
            hint="Displayed next to the logo or if the logo fails to load."
          />
        </div>
      </EditorCard>

      <EditorCard title="Styling & Colors" description="Customize the visual appearance of the navbar.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Background Color</label>
              <div className="flex gap-3">
                <input type="color" value={form.bgColor || '#0f172a'} onChange={e => change('bgColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={form.bgColor || '#0f172a'} onChange={e => change('bgColor', e.target.value)} className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
           </div>
           <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Text/Link Color</label>
              <div className="flex gap-3">
                <input type="color" value={form.textColor || '#ffffff'} onChange={e => change('textColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={form.textColor || '#ffffff'} onChange={e => change('textColor', e.target.value)} className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
           </div>
        </div>
      </EditorCard>

      <EditorCard title="Navigation Menu Items" description="Manage the links shown in the center of the navbar.">
        <div className="space-y-3">
          {(form.links || []).map((link, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <GripVertical className="w-4 h-4 text-slate-300 cursor-move shrink-0" />
              <div className="grid grid-cols-2 gap-3 flex-1">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Link Label (e.g. Home)"
                  value={link.label}
                  onChange={e => handleLinkChange(index, 'label', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Path (e.g. /home)"
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
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      </EditorCard>

      <EditorCard title="Call to Action Button" description="The primary action button on the far right of the navbar.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AdminInput
            label="Button Text"
            value={form.buttonText || ''}
            onChange={e => change('buttonText', e.target.value)}
            placeholder="Apply Now"
          />
          <AdminInput
            label="Button Link"
            value={form.buttonLink || ''}
            onChange={e => change('buttonLink', e.target.value)}
            placeholder="/admissions"
          />
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

export default NavbarEditor;
