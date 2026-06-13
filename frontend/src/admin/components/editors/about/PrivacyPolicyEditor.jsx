import React, { useState, useEffect } from 'react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { privacyPolicyData } from '../../../../data/legalPolicies';

const defaultPrivacyHtml = `<h2>1. Introduction</h2>
<p>${privacyPolicyData.intro}</p>

<h2>2. Information We Collect</h2>
<ul>
  ${privacyPolicyData.collection.map(c => `<li><strong>${c.title}:</strong> ${c.desc}</li>`).join('\n  ')}
</ul>

<h2>3. How We Use Your Information</h2>
<ul>
  ${privacyPolicyData.usage.map(u => `<li>${u}</li>`).join('\n  ')}
</ul>

<h2>4. Data Protection & Security</h2>
<p>${privacyPolicyData.protection}</p>

<h2>5. Cookies & Website Analytics</h2>
<p>${privacyPolicyData.cookies}</p>

<h2>6. Third-Party Services</h2>
<p>${privacyPolicyData.thirdParty}</p>

<h2>7. User Rights</h2>
<p>${privacyPolicyData.userRights}</p>

<h2>8. Data Retention Policy</h2>
<p>${privacyPolicyData.retention}</p>

<h2>9. Policy Updates</h2>
<p>${privacyPolicyData.updates}</p>

<h2>10. Contact Information</h2>
<p><strong>${privacyPolicyData.contact.name}</strong><br/>
${privacyPolicyData.contact.address}<br/>
Email: <a href="mailto:${privacyPolicyData.contact.email}">${privacyPolicyData.contact.email}</a></p>`;

const PrivacyPolicyEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ content: defaultPrivacyHtml });
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
      const content = JSON.stringify(form);
      if (sectionsMap['about.privacy']) {
        await cmsService.updateSection(sectionsMap['about.privacy'].id, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'about.privacy',
          title: 'Privacy Policy',
          content
        });
        setSectionsMap(prev => ({ ...prev, 'about.privacy': newSec.data }));
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Privacy Policy data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ content: defaultPrivacyHtml });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  if (loading && !pageId) return <div>Loading...</div>;

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
