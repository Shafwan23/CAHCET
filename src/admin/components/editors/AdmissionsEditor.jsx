import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminButton } from '../ui/AdminInput';
import { Plus, Trash2 } from 'lucide-react';
import { cmsService } from '../../../services/cmsService';

const AdmissionsEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ lastDate: '', applicationFee: '', eligibility: '', steps: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('admissions');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        const registration = map['admissions.registration'] ? JSON.parse(map['admissions.registration'].content) : {};
        const process = map['admissions.process'] ? JSON.parse(map['admissions.process'].content) : [];
        
        setForm({ ...registration, steps: process });
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Admissions data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const change = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const updateStep = (i, field, val) => setForm(p => ({ ...p, steps: p.steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));
  const addStep = () => setForm(p => ({ ...p, steps: [...p.steps, { id: Date.now().toString(), step: '', description: '' }] }));
  const removeStep = (i) => setForm(p => ({ ...p, steps: p.steps.filter((_, idx) => idx !== i) }));

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      const updates = [];
      const { steps, ...registration } = form;
      
      if (sectionsMap['admissions.registration']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.registration'].id, { content: JSON.stringify(registration) }));
      }
      if (sectionsMap['admissions.process']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.process'].id, { content: JSON.stringify(steps) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Admissions changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Admissions data.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage title="Admissions Editor" description="Edit admission details, eligibility, and application steps." breadcrumb={['Admin', 'Content', 'Admissions']}
      onSave={() => handleSave(false)} onPublish={() => handleSave(true)} isLoading={loading}>
      <EditorCard title="Admission Info">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminInput label="Last Date" value={form.lastDate || ''} onChange={e => change('lastDate', e.target.value)} placeholder="July 15, 2026" />
          <AdminInput label="Application Fee" value={form.applicationFee || ''} onChange={e => change('applicationFee', e.target.value)} placeholder="₹500" />
          <AdminInput label="Eligibility" value={form.eligibility || ''} onChange={e => change('eligibility', e.target.value)} placeholder="10+2 with PCM" containerClass="sm:col-span-3" />
        </div>
      </EditorCard>

      <EditorCard title="Application Steps" description="The step-by-step admission process.">
        <div className="space-y-3">
          {(form.steps || []).map((step, i) => (
            <div key={step.id || i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-900 font-black text-xs flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
              <div className="flex-1 space-y-2">
                <AdminInput value={step.step} onChange={e => updateStep(i, 'step', e.target.value)} placeholder="Step title..." />
                <AdminTextarea value={step.description} onChange={e => updateStep(i, 'description', e.target.value)} rows={2} placeholder="Step description..." />
              </div>
              <button onClick={() => removeStep(i)} className="p-1.5 text-amber-400 hover:bg-primary-50 rounded-lg transition-colors mt-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <AdminButton variant="secondary" icon={Plus} size="sm" onClick={addStep}>Add Step</AdminButton>
        </div>
      </EditorCard>
    </EditorPage>
  );
};
export default AdmissionsEditor;
