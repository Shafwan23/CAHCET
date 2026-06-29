import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, ArrowUp, ArrowDown, Search, X, Image as ImageIcon, Camera, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import { fileService } from '../../../services/fileService';
import VersionHistoryModal from './shared/VersionHistoryModal';
import GallerySection from '../../../../components/departments/sections/GallerySection';

const CATEGORIES = ['Symposium', 'Workshop', 'Industrial Visit', 'Hackathon', 'Placement Training', 'Cultural Events', 'Student Projects', 'Other'];

const emptyAlbum = {
  id: '',
  albumName: '',
  category: 'Other',
  date: '',
  images: []
};

const DeptGalleryEditor = ({ deptKey, dept, cms, session }) => {
  const { addToast } = useToast?.() || { addToast: () => {} };
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (cms.data?.gallery) {
      setAlbums(Array.isArray(cms.data.gallery) ? cms.data.gallery : []);
    } else {
      setAlbums([]);
    }
  }, [deptKey, cms.data]);

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      cms.setSection('gallery', albums);
      await cms.saveSection('gallery', session?.username, session?.name, isSilent);
      if (!isSilent) addToast({ type: 'success', title: 'Draft Saved', message: `Gallery changes saved to draft.` });
    } catch(e) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    if (cms.publishSection) {
       await cms.publishSection('gallery');
       addToast({ type: 'success', title: 'Live', message: 'Gallery published to production.' });
    }
  };

  const handleReset = () => {
    const fresh = cms.data?.gallery || [];
    setAlbums(Array.isArray(fresh) ? fresh : []);
    cms.setSection('gallery', fresh);
    addToast({ type: 'info', title: 'Reset', message: 'Discarded unsaved changes.' });
  };

  const updateItem = (index, field, value) => {
    const updated = [...albums];
    updated[index][field] = value;
    setAlbums(updated);
    cms.setSection('gallery', updated);
  };

  const moveItem = (index, direction) => {
    const list = [...albums];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    setAlbums(list);
    cms.setSection('gallery', list);
  };

  const removeItem = (index) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      const updated = albums.filter((_, i) => i !== index);
      setAlbums(updated);
      cms.setSection('gallery', updated);
    }
  };

  const addItem = () => {
    const newItem = { ...emptyAlbum, id: `alb_${Date.now()}` };
    const updated = [newItem, ...albums];
    setAlbums(updated);
    cms.setSection('gallery', updated);
    setSearch('');
  };

  const handleImageUpload = async (e, albumIndex) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    
    const newImages = [];
    for (const file of files) {
      try {
        const compressed = await fileService.compressImage(file, 1200, 0.85);
        const rec = await fileService.upload(compressed, deptKey, 'gallery');
        newImages.push({ url: rec.url, caption: '' });
      } catch (err) {
        console.error("Image upload failed", err);
      }
    }
    
    if (newImages.length > 0) {
       const updatedAlbums = [...albums];
       const currentImages = updatedAlbums[albumIndex].images || [];
       updatedAlbums[albumIndex].images = [...currentImages, ...newImages];
       setAlbums(updatedAlbums);
       cms.setSection('gallery', updatedAlbums);
       addToast({ type: 'success', title: 'Uploaded!', message: `${newImages.length} images added to album.` });
    } else {
       addToast({ type: 'error', title: 'Failed', message: 'Image uploads failed.' });
    }
    setUploading(false);
  };

  const removeAlbumImage = (albumIndex, imageIndex) => {
     const updatedAlbums = [...albums];
     updatedAlbums[albumIndex].images = updatedAlbums[albumIndex].images.filter((_, i) => i !== imageIndex);
     setAlbums(updatedAlbums);
     cms.setSection('gallery', updatedAlbums);
  };

  const validationIssues = [];
  albums.forEach((alb, idx) => {
     if (!alb.albumName?.trim()) validationIssues.push(`Album ${idx + 1} is missing a name.`);
     if (!alb.images || alb.images.length === 0) validationIssues.push(`Album "${alb.albumName || idx + 1}" has no images.`);
  });

  const filtered = search
    ? albums.filter(a => a.albumName.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()))
    : albums;

  return (
    <EditorPage
      title="Events Gallery Editor"
      description="Manage department photo albums, event galleries, and image collections."
      breadcrumb={['Admin', 'Departments', dept.abbr, 'Gallery']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={cms.status?.gallery || 'DRAFT'}
      lastModified={cms.lastModified?.gallery}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Configuration Panel */}
        <div className="xl:col-span-7 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Albums</p>
                   <ImageIcon className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {albums.length}
                   </p>
                </div>
             </div>
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Photos</p>
                   <Camera className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {albums.reduce((sum, a) => sum + (a.images?.length || 0), 0)}
                   </p>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="relative max-w-sm flex-1">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input
                 className="w-full pl-10 pr-4 py-3 border border-slate-200/70 rounded-xl text-sm bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-300"
                 placeholder="Search albums..."
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
               {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-slate-400" /></button>}
             </div>
             <button
               onClick={addItem}
               className="flex items-center justify-center gap-1.5 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all shrink-0"
             >
               <Plus className="w-4 h-4" /> Create Album
             </button>
          </div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
            <AnimatePresence>
              {filtered.map((item) => {
                const actualIndex = albums.findIndex(a => a.id === item.id);
                return (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -40 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    key={item.id} 
                    className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:border-indigo-500/30 transition-all duration-300 group overflow-visible relative"
                  >
                    {/* Premium Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500 pointer-events-none -z-10" />
                  >
                    <div className="p-5 bg-white/60 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between rounded-t-3xl relative z-10">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shrink-0 shadow-sm relative">
                           {item.images && item.images.length > 0 ? (
                             <img src={item.images[0].url || item.images[0]} alt="cover" className="w-full h-full object-cover" />
                           ) : (
                             <ImageIcon className="w-5 h-5 opacity-40 text-indigo-500" />
                           )}
                           <div className="absolute bottom-0 right-0 bg-slate-900 text-white text-[8px] font-bold px-1 rounded-tl-sm">{item.images?.length || 0}</div>
                         </div>
                         <div>
                            <span className="text-base font-extrabold text-slate-900 block leading-tight tracking-tight">
                              {item.albumName || 'New Album'}
                            </span>
                            <span className="text-[10px] text-amber-600 font-bold tracking-widest uppercase">{item.category}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {!search && (
                           <>
                              <button onClick={() => moveItem(actualIndex, -1)} disabled={actualIndex === 0} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 transition-all duration-300">
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveItem(actualIndex, 1)}
                                disabled={actualIndex === albums.length - 1}
                                className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 transition-all duration-300"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <div className="w-px h-4 bg-slate-300 mx-1"></div>
                           </>
                        )}
                        <button onClick={() => removeItem(actualIndex)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl hover:shadow-sm transition-all duration-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <AdminInput
                            label="Album Name"
                            value={item.albumName || ''}
                            onChange={e => updateItem(actualIndex, 'albumName', e.target.value)}
                            placeholder="Tech Fest 2025"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                          <select 
                             className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white"
                             value={item.category} 
                             onChange={e => updateItem(actualIndex, 'category', e.target.value)}
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <AdminInput
                             label="Event Date"
                             type="date"
                             value={item.date || ''}
                             onChange={e => updateItem(actualIndex, 'date', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-50">
                         <div className="flex items-center justify-between mb-3">
                           <label className="block text-xs font-semibold text-slate-600">Images ({item.images?.length || 0})</label>
                           <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer hover:bg-slate-200 border border-slate-200 transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              {uploading ? 'Processing...' : 'Upload Images'}
                              <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(e, actualIndex)} disabled={uploading} />
                           </label>
                         </div>
                         
                         {item.images && item.images.length > 0 ? (
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {item.images.map((imgObj, iIdx) => {
                                 const url = typeof imgObj === 'string' ? imgObj : imgObj.url;
                                 return (
                                   <div key={iIdx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                      <img src={url} alt="" className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                         <button onClick={() => removeAlbumImage(actualIndex, iIdx)} className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 hover:scale-110 transition-all shadow-md">
                                            <Trash2 className="w-3.5 h-3.5" />
                                         </button>
                                      </div>
                                   </div>
                                 );
                              })}
                           </div>
                         ) : (
                           <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                              <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs text-slate-400 font-medium">No images uploaded yet.</p>
                           </div>
                         )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {albums.length === 0 && !search && (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                   <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                   <h3 className="text-sm font-bold text-slate-700">No Albums Created</h3>
                   <p className="text-xs text-slate-500 mt-1 mb-4">Start creating albums and uploading event photos.</p>
                   <button onClick={addItem} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">Create Album</button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side: Live Preview Panel */}
        <div className="xl:col-span-5">
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
                  cahcet.edu.in/departments/{deptKey}/events-gallery
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-primary-50/50 p-6 relative">
                 <div className="scale-[0.8] origin-top">
                    <GallerySection data={albums} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHistory && (
        <VersionHistoryModal
          deptKey={deptKey}
          section="gallery"
          cms={cms}
          session={session}
          onClose={() => setShowHistory(false)}
        />
      )}
    </EditorPage>
  );
};

export default DeptGalleryEditor;
