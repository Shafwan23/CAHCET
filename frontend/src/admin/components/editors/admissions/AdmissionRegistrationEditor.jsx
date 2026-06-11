import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Search, Laptop } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { DEPARTMENTS } from '../../../services/departmentService';

const AdmissionRegistrationEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});

  const [formPrograms, setFormPrograms] = useState({ courses: [] });
  const [formProcess, setFormProcess] = useState({ steps: [] });
  const [courseSearch, setCourseSearch] = useState('');

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

      if (sMap['admissions.programs']) setFormPrograms(JSON.parse(sMap['admissions.programs'].content || '{"courses":[]}'));
      if (sMap['admissions.process']) setFormProcess(JSON.parse(sMap['admissions.process'].content || '{"steps":[]}'));
      
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
      if (sectionsMap['admissions.programs']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.programs'].id, { content: JSON.stringify(formPrograms) }));
      }
      if (sectionsMap['admissions.process']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.process'].id, { content: JSON.stringify(formProcess) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: 'Admission Registration data saved directly to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  // --- COURSES ---
  const addCourse = () => setFormPrograms(prev => ({
    ...prev,
    courses: [{ id: Date.now(), name: '', duration: '', eligibility: '', intake: '', description: '', icon: 'Laptop', featured: false, department: 'CSE' }, ...(prev.courses || [])]
  }));
  const updateCourse = (idx, f, v) => {
    setFormPrograms(prev => {
      const list = [...(prev.courses || [])];
      list[idx] = { ...list[idx], [f]: v };
      return { ...prev, courses: list };
    });
  };
  const removeCourse = (idx) => setFormPrograms(prev => ({
    ...prev,
    courses: (prev.courses || []).filter((_, i) => i !== idx)
  }));

  // --- ACCREDITATIONS ---
  // --- STEPS ---
  const addStep = () => setFormProcess(prev => ({
    ...prev,
    steps: [...(prev.steps || []), { id: Date.now(), stepNumber: `0${(prev.steps?.length || 0) + 1}`, title: '', description: '', icon: 'CheckCircle' }]
  }));
  const updateStep = (idx, f, v) => {
    setFormProcess(prev => {
      const list = [...(prev.steps || [])];
      list[idx] = { ...list[idx], [f]: v };
      return { ...prev, steps: list };
    });
  };
  const removeStep = (idx) => setFormProcess(prev => ({
    ...prev,
    steps: (prev.steps || []).filter((_, i) => i !== idx)
  }));

  const filteredCourses = (formPrograms.courses || []).map((c, i) => ({ ...c, _origIdx: i })).filter(c => 
    (c.name || '').toLowerCase().includes(courseSearch.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Admission 2026 Registration"
      description="Manage the primary admissions portal, courses offered, and application steps."
      breadcrumb={['Admin', 'Admissions', 'Registration 2026']}
      onSave={handleSave}
      isLoading={saving}
    >
      <div className="space-y-8">
        {/* SECTION 1: COURSES OFFERED */}
        <EditorCard title="Section 1: Courses Offered" description="Manage programs available for 2026 admissions.">
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" placeholder="Search courses..." value={courseSearch} onChange={e => setCourseSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button onClick={addCourse} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-semibold text-sm">
              <Plus className="w-4 h-4" /> Add Course
            </button>
          </div>

          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const idx = course._origIdx;
              return (
                <div key={course.id} className="p-5 bg-white border border-slate-200 rounded-xl relative shadow-sm group hover:border-blue-300 transition-colors">
                  <GripVertical className="absolute left-2 top-5 w-5 h-5 text-slate-300 cursor-move" />
                  <div className="pl-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdminInput label="Course Name" value={course.name} onChange={e => updateCourse(idx, 'name', e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Department</label>
                            <select value={course.department} onChange={e => updateCourse(idx, 'department', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                              {Object.values(DEPARTMENTS).map(d => <option key={d.key} value={d.short}>{d.short}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Featured</label>
                            <select value={course.featured} onChange={e => updateCourse(idx, 'featured', e.target.value === 'true')} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                              <option value="false">No</option>
                              <option value="true">Yes</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeCourse(idx)} className="p-2 text-amber-400 bg-primary-50 hover:bg-primary-100 hover:text-amber-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <AdminInput label="Duration" value={course.duration} onChange={e => updateCourse(idx, 'duration', e.target.value)} placeholder="e.g. 4 Years" />
                      <AdminInput label="Intake" value={course.intake} onChange={e => updateCourse(idx, 'intake', e.target.value)} placeholder="e.g. 120 Seats" />
                      <AdminInput label="Icon (Lucide)" value={course.icon} onChange={e => updateCourse(idx, 'icon', e.target.value)} placeholder="e.g. Laptop" />
                    </div>
                    
                    <AdminInput label="Eligibility Criteria" value={course.eligibility} onChange={e => updateCourse(idx, 'eligibility', e.target.value)} />
                    <AdminTextarea label="Description" value={course.description} onChange={e => updateCourse(idx, 'description', e.target.value)} rows={2} />
                  </div>
                </div>
              );
            })}
          </div>
        </EditorCard>

        {/* SECTION 2: HOW TO APPLY */}
        <EditorCard title="Section 2: Application Steps" description="Step-by-step guide for applicants.">
          <div className="space-y-4">
            {(formProcess.steps || []).map((step, idx) => (
              <div key={step.id} className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl relative group">
                <GripVertical className="mt-2 text-slate-300 shrink-0 cursor-move" />
                <div className="w-16 shrink-0">
                  <AdminInput label="Step #" value={step.stepNumber} onChange={e => updateStep(idx, 'stepNumber', e.target.value)} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput label="Title" value={step.title} onChange={e => updateStep(idx, 'title', e.target.value)} />
                    <AdminInput label="Icon (Lucide)" value={step.icon} onChange={e => updateStep(idx, 'icon', e.target.value)} />
                  </div>
                  <AdminTextarea label="Description" value={step.description} onChange={e => updateStep(idx, 'description', e.target.value)} rows={2} />
                </div>
                <button onClick={() => removeStep(idx)} className="mt-6 p-2 text-amber-400 hover:text-amber-600 shrink-0 h-max"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            <button onClick={addStep} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold text-sm w-max">
              <Plus className="w-4 h-4" /> Add Application Step
            </button>
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default AdmissionRegistrationEditor;
