import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

const ContactUsEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', address: '', phones: [], emails: [], timings: '', social: {}, mapUrl: '', departments: [] });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('contact');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['contact.contact_main']) {
          setForm(JSON.parse(map['contact.contact_main'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Contact Us data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));
  const changeSocial = (field, value) => setForm(p => ({ ...p, social: { ...(p.social || {}), [field]: value } }));

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      if (sectionsMap['contact.contact_main']) {
        await cmsService.updateSection(sectionsMap['contact.contact_main'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Contact Us data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ title: '', address: '', phones: [], emails: [], timings: '', social: {}, mapUrl: '', departments: [] });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  const addPhone = () => change('phones', [...(form.phones || []), '']);
  const updatePhone = (idx, val) => {
    const list = [...(form.phones || [])];
    list[idx] = val;
    change('phones', list);
  };
  const removePhone = (idx) => change('phones', (form.phones || []).filter((_, i) => i !== idx));

  const addEmail = () => change('emails', [...(form.emails || []), '']);
  const updateEmail = (idx, val) => {
    const list = [...(form.emails || [])];
    list[idx] = val;
    change('emails', list);
  };
  const removeEmail = (idx) => change('emails', (form.emails || []).filter((_, i) => i !== idx));

  const addDept = () => change('departments', [...(form.departments || []), { id: Date.now(), name: '', person: '', phone: '', email: '' }]);
  const updateDept = (idx, f, v) => {
    const list = [...(form.departments || [])];
    list[idx] = { ...list[idx], [f]: v };
    change('departments', list);
  };
  const removeDept = (idx) => change('departments', (form.departments || []).filter((_, i) => i !== idx));

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Contact Us"
      description="Manage the primary institution contact details, maps, and departmental inquiries."
      breadcrumb={['Admin', 'Contact', 'Contact Us']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EditorCard title="Primary Contact Details">
            <div className="space-y-6">
              <AdminInput label="Main Heading" value={form.title || ''} onChange={e => change('title', e.target.value)} />
              <AdminTextarea label="Official Address" value={form.address || ''} onChange={e => change('address', e.target.value)} rows={3} />
              
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Numbers</label>
                {(form.phones || []).map((phone, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" value={phone} onChange={e => updatePhone(idx, e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="+91..." />
                    <button onClick={() => removePhone(idx)} className="p-2 text-amber-400 hover:bg-primary-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addPhone} className="text-xs font-semibold text-blue-600 hover:text-blue-800">+ Add Phone Number</button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Addresses</label>
                {(form.emails || []).map((email, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="email" value={email} onChange={e => updateEmail(idx, e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="info@..." />
                    <button onClick={() => removeEmail(idx)} className="p-2 text-amber-400 hover:bg-primary-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addEmail} className="text-xs font-semibold text-blue-600 hover:text-blue-800">+ Add Email Address</button>
              </div>

              <AdminInput label="Office Timings" value={form.timings || ''} onChange={e => change('timings', e.target.value)} placeholder="e.g. Mon - Sat: 9:00 AM - 5:00 PM" />
            </div>
          </EditorCard>

          <div className="space-y-6">
            <EditorCard title="Social Media Links">
              <div className="grid grid-cols-1 gap-4">
                <AdminInput label="Facebook URL" value={form.social?.facebook || ''} onChange={e => changeSocial('facebook', e.target.value)} />
                <AdminInput label="Twitter URL" value={form.social?.twitter || ''} onChange={e => changeSocial('twitter', e.target.value)} />
                <AdminInput label="LinkedIn URL" value={form.social?.linkedin || ''} onChange={e => changeSocial('linkedin', e.target.value)} />
                <AdminInput label="Instagram URL" value={form.social?.instagram || ''} onChange={e => changeSocial('instagram', e.target.value)} />
              </div>
            </EditorCard>

            <EditorCard title="Google Maps Integration">
              <div className="space-y-4">
                <AdminTextarea label="Google Maps Embed URL (src attribute)" value={form.mapUrl || ''} onChange={e => change('mapUrl', e.target.value)} rows={3} placeholder="https://www.google.com/maps/embed?pb=..." />
                {form.mapUrl && (
                  <div className="w-full h-48 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative">
                    <iframe src={form.mapUrl} className="w-full h-full" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
                    <div className="absolute inset-0 border-4 border-transparent hover:border-blue-400 pointer-events-none transition-colors rounded-xl" />
                  </div>
                )}
              </div>
            </EditorCard>
          </div>
        </div>

        <EditorCard title="Departmental Inquiries">
          <div className="space-y-4">
            {(form.departments || []).map((dept, idx) => (
              <div key={dept.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                <button onClick={() => removeDept(idx)} className="absolute top-2 right-2 p-1.5 text-amber-400 hover:text-amber-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                <div className="space-y-4 pr-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput label="Department / Office" value={dept.name} onChange={e => updateDept(idx, 'name', e.target.value)} placeholder="e.g. Admissions Office" />
                    <AdminInput label="Contact Person" value={dept.person} onChange={e => updateDept(idx, 'person', e.target.value)} placeholder="e.g. Dr. John Doe" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput label="Phone Number" value={dept.phone} onChange={e => updateDept(idx, 'phone', e.target.value)} />
                    <AdminInput label="Email Address" value={dept.email} onChange={e => updateDept(idx, 'email', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addDept} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-sm w-max">
              <Plus className="w-4 h-4" /> Add Inquiry Contact
            </button>
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default ContactUsEditor;
