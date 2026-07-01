import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Newspaper, 
  Search, Pin, Upload, CheckCircle, ArrowLeft,
  Filter, LayoutGrid, List as ListIcon, X, Eye, FileText, Download
} from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { createEmptyItem, UPDATE_TYPES } from '../../../services/updatesService';
import { useAdminAuth } from '../../../context/AdminAuthContext';

// Animation Variants
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const NewsletterCard = ({ item, onEdit, onDelete, onTogglePin, viewMode }) => {
  const isList = viewMode === 'list';
  
  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative bg-white/70 backdrop-blur-xl border ${item.pinned ? 'border-amber-300 shadow-[0_8px_30px_rgb(251,191,36,0.15)]' : 'border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]'} hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-slate-300 transition-all duration-300 overflow-hidden flex ${isList ? 'flex-row items-center p-3 gap-5 rounded-2xl' : 'flex-col p-0 rounded-[24px] h-full'}`}
    >
      
      {isList ? (
        <>
          <div className="w-16 h-20 rounded-lg overflow-hidden relative shrink-0 border border-slate-200 shadow-sm bg-slate-50 flex flex-col justify-center items-center">
            {item.thumbnailUrl ? (
              <img loading="lazy" decoding="async" src={item.thumbnailUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <FileText className="w-6 h-6 text-slate-300" />
            )}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-between">
             <div className="space-y-1">
               <div className="flex items-center gap-2">
                 <h4 className="font-bold text-slate-900 text-sm truncate">{item.title || 'Untitled Newsletter'}</h4>
                 {item.pinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />}
                 {!item.published && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase">Draft</span>}
               </div>
               <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                 <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-amber-500" /> {item.month} {item.year}</span>
                 {item.editionNumber && (
                   <>
                     <span className="w-1 h-1 rounded-full bg-slate-300" />
                     <span className="font-bold text-slate-700">Issue #{item.editionNumber}</span>
                   </>
                 )}
               </div>
             </div>
             
             <div className="flex items-center gap-4">
                {item.pdfUrl ? (
                   <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">PDF Attached</span>
                ) : (
                   <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">No PDF</span>
                )}
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                  <button onClick={() => onTogglePin(item)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all" title="Pin">
                    <Pin className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
             </div>
          </div>
        </>
      ) : (
        <>
          <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100 p-6 flex flex-col justify-end">
            {item.thumbnailUrl ? (
              <>
                <img loading="lazy" decoding="async" src={item.thumbnailUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-slate-900/0 opacity-80" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-100 to-slate-200">
                <Newspaper className="w-16 h-16 opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
              </div>
            )}
            
            <div className="absolute top-3 left-3 flex gap-2">
              {item.editionNumber && (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm backdrop-blur-md">
                  Issue #{item.editionNumber}
                </span>
              )}
              {!item.published && (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-600 shadow-sm backdrop-blur-md">
                  Draft
                </span>
              )}
            </div>
            
            {item.pinned && (
              <div className="absolute top-3 right-3 bg-amber-500 text-white p-1.5 rounded-lg shadow-sm backdrop-blur-md">
                <Pin className="w-3.5 h-3.5" />
              </div>
            )}

            <div className="relative z-10 text-white drop-shadow-md pb-2">
              <h4 className="font-bold text-xl leading-tight mb-1">{item.title || 'Untitled'}</h4>
              <p className="text-xs font-semibold text-slate-200">{item.month} {item.year}</p>
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col relative bg-white">
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{item.description}</p>
            
            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
              <button onClick={() => onTogglePin(item)} className={`flex items-center justify-center p-2 rounded-xl text-xs font-bold transition-colors ${item.pinned ? 'text-amber-700 bg-amber-50' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Pin className="w-4 h-4" />
              </button>
              <div className="flex-1" />
              <button onClick={() => onEdit(item)} className="px-4 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => onDelete(item)} className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

const CalendarDays = ({ className }) => <Calendar className={className} />;

const NewsletterEditor = () => {
  const toast = useToast();
  const { admin } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  
  // Smart Filter State
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Individual Editor State
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('updates');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['updates.newsletters']) {
        const dataStr = map['updates.newsletters'].draftContent || map['updates.newsletters'].content || '[]';
        setItems(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Newsletters.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const handleSaveDraft = async (isSilent = false, newItems = null) => {
    setLoading(true);
    const dataToSave = newItems || items;
    try {
      const content = JSON.stringify(dataToSave);
      if (sectionsMap['updates.newsletters']) {
        await cmsService.updateSection(sectionsMap['updates.newsletters'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId, sectionKey: 'updates.newsletters', title: 'Newsletters', draftContent: content, _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'updates.newsletters': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Newsletters saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Newsletters draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSaveDraft(true);
    const res = await cmsService.getPage('updates');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'updates.newsletters');
    setPreviewSection(updatedSec);
  };

  const handleReset = () => {
    setItems([]);
    toast({ type: 'info', title: 'Reset', message: 'Newsletters reverted to empty list.' });
  };

  const saveIndividualEdit = (updatedItem) => {
    let newItems;
    const adminName = admin?.name || 'Admin';
    const timestamp = new Date().toISOString();
    updatedItem.lastEditedBy = adminName;
    updatedItem.updatedAt = timestamp;

    if (!updatedItem.id) {
      updatedItem.id = `newsletters_${Date.now()}`;
      updatedItem.createdAt = timestamp;
      newItems = [updatedItem, ...items];
    } else {
      newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
    }
    setItems(newItems);
    setEditingItem(null);
    handleSaveDraft(true, newItems);
    toast({ type: 'success', title: 'Applied', message: 'Newsletter applied to draft list.' });
  };

  const deleteItem = (itemToDelete) => {
    if (!window.confirm(`Delete newsletter "${itemToDelete.title}"?`)) return;
    const newItems = items.filter(i => i.id !== itemToDelete.id);
    setItems(newItems);
    handleSaveDraft(true, newItems);
  };

  const togglePin = (itemToToggle) => {
    const newItems = items.map(i => i.id === itemToToggle.id ? { ...i, pinned: !i.pinned } : i);
    setItems(newItems);
    handleSaveDraft(true, newItems);
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file || !editingItem) return;
    setUploadingImage(true);
    try {
      const compressed = await fileService.compressImage(file, 600, 0.85);
      const rec = await fileService.upload(compressed, 'updates', 'newsletters');
      setEditingItem(p => ({ ...p, thumbnailUrl: rec.url }));
    } catch (err) {
      toast({ type: 'error', title: 'Upload Failed', message: 'Could not upload thumbnail.' });
    }
    setUploadingImage(false);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file || !editingItem) return;
    setUploadingPdf(true);
    try {
      const rec = await fileService.upload(file, 'updates', 'newsletters');
      setEditingItem(p => ({ ...p, pdfUrl: rec.url }));
    } catch (err) {
      toast({ type: 'error', title: 'Upload Failed', message: 'Could not upload PDF.' });
    }
    setUploadingPdf(false);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'updates.newsletters', items);

  const filteredItems = useMemo(() => {
    return items.filter(i => {
      return (i.title || '').toLowerCase().includes(search.toLowerCase()) || 
             (i.month || '').toLowerCase().includes(search.toLowerCase()) ||
             (i.year || '').toLowerCase().includes(search.toLowerCase());
    });
  }, [items, search]);

  // Executive Metrics
  const metrics = useMemo(() => {
    return {
      total: items.length,
      published: items.filter(i => i.published).length,
      pinned: items.filter(i => i.pinned).length,
      drafts: items.filter(i => !i.published).length,
    };
  }, [items]);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Newsletters Manager"
      description="Manage the CAHCET Chronicle and other periodic publications."
      breadcrumb={['Admin', 'Updates', 'Newsletters']}
      onSave={() => handleSaveDraft(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
    >
      <AnimatePresence mode="wait">
        {!editingItem ? (
          <motion.div key="list" {...fadeUp} className="space-y-8">
            
            {/* Executive Header Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Editions', value: metrics.total, color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { label: 'Published Live', value: metrics.published, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                { label: 'Pinned', value: metrics.pinned, color: 'bg-amber-50 text-amber-700 border-amber-100' },
                { label: 'Drafts', value: metrics.drafts, color: 'bg-slate-100 text-slate-700 border-slate-200' }
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${stat.color} flex flex-col justify-center`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">{stat.label}</span>
                  <span className="text-3xl font-extrabold tracking-tight">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Smart Filter Bar */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm sticky top-[132px] z-10">
              <div className="flex flex-1 w-full gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white shadow-sm transition-all" 
                    placeholder="Search by title, month, or year..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}><ListIcon className="w-4 h-4" /></button>
                </div>
                <button onClick={() => setEditingItem({ ...createEmptyItem(UPDATE_TYPES.NEWSLETTERS) })} className="flex flex-1 md:flex-none items-center justify-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgb(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-0.5 transition-all">
                  <Plus className="w-4 h-4" /> Add Newsletter
                </button>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white/50 backdrop-blur-sm border border-slate-200 border-dashed rounded-3xl">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"><Newspaper className="w-8 h-8 text-slate-300" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No newsletters found</h3>
                <p className="text-slate-500 font-medium text-sm">Upload a new edition or adjust your search.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "flex flex-col gap-3"}>
                <AnimatePresence>
                  {filteredItems.map(item => (
                    <NewsletterCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteItem} onTogglePin={togglePin} viewMode={viewMode} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="editor" {...fadeUp} className="space-y-6">
            <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl sticky top-[132px] z-10 shadow-sm">
              <button onClick={() => setEditingItem(null)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Directory
              </button>
              <div className="flex gap-3">
                <button onClick={() => saveIndividualEdit(editingItem)} className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
                  <CheckCircle className="w-4 h-4" /> Apply Changes
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-8 space-y-6">
                <EditorCard title="Edition Information" description="Set the title, date, and edition details.">
                  <div className="space-y-6">
                    <AdminInput 
                      label="Newsletter Title *" 
                      value={editingItem.title} 
                      onChange={e => setEditingItem(p => ({ ...p, title: e.target.value }))} 
                      placeholder="e.g. CAHCET Chronicle - Spring Edition" 
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Month</label>
                        <select 
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm cursor-pointer"
                          value={editingItem.month || 'January'}
                          onChange={e => setEditingItem(p => ({ ...p, month: e.target.value }))}
                        >
                          {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Year</label>
                        <AdminInput 
                          value={editingItem.year || new Date().getFullYear().toString()} 
                          onChange={e => setEditingItem(p => ({ ...p, year: e.target.value }))} 
                          placeholder="e.g. 2026" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Edition #</label>
                        <AdminInput 
                          value={editingItem.editionNumber || ''} 
                          onChange={e => setEditingItem(p => ({ ...p, editionNumber: e.target.value }))} 
                          placeholder="e.g. 45" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="space-y-1.5">
                         <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Publish Date</label>
                         <input 
                            type="date" 
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white transition-all shadow-sm"
                            value={editingItem.publishDate || ''} 
                            onChange={e => setEditingItem(p => ({ ...p, publishDate: e.target.value }))} 
                         />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Public Visibility</label>
                        <AdminToggle 
                          label="Publish Newsletter" 
                          checked={editingItem.published !== false} 
                          onChange={v => setEditingItem(p => ({ ...p, published: v }))} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Brief Description</label>
                      <textarea 
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none bg-white transition-all shadow-sm leading-relaxed" 
                        rows={3} 
                        value={editingItem.description || ''} 
                        onChange={e => setEditingItem(p => ({ ...p, description: e.target.value }))} 
                        placeholder="Highlights of this edition..." 
                      />
                    </div>
                  </div>
                </EditorCard>

                <EditorCard title="Files & Assets" description="Upload the PDF document and a cover thumbnail.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* PDF Upload */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800">PDF Document</h4>
                      <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-colors ${editingItem.pdfUrl ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'}`}>
                         <FileText className={`w-10 h-10 mb-3 ${editingItem.pdfUrl ? 'text-emerald-500' : 'text-slate-300'}`} />
                         {editingItem.pdfUrl ? (
                            <>
                              <p className="text-sm font-bold text-emerald-700 mb-1">PDF Attached</p>
                              <a href={editingItem.pdfUrl} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 uppercase tracking-wider truncate max-w-full px-4">View Document</a>
                            </>
                         ) : (
                            <p className="text-sm text-slate-500 font-medium">No PDF attached</p>
                         )}
                         <label className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                           {uploadingPdf ? 'Uploading...' : (editingItem.pdfUrl ? 'Replace PDF' : 'Upload PDF')}
                           <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={uploadingPdf} />
                         </label>
                      </div>
                    </div>
                    
                    {/* Thumbnail Upload */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800">Cover Thumbnail</h4>
                      <div className="flex flex-col items-center">
                        <div className="w-32 aspect-[3/4] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner mb-4 flex items-center justify-center group">
                           {editingItem.thumbnailUrl ? (
                             <>
                               <img loading="lazy" decoding="async" src={editingItem.thumbnailUrl} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button onClick={() => setEditingItem(p => ({ ...p, thumbnailUrl: '' }))} className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"><Trash2 className="w-4 h-4"/></button>
                               </div>
                             </>
                           ) : (
                             <Newspaper className="w-8 h-8 text-slate-300" />
                           )}
                        </div>
                        <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                           <Upload className="w-3.5 h-3.5 text-amber-500" /> {uploadingImage ? 'Uploading...' : 'Upload Cover'}
                           <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploadingImage} />
                         </label>
                      </div>
                    </div>

                  </div>
                </EditorCard>
              </div>

              {/* Right Panel: Live Preview Card */}
              <div className="xl:col-span-4">
                <div className="sticky top-40">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600"><Eye className="w-3.5 h-3.5" /></div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Public Preview</h3>
                  </div>
                  
                  <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-[0_20px_40px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col transform origin-top hover:scale-[1.02] transition-transform duration-500">
                    <div className="bg-slate-100/50 border-b border-slate-100 px-4 py-3 flex items-center gap-2 backdrop-blur-sm">
                      <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-300" /><div className="w-2.5 h-2.5 rounded-full bg-slate-300" /><div className="w-2.5 h-2.5 rounded-full bg-slate-300" /></div>
                    </div>
                    
                    <div className="p-6 bg-white flex flex-col items-center">
                       <div className="w-40 aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden shadow-lg border border-slate-200 relative mb-5">
                          {editingItem.thumbnailUrl ? (
                            <img loading="lazy" decoding="async" src={editingItem.thumbnailUrl} alt="Cover" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50"><Newspaper className="w-10 h-10 text-slate-300" /></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          {editingItem.editionNumber && (
                            <div className="absolute bottom-2 left-0 right-0 text-center">
                              <span className="text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-md">Issue #{editingItem.editionNumber}</span>
                            </div>
                          )}
                       </div>
                       
                       <div className="text-center w-full">
                         <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto w-fit mb-3">
                            {editingItem.month || 'Month'} {editingItem.year || 'Year'}
                          </span>
                         <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{editingItem.title || 'Newsletter Title'}</h4>
                         <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-5">{editingItem.description || 'Description preview...'}</p>
                         
                         <div className="flex justify-center">
                           <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${editingItem.pdfUrl ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                              <Download className="w-3.5 h-3.5" /> Download PDF
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {previewSection && (
        <SectionPreviewModal 
          section={previewSection}
          onClose={() => setPreviewSection(null)}
          onPublish={async (sec) => {
            await cmsService.publishSection(sec.id);
            setPreviewSection(null);
            fetchPage();
            toast({ type: 'success', title: 'Live', message: 'Newsletters pushed to production.' });
          }}
          onRestore={() => fetchPage()}
        />
      )}
    </EditorPage>
  );
};

export default NewsletterEditor;
