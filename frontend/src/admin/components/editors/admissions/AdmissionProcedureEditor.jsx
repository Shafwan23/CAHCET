import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { motion } from 'framer-motion';
import { ShieldAlert, Monitor } from 'lucide-react';

const AdmissionProcedureEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});

  const [formProcess, setFormProcess] = useState({ steps: [] });
  const [formHero, setFormHero] = useState({});
  const [formEligibility, setFormEligibility] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPage('admissions');
      const sectionsArray = res.data?.sections || [];
      
      const sMap = {};
      sectionsArray.forEach(sec => { sMap[sec.sectionKey] = sec; });
      setSectionsMap(sMap);

      if (sMap['admissions.process']) setFormProcess(JSON.parse(sMap['admissions.process'].content || '{"steps":[]}'));
      if (sMap['admissions.hero']) setFormHero(JSON.parse(sMap['admissions.hero'].content || '{}'));
      if (sMap['admissions.eligibility']) setFormEligibility(JSON.parse(sMap['admissions.eligibility'].content || '{}'));
      
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
      if (sectionsMap['admissions.process']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.process'].id, { content: JSON.stringify(formProcess) }));
      }
      if (sectionsMap['admissions.hero']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.hero'].id, { content: JSON.stringify(formHero) }));
      }
      if (sectionsMap['admissions.eligibility']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.eligibility'].id, { content: JSON.stringify(formEligibility) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: 'Procedure saved directly to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addProcedure = () => setFormProcess(prev => ({
    ...prev,
    steps: [...(prev.steps || []), { id: Date.now(), stepNumber: `${(prev.steps?.length || 0) + 1}`, title: '', description: '', icon: 'CheckSquare', visible: true }]
  }));
  const updateProcedure = (idx, f, v) => {
    setFormProcess(prev => {
      const list = [...(prev.steps || [])];
      list[idx] = { ...list[idx], [f]: v };
      return { ...prev, steps: list };
    });
  };
  const removeProcedure = (idx) => setFormProcess(prev => ({
    ...prev,
    steps: (prev.steps || []).filter((_, i) => i !== idx)
  }));

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Admission Procedure"
      description="Manage the detailed visual step-by-step procedure cards for enrollment."
      breadcrumb={['Admin', 'Admissions', 'Procedure']}
      onSave={handleSave}
      isLoading={saving}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">admissions</div></div>
        <EditorCard title="Page Headers">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={formHero.title || ''} onChange={e => setFormHero(p => ({ ...p, title: e.target.value }))} />
            <AdminTextarea label="Eligibility Criteria" value={formEligibility.eligibility || ''} onChange={e => setFormEligibility(p => ({ ...p, eligibility: e.target.value }))} rows={3} />
          </div>
        </EditorCard>

        <EditorCard title="Procedure Steps" description="Cards detailing the admission timeline/workflow.">
          <div className="space-y-4">
            {(formProcess.steps || []).map((proc, idx) => (
              <div key={proc.id} className={`p-4 bg-white border ${proc.visible ? 'border-slate-200' : 'border-slate-200 opacity-60'} rounded-xl flex gap-4 group relative transition-all`}>
                <GripVertical className="mt-2 text-slate-300 shrink-0 cursor-move" />
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-20">
                      <AdminInput label="Step" value={proc.stepNumber} onChange={e => updateProcedure(idx, 'stepNumber', e.target.value)} />
                    </div>
                    <div className="flex-1">
                      <AdminInput label="Title" value={proc.title} onChange={e => updateProcedure(idx, 'title', e.target.value)} />
                    </div>
                    <div className="w-48">
                      <AdminInput label="Icon Name" value={proc.icon} onChange={e => updateProcedure(idx, 'icon', e.target.value)} placeholder="e.g. CheckSquare" />
                    </div>
                  </div>
                  
                  <AdminTextarea label="Description" value={proc.description} onChange={e => updateProcedure(idx, 'description', e.target.value)} rows={2} />
                  
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={proc.visible} onChange={e => updateProcedure(idx, 'visible', e.target.checked)} className="rounded text-blue-600 w-4 h-4" />
                      <span className="text-sm font-semibold text-slate-600">Visible to Public</span>
                    </label>
                    <button onClick={() => removeProcedure(idx)} className="text-sm font-semibold text-amber-500 hover:text-primary-700 flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Remove Step
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addProcedure} className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 font-semibold text-sm w-full justify-center">
              <Plus className="w-4 h-4" /> Add Procedure Step
            </button>
          </div>
        </EditorCard>
      </div>
          <div className="xl:col-span-4 hidden xl:block">
           <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>
             <div className="p-6 prose prose-sm max-w-none text-slate-600">
               <h3 className="text-xl font-bold text-slate-900 mb-1">Live Module Preview</h3>
               <div className="line-clamp-[12] whitespace-pre-wrap text-slate-400 italic">Preview updates as you type. Draft data is managed securely.</div>
             </div>
           </div>
        </div>
      </motion.div>
    </EditorPage>
  );
};

export default AdmissionProcedureEditor;
