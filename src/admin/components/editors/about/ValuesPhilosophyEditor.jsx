import React, { useState, useEffect } from 'react';
import { Target, Lightbulb, Heart, Users, GripVertical, Trash2, Plus, Quote } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

const ValuesPhilosophyEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [sectionsMap, setSectionsMap] = useState({});
  const [formVision, setFormVision] = useState({});
  const [formMission, setFormMission] = useState({ statements: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPage('about');
      const sectionsArray = res.data?.sections || [];
      
      const sMap = {};
      sectionsArray.forEach(sec => { sMap[sec.sectionKey] = sec; });
      setSectionsMap(sMap);

      if (sMap['about.vision']) setFormVision(JSON.parse(sMap['about.vision'].content || '{}'));
      if (sMap['about.mission']) setFormMission(JSON.parse(sMap['about.mission'].content || '{"statements":[]}'));
      
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
      if (sectionsMap['about.vision']) {
        updates.push(cmsService.updateSection(sectionsMap['about.vision'].id, { content: JSON.stringify(formVision) }));
      }
      if (sectionsMap['about.mission']) {
        updates.push(cmsService.updateSection(sectionsMap['about.mission'].id, { content: JSON.stringify(formMission) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: 'Values and philosophy changes saved to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addMissionStatement = () => {
    setFormMission(prev => ({
      ...prev,
      statements: [...(prev.statements || []), { id: Date.now(), title: 'New Area', desc: '', icon: 'Target' }]
    }));
  };

  const updateMissionStatement = (index, field, value) => {
    setFormMission(prev => {
      const newItems = [...(prev.statements || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, statements: newItems };
    });
  };

  const removeMissionStatement = (index) => {
    setFormMission(prev => ({
      ...prev,
      statements: (prev.statements || []).filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Values & Philosophy (Database)"
      description="Manage the institution's core values, mission, and vision statements."
      breadcrumb={['Admin', 'About', 'Values & Philosophy']}
      onSave={handleSave}
      isLoading={saving}
    >
      <div className="space-y-6">
        <EditorCard title="Institution Vision" description="The overarching vision statement.">
          <AdminInput
            label="Vision Title"
            value={formVision.title || ''}
            onChange={e => setFormVision(p => ({ ...p, title: e.target.value }))}
          />
          <div className="mt-4">
            <AdminTextarea
              label="Vision Statement"
              value={formVision.statement || ''}
              onChange={e => setFormVision(p => ({ ...p, statement: e.target.value }))}
              rows={3}
            />
          </div>
        </EditorCard>

        <EditorCard title="Institution Mission" description="The core mission pillars.">
          <div className="mb-6">
            <AdminInput
              label="Mission Title"
              value={formMission.title || ''}
              onChange={e => setFormMission(p => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div className="space-y-4">
            {(formMission.statements || []).map((item, index) => (
              <div key={item.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex gap-3">
                <GripVertical className="w-5 h-5 text-slate-300 mt-2 shrink-0 cursor-move" />
                <div className="flex-1 space-y-3">
                  <AdminInput
                    label="Pillar Title"
                    value={item.title || ''}
                    onChange={e => updateMissionStatement(index, 'title', e.target.value)}
                  />
                  <AdminTextarea
                    label="Description"
                    value={item.desc || ''}
                    onChange={e => updateMissionStatement(index, 'desc', e.target.value)}
                    rows={2}
                  />
                </div>
                <button onClick={() => removeMissionStatement(index)} className="p-2 text-amber-400 hover:text-amber-500 hover:bg-primary-50 rounded-lg transition-colors h-max">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button onClick={addMissionStatement} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Add Mission Area
            </button>
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default ValuesPhilosophyEditor;
