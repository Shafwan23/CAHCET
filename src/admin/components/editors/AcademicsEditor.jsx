import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminButton } from '../ui/AdminInput';
import { Plus, Trash2 } from 'lucide-react';
import { cmsService } from '../../../services/cmsService';

const AcademicsEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ teachingMethods: [], facilities: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('academics');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['academics.overview']) {
          setForm(JSON.parse(map['academics.overview'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Academics data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      if (sectionsMap['academics.overview']) {
        await cmsService.updateSection(sectionsMap['academics.overview'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Academics changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Academics data.' });
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field) => setForm(p => ({ ...p, [field]: [...(p[field] || []), ''] }));
  const updateItem = (field, i, val) => setForm(p => ({ ...p, [field]: p[field].map((x, idx) => idx === i ? val : x) }));
  const removeItem = (field, i) => setForm(p => ({ ...p, [field]: p[field].filter((_, idx) => idx !== i) }));

  const ListEditor = ({ label, field }) => (
    <EditorCard title={label}>
      <div className="space-y-2">
        {(form[field] || []).map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => updateItem(field, i, e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all" />
            <button onClick={() => removeItem(field, i)} className="p-2 text-amber-400 hover:bg-primary-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <AdminButton variant="secondary" icon={Plus} size="sm" onClick={() => addItem(field)}>Add Item</AdminButton>
      </div>
    </EditorCard>
  );

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage title="Academics Editor" description="Edit teaching methods and campus facilities." breadcrumb={['Admin', 'Content', 'Academics']}
      onSave={() => handleSave(false)} onPublish={() => handleSave(true)} isLoading={loading}>
      <ListEditor label="Teaching Methods" field="teachingMethods" />
      <ListEditor label="Campus Facilities" field="facilities" />
    </EditorPage>
  );
};
export default AcademicsEditor;
