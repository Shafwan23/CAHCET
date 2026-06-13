import React, { useState, useEffect } from 'react';
import { Target, Lightbulb, Heart, Users, GripVertical, Trash2, Plus, Shield, Award, Star } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { valuesPhilosophyData } from '../../../../data/valuesPhilosophy';

// Helper to get string name of icon component
const getIconName = (iconObj) => {
  if (typeof iconObj === 'string') return iconObj;
  if (!iconObj) return 'Target';
  return iconObj.name || iconObj.displayName || 'Target';
};

const defaultValuesState = {
  qualityPolicy: {
    title: valuesPhilosophyData.qualityPolicy.title,
    content: valuesPhilosophyData.qualityPolicy.content,
    focusAreas: [...valuesPhilosophyData.qualityPolicy.focusAreas]
  },
  coreValues: valuesPhilosophyData.coreValues.map(v => ({
    title: v.title,
    desc: v.desc,
    icon: getIconName(v.icon)
  })),
  philosophy: {
    title: valuesPhilosophyData.philosophy.title,
    content: [...valuesPhilosophyData.philosophy.content]
  },
  studentCentric: valuesPhilosophyData.studentCentric.map(s => ({
    title: s.title,
    desc: s.desc,
    icon: getIconName(s.icon)
  })),
  ethics: {
    title: valuesPhilosophyData.ethics.title,
    content: valuesPhilosophyData.ethics.content
  }
};

const ValuesPhilosophyEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('vision-mission');
  
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [formVision, setFormVision] = useState({});
  const [formMission, setFormMission] = useState({ statements: [] });
  const [formValues, setFormValues] = useState(defaultValuesState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPage('about');
      setPageId(res.data?.id);
      const sectionsArray = res.data?.sections || [];
      
      const sMap = {};
      sectionsArray.forEach(sec => { sMap[sec.sectionKey] = sec; });
      setSectionsMap(sMap);

      if (sMap['about.vision']) setFormVision(JSON.parse(sMap['about.vision'].content || '{}'));
      if (sMap['about.mission']) {
        const m = JSON.parse(sMap['about.mission'].content || '{"statements":[]}');
        setFormMission({
          ...m,
          statements: (m.statements || []).map(s => ({ ...s, icon: getIconName(s.icon) }))
        });
      }
      if (sMap['about.values']) {
        setFormValues(JSON.parse(sMap['about.values'].content));
      }
      
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
      
      // Save vision
      if (sectionsMap['about.vision']) {
        updates.push(cmsService.updateSection(sectionsMap['about.vision'].id, { content: JSON.stringify(formVision) }));
      } else {
        updates.push(cmsService.createSection({
          pageId,
          sectionKey: 'about.vision',
          title: 'Institution Vision',
          content: JSON.stringify(formVision)
        }));
      }

      // Save mission
      if (sectionsMap['about.mission']) {
        updates.push(cmsService.updateSection(sectionsMap['about.mission'].id, { content: JSON.stringify(formMission) }));
      } else {
        updates.push(cmsService.createSection({
          pageId,
          sectionKey: 'about.mission',
          title: 'Institution Mission',
          content: JSON.stringify(formMission)
        }));
      }

      // Save values (contains qualityPolicy, coreValues, philosophy, studentCentric, ethics)
      if (sectionsMap['about.values']) {
        updates.push(cmsService.updateSection(sectionsMap['about.values'].id, { content: JSON.stringify(formValues) }));
      } else {
        updates.push(cmsService.createSection({
          pageId,
          sectionKey: 'about.values',
          title: 'Ethos, Policy and Values',
          content: JSON.stringify(formValues)
        }));
      }

      await Promise.all(updates);
      
      // Reload page sections to refresh sectionsMap with newly created IDs
      const res = await cmsService.getPage('about');
      const sMap = {};
      res.data?.sections?.forEach(sec => { sMap[sec.sectionKey] = sec; });
      setSectionsMap(sMap);

      toast({ type: 'success', title: 'Saved!', message: 'Ethos, values and philosophy changes saved.' });
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

  // Quality Policy helpers
  const updateQualityPolicy = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      qualityPolicy: {
        ...prev.qualityPolicy,
        [field]: value
      }
    }));
  };

  const addFocusArea = () => {
    setFormValues(prev => ({
      ...prev,
      qualityPolicy: {
        ...prev.qualityPolicy,
        focusAreas: [...(prev.qualityPolicy.focusAreas || []), '']
      }
    }));
  };

  const updateFocusArea = (index, value) => {
    setFormValues(prev => {
      const list = [...(prev.qualityPolicy.focusAreas || [])];
      list[index] = value;
      return {
        ...prev,
        qualityPolicy: {
          ...prev.qualityPolicy,
          focusAreas: list
        }
      };
    });
  };

  const removeFocusArea = (index) => {
    setFormValues(prev => ({
      ...prev,
      qualityPolicy: {
        ...prev.qualityPolicy,
        focusAreas: (prev.qualityPolicy.focusAreas || []).filter((_, i) => i !== index)
      }
    }));
  };

  // Core Values helpers
  const addCoreValue = () => {
    setFormValues(prev => ({
      ...prev,
      coreValues: [...(prev.coreValues || []), { title: 'New Value', desc: '', icon: 'Star' }]
    }));
  };

  const updateCoreValue = (index, field, value) => {
    setFormValues(prev => {
      const list = [...(prev.coreValues || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, coreValues: list };
    });
  };

  const removeCoreValue = (index) => {
    setFormValues(prev => ({
      ...prev,
      coreValues: (prev.coreValues || []).filter((_, i) => i !== index)
    }));
  };

  // Student-Centric helpers
  const addStudentCentric = () => {
    setFormValues(prev => ({
      ...prev,
      studentCentric: [...(prev.studentCentric || []), { title: 'New Program', desc: '', icon: 'Users' }]
    }));
  };

  const updateStudentCentric = (index, field, value) => {
    setFormValues(prev => {
      const list = [...(prev.studentCentric || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, studentCentric: list };
    });
  };

  const removeStudentCentric = (index) => {
    setFormValues(prev => ({
      ...prev,
      studentCentric: (prev.studentCentric || []).filter((_, i) => i !== index)
    }));
  };

  const handleReset = () => {
    setFormVision(valuesPhilosophyData.vision);
    setFormMission({
      title: valuesPhilosophyData.mission.title,
      statements: valuesPhilosophyData.mission.statements.map(s => ({ ...s, icon: getIconName(s.icon) }))
    });
    setFormValues(defaultValuesState);
    toast({ type: 'info', title: 'Reset', message: 'Reverted to default configurations.' });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  const tabClass = (tab) => 
    `px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
      activeTab === tab 
        ? 'bg-slate-900 text-white shadow-sm' 
        : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const availableIcons = ['Shield', 'Star', 'Lightbulb', 'Users', 'Heart', 'Target', 'Award'];

  return (
    <EditorPage
      title="Values & Philosophy Ethos"
      description="Manage the college's vision, mission, quality policies, core values, pedagogy, student centric approach and ethics."
      breadcrumb={['Admin', 'About', 'Values & Philosophy']}
      onSave={handleSave}
      isLoading={saving}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 border border-slate-150 rounded-2xl w-max">
          <button className={tabClass('vision-mission')} onClick={() => setActiveTab('vision-mission')}>Vision & Mission</button>
          <button className={tabClass('quality-policy')} onClick={() => setActiveTab('quality-policy')}>Quality Policy</button>
          <button className={tabClass('core-values')} onClick={() => setActiveTab('core-values')}>Core Values</button>
          <button className={tabClass('philosophy-ethics')} onClick={() => setActiveTab('philosophy-ethics')}>Philosophy & Ethics</button>
          <button className={tabClass('student-centric')} onClick={() => setActiveTab('student-centric')}>Student Centric Approach</button>
        </div>

        {/* ── VISION & MISSION ────────────────────────────────────────────── */}
        {activeTab === 'vision-mission' && (
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
              <div className="mt-4">
                <AdminInput
                  label="Vision Author"
                  value={formVision.author || ''}
                  onChange={e => setFormVision(p => ({ ...p, author: e.target.value }))}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AdminInput
                          label="Pillar Title"
                          value={item.title || ''}
                          onChange={e => updateMissionStatement(index, 'title', e.target.value)}
                        />
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Pillar Icon</label>
                          <select
                            value={item.icon || 'Target'}
                            onChange={e => updateMissionStatement(index, 'icon', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                          >
                            {availableIcons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                          </select>
                        </div>
                      </div>
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
        )}

        {/* ── QUALITY POLICY ────────────────────────────────────────────── */}
        {activeTab === 'quality-policy' && (
          <div className="space-y-6">
            <EditorCard title="Quality Policy Content" description="The primary quality statements and directives.">
              <AdminInput
                label="Section Title"
                value={formValues.qualityPolicy?.title || ''}
                onChange={e => updateQualityPolicy('title', e.target.value)}
              />
              <div className="mt-4">
                <AdminTextarea
                  label="Quality Statement"
                  value={formValues.qualityPolicy?.content || ''}
                  onChange={e => updateQualityPolicy('content', e.target.value)}
                  rows={4}
                />
              </div>
            </EditorCard>

            <EditorCard title="Focus Areas" description="List of continuous focus points.">
              <div className="space-y-3">
                {(formValues.qualityPolicy?.focusAreas || []).map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={area}
                      onChange={e => updateFocusArea(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      placeholder="Focus area point..."
                    />
                    <button onClick={() => removeFocusArea(index)} className="p-2 text-amber-400 hover:bg-primary-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addFocusArea} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-600 bg-primary-50 hover:bg-primary-100 rounded-lg mt-2">
                  <Plus className="w-4 h-4" /> Add Focus Point
                </button>
              </div>
            </EditorCard>
          </div>
        )}

        {/* ── CORE VALUES ───────────────────────────────────────────────── */}
        {activeTab === 'core-values' && (
          <EditorCard title="Core Value Pillars" description="College foundational pillars and ethos cards.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formValues.coreValues || []).map((val, index) => (
                <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative group">
                  <div className="space-y-3">
                    <AdminInput
                      label="Value Title"
                      value={val.title}
                      onChange={e => updateCoreValue(index, 'title', e.target.value)}
                    />
                    <div className="grid grid-cols-1 gap-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">Value Icon</label>
                      <select
                        value={val.icon || 'Shield'}
                        onChange={e => updateCoreValue(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                      >
                        {availableIcons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </div>
                    <AdminTextarea
                      label="Description"
                      value={val.desc}
                      onChange={e => updateCoreValue(index, 'desc', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <button onClick={() => removeCoreValue(index)} className="absolute top-2 right-2 p-1.5 text-amber-500 hover:bg-primary-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addCoreValue} className="mt-4 flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Add Core Value
            </button>
          </EditorCard>
        )}

        {/* ── PHILOSOPHY & ETHICS ────────────────────────────────────────── */}
        {activeTab === 'philosophy-ethics' && (
          <div className="space-y-6">
            <EditorCard title="Educational Philosophy" description="Core college library/pedagogy statements.">
              <AdminInput
                label="Philosophy Title"
                value={formValues.philosophy?.title || ''}
                onChange={e => setFormValues(prev => ({
                  ...prev,
                  philosophy: { ...prev.philosophy, title: e.target.value }
                }))}
              />
              <div className="mt-4">
                <AdminTextarea
                  label="Philosophy Content Paragraphs (Double line break between paragraphs)"
                  value={formValues.philosophy?.content?.join('\n\n') || ''}
                  onChange={e => setFormValues(prev => ({
                    ...prev,
                    philosophy: { ...prev.philosophy, content: e.target.value.split('\n\n') }
                  }))}
                  rows={8}
                />
              </div>
            </EditorCard>

            <EditorCard title="Ethics & Social Responsibility" description="Institutional codes of conduct.">
              <AdminInput
                label="Ethics Section Title"
                value={formValues.ethics?.title || ''}
                onChange={e => setFormValues(prev => ({
                  ...prev,
                  ethics: { ...prev.ethics, title: e.target.value }
                }))}
              />
              <div className="mt-4">
                <AdminTextarea
                  label="Ethics Policy Statement"
                  value={formValues.ethics?.content || ''}
                  onChange={e => setFormValues(prev => ({
                    ...prev,
                    ethics: { ...prev.ethics, content: e.target.value }
                  }))}
                  rows={4}
                />
              </div>
            </EditorCard>
          </div>
        )}

        {/* ── STUDENT-CENTRIC ───────────────────────────────────────────── */}
        {activeTab === 'student-centric' && (
          <EditorCard title="Student-Centric Learning Approach" description="Support services, skill development and mentorship.">
            <div className="space-y-4">
              {(formValues.studentCentric || []).map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative group flex gap-3">
                  <GripVertical className="w-5 h-5 text-slate-300 mt-2 shrink-0 cursor-move" />
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <AdminInput
                        label="Program Name/Title"
                        value={item.title}
                        onChange={e => updateStudentCentric(index, 'title', e.target.value)}
                      />
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Icon Selection</label>
                        <select
                          value={item.icon || 'Users'}
                          onChange={e => updateStudentCentric(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                        >
                          {availableIcons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                      </div>
                    </div>
                    <AdminTextarea
                      label="Service description"
                      value={item.desc}
                      onChange={e => updateStudentCentric(index, 'desc', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <button onClick={() => removeStudentCentric(index)} className="p-2 text-amber-400 hover:text-amber-500 hover:bg-primary-50 rounded-lg transition-colors h-max">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button onClick={addStudentCentric} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
                <Plus className="w-4 h-4" /> Add Student Program
              </button>
            </div>
          </EditorCard>
        )}
      </div>
    </EditorPage>
  );
};

export default ValuesPhilosophyEditor;
