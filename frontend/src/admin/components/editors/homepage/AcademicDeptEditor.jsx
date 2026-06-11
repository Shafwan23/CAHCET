import React, { useState, useEffect } from 'react';
import { Monitor, GripVertical, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { DEPARTMENTS } from '../../../services/departmentService';
import { cmsService } from '../../../../services/cmsService';

const AcademicDeptEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ visible: true, title: 'Academic Excellence', subtitle: '', highlightedDepts: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('home');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['home.academic']) {
          setForm(JSON.parse(map['home.academic'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Academic Dept data.' });
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
      if (sectionsMap['home.academic']) {
        await cmsService.updateSection(sectionsMap['home.academic'].id, { content: JSON.stringify(form) });
      } else {
        // Fallback for missing seed
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Academic changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Academic data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ visible: true, title: 'Academic Excellence', subtitle: 'Explore our comprehensive range of undergraduate and postgraduate programs.', highlightedDepts: ['cse', 'ece', 'mech', 'civil'] });
    toast({ type: 'info', title: 'Reset', message: 'Academic section reverted to defaults.' });
  };

  const toggleDept = (deptKey) => {
    const current = form.highlightedDepts || [];
    if (current.includes(deptKey)) {
      change('highlightedDepts', current.filter(k => k !== deptKey));
    } else {
      change('highlightedDepts', [...current, deptKey]);
    }
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Academic Departments Section"
      description="Manage the featured departments showcased on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Academic Departments']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Section Settings" description="General configuration for the Academic section.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the entire academic section."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Section Title"
              value={form.title || ''}
              onChange={e => change('title', e.target.value)}
              placeholder="Academic Excellence"
            />
            <AdminInput
              label="Section Subtitle"
              value={form.subtitle || ''}
              onChange={e => change('subtitle', e.target.value)}
              placeholder="Explore our comprehensive range..."
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Featured Departments" description="Select which departments to highlight on the homepage. Data is automatically pulled from the main Department CMS.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {DEPARTMENTS.map(dept => {
            const isSelected = (form.highlightedDepts || []).includes(dept.key);
            return (
              <div 
                key={dept.key} 
                onClick={() => toggleDept(dept.key)}
                className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col gap-3 transition-all duration-200
                  ${isSelected ? 'border-amber-500 bg-primary-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: dept.color }}>
                    {dept.label.slice(0,2)}
                  </div>
                  {isSelected ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-primary-100 px-2 py-1 rounded-md">
                      <Eye className="w-3.5 h-3.5" /> Featured
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                      <EyeOff className="w-3.5 h-3.5" /> Hidden
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 line-clamp-1">{dept.label}</h4>
                  <p className="text-xs text-slate-500 mt-1">Automatic sync from Dept CMS</p>
                </div>
              </div>
            );
          })}
        </div>
      </EditorCard>

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">The homepage automatically loads the latest HOD name, images, and descriptions directly from the <b>Departments CMS</b> for any featured department.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default AcademicDeptEditor;
