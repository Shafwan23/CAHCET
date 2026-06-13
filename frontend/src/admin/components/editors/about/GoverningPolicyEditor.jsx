import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Upload, User } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import { governingCouncilData } from '../../../../data/governingCouncil';

const GoverningPolicyEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ members: governingCouncilData.map(m => ({ id: Date.now() + Math.random(), ...m })) });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('about');
        setPageId(res.data?.id);
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['about.governing_policy']) {
          setForm(JSON.parse(map['about.governing_policy'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Governing Policy data.' });
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
      const content = JSON.stringify(form);
      if (sectionsMap['about.governing_policy']) {
        await cmsService.updateSection(sectionsMap['about.governing_policy'].id, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'about.governing_policy',
          title: 'Governing Council Policy',
          content
        });
        setSectionsMap(prev => ({ ...prev, 'about.governing_policy': newSec.data }));
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Governing Policy data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ members: governingCouncilData.map(m => ({ id: Date.now() + Math.random(), ...m })) });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  const addMember = () => change('members', [...(form.members || []), { id: Date.now(), name: '', designation: '', position: '', photoUrl: '' }]);
  const updateMember = (idx, f, v) => {
    const list = [...(form.members || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('members', list);
  };
  const removeMember = (idx) => change('members', (form.members || []).filter((_, i) => i !== idx));

  const handleUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'about', 'gov-member');
      updateMember(idx, 'photoUrl', rec.url);
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Governing Policy Members"
      description="Manage the list of governing council members."
      breadcrumb={['Admin', 'About', 'Governing Policy']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Council Members" description="Add, edit, or reorder members of the governing council.">
        <div className="space-y-4">
          {(form.members || []).map((member, idx) => (
            <div key={member.id} className="p-4 bg-white border border-slate-200 rounded-xl flex gap-4 relative group hover:border-blue-400 transition-colors shadow-sm">
              <GripVertical className="w-5 h-5 text-slate-300 mt-6 shrink-0 cursor-move" />
              
              <div className="w-20 h-24 shrink-0 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden group/thumb">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-300" />
                )}
                <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(idx, e.target.files[0])} />
                </label>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <AdminInput label="Name" value={member.name} onChange={e => updateMember(idx, 'name', e.target.value)} placeholder="e.g. John Doe" />
                <AdminInput label="Designation" value={member.designation} onChange={e => updateMember(idx, 'designation', e.target.value)} placeholder="e.g. Professor" />
                <AdminInput label="Position" value={member.position} onChange={e => updateMember(idx, 'position', e.target.value)} placeholder="e.g. Chairman" />
              </div>
              
              <button onClick={() => removeMember(idx)} className="absolute -top-3 -right-3 p-1.5 bg-white border border-slate-200 text-amber-500 rounded-full hover:bg-primary-50 hover:border-primary-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addMember} className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 border-dashed text-slate-600 rounded-xl hover:bg-slate-100 transition-colors w-full justify-center text-sm font-semibold">
            <Plus className="w-4 h-4" /> Add New Member
          </button>
        </div>
      </EditorCard>
    </EditorPage>
  );
};

export default GoverningPolicyEditor;
