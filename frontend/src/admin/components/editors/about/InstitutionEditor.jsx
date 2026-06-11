import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const InstitutionEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [sectionsMap, setSectionsMap] = useState({});
  const [formHero, setFormHero] = useState({});
  const [formCollege, setFormCollege] = useState({});
  const [formHistory, setFormHistory] = useState({ sections: [] });
  const [formParentOrg, setFormParentOrg] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPage('about');
      const sectionsArray = res.data?.sections || [];
      
      const sMap = {};
      sectionsArray.forEach(sec => { sMap[sec.sectionKey] = sec; });
      setSectionsMap(sMap);

      if (sMap['about.hero']) setFormHero(JSON.parse(sMap['about.hero'].content || '{}'));
      if (sMap['about.college']) setFormCollege(JSON.parse(sMap['about.college'].content || '{}'));
      if (sMap['about.history']) setFormHistory(JSON.parse(sMap['about.history'].content || '{"sections":[]}'));
      if (sMap['about.parentOrganization']) setFormParentOrg(JSON.parse(sMap['about.parentOrganization'].content || '{}'));
      
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = [];
      if (sectionsMap['about.hero']) {
        updates.push(cmsService.updateSection(sectionsMap['about.hero'].id, { content: JSON.stringify(formHero) }));
      }
      if (sectionsMap['about.college']) {
        updates.push(cmsService.updateSection(sectionsMap['about.college'].id, { content: JSON.stringify(formCollege) }));
      }
      if (sectionsMap['about.history']) {
        updates.push(cmsService.updateSection(sectionsMap['about.history'].id, { content: JSON.stringify(formHistory) }));
      }
      if (sectionsMap['about.parentOrganization']) {
        updates.push(cmsService.updateSection(sectionsMap['about.parentOrganization'].id, { content: JSON.stringify(formParentOrg) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: 'Institution changes saved directly to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'about', 'banner');
      setFormHero(p => ({ ...p, bannerUrl: rec.url }));
    } catch {}
    setUploading(false);
  };

  const addHighlight = () => {
    setFormHistory(prev => ({
      ...prev,
      sections: [...(prev.sections || []), { id: Date.now(), title: 'New History Section', text: '', align: 'left' }]
    }));
  };

  const updateHighlight = (index, field, value) => {
    setFormHistory(prev => {
      const newSections = [...(prev.sections || [])];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const removeHighlight = (index) => {
    setFormHistory(prev => ({
      ...prev,
      sections: (prev.sections || []).filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Institution Settings (Database)"
      description="Manage the main information about the college, including history, vision, and mission. Saves directly to MySQL CMS."
      breadcrumb={['Admin', 'About', 'Institution']}
      onSave={handleSave}
      isLoading={saving}
    >
      <EditorCard title="Hero Banner" description="The main background image at the top of the institution page.">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input 
              type="text" 
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800"
              value={formHero.bannerUrl || ''}
              onChange={e => setFormHero(p => ({ ...p, bannerUrl: e.target.value }))}
              placeholder="URL to banner image..."
            />
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors shrink-0 border border-slate-200">
            <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} disabled={uploading} />
          </label>
        </div>
        {formHero.bannerUrl && (
          <div className="mt-4 aspect-[21/9] rounded-xl overflow-hidden border border-slate-200">
             <img src={formHero.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mt-4 space-y-4">
          <AdminInput
            label="Hero Title"
            value={formHero.title || ''}
            onChange={e => setFormHero(p => ({ ...p, title: e.target.value }))}
          />
          <AdminTextarea
            label="Hero Subtitle"
            value={formHero.subtitle || ''}
            onChange={e => setFormHero(p => ({ ...p, subtitle: e.target.value }))}
            rows={2}
          />
        </div>
      </EditorCard>

      <EditorCard title="General Overview" description="The primary introductory text for the college.">
        <AdminInput
          label="Institution Heading"
          value={formCollege.title || ''}
          onChange={e => setFormCollege(p => ({ ...p, title: e.target.value }))}
        />
        <div className="mt-4">
          <AdminTextarea
            label="Overview Paragraph"
            value={formCollege.overview || ''}
            onChange={e => setFormCollege(p => ({ ...p, overview: e.target.value }))}
            rows={5}
          />
        </div>
      </EditorCard>

      <EditorCard title="Parent Organization" description="Information about MMES.">
        <AdminInput
          label="Organization Title"
          value={formParentOrg.title || ''}
          onChange={e => setFormParentOrg(p => ({ ...p, title: e.target.value }))}
        />
        <div className="mt-4">
          <AdminTextarea
            label="Description"
            value={formParentOrg.description || ''}
            onChange={e => setFormParentOrg(p => ({ ...p, description: e.target.value }))}
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <AdminInput
            label="Short Name"
            value={formParentOrg.shortName || ''}
            onChange={e => setFormParentOrg(p => ({ ...p, shortName: e.target.value }))}
          />
          <AdminInput
            label="Since"
            value={formParentOrg.since || ''}
            onChange={e => setFormParentOrg(p => ({ ...p, since: e.target.value }))}
          />
        </div>
      </EditorCard>

      <EditorCard title="History Sections" description="Manage the history paragraphs and images.">
        <div className="space-y-4">
          {(formHistory.sections || []).map((section, index) => (
            <div key={section.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex gap-3">
              <GripVertical className="w-5 h-5 text-slate-300 mt-2 shrink-0 cursor-move" />
              <div className="flex-1 space-y-3">
                <AdminInput
                  label="Section Title"
                  value={section.title || ''}
                  onChange={e => updateHighlight(index, 'title', e.target.value)}
                />
                <AdminTextarea
                  label="Description"
                  value={section.text || ''}
                  onChange={e => updateHighlight(index, 'text', e.target.value)}
                  rows={3}
                />
                <AdminInput
                  label="Image URL"
                  value={section.image || ''}
                  onChange={e => updateHighlight(index, 'image', e.target.value)}
                />
              </div>
              <button onClick={() => removeHighlight(index)} className="p-2 text-amber-400 hover:text-amber-500 hover:bg-primary-50 rounded-lg transition-colors h-max">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button onClick={addHighlight} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Add History Section
          </button>
        </div>
      </EditorCard>
    </EditorPage>
  );
};

export default InstitutionEditor;
