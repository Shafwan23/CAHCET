import React, { useState, useEffect } from 'react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

const RefundPolicyEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ email: '', phone: '', officeAddress: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['about.refund_policy']) {
          setForm(JSON.parse(map['about.refund_policy'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Refund Policy data.' });
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
      if (sectionsMap['about.refund_policy']) {
        await cmsService.updateSection(sectionsMap['about.refund_policy'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Refund Policy data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ email: '', phone: '', officeAddress: '', content: '' });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Refund Policy"
      description="Edit the contact details shown on the refund policy page."
      breadcrumb={['Admin', 'About', 'Refund Policy']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <EditorCard title="Contact Information" description="Contact details specifically for refund-related inquiries.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <AdminInput label="Email Address" value={form.email || ''} onChange={e => change('email', e.target.value)} placeholder="e.g. admissions@cahcet.edu.in" />
          <AdminInput label="Phone Number" value={form.phone || ''} onChange={e => change('phone', e.target.value)} placeholder="e.g. +91 4172 267 387" />
        </div>
        <AdminTextarea label="Office Address" value={form.officeAddress || ''} onChange={e => change('officeAddress', e.target.value)} rows={3} placeholder="Full address for written correspondence..." />
      </EditorCard>

      <EditorCard title="Policy Content" description="The main text of the refund policy.">
        <AdminTextarea label="Policy Content (HTML Supported)" value={form.content || ''} onChange={e => change('content', e.target.value)} rows={15} />
      </EditorCard>
    </EditorPage>
  );
};

export default RefundPolicyEditor;
