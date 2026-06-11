import React, { useState, useEffect } from 'react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

const TermsEditor = () => {
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

        if (map['about.terms']) {
          setForm(JSON.parse(map['about.terms'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Terms data.' });
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
      if (sectionsMap['about.terms']) {
        await cmsService.updateSection(sectionsMap['about.terms'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Terms data.' });
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
      title="Terms & Conditions"
      description="Edit the main Terms and Conditions page for the website."
      breadcrumb={['Admin', 'About', 'Terms & Conditions']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Document Content" description="HTML formatting is supported. Use <h2> tags for section headings and <p> tags for paragraphs.">
        <AdminTextarea 
          label="Terms & Conditions (HTML Supported)" 
          value={form.content || ''} 
          onChange={e => change('content', e.target.value)} 
          rows={25} 
        />
      </EditorCard>
    </EditorPage>
  );
};

export default TermsEditor;
