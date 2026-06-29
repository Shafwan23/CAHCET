import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { Briefcase } from 'lucide-react';

const PlacementExcellenceEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    title: 'Placement Excellence', subtitle: '', highestPackage: '', highestPackageLabel: 'Highest Package',
    highestPackageDesc: 'Secured by our top students at global tech giants.', placementRate: '95%',
    placementRateLabel: 'Placement Rate', placementRateDesc: 'Consistent track record of placement excellence across departments.',
    totalOffers: '500', totalOffersLabel: 'Offers in 2026', totalOffersDesc: 'A new milestone achieved by our students this academic year.',
    companiesVisited: '', featuredLogos: []
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

      if (map['home.placements']) {
        const dataStr = map['home.placements'].draftContent || map['home.placements'].content || '{}';
        setForm(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Placement data.' });
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
      if (sectionsMap['home.placements']) {
        await cmsService.updateSection(sectionsMap['home.placements'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId, sectionKey: 'home.placements', title: 'Placement Excellence', draftContent: content, _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'home.placements': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Placement changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Placement draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    const res = await cmsService.getPage('home');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'home.placements');
    setPreviewSection(updatedSec);
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

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.placements', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Placement Excellence Section"
      description="Manage the placement statistics and recruiter logos shown on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Placement Excellence']}
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

              <div className="bg-slate-900 text-white relative">
               <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500 opacity-20 blur-3xl rounded-full" />
               <div className="p-6 relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                       <Briefcase className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold leading-none">{form.title || 'Placement Excellence'}</h3>
                       <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Top Recruiters</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                     <p className="text-2xl font-black text-amber-400">{form.highestPackage || '0'} <span className="text-sm text-slate-400 font-medium">LPA</span></p>
                     <p className="text-xs font-bold text-white mt-1">{form.highestPackageLabel || 'Highest Package'}</p>
                   </div>
                   
                   <div className="flex gap-4">
                     <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                       <p className="text-xl font-black text-emerald-400">{form.placementRate || '0%'}</p>
                       <p className="text-xs font-bold text-white mt-1">{form.placementRateLabel || 'Placement Rate'}</p>
                     </div>
                     <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                       <p className="text-xl font-black text-blue-400">{form.totalOffers || '0'}</p>
                       <p className="text-xs font-bold text-white mt-1">{form.totalOffersLabel || 'Offers'}</p>
                     </div>
                   </div>
                 </div>
                 
                 {form.featuredLogos && form.featuredLogos.length > 0 && (
                   <div className="mt-6 pt-6 border-t border-white/10">
                     <p className="text-xs text-slate-400 mb-3 text-center uppercase tracking-wider">Recruiters</p>
                     <div className="flex flex-wrap gap-2 justify-center">
                       {form.featuredLogos.slice(0, 5).map((logo, i) => (
                         <div key={i} className="w-12 h-8 bg-white rounded flex items-center justify-center p-1">
                           <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                         </div>
                       ))}
                       {form.featuredLogos.length > 5 && (
                         <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-slate-300">
                           +{form.featuredLogos.length - 5}
                         </div>
                       )}
                     </div>
                   </div>
                 )}
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

export default PlacementExcellenceEditor;
