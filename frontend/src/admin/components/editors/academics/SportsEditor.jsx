import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Upload, X, Trophy } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';

const SportsEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', description: '', stats: {}, achievements: [], gallery: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const page = await cmsService.getPage('academics');
      const section = page.sections?.find(s => s.sectionKey === 'academics.sports');
      if (section && section.content) {
        setForm(section.content);
      }
    } catch (err) {
      toast({ type: 'error', title: 'Failed to load data' });
    } finally {
      setPageLoading(false);
    }
  };

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));
  const changeStat = (field, value) => setForm(p => ({ ...p, stats: { ...(p.stats || {}), [field]: value } }));

  const handleSave = async () => {
    setLoading(true);
    try {
      await cmsService.updateSection('academics.sports', form);
      toast({ type: 'success', title: 'Changes published' });
    } catch (err) {
      toast({ type: 'error', title: 'Failed to save' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = handleSave;

  const addAchievement = () => change('achievements', [...(form.achievements || []), { id: Date.now(), title: '', year: '', description: '' }]);
  const updateAchievement = (idx, f, v) => {
    const list = [...(form.achievements || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('achievements', list);
  };
  const removeAchievement = (idx) => change('achievements', (form.achievements || []).filter((_, i) => i !== idx));

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const rec = await fileService.upload(file, 'academics', 'sports');
      change('gallery', [...(form.gallery || []), rec.url]);
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };
  const removeGalleryImage = (idx) => change('gallery', (form.gallery || []).filter((_, i) => i !== idx));

  return (
    <EditorPage
      title="Sports & Athletics"
      description="Manage sports statistics, galleries, and achievements."
      breadcrumb={['Admin', 'Academics', 'Sports']}
      onSave={handleSave}
      onPublish={handlePublish}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EditorCard title="Page Introduction">
            <div className="space-y-4">
              <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
              <AdminTextarea label="Introduction Text" value={form.description || ''} onChange={e => change('description', e.target.value)} rows={4} />
            </div>
          </EditorCard>

          <EditorCard title="Live Statistics Counters" description="Numbers that animate when the page loads.">
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="Total Grounds" value={form.stats?.grounds || ''} onChange={e => changeStat('grounds', e.target.value)} placeholder="e.g. 5" />
              <AdminInput label="Active Players" value={form.stats?.players || ''} onChange={e => changeStat('players', e.target.value)} placeholder="e.g. 500+" />
              <AdminInput label="Tournaments Won" value={form.stats?.tournaments || ''} onChange={e => changeStat('tournaments', e.target.value)} placeholder="e.g. 20+" />
              <AdminInput label="Medals Achieved" value={form.stats?.medals || ''} onChange={e => changeStat('medals', e.target.value)} placeholder="e.g. 150+" />
            </div>
          </EditorCard>
        </div>

        <EditorCard title="Major Achievements & Awards">
          <div className="space-y-4">
            {(form.achievements || []).map((ach, idx) => (
              <div key={ach.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 relative">
                <Trophy className="w-6 h-6 text-amber-500 mt-2 shrink-0" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AdminInput label="Title/Award" value={ach.title} onChange={e => updateAchievement(idx, 'title', e.target.value)} placeholder="e.g. State Level Champions" />
                  <AdminInput label="Year" value={ach.year} onChange={e => updateAchievement(idx, 'year', e.target.value)} placeholder="e.g. 2025" />
                  <div className="md:col-span-2">
                    <AdminTextarea label="Description" value={ach.description} onChange={e => updateAchievement(idx, 'description', e.target.value)} rows={2} />
                  </div>
                </div>
                <button onClick={() => removeAchievement(idx)} className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-amber-400 rounded-full shadow-sm hover:bg-primary-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={addAchievement} className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 font-semibold text-sm w-max">
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>
        </EditorCard>

        <EditorCard title="Sports Image Gallery" description="Upload photos of grounds, events, and teams.">
          <div className="flex flex-wrap gap-4">
            {(form.gallery || []).map((img, idx) => (
              <div key={idx} className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 group">
                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removeGalleryImage(idx)} className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transform scale-0 group-hover:scale-100 transition-transform"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            <label className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors">
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-xs font-semibold">Upload Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
            </label>
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default SportsEditor;
