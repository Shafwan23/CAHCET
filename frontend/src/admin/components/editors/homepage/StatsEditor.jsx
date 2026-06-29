import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Trash2, GripVertical, Users, BookOpen, Building2, Trophy, Target, Award, Star, Briefcase } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const AVAILABLE_ICONS = [
  { id: 'users', icon: Users, label: 'Users/Students' },
  { id: 'book', icon: BookOpen, label: 'Books/Courses' },
  { id: 'building', icon: Building2, label: 'Building/Campus' },
  { id: 'trophy', icon: Trophy, label: 'Trophy/Awards' },
  { id: 'target', icon: Target, label: 'Target/Goals' },
  { id: 'award', icon: Award, label: 'Award/Certification' },
  { id: 'star', icon: Star, label: 'Star/Excellence' },
  { id: 'briefcase', icon: Briefcase, label: 'Briefcase/Placements' }
];

const StatsEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: 'By the Numbers', stats: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [previewSection, setPreviewSection] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('home');
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['home.statistics']) {
        const dataStr = map['home.statistics'].draftContent || map['home.statistics'].content || '{}';
        const statsData = JSON.parse(dataStr);
        if (Array.isArray(statsData)) {
          setForm({ title: 'By the Numbers', stats: statsData });
        } else {
          setForm(statsData || { title: 'By the Numbers', stats: [] });
        }
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Stats data.' });
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
      let contentToSave;
      if (Array.isArray(form)) {
        contentToSave = form;
      } else {
        contentToSave = form.stats || form;
      }

      if (sectionsMap['home.statistics']) {
        await cmsService.updateSection(sectionsMap['home.statistics'].id, { draftContent: JSON.stringify(contentToSave), _isSilentDraft: isSilent });
      } else {
        const res = await cmsService.getPage('home');
        const newSec = await cmsService.createSection({
          pageId: res.data.id, sectionKey: 'home.statistics', title: 'Statistics', draftContent: JSON.stringify(contentToSave), _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'home.statistics': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Statistics changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Stats draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    const res = await cmsService.getPage('home');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'home.statistics');
    setPreviewSection(updatedSec);
  };

  const handleReset = () => {
    // Reset to defaults
    setForm({ title: 'By the Numbers', stats: [] });
    toast({ type: 'info', title: 'Reset', message: 'Statistics section reverted to defaults.' });
  };

  const updateStat = (index, field, value) => {
    const newStats = [...(form.stats || form || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    change('stats', newStats);
  };

  const addStat = () => {
    const currentStats = Array.isArray(form) ? form : (form.stats || []);
    change('stats', [
      ...currentStats, 
      { id: Date.now(), label: 'New Metric', value: '100', prefix: '', suffix: '+', icon: 'star', duration: 1500 }
    ]);
  };

  const removeStat = (index) => {
    const currentStats = Array.isArray(form) ? form : (form.stats || []);
    change('stats', currentStats.filter((_, i) => i !== index));
  };

  const statsList = Array.isArray(form) ? form : (form.stats || []);
  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.statistics', form);

  return (
    <EditorPage
      title="Animation Numbers Section"
      description="Manage the dynamic counter statistics displayed on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Animation Numbers']}
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
          <EditorCard title="Section Visibility & Title" description="Controls whether these stats are shown on the public site.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the entire animation numbers section."
          />
          <AdminInput
            label="Section Title"
            value={form.title || ''}
            onChange={e => change('title', e.target.value)}
            placeholder="By the Numbers"
          />
        </div>
      </EditorCard>

      <EditorCard title="Statistics Cards" description="Add, edit, or remove the individual metric counters.">
        <div className="space-y-4">
          {statsList.map((stat, index) => (
            <div key={stat.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-4">
              <div className="pt-2 cursor-move text-slate-300 hover:text-slate-500">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput
                  label="Label Text"
                  value={stat.label || ''}
                  onChange={e => updateStat(index, 'label', e.target.value)}
                  placeholder="e.g. Students Enrolled"
                />
                <AdminInput
                  label="Number Value"
                  value={stat.value || ''}
                  onChange={e => updateStat(index, 'value', e.target.value)}
                  placeholder="e.g. 5000"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <AdminInput
                    label="Prefix (Optional)"
                    value={stat.prefix || ''}
                    onChange={e => updateStat(index, 'prefix', e.target.value)}
                    placeholder="e.g. $"
                  />
                  <AdminInput
                    label="Suffix (Optional)"
                    value={stat.suffix || ''}
                    onChange={e => updateStat(index, 'suffix', e.target.value)}
                    placeholder="e.g. +"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Icon Selection</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                      value={stat.icon || 'star'}
                      onChange={e => updateStat(index, 'icon', e.target.value)}
                    >
                      {AVAILABLE_ICONS.map(i => (
                        <option key={i.id} value={i.id}>{i.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Animation Duration (ms)</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                      value={stat.duration || 1500}
                      onChange={e => updateStat(index, 'duration', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-1">
                <button onClick={() => removeStat(index)} className="p-2 text-amber-400 hover:text-amber-500 hover:bg-primary-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <button onClick={addStat} className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-500 hover:text-amber-600 hover:border-emerald-200 hover:bg-primary-50 rounded-2xl transition-all">
            <Plus className="w-5 h-5" /> Add New Statistic Card
          </button>
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

              <div className="bg-slate-900 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-20 blur-3xl rounded-full" />
               <div className="p-6 relative z-10">
                 <h4 className="text-center text-sm font-semibold text-white mb-6 uppercase tracking-widest">{form.title || 'By the Numbers'}</h4>
                 <div className="grid grid-cols-2 gap-4">
                   {statsList.slice(0, 4).map((stat, i) => {
                     const IconComponent = AVAILABLE_ICONS.find(ic => ic.id === stat.icon)?.icon || AVAILABLE_ICONS[0].icon;
                     return (
                       <div key={i} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                         <div className="w-8 h-8 mx-auto bg-amber-500/20 text-amber-400 flex items-center justify-center rounded-lg mb-2">
                           <IconComponent className="w-4 h-4" />
                         </div>
                         <div className="text-xl font-bold text-white leading-none">
                           {stat.prefix}{stat.value}{stat.suffix}
                         </div>
                         <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</div>
                       </div>
                     )
                   })}
                 </div>
                 {statsList.length > 4 && (
                   <p className="text-center text-xs text-slate-500 mt-4 italic">+ {statsList.length - 4} more items hidden in preview</p>
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

export default StatsEditor;
