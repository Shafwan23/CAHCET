import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const GovApprovalEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [sectionsMap, setSectionsMap] = useState({});
  const [formAicte, setFormAicte] = useState({ documents: [] });
  const [formAcc, setFormAcc] = useState({ documents: [] });
  const [formAff, setFormAff] = useState({ documents: [] });

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

      if (sMap['about.accreditation']) setFormAicte(JSON.parse(sMap['about.accreditation'].content || '{"documents":[]}'));
      if (sMap['about.recognition']) setFormAcc(JSON.parse(sMap['about.recognition'].content || '{"documents":[]}'));
      if (sMap['about.affiliation']) setFormAff(JSON.parse(sMap['about.affiliation'].content || '{"documents":[]}'));
      
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
      if (sectionsMap['about.accreditation']) {
        updates.push(cmsService.updateSection(sectionsMap['about.accreditation'].id, { content: JSON.stringify(formAicte) }));
      }
      if (sectionsMap['about.recognition']) {
        updates.push(cmsService.updateSection(sectionsMap['about.recognition'].id, { content: JSON.stringify(formAcc) }));
      }
      if (sectionsMap['about.affiliation']) {
        updates.push(cmsService.updateSection(sectionsMap['about.affiliation'].id, { content: JSON.stringify(formAff) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: 'Government Approvals saved directly to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file, type) => {
    if (!file) return null;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'about', type);
      setUploading(false);
      return rec.url;
    } catch {
      setUploading(false);
      toast({ type: 'error', title: 'Upload failed' });
      return null;
    }
  };

  // List operations
  const addReport = () => setFormAicte(prev => ({
    ...prev,
    documents: [{ id: Date.now(), title: 'New Report', desc: '', url: '' }, ...(prev.documents || [])]
  }));
  
  const updateReport = (idx, f, v) => {
    setFormAicte(prev => {
      const list = [...(prev.documents || [])];
      list[idx] = { ...list[idx], [f]: v };
      return { ...prev, documents: list };
    });
  };
  const removeReport = (idx) => setFormAicte(prev => ({
    ...prev,
    documents: (prev.documents || []).filter((_, i) => i !== idx)
  }));

  const addAccreditation = () => setFormAcc(prev => ({
    ...prev,
    documents: [{ id: Date.now(), title: 'New Accreditation', desc: '', status: '', url: '' }, ...(prev.documents || [])]
  }));
  
  const updateAccreditation = (idx, f, v) => {
    setFormAcc(prev => {
      const list = [...(prev.documents || [])];
      list[idx] = { ...list[idx], [f]: v };
      return { ...prev, documents: list };
    });
  };
  const removeAccreditation = (idx) => setFormAcc(prev => ({
    ...prev,
    documents: (prev.documents || []).filter((_, i) => i !== idx)
  }));

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Government Approvals & Accreditations (Database)"
      description="Manage AICTE EOA reports and institutional accreditations. Saves directly to MySQL CMS."
      breadcrumb={['Admin', 'About', 'Govt Approval']}
      onSave={handleSave}
      isLoading={saving}
    >
      <div className="space-y-6">
        {/* AICTE REPORTS */}
        <EditorCard title="AICTE EOA Reports" description="Manage the official Extension of Approval PDF documents.">
          <div className="space-y-4">
            <button onClick={addReport} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-amber-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-semibold mb-4 w-max">
              <Plus className="w-4 h-4" /> Add AICTE Report
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formAicte.documents || []).map((report, idx) => (
                <div key={report.id} className="p-4 bg-white border border-slate-200 rounded-xl flex gap-4 relative group hover:border-amber-400 transition-colors shadow-sm">
                  <div className="flex-1 space-y-3">
                    <AdminInput value={report.title} onChange={e => updateReport(idx, 'title', e.target.value)} placeholder="Title (e.g. AICTE EOA Report)" />
                    <AdminInput value={report.desc} onChange={e => updateReport(idx, 'desc', e.target.value)} placeholder="Description" />
                    
                    <div className="flex items-center gap-2">
                      <input type="text" value={report.url} onChange={e => updateReport(idx, 'url', e.target.value)} placeholder="PDF URL..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                      <label className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="application/pdf" className="hidden" onChange={async e => { const url = await handleUpload(e.target.files[0], 'aicte-pdf'); if(url) updateReport(idx, 'url', url); }} />
                      </label>
                    </div>
                  </div>
                  
                  <button onClick={() => removeReport(idx)} className="absolute -top-3 -right-3 p-1.5 bg-white border border-slate-200 text-amber-500 rounded-full hover:bg-primary-50 hover:border-primary-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </EditorCard>

        {/* ACCREDITATIONS */}
        <EditorCard title="Accreditations & Recognitions" description="Manage NAAC, NBA, and other institutional recognitions.">
          <div className="space-y-4">
            <button onClick={addAccreditation} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold mb-4 w-max">
              <Plus className="w-4 h-4" /> Add Accreditation
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formAcc.documents || []).map((acc, idx) => (
                <div key={acc.id} className="p-4 bg-white border border-slate-200 rounded-xl flex gap-4 relative group hover:border-blue-400 transition-colors shadow-sm">
                  <div className="flex-1 space-y-3">
                    <AdminInput value={acc.title} onChange={e => updateAccreditation(idx, 'title', e.target.value)} placeholder="Title (e.g. NAAC A Grade)" />
                    <input type="text" value={acc.desc} onChange={e => updateAccreditation(idx, 'desc', e.target.value)} placeholder="Description..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    
                    <div className="flex items-center gap-2">
                      <input type="text" value={acc.url} onChange={e => updateAccreditation(idx, 'url', e.target.value)} placeholder="Certificate PDF URL..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                      <label className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="application/pdf" className="hidden" onChange={async e => { const url = await handleUpload(e.target.files[0], 'acc-pdf'); if(url) updateAccreditation(idx, 'url', url); }} />
                      </label>
                    </div>
                  </div>
                  
                  <button onClick={() => removeAccreditation(idx)} className="absolute -top-3 -right-3 p-1.5 bg-white border border-slate-200 text-amber-500 rounded-full hover:bg-primary-50 hover:border-primary-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </EditorCard>

        {/* AFFILIATIONS */}
        <EditorCard title="Affiliations" description="Manage Anna University and other affiliations.">
          <div className="space-y-4">
            <button onClick={() => setFormAff(prev => ({ ...prev, documents: [{ id: Date.now(), title: 'New Affiliation', desc: '', url: '' }, ...(prev.documents || [])] }))} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-semibold mb-4 w-max">
              <Plus className="w-4 h-4" /> Add Affiliation
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formAff.documents || []).map((aff, idx) => (
                <div key={aff.id} className="p-4 bg-white border border-slate-200 rounded-xl flex gap-4 relative group hover:border-emerald-400 transition-colors shadow-sm">
                  <div className="flex-1 space-y-3">
                    <AdminInput value={aff.title} onChange={e => {
                      setFormAff(prev => {
                        const list = [...(prev.documents || [])];
                        list[idx] = { ...list[idx], title: e.target.value };
                        return { ...prev, documents: list };
                      });
                    }} placeholder="Title (e.g. Anna University)" />
                    <input type="text" value={aff.desc} onChange={e => {
                      setFormAff(prev => {
                        const list = [...(prev.documents || [])];
                        list[idx] = { ...list[idx], desc: e.target.value };
                        return { ...prev, documents: list };
                      });
                    }} placeholder="Description..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    
                    <div className="flex items-center gap-2">
                      <input type="text" value={aff.url} onChange={e => {
                        setFormAff(prev => {
                          const list = [...(prev.documents || [])];
                          list[idx] = { ...list[idx], url: e.target.value };
                          return { ...prev, documents: list };
                        });
                      }} placeholder="Certificate PDF URL..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                      <label className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="application/pdf" className="hidden" onChange={async e => { 
                          const url = await handleUpload(e.target.files[0], 'aff-pdf'); 
                          if(url) {
                            setFormAff(prev => {
                              const list = [...(prev.documents || [])];
                              list[idx] = { ...list[idx], url: url };
                              return { ...prev, documents: list };
                            });
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  
                  <button onClick={() => {
                    setFormAff(prev => ({
                      ...prev,
                      documents: (prev.documents || []).filter((_, i) => i !== idx)
                    }));
                  }} className="absolute -top-3 -right-3 p-1.5 bg-white border border-slate-200 text-amber-500 rounded-full hover:bg-primary-50 hover:border-primary-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default GovApprovalEditor;
