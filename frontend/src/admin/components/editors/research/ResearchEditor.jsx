import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Upload, X, ShieldAlert, Monitor } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { motion } from 'framer-motion';

const ResearchEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', content: '', stats: {}, sections: [], publications: [], labs: [], collaborations: [], functionalities: [], team: [], achievementsList: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [previewSection, setPreviewSection] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('research');
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);
      if (map['research.research_main']) {
        setForm(JSON.parse(map['research.research_main'].draftContent || map['research.research_main'].content || '{}') || { title: '', content: '', stats: {}, sections: [], publications: [], labs: [], collaborations: [], functionalities: [], team: [], achievementsList: [] });
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));
  const changeStat = (field, value) => setForm(p => ({ ...p, stats: { ...(p.stats || {}), [field]: value } }));

  const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['research.research_main']) {
        await cmsService.updateSection(sectionsMap['research.research_main'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const res = await cmsService.getPage('research');
        const newSec = await cmsService.createSection({
          pageId: res.data?.id,
          sectionKey: 'research.research_main',
          title: 'Research',
          type: 'json',
          draftContent: content,
          _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, ['research.research_main']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ title: '', content: '', stats: {}, sections: [], publications: [], labs: [], collaborations: [], functionalities: [], team: [], achievementsList: [] });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  // --- SECTIONS ---
  const addSection = () => change('sections', [...(form.sections || []), { id: Date.now(), title: '', description: '', images: [] }]);
  const updateSectionData = (idx, f, v) => {
    const list = [...(form.sections || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('sections', list);
  };
  const removeSection = (idx) => change('sections', (form.sections || []).filter((_, i) => i !== idx));
  
  const handleSectionImageUpload = async (secIdx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'research', 'section');
      const list = [...(form.sections || [])];
      list[secIdx] = { ...list[secIdx], images: [...(list[secIdx].images || []), rec.url] };
      change('sections', list);
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };
  const removeSectionImage = (secIdx, imgIdx) => {
    const list = [...(form.sections || [])];
    list[secIdx].images = list[secIdx].images.filter((_, i) => i !== imgIdx);
    change('sections', list);
  };

  // --- FUNCTIONALITIES ---
  const addFunctionality = () => change('functionalities', [...(form.functionalities || []), '']);
  const updateFunctionality = (idx, v) => {
    const list = [...(form.functionalities || [])];
    list[idx] = v;
    change('functionalities', list);
  };
  const removeFunctionality = (idx) => change('functionalities', (form.functionalities || []).filter((_, i) => i !== idx));

  // --- TEAM ---
  const addTeamMember = () => change('team', [...(form.team || []), { id: Date.now(), name: '', role: '', image: '' }]);
  const updateTeamMember = (idx, f, v) => {
    const list = [...(form.team || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('team', list);
  };
  const removeTeamMember = (idx) => change('team', (form.team || []).filter((_, i) => i !== idx));
  const handleTeamImage = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'research', 'team');
      updateTeamMember(idx, 'image', rec.url);
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };

  // --- ACHIEVEMENTS ---
  const addAchievement = () => change('achievementsList', [...(form.achievementsList || []), '']);
  const updateAchievement = (idx, v) => {
    const list = [...(form.achievementsList || [])];
    list[idx] = v;
    change('achievementsList', list);
  };
  const removeAchievement = (idx) => change('achievementsList', (form.achievementsList || []).filter((_, i) => i !== idx));

  // --- PUBLICATIONS ---
  const addPublication = () => change('publications', [{ id: Date.now(), title: '', authors: '', journal: '', year: '', link: '' }, ...(form.publications || [])]);
  const updatePublication = (idx, f, v) => {
    const list = [...(form.publications || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('publications', list);
  };
  const removePublication = (idx) => change('publications', (form.publications || []).filter((_, i) => i !== idx));

  // --- LABS ---
  const addLab = () => change('labs', [...(form.labs || []), { id: Date.now(), name: '', description: '' }]);
  const updateLab = (idx, f, v) => {
    const list = [...(form.labs || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('labs', list);
  };
  const removeLab = (idx) => change('labs', (form.labs || []).filter((_, i) => i !== idx));

  // --- COLLABORATIONS ---
  const addCollaboration = () => change('collaborations', [...(form.collaborations || []), { id: Date.now(), name: '', logoUrl: '', description: '' }]);
  const updateCollaboration = (idx, f, v) => {
    const list = [...(form.collaborations || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('collaborations', list);
  };
  const removeCollaboration = (idx) => change('collaborations', (form.collaborations || []).filter((_, i) => i !== idx));
  const handleCollabLogo = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'research', 'collab-logo');
      updateCollaboration(idx, 'logoUrl', rec.url);
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'research.research_main', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Research Center"
      description="Manage research publications, labs, statistics, and industry collaborations."
      breadcrumb={['Admin', 'Research', 'Research Center']}
      onSave={() => handleSaveDraft(false)}
      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['research.research_main'] || {}); }}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      onReset={handleReset}
      isLoading={loading}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">research.research_main</div></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EditorCard title="Page Title & Intro">
              <div className="space-y-4">
                <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
                <AdminTextarea label="Introduction Text" value={form.content || ''} onChange={e => change('content', e.target.value)} rows={4} />
              </div>
            </EditorCard>

            <EditorCard title="Research Statistics" description="Dynamic counters for the research portal.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput label="Publications" value={form.stats?.publications || ''} onChange={e => changeStat('publications', e.target.value)} placeholder="e.g. 500+" />
                <AdminInput label="Patents Filed" value={form.stats?.patents || ''} onChange={e => changeStat('patents', e.target.value)} placeholder="e.g. 20+" />
                <AdminInput label="Funding Proposals" value={form.stats?.grants || ''} onChange={e => changeStat('grants', e.target.value)} placeholder="e.g. 14+" />
                <AdminInput label="Scholars" value={form.stats?.scholars || ''} onChange={e => changeStat('scholars', e.target.value)} placeholder="e.g. 100+" />
              </div>
            </EditorCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EditorCard title="R&D Cell Functionalities">
              <div className="space-y-4">
                {(form.functionalities || []).map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <button onClick={() => removeFunctionality(idx)} className="mt-1 p-1.5 text-amber-400 hover:text-amber-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="flex-1">
                      <AdminTextarea value={item} onChange={e => updateFunctionality(idx, e.target.value)} rows={2} placeholder="Functionality description..." />
                    </div>
                  </div>
                ))}
                <button onClick={addFunctionality} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-semibold text-sm w-full justify-center">
                  <Plus className="w-4 h-4" /> Add Functionality
                </button>
              </div>
            </EditorCard>

            <EditorCard title="Achievements & Innovations">
              <div className="space-y-4">
                {(form.achievementsList || []).map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <button onClick={() => removeAchievement(idx)} className="mt-1 p-1.5 text-amber-400 hover:text-amber-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="flex-1">
                      <AdminTextarea value={item} onChange={e => updateAchievement(idx, e.target.value)} rows={2} placeholder="Achievement description..." />
                    </div>
                  </div>
                ))}
                <button onClick={addAchievement} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-semibold text-sm w-full justify-center">
                  <Plus className="w-4 h-4" /> Add Achievement
                </button>
              </div>
            </EditorCard>
          </div>

          <EditorCard title="Research Team">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(form.team || []).map((member, idx) => (
                  <div key={member.id} className="p-4 bg-white border border-slate-200 rounded-xl relative flex flex-col gap-3">
                    <button onClick={() => removeTeamMember(idx)} className="absolute top-2 right-2 p-1.5 text-amber-400 hover:text-amber-600 rounded-lg transition-colors z-10"><Trash2 className="w-4 h-4" /></button>
                    <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-full mx-auto flex items-center justify-center overflow-hidden relative group/img">
                      {member.image ? <img loading="lazy" decoding="async" src={member.image} className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-400">Photo</span>}
                      <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleTeamImage(idx, e.target.files[0])} />
                      </label>
                    </div>
                    <AdminInput label="Name" value={member.name} onChange={e => updateTeamMember(idx, 'name', e.target.value)} />
                    <AdminInput label="Role" value={member.role} onChange={e => updateTeamMember(idx, 'role', e.target.value)} />
                  </div>
                ))}
              </div>
              <button onClick={addTeamMember} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-sm w-max">
                <Plus className="w-4 h-4" /> Add Team Member
              </button>
            </div>
          </EditorCard>

          <EditorCard title="Research Sections">
            <div className="space-y-6">
              {(form.sections || []).map((sec, idx) => (
                <div key={sec.id} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm group">
                  <GripVertical className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1 space-y-4">
                      <AdminInput label="Section Title" value={sec.title} onChange={e => updateSectionData(idx, 'title', e.target.value)} placeholder="e.g. Center of Excellence" />
                      <AdminTextarea label="Description" value={sec.description} onChange={e => updateSectionData(idx, 'description', e.target.value)} rows={3} />
                    </div>
                    <button onClick={() => removeSection(idx)} className="p-2 text-amber-500 bg-primary-50 hover:bg-primary-100 rounded-lg shrink-0 mt-1"><Trash2 className="w-5 h-5" /></button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Section Images</label>
                    <div className="flex flex-wrap gap-3">
                      {(sec.images || []).map((img, imgIdx) => (
                        <div key={imgIdx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group/img shadow-sm">
                          <img loading="lazy" decoding="async" src={img} alt="Research" className="w-full h-full object-cover" />
                          <button onClick={() => removeSectionImage(idx, imgIdx)} className="absolute top-1 right-1 p-1 bg-amber-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-white hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-semibold">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleSectionImageUpload(idx, e.target.files[0])} />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addSection} className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-semibold text-sm w-full justify-center transition-colors">
                <Plus className="w-4 h-4" /> Add Research Section
              </button>
            </div>
          </EditorCard>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <EditorCard title="Publications & Journals">
              <div className="space-y-4">
                {(form.publications || []).map((pub, idx) => (
                  <div key={pub.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                    <button onClick={() => removePublication(idx)} className="absolute top-2 right-2 p-1.5 text-amber-400 hover:text-amber-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="space-y-3 pr-8">
                      <AdminInput label="Publication Title" value={pub.title} onChange={e => updatePublication(idx, 'title', e.target.value)} />
                      <AdminInput label="Authors" value={pub.authors} onChange={e => updatePublication(idx, 'authors', e.target.value)} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AdminInput label="Journal / Conference" value={pub.journal} onChange={e => updatePublication(idx, 'journal', e.target.value)} />
                        <AdminInput label="Year" value={pub.year} onChange={e => updatePublication(idx, 'year', e.target.value)} />
                      </div>
                      <AdminInput label="DOI / Link" value={pub.link} onChange={e => updatePublication(idx, 'link', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addPublication} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-sm w-full justify-center">
                  <Plus className="w-4 h-4" /> Add Publication
                </button>
              </div>
            </EditorCard>

            <div className="space-y-6">
              <EditorCard title="Research Labs">
                <div className="space-y-4">
                  {(form.labs || []).map((lab, idx) => (
                    <div key={lab.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                      <button onClick={() => removeLab(idx)} className="absolute top-2 right-2 p-1.5 text-amber-400 hover:text-amber-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <div className="space-y-3 pr-8">
                        <AdminInput label="Lab Name" value={lab.name} onChange={e => updateLab(idx, 'name', e.target.value)} />
                        <AdminTextarea label="Description" value={lab.description} onChange={e => updateLab(idx, 'description', e.target.value)} rows={2} />
                      </div>
                    </div>
                  ))}
                  <button onClick={addLab} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold text-sm w-max">
                    <Plus className="w-4 h-4" /> Add Lab
                  </button>
                </div>
              </EditorCard>

              <EditorCard title="Industry Collaborations">
                <div className="space-y-4">
                  {(form.collaborations || []).map((collab, idx) => (
                    <div key={collab.id} className="p-4 bg-white border border-slate-200 rounded-xl relative flex gap-4 items-start">
                      <button onClick={() => removeCollaboration(idx)} className="absolute top-2 right-2 p-1.5 text-amber-400 hover:text-amber-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative group/collab">
                        {collab.logoUrl ? <img loading="lazy" decoding="async" src={collab.logoUrl} className="w-full h-full object-contain p-1" /> : <span className="text-[9px] text-slate-400">Logo</span>}
                        <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/collab:opacity-100 cursor-pointer transition-opacity">
                          <Upload className="w-3 h-3 mb-1" />
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleCollabLogo(idx, e.target.files[0])} />
                        </label>
                      </div>
                      <div className="flex-1 space-y-3 pr-6">
                        <AdminInput label="Partner Name" value={collab.name} onChange={e => updateCollaboration(idx, 'name', e.target.value)} />
                        <AdminTextarea label="Collaboration Details" value={collab.description} onChange={e => updateCollaboration(idx, 'description', e.target.value)} rows={2} />
                      </div>
                    </div>
                  ))}
                  <button onClick={addCollaboration} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 font-semibold text-sm w-max">
                    <Plus className="w-4 h-4" /> Add Partner
                  </button>
                </div>
              </EditorCard>
            </div>
          </div>
        </div>
        <div className="xl:col-span-4 hidden xl:block">
          <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>
            <div className="p-6 prose prose-sm max-w-none text-slate-600">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{form.title || 'Research Center'}</h3>
              <div className="line-clamp-[12] whitespace-pre-wrap">{form.content || 'Start typing...'}</div>
            </div>
          </div>
        </div>
      </motion.div>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};

export default ResearchEditor;
