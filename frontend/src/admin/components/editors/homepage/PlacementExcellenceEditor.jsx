import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const PlacementExcellenceEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    title: 'Placement Excellence',
    subtitle: '',
    highestPackage: '',
    highestPackageLabel: 'Highest Package',
    highestPackageDesc: 'Secured by our top students at global tech giants.',
    placementRate: '95%',
    placementRateLabel: 'Placement Rate',
    placementRateDesc: 'Consistent track record of placement excellence across departments.',
    totalOffers: '500',
    totalOffersLabel: 'Offers in 2026',
    totalOffersDesc: 'A new milestone achieved by our students this academic year.',
    companiesVisited: '',
    featuredLogos: []
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('home');
        setPageId(res.data?.id);
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['home.placements']) {
          setForm(JSON.parse(map['home.placements'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Placement data.' });
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
      if (sectionsMap['home.placements']) {
        await cmsService.updateSection(sectionsMap['home.placements'].id, { content: JSON.stringify(form) });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'home.placements',
          title: 'Placement Excellence',
          content: JSON.stringify(form)
        });
        setSectionsMap(prev => ({ ...prev, 'home.placements': newSec.data }));
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Placement changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Placement data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: 'Placement Excellence',
      subtitle: 'Our graduates are recruited by top global companies.',
      highestPackage: '24',
      highestPackageLabel: 'Highest Package',
      highestPackageDesc: 'Secured by our top students at global tech giants.',
      placementRate: '95%',
      placementRateLabel: 'Placement Rate',
      placementRateDesc: 'Consistent track record of placement excellence across departments.',
      totalOffers: '500',
      totalOffersLabel: 'Offers in 2026',
      totalOffersDesc: 'A new milestone achieved by our students this academic year.',
      companiesVisited: '200+',
      featuredLogos: []
    });
    toast({ type: 'info', title: 'Reset', message: 'Section reverted to defaults.' });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'homepage', 'placement-logos');
      change('featuredLogos', [...(form.featuredLogos || []), rec.url]);
    } catch {}
    setUploading(false);
  };

  const removeLogo = (index) => {
    change('featuredLogos', (form.featuredLogos || []).filter((_, i) => i !== index));
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Placement Excellence Section"
      description="Manage the placement statistics and recruiter logos shown on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Placement Excellence']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Section Overview" description="Main text and visibility controls.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the placement section on the homepage."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Section Title"
              value={form.title || ''}
              onChange={e => change('title', e.target.value)}
              placeholder="Placement Excellence"
            />
            <AdminInput
              label="Section Subtitle"
              value={form.subtitle || ''}
              onChange={e => change('subtitle', e.target.value)}
              placeholder="Our graduates are recruited by..."
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Card 1: Highest Package Card" description="Configure the Highest Package stat card.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput
            label="Highest Package Value (LPA)"
            value={form.highestPackage || ''}
            onChange={e => change('highestPackage', e.target.value)}
            placeholder="e.g. 24"
          />
          <AdminInput
            label="Card Label"
            value={form.highestPackageLabel || ''}
            onChange={e => change('highestPackageLabel', e.target.value)}
            placeholder="Highest Package"
          />
          <div className="sm:col-span-2">
            <AdminTextarea
              label="Card Description"
              value={form.highestPackageDesc || ''}
              onChange={e => change('highestPackageDesc', e.target.value)}
              placeholder="Secured by our top students..."
              rows={2}
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Card 2: Placement Rate Card" description="Configure the Placement Rate stat card.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput
            label="Placement Rate Value"
            value={form.placementRate || ''}
            onChange={e => change('placementRate', e.target.value)}
            placeholder="e.g. 95%"
          />
          <AdminInput
            label="Card Label"
            value={form.placementRateLabel || ''}
            onChange={e => change('placementRateLabel', e.target.value)}
            placeholder="Placement Rate"
          />
          <div className="sm:col-span-2">
            <AdminTextarea
              label="Card Description"
              value={form.placementRateDesc || ''}
              onChange={e => change('placementRateDesc', e.target.value)}
              placeholder="Consistent track record..."
              rows={2}
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Card 3: Offers Card" description="Configure the Offers stat card.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput
            label="Offers Value"
            value={form.totalOffers || ''}
            onChange={e => change('totalOffers', e.target.value)}
            placeholder="e.g. 500"
          />
          <AdminInput
            label="Card Label"
            value={form.totalOffersLabel || ''}
            onChange={e => change('totalOffersLabel', e.target.value)}
            placeholder="Offers in 2026"
          />
          <div className="sm:col-span-2">
            <AdminTextarea
              label="Card Description"
              value={form.totalOffersDesc || ''}
              onChange={e => change('totalOffersDesc', e.target.value)}
              placeholder="A new milestone achieved..."
              rows={2}
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Featured Recruiter Logos" description="Upload logos of top companies to scroll across the homepage.">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {(form.featuredLogos || []).map((logo, index) => (
              <div key={index} className="w-24 h-16 bg-white border border-slate-200 rounded-xl relative group flex items-center justify-center p-2">
                <img src={logo} alt="Recruiter" className="max-w-full max-h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removeLogo(index)} className="p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <label className="w-24 h-16 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-primary-50 text-slate-400 hover:text-amber-500 transition-colors">
              {uploading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-semibold">Upload</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </EditorCard>

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Automatic Sync</p>
          <p className="text-xs mt-0.5">Note: Real-time dynamic stats (total students placed) are automatically calculated from the <a href="/admin/dashboard/placements/students" className="underline font-semibold">Placements CMS module</a>.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default PlacementExcellenceEditor;
