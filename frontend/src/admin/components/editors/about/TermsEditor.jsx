import React, { useState, useEffect } from 'react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { termsConditionsData } from '../../../../data/legalPolicies';

const defaultTermsHtml = `<h2>1. Introduction</h2>
<p>${termsConditionsData.intro}</p>

<h2>2. Acceptance of Terms</h2>
<p>${termsConditionsData.acceptance}</p>

<h2>3. Use of Website</h2>
<ul>
  ${termsConditionsData.useOfWebsite.map(item => `<li>${item}</li>`).join('\n  ')}
</ul>

<h2>4. Application Process</h2>
<ul>
  ${termsConditionsData.applicationProcess.map(item => `<li>${item}</li>`).join('\n  ')}
</ul>

<h2>5. User Responsibilities</h2>
<p>${termsConditionsData.userResponsibilities}</p>

<h2>6. Intellectual Property</h2>
<p>${termsConditionsData.intellectualProperty}</p>

<h2>7. Limitation of Liability</h2>
<p>${termsConditionsData.limitationOfLiability}</p>

<h2>8. External Links</h2>
<p>${termsConditionsData.externalLinks}</p>

<h2>9. Policy Updates</h2>
<p>${termsConditionsData.policyUpdates}</p>

<h2>10. Contact Information</h2>
<p><strong>${termsConditionsData.contact.name}</strong><br/>
${termsConditionsData.contact.address}<br/>
Email: <a href="mailto:${termsConditionsData.contact.email}">${termsConditionsData.contact.email}</a></p>`;

const TermsEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ content: defaultTermsHtml });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('about');
        setPageId(res.data?.id);
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
      const content = JSON.stringify(form);
      if (sectionsMap['about.terms']) {
        await cmsService.updateSection(sectionsMap['about.terms'].id, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'about.terms',
          title: 'Terms & Conditions',
          content
        });
        setSectionsMap(prev => ({ ...prev, 'about.terms': newSec.data }));
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Terms data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ content: defaultTermsHtml });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  if (loading && !pageId) return <div>Loading...</div>;

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
