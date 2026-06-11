import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Upload, X } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const ResearchEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', content: '', stats: {}, sections: [], publications: [], labs: [], collaborations: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('research');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['research.research_main']) {
          setForm(JSON.parse(map['research.research_main'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Research data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));
  const changeStat = (field, value) => setForm(p => ({ ...p, stats: { ...(p.stats || {}), [field]: value } }));

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      if (sectionsMap['research.research_main']) {
        await cmsService.updateSection(sectionsMap['research.research_main'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Research data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ title: '', content: '', stats: {}, sections: [], publications: [], labs: [], collaborations: [] });
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

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Research Center"
      description="Manage research publications, labs, statistics, and industry collaborations."
      breadcrumb={['Admin', 'Research', 'Research Center']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EditorCard title="Page Title & Intro">
            <div className="space-y-4">
              <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
              <AdminTextarea label="Introduction Text" value={form.content || ''} onChange={e => change('content', e.target.value)} rows={4} />
            </div>
          </EditorCard>

          <EditorCard title="Research Statistics" description="Dynamic counters for the research portal.">
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="Publications" value={form.stats?.publications || ''} onChange={e => changeStat('publications', e.target.value)} placeholder="e.g. 500+" />
              <AdminInput label="Patents Filed" value={form.stats?.patents || ''} onChange={e => changeStat('patents', e.target.value)} placeholder="e.g. 20+" />
              <AdminInput label="Research Grants" value={form.stats?.grants || ''} onChange={e => changeStat('grants', e.target.value)} placeholder="e.g. ₹5 Cr+" />
              <AdminInput label="Scholars" value={form.stats?.scholars || ''} onChange={e => changeStat('scholars', e.target.value)} placeholder="e.g. 100+" />
            </div>
          </EditorCard>
        </div>

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
                        <img src={img} alt="Research" className="w-full h-full object-cover" />
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
                    <div className="grid grid-cols-2 gap-4">
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
                      {collab.logoUrl ? <img src={collab.logoUrl} className="w-full h-full object-contain p-1" /> : <span className="text-[9px] text-slate-400">Logo</span>}
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
    </EditorPage>
  );
};

export default ResearchEditor;
