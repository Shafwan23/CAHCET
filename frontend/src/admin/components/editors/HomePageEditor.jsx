import React, { useState, useEffect } from 'react';
import { Monitor, Save, RefreshCw, Layers, Upload } from 'lucide-react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../ui/AdminInput';
import { cmsService } from '../../../services/cmsService';
import { fileService } from '../../services/fileService';

const HomePageEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPrincipal, setUploadingPrincipal] = useState(false);

  const [sectionsMap, setSectionsMap] = useState({});
  const [formHero, setFormHero] = useState({});
  const [formWelcome, setFormWelcome] = useState({});
  const [formStats, setFormStats] = useState([]);
  const [formCTA, setFormCTA] = useState({});

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPage('home');
      const sectionsArray = res.data?.sections || [];
      
      const sMap = {};
      sectionsArray.forEach(sec => {
        sMap[sec.sectionKey] = sec;
      });
      setSectionsMap(sMap);

      if (sMap['home.hero']) setFormHero(JSON.parse(sMap['home.hero'].content || '{}'));
      if (sMap['home.welcome']) setFormWelcome(JSON.parse(sMap['home.welcome'].content || '{}'));
      if (sMap['home.statistics']) setFormStats(JSON.parse(sMap['home.statistics'].content || '[]'));
      if (sMap['home.cta']) setFormCTA(JSON.parse(sMap['home.cta'].content || '{}'));

    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load homepage CMS data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updates = [];
      if (sectionsMap['home.hero']) {
        updates.push(cmsService.updateSection(sectionsMap['home.hero'].id, { content: JSON.stringify(formHero) }));
      }
      if (sectionsMap['home.welcome']) {
        updates.push(cmsService.updateSection(sectionsMap['home.welcome'].id, { content: JSON.stringify(formWelcome) }));
      }
      if (sectionsMap['home.statistics']) {
        updates.push(cmsService.updateSection(sectionsMap['home.statistics'].id, { content: JSON.stringify(formStats) }));
      }
      if (sectionsMap['home.cta']) {
        updates.push(cmsService.updateSection(sectionsMap['home.cta'].id, { content: JSON.stringify(formCTA) }));
      }

      await Promise.all(updates);
      
      toast({ type: 'success', title: 'Saved!', message: 'Homepage changes saved directly to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePrincipalUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingPrincipal(true);
    try {
      const rec = await fileService.upload(file, 'homepage', 'principal');
      setFormWelcome(p => ({ ...p, principalImage: rec.url }));
      toast({ type: 'success', title: 'Image Uploaded', message: 'Principal photo uploaded successfully.' });
    } catch {
      toast({ type: 'error', title: 'Upload Failed', message: 'Failed to upload principal photo.' });
    }
    setUploadingPrincipal(false);
  };

  const updateStat = (index, field, value) => {
    setFormStats(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Home Page Editor (Database)"
      description="Edit the hero section, welcome message, call-to-action, and statistics. Saves directly to MySQL CMS."
      breadcrumb={['Admin', 'Content', 'Home Page']}
      onSave={handleSave}
      isLoading={saving}
    >
      {/* Hero Section */}
      <EditorCard
        title="Hero Section"
        description="Controls the fullscreen video hero at the top of the home page."
      >
        <AdminToggle
          label="Show Text Overlay"
          checked={formHero.showTextOverlay !== false}
          onChange={v => setFormHero(p => ({ ...p, showTextOverlay: v }))}
          hint="Display a title and subtitle over the hero video."
        />
        {formHero.showTextOverlay !== false && (
          <div className="mt-4 space-y-4 pt-4 border-t border-slate-50">
            <AdminInput
              label="Hero Title"
              value={formHero.title || ''}
              onChange={e => setFormHero(p => ({ ...p, title: e.target.value }))}
              placeholder="Engineering Excellence"
            />
            <AdminTextarea
              label="Hero Subtitle"
              value={formHero.subtitle || ''}
              onChange={e => setFormHero(p => ({ ...p, subtitle: e.target.value }))}
              placeholder="Inspiring the next generation of engineers..."
              rows={2}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="CTA Button Text"
                value={formHero.ctaText || ''}
                onChange={e => setFormHero(p => ({ ...p, ctaText: e.target.value }))}
                placeholder="Apply Now 2026"
              />
              <AdminInput
                label="CTA Button Link"
                value={formHero.ctaLink || ''}
                onChange={e => setFormHero(p => ({ ...p, ctaLink: e.target.value }))}
                placeholder="/admissions"
              />
            </div>
          </div>
        )}
      </EditorCard>

      {/* Welcome Section */}
      <EditorCard
        title="Welcome Section"
        description="The welcoming message from the principal/institution."
      >
        <div className="space-y-4">
          <AdminInput
            label="Welcome Subtitle"
            value={formWelcome.title || ''}
            onChange={e => setFormWelcome(p => ({ ...p, title: e.target.value }))}
            placeholder="Welcome to CAHCET"
          />
          <AdminInput
            label="Welcome Title"
            value={formWelcome.subtitle || ''}
            onChange={e => setFormWelcome(p => ({ ...p, subtitle: e.target.value }))}
            placeholder="A Legacy of Engineering Excellence Since 1998"
          />
          <AdminTextarea
            label="Main Description"
            value={formWelcome.description || ''}
            onChange={e => setFormWelcome(p => ({ ...p, description: e.target.value }))}
            rows={4}
            placeholder="C. Abdul Hakeem College of Engineering and Technology..."
          />
          <AdminTextarea
            label="Principal's Mission/Quote"
            value={formWelcome.mission || ''}
            onChange={e => setFormWelcome(p => ({ ...p, mission: e.target.value }))}
            rows={2}
            placeholder="Our mission is to nurture engineers..."
          />

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Principal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Principal Name"
                value={formWelcome.principalName || ''}
                onChange={e => setFormWelcome(p => ({ ...p, principalName: e.target.value }))}
                placeholder="Dr. M. Sasikumar"
              />
              <AdminInput
                label="Principal Designation"
                value={formWelcome.principalDesignation || ''}
                onChange={e => setFormWelcome(p => ({ ...p, principalDesignation: e.target.value }))}
                placeholder="Principal, CAHCET"
              />
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Principal Photo</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800"
                      value={formWelcome.principalImage || ''}
                      onChange={e => setFormWelcome(p => ({ ...p, principalImage: e.target.value }))}
                      placeholder="URL to principal image..."
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors shrink-0 border border-slate-200">
                    <Upload className="w-4 h-4" /> {uploadingPrincipal ? 'Uploading...' : 'Upload Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePrincipalUpload} disabled={uploadingPrincipal} />
                  </label>
                </div>
                {formWelcome.principalImage && (
                  <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                     <img src={formWelcome.principalImage} alt="Principal Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Legacy Stat 1</h4>
              <AdminInput
                label="Value"
                value={formWelcome.stat1Value || ''}
                onChange={e => setFormWelcome(p => ({ ...p, stat1Value: e.target.value }))}
                placeholder="25+"
              />
              <AdminInput
                label="Label"
                value={formWelcome.stat1Label || ''}
                onChange={e => setFormWelcome(p => ({ ...p, stat1Label: e.target.value }))}
                placeholder="Years of Legacy"
              />
              <AdminInput
                label="Description"
                value={formWelcome.stat1Desc || ''}
                onChange={e => setFormWelcome(p => ({ ...p, stat1Desc: e.target.value }))}
                placeholder="Excellence in education"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Legacy Stat 2</h4>
              <AdminInput
                label="Value"
                value={formWelcome.stat2Value || ''}
                onChange={e => setFormWelcome(p => ({ ...p, stat2Value: e.target.value }))}
                placeholder="15k+"
              />
              <AdminInput
                label="Label"
                value={formWelcome.stat2Label || ''}
                onChange={e => setFormWelcome(p => ({ ...p, stat2Label: e.target.value }))}
                placeholder="Alumni Globally"
              />
              <AdminInput
                label="Description"
                value={formWelcome.stat2Desc || ''}
                onChange={e => setFormWelcome(p => ({ ...p, stat2Desc: e.target.value }))}
                placeholder="Shaping the future"
              />
            </div>
          </div>
        </div>
      </EditorCard>

      {/* Stats */}
      <EditorCard
        title="Statistics Section"
        description="The 4 highlight stats displayed on the home page."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {formStats.map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stat {i + 1}</p>
              <AdminInput
                label="Label"
                value={stat.label || ''}
                onChange={e => updateStat(i, 'label', e.target.value)}
                placeholder="Students Enrolled"
              />
              <div className="grid grid-cols-2 gap-3">
                <AdminInput
                  label="Value"
                  value={stat.value || ''}
                  onChange={e => updateStat(i, 'value', e.target.value)}
                  placeholder="5000"
                />
                <AdminInput
                  label="Suffix"
                  value={stat.suffix || ''}
                  onChange={e => updateStat(i, 'suffix', e.target.value)}
                  placeholder="+"
                />
              </div>
            </div>
          ))}
        </div>
      </EditorCard>

      {/* CTA Section */}
      <EditorCard
        title="Admissions CTA Section"
        description="The bold call to action block."
      >
        <div className="space-y-4">
          <AdminInput
            label="CTA Title"
            value={formCTA.title || ''}
            onChange={e => setFormCTA(p => ({ ...p, title: e.target.value }))}
          />
          <AdminTextarea
            label="CTA Subtitle"
            value={formCTA.subtitle || ''}
            onChange={e => setFormCTA(p => ({ ...p, subtitle: e.target.value }))}
            rows={2}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Button Text"
              value={formCTA.buttonText || ''}
              onChange={e => setFormCTA(p => ({ ...p, buttonText: e.target.value }))}
            />
            <AdminInput
              label="Button Link"
              value={formCTA.buttonLink || ''}
              onChange={e => setFormCTA(p => ({ ...p, buttonLink: e.target.value }))}
            />
          </div>
        </div>
      </EditorCard>

      {/* Preview hint */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">Your changes are instantly saved to the database. Visit the <a href="/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">home page</a> to see them live.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default HomePageEditor;
