import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, CheckCircle, ArrowLeft, Building2, UploadCloud, Monitor, Image as ImageIcon, CheckSquare } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

const InstitutionEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  const [activeTab, setActiveTab] = useState('hero'); // hero, college, history, parentOrg

  const [formHero, setFormHero] = useState({});
  const [formCollege, setFormCollege] = useState({});
  const [formHistory, setFormHistory] = useState({ sections: [] });
  const [formParentOrg, setFormParentOrg] = useState({});

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('about');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['about.hero']) setFormHero(JSON.parse(map['about.hero'].draftContent || map['about.hero'].content || '{}'));
      if (map['about.college']) setFormCollege(JSON.parse(map['about.college'].draftContent || map['about.college'].content || '{}'));
      if (map['about.history']) setFormHistory(JSON.parse(map['about.history'].draftContent || map['about.history'].content || '{"sections":[]}'));
      if (map['about.parentOrganization']) setFormParentOrg(JSON.parse(map['about.parentOrganization'].draftContent || map['about.parentOrganization'].content || '{}'));
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to load data.' }); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPage(); }, []);

  const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const updates = [];
      const pushUpdate = async (key, title, content) => {
        if (sectionsMap[key]) {
          updates.push(cmsService.updateSection(sectionsMap[key].id, { draftContent: content, _isSilentDraft: isSilent }));
        } else {
          const res = await cmsService.createSection({ pageId, sectionKey: key, title, draftContent: content, _isSilentDraft: isSilent });
          setSectionsMap(prev => ({ ...prev, [key]: res.data }));
        }
      };

      await pushUpdate('about.hero', 'Hero Banner', JSON.stringify(formHero));
      await pushUpdate('about.college', 'College Overview', JSON.stringify(formCollege));
      await pushUpdate('about.history', 'History', JSON.stringify(formHistory));
      await pushUpdate('about.parentOrganization', 'Parent Organization', JSON.stringify(formParentOrg));

      await Promise.all(updates);
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Institution sections saved to draft.' });
    } catch (err) { toast({ type: 'error', title: 'Error', message: 'Failed to save.' }); } finally { setLoading(false); }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'about', 'banner');
      const newHero = { ...formHero, bannerUrl: rec.url };
      setFormHero(newHero);
      handleSaveDraft(true);
    } catch { toast({ type: 'error', title: 'Upload Failed' }); }
    setUploading(false);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const rec = await fileService.upload(file, 'about', 'history');
      const newSections = [...(formHistory.sections || [])];
      newSections[index] = { ...newSections[index], image: rec.url };
      setFormHistory(p => ({ ...p, sections: newSections }));
      handleSaveDraft(true);
    } catch {}
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, `about.${activeTab}`, formHero);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage title="Institution Records" description="Manage main information about the college." breadcrumb={['Admin', 'About', 'Institution']} onSave={() => handleSaveDraft(false)} onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap[`about.${activeTab}`]); }} onReset={fetchPage} isLoading={loading} status={status} lastModified={lastModified} validationIssues={validationIssues}>
      <motion.div key="main" {...fadeUp} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border bg-indigo-50 text-indigo-700 border-indigo-100 relative overflow-hidden"><CheckSquare className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">Sections Managed</span><span className="text-3xl font-extrabold">4</span></div>
          <div className="p-5 rounded-2xl border bg-amber-50 text-amber-700 border-amber-100 relative overflow-hidden"><ImageIcon className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10"/><span className="text-[10px] font-bold uppercase block mb-1">History Images</span><span className="text-3xl font-extrabold">{(formHistory.sections || []).length}</span></div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-2xl flex gap-2 sticky top-[132px] z-20 shadow-sm w-max">
          <button onClick={() => setActiveTab('hero')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'hero' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>Hero Section</button>
          <button onClick={() => setActiveTab('college')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'college' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>Overview</button>
          <button onClick={() => setActiveTab('parentOrganization')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'parentOrganization' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>Parent Org</button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>History Timeline</button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-6">
            {activeTab === 'hero' && (
              <EditorCard title="Hero Configuration">
                <div className="space-y-6">
                  <div className="aspect-[21/9] rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative group">
                    {formHero.bannerUrl ? (
                      <><img src={formHero.bannerUrl} alt="Banner" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><label className="cursor-pointer text-white text-xs font-bold px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 backdrop-blur-md"><UploadCloud className="w-4 h-4 inline mr-2"/>Change Banner<input type="file" className="hidden" onChange={handleBannerUpload} disabled={uploading} /></label></div></>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors"><UploadCloud className="w-8 h-8"/> <span className="text-sm font-bold">Upload Banner</span><input type="file" className="hidden" onChange={handleBannerUpload} disabled={uploading} /></label>
                    )}
                  </div>
                  <AdminInput label="Hero Title" value={formHero.title || ''} onChange={e => setFormHero(p => ({ ...p, title: e.target.value }))} placeholder="Welcome to CAHCET" />
                  <AdminTextarea label="Hero Subtitle" value={formHero.subtitle || ''} onChange={e => setFormHero(p => ({ ...p, subtitle: e.target.value }))} rows={3} placeholder="A premier engineering institution..." />
                </div>
              </EditorCard>
            )}

            {activeTab === 'college' && (
              <EditorCard title="College Overview">
                <AdminInput label="Overview Title" value={formCollege.title || ''} onChange={e => setFormCollege(p => ({ ...p, title: e.target.value }))} />
                <div className="mt-4"><AdminTextarea label="Overview Content" value={formCollege.overview || ''} onChange={e => setFormCollege(p => ({ ...p, overview: e.target.value }))} rows={8} /></div>
              </EditorCard>
            )}

            {activeTab === 'parentOrganization' && (
              <EditorCard title="Parent Organization (MMES)">
                <AdminInput label="Organization Name" value={formParentOrg.title || ''} onChange={e => setFormParentOrg(p => ({ ...p, title: e.target.value }))} />
                <div className="mt-4"><AdminTextarea label="Description" value={formParentOrg.description || ''} onChange={e => setFormParentOrg(p => ({ ...p, description: e.target.value }))} rows={6} /></div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <AdminInput label="Short Name" value={formParentOrg.shortName || ''} onChange={e => setFormParentOrg(p => ({ ...p, shortName: e.target.value }))} />
                  <AdminInput label="Established Year" value={formParentOrg.since || ''} onChange={e => setFormParentOrg(p => ({ ...p, since: e.target.value }))} />
                </div>
              </EditorCard>
            )}

            {activeTab === 'history' && (
              <EditorCard title="History Timeline">
                <div className="space-y-6">
                  {(formHistory.sections || []).map((section, index) => (
                    <div key={section.id || index} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm relative group">
                      <button onClick={() => setFormHistory(p => ({ ...p, sections: p.sections.filter((_, i) => i !== index) }))} className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                      <div className="space-y-4 pr-12">
                        <AdminInput label="Timeline Era / Title" value={section.title || ''} onChange={e => { const n = [...formHistory.sections]; n[index].title = e.target.value; setFormHistory(p => ({ ...p, sections: n })); }} />
                        <AdminTextarea label="Historical Details" value={section.text || ''} onChange={e => { const n = [...formHistory.sections]; n[index].text = e.target.value; setFormHistory(p => ({ ...p, sections: n })); }} rows={3} />
                        <div className="flex items-center gap-4">
                           {section.image && <img src={section.image} className="w-20 h-20 object-cover rounded-xl border border-slate-200" />}
                           <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl cursor-pointer hover:bg-slate-200"><UploadCloud className="w-4 h-4"/> Upload Photo<input type="file" className="hidden" onChange={e => handleImageUpload(e, index)}/></label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setFormHistory(p => ({ ...p, sections: [...(p.sections || []), { id: Date.now(), title: '', text: '', image: '' }] }))} className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"><Plus className="w-4 h-4" /> Add History Entry</button>
                </div>
              </EditorCard>
            )}
          </div>
          
          <div className="xl:col-span-4 hidden xl:block">
            <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview Area</span></div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                  <Building2 className="w-12 h-12 mb-3 text-slate-200" />
                  <p className="text-sm font-medium">Click "Preview Changes" on the action bar to see the full page rendering in the Modal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}
    </EditorPage>
  );
};
export default InstitutionEditor;
