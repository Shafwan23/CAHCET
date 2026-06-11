import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../ui/AdminInput';
import { cmsService } from '../../../services/cmsService';

const AboutEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', description: '', mission: '', vision: '' });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => {
          acc[sec.sectionKey] = sec;
          return acc;
        }, {});
        setSectionsMap(map);

        if (map['about.college']) {
          setForm(JSON.parse(map['about.college'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load About data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const change = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      if (sectionsMap['about.college']) {
        await cmsService.updateSection(sectionsMap['about.college'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `About page changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save About data.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="About Page Editor"
      description="Edit the institution description, mission, and vision statements."
      breadcrumb={['Admin', 'Content', 'About']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      isLoading={loading}
    >
      <EditorCard title="Institution Overview" description="Main heading and description for the About section.">
        <div className="space-y-4">
          <AdminInput label="Page Title" value={form.title || ''} onChange={e => change('title', e.target.value)} placeholder="An Education That Inspires" />
          <AdminTextarea label="Main Description" value={form.description || ''} onChange={e => change('description', e.target.value)} rows={5} placeholder="About the institution..." />
        </div>
      </EditorCard>

      <EditorCard title="Mission & Vision">
        <div className="space-y-4">
          <AdminTextarea label="Mission Statement" value={form.mission || ''} onChange={e => change('mission', e.target.value)} rows={3} placeholder="Our mission is..." />
          <AdminTextarea label="Vision Statement" value={form.vision || ''} onChange={e => change('vision', e.target.value)} rows={3} placeholder="Our vision is..." />
        </div>
      </EditorCard>
    </EditorPage>
  );
};

export default AboutEditor;
