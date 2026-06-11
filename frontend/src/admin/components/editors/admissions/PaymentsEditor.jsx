import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, QrCode } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const PaymentsEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});

  const [formFees, setFormFees] = useState({ methods: [], notices: [], instructions: '' });
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPage('admissions');
      const sectionsArray = res.data?.sections || [];
      
      const sMap = {};
      sectionsArray.forEach(sec => { sMap[sec.sectionKey] = sec; });
      setSectionsMap(sMap);

      if (sMap['admissions.fees']) setFormFees(JSON.parse(sMap['admissions.fees'].content || '{"methods":[], "notices":[]}'));
      
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
      if (sectionsMap['admissions.fees']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.fees'].id, { content: JSON.stringify(formFees) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: 'Fee Payments saved directly to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addNotice = () => setFormFees(prev => ({ ...prev, notices: [...(prev.notices || []), ''] }));
  const updateNotice = (idx, val) => {
    setFormFees(prev => {
      const list = [...(prev.notices || [])];
      list[idx] = val;
      return { ...prev, notices: list };
    });
  };
  const removeNotice = (idx) => setFormFees(prev => ({ ...prev, notices: (prev.notices || []).filter((_, i) => i !== idx) }));

  const addMethod = () => setFormFees(prev => ({ ...prev, methods: [...(prev.methods || []), { id: Date.now(), type: '', description: '', link: '', qrUrl: '', details: '' }] }));
  const updateMethod = (idx, f, v) => {
    setFormFees(prev => {
      const list = [...(prev.methods || [])];
      list[idx] = { ...list[idx], [f]: v };
      return { ...prev, methods: list };
    });
  };
  const removeMethod = (idx) => setFormFees(prev => ({ ...prev, methods: (prev.methods || []).filter((_, i) => i !== idx) }));

  const handleQrUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'admissions', 'qr-code');
      updateMethod(idx, 'qrUrl', rec.url);
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Fee Payments"
      description="Manage payment instructions, bank details, and QR codes for student fees."
      breadcrumb={['Admin', 'Admissions', 'Payments']}
      onSave={handleSave}
      isLoading={saving}
    >
      <div className="space-y-6">
        <EditorCard title="Page Title & Instructions">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={formFees.title || ''} onChange={e => setFormFees(p => ({ ...p, title: e.target.value }))} />
            <AdminTextarea label="Main Description" value={formFees.description || ''} onChange={e => setFormFees(p => ({ ...p, description: e.target.value }))} rows={2} />
            <AdminTextarea label="Important Instructions" value={formFees.instructions || ''} onChange={e => setFormFees(p => ({ ...p, instructions: e.target.value }))} rows={3} />
          </div>
        </EditorCard>

        <EditorCard title="Important Payment Notices" description="Scrolling ticker or highlighted alerts.">
          <div className="space-y-3">
            {(formFees.notices || []).map((notice, idx) => (
              <div key={idx} className="flex gap-2">
                <div className="mt-2.5 shrink-0 w-2 h-2 rounded-full bg-amber-500" />
                <input 
                  type="text" 
                  value={notice} 
                  onChange={e => updateNotice(idx, e.target.value)} 
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                  placeholder="Notice text..."
                />
                <button onClick={() => removeNotice(idx)} className="p-2 text-amber-400 hover:bg-primary-50 rounded-lg h-max mt-0.5"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
            <button onClick={addNotice} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-amber-600 hover:text-primary-800 transition-colors w-max">
              <Plus className="w-4 h-4" /> Add Notice Alert
            </button>
          </div>
        </EditorCard>

        <EditorCard title="Payment Methods">
          <div className="space-y-6">
            {(formFees.methods || []).map((method, idx) => (
              <div key={method.id} className="p-5 bg-white border border-slate-200 rounded-xl relative shadow-sm">
                <button onClick={() => removeMethod(idx)} className="absolute top-4 right-4 p-2 text-amber-400 hover:text-amber-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                
                <div className="flex flex-col md:flex-row gap-6 pr-12">
                  <div className="w-32 h-32 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative group/qr shadow-sm">
                    {method.qrUrl ? <img src={method.qrUrl} className="w-full h-full object-contain p-2" /> : <div className="text-center text-slate-400"><QrCode className="w-8 h-8 mx-auto mb-1 opacity-50"/> <span className="text-[10px]">No QR Code</span></div>}
                    <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/qr:opacity-100 cursor-pointer transition-opacity backdrop-blur-[1px]">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-semibold">Upload QR</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleQrUpload(idx, e.target.files[0])} />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdminInput label="Method Type" value={method.type} onChange={e => updateMethod(idx, 'type', e.target.value)} placeholder="e.g. Bank Transfer (NEFT/RTGS)" />
                      <AdminInput label="Payment Link (Optional)" value={method.link} onChange={e => updateMethod(idx, 'link', e.target.value)} placeholder="e.g. https://razorpay.com/..." />
                    </div>
                    <AdminInput label="Short Description" value={method.description} onChange={e => updateMethod(idx, 'description', e.target.value)} />
                    <AdminTextarea label="Bank Details / A/C Info" value={method.details} onChange={e => updateMethod(idx, 'details', e.target.value)} rows={3} placeholder="A/C Number: ...&#10;IFSC Code: ..." />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addMethod} className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-semibold text-sm w-full justify-center transition-colors">
              <Plus className="w-4 h-4" /> Add Payment Method
            </button>
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default PaymentsEditor;
