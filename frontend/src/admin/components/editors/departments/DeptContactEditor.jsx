import React, { useState, useEffect } from 'react';
import { Monitor, Upload, User, Mail, Phone, MapPin, Clock, Eye, EyeOff, Map, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../ui/Toast';
import EditorPage from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { fileService } from '../../../services/fileService';
import VersionHistoryModal from './shared/VersionHistoryModal';
import ContactSection from '../../../../components/departments/sections/ContactSection';

const DeptContactEditor = ({ deptKey, dept, cms, session }) => {
  const { addToast } = useToast?.() || { addToast: () => {} };
  const [form, setForm] = useState(cms.data?.contact || {});
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(false);

  useEffect(() => {
    if (cms.data?.contact) {
      setForm(cms.data.contact);
    }
  }, [deptKey, cms.data]);

  const update = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    cms.setSection('contact', updated);
  };

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      cms.setSection('contact', form);
      await cms.saveSection('contact', session?.username, session?.name, isSilent);
      if (!isSilent) addToast({ type: 'success', title: 'Draft Saved', message: `Contact details saved to draft.` });
    } catch(e) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    if (cms.publishSection) {
       await cms.publishSection('contact');
       addToast({ type: 'success', title: 'Live', message: 'Contact details published to production.' });
    }
  };

  const handleReset = () => {
    const fresh = cms.data?.contact || {};
    setForm(fresh);
    cms.setSection('contact', fresh);
    addToast({ type: 'info', title: 'Reset', message: 'Discarded unsaved changes.' });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileService.compressImage(file, 600, 0.85);
      const rec = await fileService.upload(compressed, deptKey, 'contact');
      update('hodPhoto', rec.url);
      addToast({ type: 'success', title: 'Uploaded!', message: 'HOD Photo uploaded successfully.' });
    } catch {
      addToast({ type: 'error', title: 'Failed', message: 'Upload failed.' });
    }
    setUploading(false);
  };

  const mapSrcFromEmbed = (embed) => {
    if (!embed) return null;
    if (embed.startsWith('http')) return embed;
    const match = embed.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };
  const mapSrc = mapSrcFromEmbed(form.mapEmbed);

  const validationIssues = [];
  if (!form.hodName?.trim()) validationIssues.push("HOD Name is required.");
  if (!form.email?.trim()) validationIssues.push("Department Email is required.");
  if (!form.phone?.trim()) validationIssues.push("Phone Number is required.");

  // Transform form data to match ContactSection expectation
  const previewData = form.hodName ? [
    {
      role: 'Head of Department',
      name: form.hodName,
      email: form.email || `${deptKey}@cahcet.edu.in`,
      phone: form.phone || '+91 XXXXX XXXXX',
      photo: form.hodPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
    }
  ] : [];

  return (
    <EditorPage
      title="Contact Editor"
      description="Manage department contact information, HOD details, and location maps."
      breadcrumb={['Admin', 'Departments', dept.abbr, 'Contact Us']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={cms.status?.contact || 'DRAFT'}
      lastModified={cms.lastModified?.contact}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Configuration Panel */}
        <div className="xl:col-span-6 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
             <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
               <User className="w-4 h-4 text-slate-500" />
               <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">HOD Information</h3>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 relative group flex items-center justify-center">
                   {form.hodPhoto ? (
                     <img src={form.hodPhoto} alt="HOD" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-8 h-8 text-slate-300" />
                   )}
                   <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="w-5 h-5 text-white mb-1" />
                      <span className="text-[9px] text-white font-bold tracking-wider">UPLOAD</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                   </label>
                </div>
                <div className="flex-1">
                   <AdminInput
                     label="Head of Department Name *"
                     value={form.hodName || ''}
                     onChange={e => update('hodName', e.target.value)}
                     placeholder="Dr. John Doe"
                   />
                </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
             <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
               <Mail className="w-4 h-4 text-slate-500" />
               <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Contact Details</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput
                  label="Department Email *"
                  type="email"
                  value={form.email || ''}
                  onChange={e => update('email', e.target.value)}
                  placeholder={`${deptKey}@cahcet.edu.in`}
                />
                <AdminInput
                  label="Phone Number *"
                  value={form.phone || ''}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
             </div>
             <AdminInput
               label="Office Location"
               value={form.location || ''}
               onChange={e => update('location', e.target.value)}
               placeholder="Room 101, Block A, Ground Floor"
             />
             <AdminInput
               label="Office Timings"
               value={form.timings || ''}
               onChange={e => update('timings', e.target.value)}
               placeholder="Mon-Fri: 9:00 AM - 4:00 PM"
             />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
             <div className="flex items-center justify-between pb-3 border-b border-slate-100">
               <div className="flex items-center gap-2">
                 <Map className="w-4 h-4 text-slate-500" />
                 <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Map Location</h3>
               </div>
               {mapSrc && (
                 <button onClick={() => setShowMapPreview(!showMapPreview)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
                   {showMapPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                   {showMapPreview ? 'Hide' : 'Preview'} Map
                 </button>
               )}
             </div>
             <AdminTextarea
               label="Google Map Embed Code or URL"
               value={form.mapEmbed || ''}
               onChange={e => update('mapEmbed', e.target.value)}
               placeholder='<iframe src="..."></iframe>'
               rows={3}
             />
             {showMapPreview && mapSrc && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 260 }} className="rounded-xl overflow-hidden border border-slate-200 mt-4">
                 <iframe
                   src={mapSrc}
                   width="100%"
                   height="260"
                   style={{ border: 0 }}
                   allowFullScreen
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Map Preview"
                 />
               </motion.div>
             )}
          </div>
        </div>

        {/* Right Side: Live Preview Panel */}
        <div className="xl:col-span-6">
          <div className="sticky top-24 max-h-[calc(100vh-140px)] flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4" /> Live Preview
            </h3>
            
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex-1 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono flex-1 max-w-[200px] text-center truncate shadow-sm">
                  cahcet.edu.in/departments/{deptKey}/contact
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-primary-50/50 p-6 relative">
                 <div className="scale-[0.8] origin-top">
                    <ContactSection data={previewData} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHistory && (
        <VersionHistoryModal
          deptKey={deptKey}
          section="contact"
          cms={cms}
          session={session}
          onClose={() => setShowHistory(false)}
        />
      )}
    </EditorPage>
  );
};

export default DeptContactEditor;
