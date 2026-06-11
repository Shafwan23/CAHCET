import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, FileText, Landmark, X } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const EducationLoanEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});

  const [formLoans, setFormLoans] = useState({ providers: [] });

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

      if (sMap['admissions.loans']) setFormLoans(JSON.parse(sMap['admissions.loans'].content || '{"providers":[]}'));
      
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
      if (sectionsMap['admissions.loans']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.loans'].id, { content: JSON.stringify(formLoans) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: 'Education Loans saved directly to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addProvider = () => setFormLoans(prev => ({
    ...prev,
    providers: [{ id: Date.now(), bankName: '', logoUrl: '', eligibility: '', interest: '', process: '', contact: '', documents: [] }, ...(prev.providers || [])]
  }));
  const updateProvider = (idx, f, v) => {
    setFormLoans(prev => {
      const list = [...(prev.providers || [])];
      list[idx] = { ...list[idx], [f]: v };
      return { ...prev, providers: list };
    });
  };
  const removeProvider = (idx) => setFormLoans(prev => ({
    ...prev,
    providers: (prev.providers || []).filter((_, i) => i !== idx)
  }));

  const handleLogoUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'admissions', 'bank-logo');
      updateProvider(idx, 'logoUrl', rec.url);
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };

  const addDocument = (idx) => {
    setFormLoans(prev => {
      const list = [...(prev.providers || [])];
      list[idx].documents = [...(list[idx].documents || []), { title: '', url: '' }];
      return { ...prev, providers: list };
    });
  };
  const updateDocument = (pIdx, dIdx, field, val) => {
    setFormLoans(prev => {
      const list = [...(prev.providers || [])];
      list[pIdx].documents[dIdx] = { ...list[pIdx].documents[dIdx], [field]: val };
      return { ...prev, providers: list };
    });
  };
  const removeDocument = (pIdx, dIdx) => {
    setFormLoans(prev => {
      const list = [...(prev.providers || [])];
      list[pIdx].documents = list[pIdx].documents.filter((_, i) => i !== dIdx);
      return { ...prev, providers: list };
    });
  };
  const uploadDocument = async (pIdx, dIdx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'admissions', 'loan-doc');
      updateDocument(pIdx, dIdx, 'url', rec.url);
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Education Loans"
      description="Manage partnered banks and financial institutions providing educational loans."
      breadcrumb={['Admin', 'Admissions', 'Education Loan']}
      onSave={handleSave}
      isLoading={saving}
    >
      <div className="space-y-6">
        <EditorCard title="Page Title">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={formLoans.title || ''} onChange={e => setFormLoans(p => ({ ...p, title: e.target.value }))} />
            <AdminTextarea label="Introduction Text" value={formLoans.description || ''} onChange={e => setFormLoans(p => ({ ...p, description: e.target.value }))} rows={3} />
          </div>
        </EditorCard>

        <EditorCard title="Banking Partners & Procedures">
          <div className="space-y-6">
            {(formLoans.providers || []).map((provider, idx) => (
              <div key={provider.id} className="p-5 bg-white border border-slate-200 rounded-xl relative shadow-sm">
                
                <div className="flex gap-4 mb-4">
                  <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative group/logo p-2 shadow-sm">
                    {provider.logoUrl ? <img src={provider.logoUrl} className="w-full h-full object-contain" /> : <Landmark className="w-8 h-8 text-slate-300" />}
                    <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/logo:opacity-100 cursor-pointer transition-opacity backdrop-blur-[1px]">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-semibold">Upload Logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(idx, e.target.files[0])} />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdminInput label="Bank / Institution Name" value={provider.bankName} onChange={e => updateProvider(idx, 'bankName', e.target.value)} />
                        <AdminInput label="Contact / Helpline" value={provider.contact} onChange={e => updateProvider(idx, 'contact', e.target.value)} />
                      </div>
                      <button onClick={() => removeProvider(idx)} className="p-2 text-amber-500 bg-primary-50 hover:bg-primary-100 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdminInput label="Eligibility" value={provider.eligibility} onChange={e => updateProvider(idx, 'eligibility', e.target.value)} placeholder="e.g. All regular students" />
                      <AdminInput label="Interest Rate" value={provider.interest} onChange={e => updateProvider(idx, 'interest', e.target.value)} placeholder="e.g. 7.5% p.a." />
                    </div>
                  </div>
                </div>
                
                <AdminTextarea label="Application Process" value={provider.process} onChange={e => updateProvider(idx, 'process', e.target.value)} rows={2} />
                
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Required Forms & Documents</label>
                    <button onClick={() => addDocument(idx)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">+ Add Form</button>
                  </div>
                  <div className="space-y-2">
                    {(provider.documents || []).map((doc, dIdx) => (
                      <div key={dIdx} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-200">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0 mx-1" />
                        <input type="text" value={doc.title} onChange={e => updateDocument(idx, dIdx, 'title', e.target.value)} placeholder="Document Title..." className="w-1/3 text-sm outline-none bg-transparent" />
                        <input type="text" value={doc.url} onChange={e => updateDocument(idx, dIdx, 'url', e.target.value)} placeholder="PDF URL..." className="flex-1 text-xs outline-none bg-transparent font-mono text-slate-500" />
                        <label className="shrink-0 px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold cursor-pointer hover:bg-slate-200">
                          Upload
                          <input type="file" accept="application/pdf" className="hidden" onChange={e => uploadDocument(idx, dIdx, e.target.files[0])} />
                        </label>
                        <button onClick={() => removeDocument(idx, dIdx)} className="p-1 text-amber-400 hover:bg-primary-50 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {(provider.documents || []).length === 0 && <p className="text-xs text-slate-400 italic">No downloadable forms attached.</p>}
                  </div>
                </div>

              </div>
            ))}
            <button onClick={addProvider} className="flex items-center gap-2 px-4 py-3 bg-primary-50 text-amber-600 rounded-xl hover:bg-primary-100 font-semibold text-sm w-full justify-center transition-colors">
              <Plus className="w-4 h-4" /> Add Banking Partner
            </button>
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default EducationLoanEditor;
