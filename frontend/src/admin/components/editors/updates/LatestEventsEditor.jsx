import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Calendar, MapPin, 
  Search, Pin, Upload, CheckCircle, ArrowLeft,
  Filter, ArrowUpDown, LayoutGrid, List as ListIcon, X, CalendarDays, Eye
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

const EventCard = ({ item, onEdit, onDelete, onTogglePin, viewMode }) => {
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
      
      {/* List vs Grid Layout switch */}
      {isList ? (
        <>
          <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 border border-slate-100 shadow-sm">
            {item.image ? (
              <img loading="lazy" decoding="async" src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"><Calendar className="w-6 h-6" /></div>
            )}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-between">
             <div className="space-y-1">
               <div className="flex items-center gap-2">
                 <h4 className="font-bold text-slate-900 text-sm truncate">{item.title || 'Untitled Event'}</h4>
                 {item.pinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />}
                 {!item.published && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase">Draft</span>}
               </div>
               <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                 <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-amber-500" /> {item.eventDate || 'TBD'}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300" />
                 <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {item.venue || 'TBD'}</span>
               </div>
             </div>
             
             <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  item.eventStatus === 'Live' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                  item.eventStatus === 'Completed' ? 'bg-slate-50 text-slate-500 border border-slate-200/50' :
                  'bg-blue-50 text-blue-600 border border-blue-100/50'
                }`}>
                  {item.eventStatus || 'Upcoming'}
                </span>
                
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
          <div className="h-44 bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
            {item.image ? (
              <img loading="lazy" decoding="async" src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100"><Calendar className="w-10 h-10" /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0 opacity-60" />
            
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                item.eventStatus === 'Live' ? 'bg-emerald-500/90 text-white' :
                item.eventStatus === 'Completed' ? 'bg-slate-800/80 text-white' :
                'bg-blue-500/90 text-white'
              }`}>
                {item.eventStatus || 'Upcoming'}
              </span>
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

            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white text-xs font-medium drop-shadow-sm">
              <span className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-2 py-1 rounded-md"><CalendarDays className="w-3 h-3" /> {item.eventDate || 'TBD'}</span>
            </div>
          </div>
          
          <div className="p-5 flex-1 flex flex-col relative bg-white">
            <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-amber-600 transition-colors">{item.title || 'Untitled Event'}</h4>
            {item.venue && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3 font-medium"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.venue}</p>
            )}
            
            <div className="mt-auto pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <button onClick={() => onTogglePin(item)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors ${item.pinned ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-slate-600 bg-slate-50 hover:bg-slate-100'}`}>
                <Pin className="w-3.5 h-3.5" /> {item.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button onClick={() => onEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => onDelete(item)} className="w-10 flex items-center justify-center py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

const LatestEventsEditor = () => {
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
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Individual Editor State
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('updates');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['updates.events']) {
        const dataStr = map['updates.events'].draftContent || map['updates.events'].content || '[]';
        setItems(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Events data.' });
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
      if (sectionsMap['updates.events']) {
        await cmsService.updateSection(sectionsMap['updates.events'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId, sectionKey: 'updates.events', title: 'Latest Events', draftContent: content, _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'updates.events': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Events saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Events draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSaveDraft(true);
    const res = await cmsService.getPage('updates');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'updates.events');
    setPreviewSection(updatedSec);
  };

  const handleReset = () => {
    setItems([]);
    toast({ type: 'info', title: 'Reset', message: 'Events reverted to empty list.' });
  };

  const saveIndividualEdit = (updatedItem) => {
    let newItems;
    const adminName = admin?.name || 'Admin';
    const timestamp = new Date().toISOString();
    updatedItem.lastEditedBy = adminName;
    updatedItem.updatedAt = timestamp;

    if (!updatedItem.id) {
      updatedItem.id = `events_${Date.now()}`;
      updatedItem.createdAt = timestamp;
      newItems = [updatedItem, ...items];
    } else {
      newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
    }
    setItems(newItems);
    setEditingItem(null);
    handleSaveDraft(true, newItems);
    toast({ type: 'success', title: 'Applied', message: 'Event applied to draft list.' });
  };

  const deleteItem = (itemToDelete) => {
    if (!window.confirm(`Delete event "${itemToDelete.title}"?`)) return;
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
      const compressed = await fileService.compressImage(file, 800, 0.85);
      const rec = await fileService.upload(compressed, 'updates', 'events');
      setEditingItem(p => ({ ...p, image: rec.url }));
    } catch (err) {
      toast({ type: 'error', title: 'Upload Failed', message: 'Could not upload image.' });
    }
    setUploadingImage(false);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'updates.events', items);

  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = (i.title || '').toLowerCase().includes(search.toLowerCase()) || (i.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || i.eventStatus === statusFilter || (!i.eventStatus && statusFilter === 'Upcoming');
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  // Executive Metrics
  const metrics = useMemo(() => {
    return {
      total: items.length,
      published: items.filter(i => i.published).length,
      drafts: items.filter(i => !i.published).length,
      upcoming: items.filter(i => i.eventStatus === 'Upcoming' || !i.eventStatus).length
    };
  }, [items]);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Latest Events Manager"
      description="Manage campus events, seminars, workshops and fests with an enterprise workflow."
      breadcrumb={['Admin', 'Updates', 'Events']}
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
                { label: 'Total Events', value: metrics.total, color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { label: 'Published Live', value: metrics.published, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                { label: 'Drafts', value: metrics.drafts, color: 'bg-amber-50 text-amber-700 border-amber-100' },
                { label: 'Upcoming', value: metrics.upcoming, color: 'bg-purple-50 text-purple-700 border-purple-100' }
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
                    placeholder="Search events by title or description..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                <div className="relative flex items-center">
                  <Filter className="w-4 h-4 text-slate-400 absolute left-3" />
                  <select 
                    className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live / Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}><ListIcon className="w-4 h-4" /></button>
                </div>
                <button onClick={() => setEditingItem({ ...createEmptyItem(UPDATE_TYPES.EVENTS) })} className="flex flex-1 md:flex-none items-center justify-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgb(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-0.5 transition-all">
                  <Plus className="w-4 h-4" /> Create Event
                </button>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white/50 backdrop-blur-sm border border-slate-200 border-dashed rounded-3xl">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"><Calendar className="w-8 h-8 text-slate-300" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No events found</h3>
                <p className="text-slate-500 font-medium text-sm">Create a new event or adjust your search filters.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                <AnimatePresence>
                  {filteredItems.map(item => (
                    <EventCard key={item.id} item={item} onEdit={setEditingItem} onDelete={deleteItem} onTogglePin={togglePin} viewMode={viewMode} />
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
                <EditorCard title="Event Configuration" description="Core information about the event including dates and status.">
                  <div className="space-y-6">
                    <AdminInput 
                      label="Event Title *" 
                      value={editingItem.title} 
                      onChange={e => setEditingItem(p => ({ ...p, title: e.target.value }))} 
                      placeholder="e.g. Annual Tech Symposium 'Xelerate 2026'" 
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Event Date</label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="date" 
                            className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white transition-all shadow-sm"
                            value={editingItem.eventDate || ''} 
                            onChange={e => setEditingItem(p => ({ ...p, eventDate: e.target.value }))} 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Venue</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white transition-all shadow-sm"
                            value={editingItem.venue || ''} 
                            onChange={e => setEditingItem(p => ({ ...p, venue: e.target.value }))} 
                            placeholder="e.g. Main Auditorium" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Event Status</label>
                        <select 
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm cursor-pointer"
                          value={editingItem.eventStatus || 'Upcoming'}
                          onChange={e => setEditingItem(p => ({ ...p, eventStatus: e.target.value }))}
                        >
                          <option value="Upcoming">Upcoming (Future Event)</option>
                          <option value="Live">Live / Ongoing (Happening Now)</option>
                          <option value="Completed">Completed (Past Event)</option>
                          <option value="Archived">Archived (Hidden from main list)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Public Visibility</label>
                        <AdminToggle 
                          label="Publish Event" 
                          checked={editingItem.published !== false} 
                          onChange={v => setEditingItem(p => ({ ...p, published: v }))} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Description</label>
                      <textarea 
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none bg-white transition-all shadow-sm leading-relaxed" 
                        rows={5} 
                        value={editingItem.description || ''} 
                        onChange={e => setEditingItem(p => ({ ...p, description: e.target.value }))} 
                        placeholder="Provide full details about the event context, agenda, speakers, etc." 
                      />
                    </div>
                  </div>
                </EditorCard>

                <EditorCard title="Event Creative" description="Upload a high-quality thumbnail image.">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-48 aspect-video sm:aspect-square rounded-2xl bg-slate-50 border border-slate-200 shrink-0 overflow-hidden relative shadow-inner flex items-center justify-center group">
                      {editingItem.image ? (
                        <>
                          <img loading="lazy" decoding="async" src={editingItem.image} alt="Event Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => setEditingItem(p => ({ ...p, image: '' }))} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors shadow-lg">Remove</button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <Upload className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">Cover Image</h4>
                        <p className="text-xs text-slate-500">Upload a 16:9 or 1:1 image. Maximum size 2MB. This image will appear on the public portal.</p>
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm w-fit">
                        <Upload className="w-4 h-4 text-amber-500" /> {uploadingImage ? 'Uploading...' : 'Browse Files'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploadingImage} />
                      </label>
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
                    
                    {/* The exact frontend representation mock */}
                    <div className="h-48 bg-slate-100 relative overflow-hidden shrink-0">
                      {editingItem.image ? (
                        <img loading="lazy" decoding="async" src={editingItem.image} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Calendar className="w-10 h-10" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                         <div className="flex gap-2 mb-2">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                             editingItem.eventStatus === 'Live' ? 'bg-emerald-500 text-white' :
                             editingItem.eventStatus === 'Completed' ? 'bg-slate-700 text-white' :
                             'bg-amber-500 text-white'
                           }`}>
                             {editingItem.eventStatus || 'Upcoming'}
                           </span>
                         </div>
                         <h4 className="font-bold text-white text-lg leading-tight shadow-sm drop-shadow-md">{editingItem.title || 'Event Title'}</h4>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col relative bg-white">
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">{editingItem.description || 'Description preview...'}</p>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                         <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><CalendarDays className="w-3.5 h-3.5 text-amber-500" /> {editingItem.eventDate || 'TBD'}</span>
                         <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {editingItem.venue || 'TBD'}</span>
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
            toast({ type: 'success', title: 'Live', message: 'Events changes pushed to production.' });
          }}
          onRestore={() => fetchPage()}
        />
      )}
    </EditorPage>
  );
};

export default LatestEventsEditor;
