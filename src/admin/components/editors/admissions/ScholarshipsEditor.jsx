import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Upload, FileText, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const ScholarshipsEditor = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionsMap, setSectionsMap] = useState({});

  const [formScholarships, setFormScholarships] = useState({ scholarships: [] });
  const [searchTerm, setSearchTerm] = useState('');

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

      if (sMap['admissions.scholarships']) setFormScholarships(JSON.parse(sMap['admissions.scholarships'].content || '{"scholarships":[]}'));
      
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
      if (sectionsMap['admissions.scholarships']) {
        updates.push(cmsService.updateSection(sectionsMap['admissions.scholarships'].id, { content: JSON.stringify(formScholarships) }));
      }
      await Promise.all(updates);
      toast({ type: 'success', title: 'Saved!', message: 'Scholarships saved directly to the database.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addScholarship = () => setFormScholarships(prev => ({
    ...prev,
    scholarships: [{ id: Date.now(), title: '', eligibility: '', description: '', amount: '', images: [], pdfUrl: '', featured: false }, ...(prev.scholarships || [])]
  }));
  const updateScholarship = (idx, f, v) => {
    setFormScholarships(prev => {
      const list = [...(prev.scholarships || [])];
      list[idx] = { ...list[idx], [f]: v };
      return { ...prev, scholarships: list };
    });
  };
  const removeScholarship = (idx) => setFormScholarships(prev => ({
    ...prev,
    scholarships: (prev.scholarships || []).filter((_, i) => i !== idx)
  }));

  const handleImageUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'admissions', 'scholarship-img');
      setFormScholarships(prev => {
        const list = [...(prev.scholarships || [])];
        list[idx] = { ...list[idx], images: [...(list[idx].images || []), rec.url] };
        return { ...prev, scholarships: list };
      });
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };
  const removeImage = (sIdx, imgIdx) => {
    setFormScholarships(prev => {
      const list = [...(prev.scholarships || [])];
      list[sIdx].images = list[sIdx].images.filter((_, i) => i !== imgIdx);
      return { ...prev, scholarships: list };
    });
  };

  const handlePdfUpload = async (idx, file) => {
    if (!file) return;
    try {
      const rec = await fileService.upload(file, 'admissions', 'scholarship-pdf');
      updateScholarship(idx, 'pdfUrl', rec.url);
    } catch { toast({ type: 'error', title: 'Upload failed' }); }
  };

  const filtered = (formScholarships.scholarships || []).map((s, i) => ({ ...s, _origIdx: i })).filter(s => 
    (s.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Loading Database CMS...</div>;
  }

  return (
    <EditorPage
      title="Scholarships & Awards"
      description="Manage merit, sports, and community scholarships offered by the institution."
      breadcrumb={['Admin', 'Admissions', 'Scholarships']}
      onSave={handleSave}
      isLoading={saving}
    >
      <div className="space-y-6">
        <EditorCard title="Page Title & Intro">
          <div className="space-y-4">
            <AdminInput label="Main Heading" value={formScholarships.title || ''} onChange={e => setFormScholarships(p => ({ ...p, title: e.target.value }))} />
            <AdminTextarea label="Introduction Text" value={formScholarships.description || ''} onChange={e => setFormScholarships(p => ({ ...p, description: e.target.value }))} rows={3} />
          </div>
        </EditorCard>

        <EditorCard title="Scholarship Programs">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" placeholder="Search scholarships..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button onClick={addScholarship} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 font-semibold text-sm">
              <Plus className="w-4 h-4" /> Add Program
            </button>
          </div>

          <div className="space-y-6">
            {filtered.map((scholarship) => {
              const idx = scholarship._origIdx;
              return (
                <div key={scholarship.id} className={`p-5 bg-white border-2 ${scholarship.featured ? 'border-amber-400 shadow-md' : 'border-slate-200'} rounded-xl relative group transition-all`}>
                  
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdminInput label="Scholarship Title" value={scholarship.title} onChange={e => updateScholarship(idx, 'title', e.target.value)} />
                      <div className="grid grid-cols-2 gap-4">
                        <AdminInput label="Award Amount/Benefit" value={scholarship.amount} onChange={e => updateScholarship(idx, 'amount', e.target.value)} placeholder="e.g. 50% Tuition Fee Waiver" />
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Featured/Highlighted</label>
                          <select value={scholarship.featured} onChange={e => updateScholarship(idx, 'featured', e.target.value === 'true')} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500">
                            <option value="false">No</option>
                            <option value="true">Yes (Highlight)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeScholarship(idx)} className="p-2 text-amber-400 hover:text-amber-600 rounded-lg mt-1"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="mb-4">
                    <AdminInput label="Eligibility Criteria" value={scholarship.eligibility} onChange={e => updateScholarship(idx, 'eligibility', e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <AdminTextarea label="Full Description" value={scholarship.description} onChange={e => updateScholarship(idx, 'description', e.target.value)} rows={2} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Images / Badges</label>
                      <div className="flex flex-wrap gap-2">
                        {(scholarship.images || []).map((img, imgIdx) => (
                          <div key={imgIdx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group/img">
                            <img src={img} alt="Badge" className="w-full h-full object-cover" />
                            <button onClick={() => removeImage(idx, imgIdx)} className="absolute top-1 right-1 p-1 bg-amber-500 text-white rounded-full opacity-0 group-hover/img:opacity-100"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                        <label className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-white hover:border-primary-400 hover:text-primary-500">
                          <ImageIcon className="w-4 h-4 mb-1" />
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(idx, e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Application Form (PDF)</label>
                      <div className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <FileText className="w-5 h-5 text-primary-500 shrink-0" />
                        <input type="text" value={scholarship.pdfUrl} onChange={e => updateScholarship(idx, 'pdfUrl', e.target.value)} placeholder="PDF Document URL..." className="flex-1 text-xs outline-none bg-transparent font-mono text-slate-500" />
                        <label className="shrink-0 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-md text-xs font-semibold cursor-pointer hover:bg-primary-100">
                          Upload PDF
                          <input type="file" accept="application/pdf" className="hidden" onChange={e => handlePdfUpload(idx, e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </EditorCard>
      </div>
    </EditorPage>
  );
};

export default ScholarshipsEditor;
