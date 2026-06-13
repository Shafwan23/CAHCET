import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, BookOpen } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';

const TeachingMethodologyEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', content: '', methods: [], highlights: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionId, setSectionId] = useState(null);
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const page = await cmsService.getPage('academics');
      setPageId(page.data?.id);
      const section = page.data?.sections?.find(s => s.sectionKey === 'academics.teachingMethodology');
      if (section) {
        setSectionId(section.id);
        if (section.content) {
          setForm(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
        }
      }
    } catch (err) {
      toast({ type: 'error', title: 'Failed to load data' });
    } finally {
      setPageLoading(false);
    }
  };

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionId) {
        await cmsService.updateSection(sectionId, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'academics.teachingMethodology',
          title: 'Teaching Methodology',
          content
        });
        setSectionId(newSec.data?.id);
      }
      toast({ type: 'success', title: 'Changes published' });
    } catch (err) {
      toast({ type: 'error', title: 'Failed to save' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = handleSave;

  const addMethod = () => change('methods', [...(form.methods || []), { id: Date.now(), title: '', description: '', icon: 'BookOpen' }]);
  const updateMethod = (idx, f, v) => {
    const list = [...(form.methods || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('methods', list);
  };
  const removeMethod = (idx) => change('methods', (form.methods || []).filter((_, i) => i !== idx));

  const addHighlight = () => change('highlights', [...(form.highlights || []), '']);
  const updateHighlight = (idx, v) => {
    const list = [...(form.highlights || [])];
    list[idx] = v;
    change('highlights', list);
  };
  const removeHighlight = (idx) => change('highlights', (form.highlights || []).filter((_, i) => i !== idx));

  return (
    <EditorPage
      title="Teaching Methodology"
      description="Edit the educational approaches, learning methodologies, and smart classroom strategies."
      breadcrumb={['Admin', 'Academics', 'Teaching Methodology']}
      onSave={handleSave}
      onPublish={handlePublish}
      onReset={() => loadData()}
      isLoading={loading || pageLoading}
    >
      <div className="space-y-6">
        <EditorCard title="Main Introduction" description="The primary overview text displayed at the top.">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
            <AdminTextarea label="Introduction Text" value={form.content || ''} onChange={e => change('content', e.target.value)} rows={4} />
          </div>
        </EditorCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EditorCard title="Methodology Cards" description="Interactive cards showcasing specific teaching techniques.">
              <div className="space-y-4">
                {(form.methods || []).map((method, idx) => (
                  <div key={method.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 relative">
                    <GripVertical className="w-5 h-5 text-slate-300 mt-2 shrink-0 cursor-move" />
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AdminInput label="Title" value={method.title} onChange={e => updateMethod(idx, 'title', e.target.value)} />
                        <AdminInput label="Icon Name (Lucide)" value={method.icon} onChange={e => updateMethod(idx, 'icon', e.target.value)} placeholder="e.g. Monitor, Users" />
                      </div>
                      <AdminTextarea label="Description" value={method.description} onChange={e => updateMethod(idx, 'description', e.target.value)} rows={2} />
                    </div>
                    <button onClick={() => removeMethod(idx)} className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-amber-400 rounded-full shadow-sm hover:bg-primary-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addMethod} className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold w-max">
                  <Plus className="w-4 h-4" /> Add Method Card
                </button>
              </div>
            </EditorCard>
          </div>

          <div className="lg:col-span-1">
            <EditorCard title="Key Highlights" description="Bullet points summarizing the core focus.">
              <div className="space-y-3">
                {(form.highlights || []).map((highlight, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <input 
                      type="text" 
                      value={highlight} 
                      onChange={e => updateHighlight(idx, e.target.value)} 
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                      placeholder="Highlight point..."
                    />
                    <button onClick={() => removeHighlight(idx)} className="p-1.5 text-amber-400 hover:bg-primary-50 rounded-lg h-max mt-0.5"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addHighlight} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  <Plus className="w-4 h-4" /> Add Highlight
                </button>
              </div>
            </EditorCard>
          </div>
        </div>
      </div>
    </EditorPage>
  );
};

export default TeachingMethodologyEditor;
