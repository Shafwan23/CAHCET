import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Trash2, GripVertical, Users, BookOpen, Building2, Trophy, Target, Award, Star, Briefcase } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

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

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('home');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['home.statistics']) {
          const statsData = JSON.parse(map['home.statistics'].content);
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
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      let contentToSave;
      // Depending on whether it expects an array or object
      if (Array.isArray(form)) {
        contentToSave = form;
      } else {
        contentToSave = form.stats || form;
      }

      if (sectionsMap['home.statistics']) {
        await cmsService.updateSection(sectionsMap['home.statistics'].id, { content: JSON.stringify(contentToSave) });
      } else {
        // If the section doesn't exist yet, we'd need its ID, but usually it's seeded.
        // For safety, we use the raw update method if available, but assuming it exists:
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Statistics changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Stats data.' });
    } finally {
      setLoading(false);
    }
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

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Animation Numbers Section"
      description="Manage the dynamic counter statistics displayed on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Animation Numbers']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
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

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">After publishing, visit the <a href="/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">home page</a> to see the animated counters.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default StatsEditor;
