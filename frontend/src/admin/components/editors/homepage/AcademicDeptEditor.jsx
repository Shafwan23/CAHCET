import React, { useState, useEffect } from 'react';
import { Monitor, GripVertical, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { DEPARTMENTS } from '../../../services/departmentService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { ArrowRight } from 'lucide-react';

const AcademicDeptEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ visible: true, title: 'Academic Excellence', subtitle: '', highlightedDepts: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [previewSection, setPreviewSection] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('home');
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['home.academic']) {
        const dataStr = map['home.academic'].draftContent || map['home.academic'].content || '{}';
        setForm(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Academic Dept data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      if (sectionsMap['home.academic']) {
        await cmsService.updateSection(sectionsMap['home.academic'].id, { draftContent: JSON.stringify(form), _isSilentDraft: isSilent });
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Academic changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Academic data.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true); // silent save draft
    const res = await cmsService.getPage('home');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'home.academic');
    setPreviewSection(updatedSec);
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

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.academic', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Academic Departments Section"
      description="Manage the featured departments showcased on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Academic Departments']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
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
        </div>

        {/* Lightweight Preview Card */}
        <div className="xl:col-span-4">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Monitor className="w-4 h-4" /> Live Preview</h3>
            
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
              {/* Browser/Device Chrome */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono flex-1 max-w-[200px] text-center truncate shadow-sm">
                  cahcet.edu.in
                </div>
              </div>

              <div className="bg-slate-50 p-6">
               <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Departments</h4>
               <h3 className="text-lg font-bold text-slate-800 mb-6">{form.title || 'Academic Excellence'}</h3>
               
               <div className="flex gap-4 overflow-x-hidden pb-4">
                 {(form.highlightedDepts || []).slice(0, 2).map((key, i) => {
                   const dept = DEPARTMENTS.find(d => d.key === key) || { label: 'Unknown', color: '#ccc' };
                   return (
                     <div key={i} className="min-w-[160px] bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-shrink-0">
                       <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mb-3" style={{ backgroundColor: dept.color }}>
                         {dept.label.slice(0,2)}
                       </div>
                       <h5 className="font-bold text-slate-800 text-sm mb-1">{dept.label}</h5>
                       <p className="text-xs text-amber-500 font-semibold flex items-center gap-1 mt-3">Explore <ArrowRight className="w-3 h-3" /></p>
                     </div>
                   );
                 })}
                 {(form.highlightedDepts || []).length === 0 && (
                   <p className="text-xs text-slate-400 italic">No departments selected.</p>
                 )}
               </div>
               
               {form.subtitle && (
                 <p className="text-xs text-slate-600 border-t border-slate-200 pt-4">{form.subtitle}</p>
               )}
            </div>
            </div>
          </div>
        </div>
      </div>

      {previewSection && (
        <SectionPreviewModal 
          section={previewSection}
          onClose={() => setPreviewSection(null)}
          onPublish={async (sec) => {
            await cmsService.publishSection(sec.id);
            setPreviewSection(null);
            fetchPage();
            toast({ type: 'success', title: 'Live', message: 'Changes pushed to production.' });
          }}
          onRestore={() => fetchPage()}
        />
      )}
    </EditorPage>
  );
};

export default AcademicDeptEditor;
