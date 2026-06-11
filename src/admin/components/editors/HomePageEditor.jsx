import React, { useState, useEffect } from 'react';
import { Monitor, Save, RefreshCw, Layers } from 'lucide-react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../ui/AdminInput';
import { cmsService } from '../../../services/cmsService';

const HomePageEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          />
          <AdminInput
            label="Welcome Title"
            value={formWelcome.subtitle || ''}
            onChange={e => setFormWelcome(p => ({ ...p, subtitle: e.target.value }))}
          />
          <AdminTextarea
            label="Main Description"
            value={formWelcome.description || ''}
            onChange={e => setFormWelcome(p => ({ ...p, description: e.target.value }))}
            rows={4}
          />
          <AdminTextarea
            label="Principal's Mission/Quote"
            value={formWelcome.mission || ''}
            onChange={e => setFormWelcome(p => ({ ...p, mission: e.target.value }))}
            rows={2}
          />
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
