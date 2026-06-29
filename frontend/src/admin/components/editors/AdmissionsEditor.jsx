import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminButton } from '../ui/AdminInput';
import { Plus, Trash2, ShieldAlert, Monitor } from 'lucide-react';
import { cmsService } from '../../../services/cmsService';
import { useEditorStatus } from '../../utils/useEditorStatus';
import SectionPreviewModal from '../ui/SectionPreviewModal';
import { motion } from 'framer-motion';

const AdmissionsEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ lastDate: '', applicationFee: '', eligibility: '', steps: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [previewSection, setPreviewSection] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('admissions');
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      // Registration
      let registration = {};
      if (map['admissions.registration']) {
        const raw = map['admissions.registration'].draftContent || map['admissions.registration'].content || '{}';
        try { registration = JSON.parse(raw); } catch { registration = {}; }
      }

      // Process (handle both array format and object format `{ steps: [] }`)
      let process = [];
      if (map['admissions.process']) {
        const raw = map['admissions.process'].draftContent || map['admissions.process'].content || '[]';
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            process = parsed;
          } else if (parsed && Array.isArray(parsed.steps)) {
            process = parsed.steps;
          }
        } catch { process = []; }
      }
      
      setForm({ ...registration, steps: process });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Admissions data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const change = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const updateStep = (i, field, val) => setForm(p => ({ ...p, steps: (p.steps || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));
  const addStep = () => setForm(p => ({ ...p, steps: [...(p.steps || []), { id: Date.now().toString(), step: '', description: '' }] }));
  const removeStep = (i) => setForm(p => ({ ...p, steps: (p.steps || []).filter((_, idx) => idx !== i) }));

  const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const updates = [];
      const { steps, ...registration } = form;
      
      if (sectionsMap['admissions.registration']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.registration'].id, { draftContent: JSON.stringify(registration), _isSilentDraft: isSilent }));
      }
      if (sectionsMap['admissions.process']) {
        // Must save it in the object format { steps: [...] } because AdmissionProcedureEditor expects it that way
        updates.push(cmsService.updateSection(sectionsMap['admissions.process'].id, { draftContent: JSON.stringify({ steps }), _isSilentDraft: isSilent }));
      }
      await Promise.all(updates);
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ lastDate: '', applicationFee: '', eligibility: '', steps: [] });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  // Status for registration section as a proxy for the entire editor
  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'admissions.registration', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage 
      title="Admissions Editor" 
      description="Edit admission details, eligibility, and application steps." 
      breadcrumb={['Admin', 'Content', 'Admissions']}
      onSave={() => handleSaveDraft(false)} 
      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['admissions.registration'] || {}); }} 
      onReset={handleReset}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      isLoading={loading}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">admissions.registration</div></div>

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
                    <AdminInput value={step.step || step.title} onChange={e => updateStep(i, 'step', e.target.value)} placeholder="Step title..." />
                    <AdminTextarea value={step.description} onChange={e => updateStep(i, 'description', e.target.value)} rows={2} placeholder="Step description..." />
                  </div>
                  <button onClick={() => removeStep(i)} className="p-1.5 text-amber-400 hover:bg-primary-50 rounded-lg transition-colors mt-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <AdminButton variant="secondary" icon={Plus} size="sm" onClick={addStep}>Add Step</AdminButton>
            </div>
          </EditorCard>
        </div>
        <div className="xl:col-span-4 hidden xl:block">
          <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>
            <div className="p-6 prose prose-sm max-w-none text-slate-600">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Admissions</h3>
              <div className="line-clamp-[12] whitespace-pre-wrap">Eligibility: {form.eligibility || 'Not specified'}</div>
              <div className="line-clamp-[12] whitespace-pre-wrap mt-2">Application Fee: {form.applicationFee || 'Not specified'}</div>
            </div>
          </div>
        </div>
      </motion.div>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default AdmissionsEditor;
