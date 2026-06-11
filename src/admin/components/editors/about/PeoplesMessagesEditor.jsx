import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const PeoplesMessagesEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sectionsMap, setSectionsMap] = useState({});
  const [formChairman, setFormChairman] = useState({});
  const [formPrincipal, setFormPrincipal] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPage('about');
      const sectionsArray = res.data?.sections || [];
      
      const sMap = {};
      sectionsArray.forEach(sec => { sMap[sec.sectionKey] = sec; });
      setSectionsMap(sMap);

      if (sMap['about.chairman']) setFormChairman(JSON.parse(sMap['about.chairman'].content || '{}'));
      if (sMap['about.principal']) setFormPrincipal(JSON.parse(sMap['about.principal'].content || '{}'));
      
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = [];
      if (sectionsMap['about.chairman']) {
        updates.push(cmsService.updateSection(sectionsMap['about.chairman'].id, { content: JSON.stringify(formChairman) }));
      }
      if (sectionsMap['about.principal']) {
        updates.push(cmsService.updateSection(sectionsMap['about.principal'].id, { content: JSON.stringify(formPrincipal) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: "People's Messages saved directly to the database." });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (person, field, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'about', `${person}-${field}`);
      if (person === 'chairman') {
        setFormChairman(p => ({ ...p, [field]: rec.url }));
      } else if (person === 'principal') {
        setFormPrincipal(p => ({ ...p, [field]: rec.url }));
      }
    } catch (e) {
      toast({ type: 'error', title: 'Upload failed' });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  const renderPersonEditor = (personKey, personData, setPersonData, defaultDesignation) => {
    const person = personData || {};
    return (
      <EditorCard title={`${defaultDesignation} Block`} description={`Manage the message from the ${defaultDesignation}.`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <AdminInput
              label="Full Name"
              value={person.name || ''}
              onChange={e => setPersonData(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Dr. A. P. J. Abdul Kalam"
            />
            <AdminInput
              label="Designation"
              value={person.designation || defaultDesignation}
              onChange={e => setPersonData(p => ({ ...p, designation: e.target.value }))}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Photo</label>
                <div className="flex flex-col gap-2">
                  {person.photoUrl && (
                    <img src={person.photoUrl} alt="Photo" className="w-20 h-24 object-cover rounded-lg border border-slate-200" />
                  )}
                  <label className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-200 transition-colors border border-slate-200 w-max">
                    <Upload className="w-3 h-3 mr-1.5" /> Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(personKey, 'photoUrl', e.target.files?.[0])} />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Signature</label>
                <div className="flex flex-col gap-2">
                  {person.signatureUrl && (
                    <img src={person.signatureUrl} alt="Signature" className="h-10 object-contain p-1 border border-slate-200 rounded bg-white" />
                  )}
                  <label className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-200 transition-colors border border-slate-200 w-max">
                    <Upload className="w-3 h-3 mr-1.5" /> Upload Signature
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(personKey, 'signatureUrl', e.target.files?.[0])} />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <AdminTextarea
              label="Message Content (Use array format or string)"
              value={Array.isArray(person.message) ? person.message.join('\n\n') : (person.message || '')}
              onChange={e => setPersonData(p => ({ ...p, message: e.target.value.split('\n\n') }))}
              rows={9}
              placeholder={`Enter the message from the ${defaultDesignation} here...`}
            />
          </div>
        </div>
      </EditorCard>
    );
  };

  return (
    <EditorPage
      title="People's Messages (Database)"
      description="Edit the official messages from the Chairman and Principal. Saves directly to MySQL CMS."
      breadcrumb={['Admin', 'About', "People's Messages"]}
      onSave={handleSave}
      isLoading={saving}
    >
      <div className="space-y-6">
        {renderPersonEditor('chairman', formChairman, setFormChairman, 'Chairman')}
        {renderPersonEditor('principal', formPrincipal, setFormPrincipal, 'Principal')}
      </div>
    </EditorPage>
  );
};

export default PeoplesMessagesEditor;
