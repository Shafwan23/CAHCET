import React, { useState, useEffect } from 'react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

const PrivacyPolicyEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ content: '' });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['about.privacy']) {
          setForm(JSON.parse(map['about.privacy'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Privacy Policy data.' });
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
      if (sectionsMap['about.privacy']) {
        await cmsService.updateSection(sectionsMap['about.privacy'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Privacy Policy data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ content: '' });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Privacy Policy"
      description="Edit the main Privacy Policy page for the website."
      breadcrumb={['Admin', 'About', 'Privacy Policy']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Document Content" description="HTML formatting is supported. Use <h2> tags for section headings and <p> tags for paragraphs.">
        <AdminTextarea 
          label="Privacy Policy (HTML Supported)" 
          value={form.content || ''} 
          onChange={e => change('content', e.target.value)} 
          rows={25} 
        />
      </EditorCard>
    </EditorPage>
  );
};

export default PrivacyPolicyEditor;
