import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Lightbulb, Heart, Users, GripVertical, Trash2, Plus, Shield, Award, Star, CheckCircle, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { valuesPhilosophyData } from '../../../../data/valuesPhilosophy';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };
const getIconName = (iconObj) => (typeof iconObj === 'string' ? iconObj : (iconObj?.name || iconObj?.displayName || 'Target'));

const ValuesPhilosophyEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vision-mission');
  
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);

  const [formVision, setFormVision] = useState({});
  const [formMission, setFormMission] = useState({ statements: [] });
  const [formValues, setFormValues] = useState({ qualityPolicy: {}, coreValues: [], philosophy: {}, studentCentric: [], ethics: {} });

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('about');
      setPageId(res.data?.id);
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['about.vision']) setFormVision(JSON.parse(map['about.vision'].draftContent || map['about.vision'].content || '{}'));
      if (map['about.mission']) setFormMission(JSON.parse(map['about.mission'].draftContent || map['about.mission'].content || '{"statements":[]}'));
      if (map['about.values']) setFormValues(JSON.parse(map['about.values'].draftContent || map['about.values'].content || '{}'));
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load data.' }); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const updates = [];
      const pushUpdate = async (key, title, content) => {
        if (sectionsMap[key]) updates.push(cmsService.updateSection(sectionsMap[key].id, { draftContent: content, _isSilentDraft: isSilent }));
        else {
          const res = await cmsService.createSection({ pageId, sectionKey: key, title, draftContent: content, _isSilentDraft: isSilent });
          setSectionsMap(prev => ({ ...prev, [key]: res.data }));
        }
      };

      await pushUpdate('about.vision', 'Institution Vision', JSON.stringify(formVision));
      await pushUpdate('about.mission', 'Institution Mission', JSON.stringify(formMission));
      await pushUpdate('about.values', 'Ethos, Policy and Values', JSON.stringify(formValues));

      await Promise.all(updates);
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Sections saved to draft.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'about.vision', formVision);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  const availableIcons = ['Shield', 'Star', 'Lightbulb', 'Users', 'Heart', 'Target', 'Award'];

  return (
    <EditorPage title="Values & Philosophy Ethos" description="Manage the college's vision, mission, and core values." breadcrumb={['Admin', 'About', 'Values & Philosophy']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['about.vision']); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <motion.div key="main" {...fadeUp} className="space-y-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-2xl flex flex-wrap gap-2 sticky top-[132px] z-20 shadow-sm w-max">
          {[
            { id: 'vision-mission', label: 'Vision & Mission' },
            { id: 'quality-policy', label: 'Quality Policy' },
            { id: 'core-values', label: 'Core Values' },
            { id: 'philosophy-ethics', label: 'Philosophy & Ethics' },
            { id: 'student-centric', label: 'Student Centric Approach' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'vision-mission' && (
                <motion.div key="vision" {...fadeUp} className="space-y-6">
                  <EditorCard title="Institution Vision">
                    <AdminInput label="Vision Title" value={formVision.title || ''} onChange={e => setFormVision(p => ({ ...p, title: e.target.value }))} />
                    <div className="mt-4"><AdminTextarea label="Vision Statement" value={formVision.statement || ''} onChange={e => setFormVision(p => ({ ...p, statement: e.target.value }))} rows={3} /></div>
                    <div className="mt-4"><AdminInput label="Vision Author" value={formVision.author || ''} onChange={e => setFormVision(p => ({ ...p, author: e.target.value }))} /></div>
                  </EditorCard>

                  <EditorCard title="Institution Mission">
                    <div className="mb-6"><AdminInput label="Mission Title" value={formMission.title || ''} onChange={e => setFormMission(p => ({ ...p, title: e.target.value }))} /></div>
                    <div className="space-y-4">
                      {(formMission.statements || []).map((item, index) => (
                        <div key={item.id || index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 shadow-sm relative group">
                          <GripVertical className="w-5 h-5 text-slate-300 mt-2 shrink-0 cursor-move" />
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <AdminInput label="Pillar Title" value={item.title || ''} onChange={e => { const n = [...formMission.statements]; n[index].title = e.target.value; setFormMission(p => ({ ...p, statements: n })); }} />
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Pillar Icon</label>
                                <select value={item.icon || 'Target'} onChange={e => { const n = [...formMission.statements]; n[index].icon = e.target.value; setFormMission(p => ({ ...p, statements: n })); }} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500/20">
                                  {availableIcons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                              </div>
                            </div>
                            <AdminTextarea label="Description" value={item.desc || ''} onChange={e => { const n = [...formMission.statements]; n[index].desc = e.target.value; setFormMission(p => ({ ...p, statements: n })); }} rows={2} />
                          </div>
                          <button onClick={() => { const n = [...formMission.statements]; n.splice(index, 1); setFormMission(p => ({ ...p, statements: n })); }} className="absolute top-2 right-2 p-1.5 text-amber-500 bg-amber-50 hover:bg-amber-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => setFormMission(p => ({ ...p, statements: [...(p.statements || []), { id: Date.now(), title: '', desc: '', icon: 'Target' }] }))} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"><Plus className="w-4 h-4" /> Add Mission Area</button>
                    </div>
                  </EditorCard>
                </motion.div>
              )}

              {activeTab === 'quality-policy' && (
                <motion.div key="quality" {...fadeUp} className="space-y-6">
                  <EditorCard title="Quality Policy Content">
                    <AdminInput label="Section Title" value={formValues.qualityPolicy?.title || ''} onChange={e => setFormValues(p => ({ ...p, qualityPolicy: { ...p.qualityPolicy, title: e.target.value } }))} />
                    <div className="mt-4"><AdminTextarea label="Quality Statement" value={formValues.qualityPolicy?.content || ''} onChange={e => setFormValues(p => ({ ...p, qualityPolicy: { ...p.qualityPolicy, content: e.target.value } }))} rows={4} /></div>
                  </EditorCard>

                  <EditorCard title="Focus Areas">
                    <div className="space-y-3">
                      {(formValues.qualityPolicy?.focusAreas || []).map((area, index) => (
                        <div key={index} className="flex items-center gap-2 group">
                          <input type="text" value={area} onChange={e => { const n = [...(formValues.qualityPolicy?.focusAreas || [])]; n[index] = e.target.value; setFormValues(p => ({ ...p, qualityPolicy: { ...p.qualityPolicy, focusAreas: n } })); }} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white" placeholder="Focus area point..." />
                          <button onClick={() => { const n = [...(formValues.qualityPolicy?.focusAreas || [])]; n.splice(index, 1); setFormValues(p => ({ ...p, qualityPolicy: { ...p.qualityPolicy, focusAreas: n } })); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => { const n = [...(formValues.qualityPolicy?.focusAreas || []), '']; setFormValues(p => ({ ...p, qualityPolicy: { ...p.qualityPolicy, focusAreas: n } })); }} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg mt-2"><Plus className="w-4 h-4" /> Add Focus Point</button>
                    </div>
                  </EditorCard>
                </motion.div>
              )}

              {activeTab === 'core-values' && (
                <motion.div key="core" {...fadeUp}>
                  <EditorCard title="Core Value Pillars">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(formValues.coreValues || []).map((val, index) => (
                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group shadow-sm">
                          <div className="space-y-3">
                            <AdminInput label="Value Title" value={val.title} onChange={e => { const n = [...(formValues.coreValues || [])]; n[index].title = e.target.value; setFormValues(p => ({ ...p, coreValues: n })); }} />
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">Value Icon</label>
                              <select value={val.icon || 'Shield'} onChange={e => { const n = [...(formValues.coreValues || [])]; n[index].icon = e.target.value; setFormValues(p => ({ ...p, coreValues: n })); }} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                {availableIcons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                              </select>
                            </div>
                            <AdminTextarea label="Description" value={val.desc} onChange={e => { const n = [...(formValues.coreValues || [])]; n[index].desc = e.target.value; setFormValues(p => ({ ...p, coreValues: n })); }} rows={2} />
                          </div>
                          <button onClick={() => { const n = [...(formValues.coreValues || [])]; n.splice(index, 1); setFormValues(p => ({ ...p, coreValues: n })); }} className="absolute top-2 right-2 p-1.5 text-amber-500 bg-white hover:bg-red-50 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setFormValues(p => ({ ...p, coreValues: [...(p.coreValues || []), { title: '', desc: '', icon: 'Star' }] }))} className="mt-4 flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"><Plus className="w-4 h-4" /> Add Core Value</button>
                  </EditorCard>
                </motion.div>
              )}

              {activeTab === 'philosophy-ethics' && (
                <motion.div key="philosophy" {...fadeUp} className="space-y-6">
                  <EditorCard title="Educational Philosophy">
                    <AdminInput label="Philosophy Title" value={formValues.philosophy?.title || ''} onChange={e => setFormValues(p => ({ ...p, philosophy: { ...p.philosophy, title: e.target.value } }))} />
                    <div className="mt-4"><AdminTextarea label="Philosophy Content (Double break for paras)" value={formValues.philosophy?.content?.join('\n\n') || ''} onChange={e => setFormValues(p => ({ ...p, philosophy: { ...p.philosophy, content: e.target.value.split('\n\n') } }))} rows={8} /></div>
                  </EditorCard>
                  <EditorCard title="Ethics & Social Responsibility">
                    <AdminInput label="Ethics Section Title" value={formValues.ethics?.title || ''} onChange={e => setFormValues(p => ({ ...p, ethics: { ...p.ethics, title: e.target.value } }))} />
                    <div className="mt-4"><AdminTextarea label="Ethics Policy Statement" value={formValues.ethics?.content || ''} onChange={e => setFormValues(p => ({ ...p, ethics: { ...p.ethics, content: e.target.value } }))} rows={4} /></div>
                  </EditorCard>
                </motion.div>
              )}

              {activeTab === 'student-centric' && (
                <motion.div key="student" {...fadeUp}>
                  <EditorCard title="Student-Centric Learning Approach">
                    <div className="space-y-4">
                      {(formValues.studentCentric || []).map((item, index) => (
                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group flex gap-3 shadow-sm">
                          <GripVertical className="w-5 h-5 text-slate-300 mt-2 shrink-0 cursor-move" />
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <AdminInput label="Program Name" value={item.title} onChange={e => { const n = [...(formValues.studentCentric || [])]; n[index].title = e.target.value; setFormValues(p => ({ ...p, studentCentric: n })); }} />
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Icon</label>
                                <select value={item.icon || 'Users'} onChange={e => { const n = [...(formValues.studentCentric || [])]; n[index].icon = e.target.value; setFormValues(p => ({ ...p, studentCentric: n })); }} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                  {availableIcons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                </select>
                              </div>
                            </div>
                            <AdminTextarea label="Service description" value={item.desc} onChange={e => { const n = [...(formValues.studentCentric || [])]; n[index].desc = e.target.value; setFormValues(p => ({ ...p, studentCentric: n })); }} rows={2} />
                          </div>
                          <button onClick={() => { const n = [...(formValues.studentCentric || [])]; n.splice(index, 1); setFormValues(p => ({ ...p, studentCentric: n })); }} className="p-2 text-amber-500 bg-white hover:text-red-500 hover:bg-red-50 rounded-lg h-max border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => setFormValues(p => ({ ...p, studentCentric: [...(p.studentCentric || []), { title: '', desc: '', icon: 'Users' }] }))} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"><Plus className="w-4 h-4" /> Add Student Program</button>
                    </div>
                  </EditorCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="xl:col-span-4 hidden xl:block">
            <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>
              <div className="p-6">
                 <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                    <Target className="w-12 h-12 mb-3 text-slate-200" />
                    <p className="text-sm font-medium">Click "Preview Changes" to view the full page rendering in the modal.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sectionsMap['about.vision'].id); await cmsService.publishSection(sectionsMap['about.mission'].id); await cmsService.publishSection(sectionsMap['about.values'].id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default ValuesPhilosophyEditor;
