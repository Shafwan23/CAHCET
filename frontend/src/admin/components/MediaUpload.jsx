import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Trash2, Copy, Check, X, ZoomIn } from 'lucide-react';
import { useToast } from './ui/Toast';
import { ConfirmDialog } from './ui/Modal';
import EmptyState from './ui/EmptyState';
import EditorPage from './ui/EditorPage';
import { cmsService } from '../../services/cmsService';

const MAX_SIZE_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MediaUpload = () => {
  const toast = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [media, setMedia] = useState([]);
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await cmsService.getPage('system');
        const sections = res.data?.sections || [];
        const mediaSection = sections.find(s => s.sectionKey === 'system.media');
        if (mediaSection) {
          setSectionId(mediaSection.id);
          setMedia(JSON.parse(mediaSection.content));
        } else {
          setMedia([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const saveMedia = async (newMedia) => {
    if (!sectionId) return; // Cannot save if section doesn't exist
    try {
      await cmsService.updateSection(sectionId, { content: JSON.stringify(newMedia) });
      setMedia(newMedia);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to update media.' });
    }
  };

  const filtered = media.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const processFiles = useCallback(async (files) => {
    const valid = Array.from(files).filter(f => {
      if (!ACCEPTED.includes(f.type)) { toast({ type: 'error', title: 'Invalid file', message: `${f.name}: Only images are allowed.` }); return false; }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) { toast({ type: 'error', title: 'File too large', message: `${f.name}: Max ${MAX_SIZE_MB}MB allowed.` }); return false; }
      return true;
    });
    if (!valid.length) return;

    setUploading(true);
    const newItems = await Promise.all(
      valid.map(file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Simple compression: create canvas and reduce quality
          const img = document.createElement('img');
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_W = 1200;
            const ratio = Math.min(1, MAX_W / img.width);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            resolve({
              id: Date.now().toString() + Math.random().toString(36).slice(2),
              name: file.name,
              url: dataUrl,
              size: Math.round(dataUrl.length * 0.75 / 1024),
              type: file.type,
              uploadedAt: new Date().toISOString(),
            });
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }))
    );

    await new Promise(r => setTimeout(r, 500));
    const updated = [...media, ...newItems];
    await saveMedia(updated);
    setUploading(false);
    toast({ type: 'success', title: `${newItems.length} image${newItems.length > 1 ? 's' : ''} uploaded`, message: 'Images compressed and saved.' });
  }, [media, toast, sectionId]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({ type: 'success', title: 'Copied!', message: 'URL copied to clipboard.' });
    });
  };

  const handleDelete = () => {
    const updated = media.filter(m => m.id !== confirmDelete.id);
    saveMedia(updated);
    setConfirmDelete(null);
    toast({ type: 'success', title: 'Deleted' });
  };

  const totalSizeMB = (media.reduce((a, m) => a + (m.size || 0), 0) / 1024).toFixed(1);

  if (loading) return <div>Loading...</div>;

  return (
    <EditorPage title="Media Uploads" description="Upload and manage images. Supports JPEG, PNG, WebP, GIF up to 5MB." breadcrumb={['Admin', 'Media', 'Uploads']}>
      {/* Stats bar */}
      <div className="flex gap-4 mb-5 text-sm">
        <span className="text-slate-500">{media.length} files · {totalSizeMB} MB stored</span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 mb-6 ${
          isDragOver ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 bg-white'
        }`}
      >
        <input ref={fileInputRef} type="file" multiple accept={ACCEPTED.join(',')} className="hidden" onChange={e => processFiles(e.target.files)} />
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-amber-600">Uploading & compressing...</p>
            </motion.div>
          ) : (
            <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragOver ? 'bg-amber-100' : 'bg-slate-100'}`}>
                <Upload className={`w-6 h-6 ${isDragOver ? 'text-amber-500' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{isDragOver ? 'Drop to upload!' : 'Drag & drop images here'}</p>
                <p className="text-xs text-slate-400 mt-1">or click to browse · JPEG, PNG, WebP, GIF · Max 5MB each</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      {media.length > 0 && (
        <div className="relative mb-4">
          <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all" />
        </div>
      )}

      {/* Media Grid */}
      {filtered.length === 0 && !uploading ? (
        <EmptyState icon={ImageIcon} title="No media yet" description="Upload images to build your media library." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              className="group relative bg-slate-100 rounded-xl overflow-hidden aspect-square border border-slate-200 hover:shadow-lg transition-all"
            >
              <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-white text-[10px] font-medium text-center line-clamp-2 leading-tight">{item.name}</p>
                <p className="text-slate-300 text-[9px]">{item.size}KB</p>
                <div className="flex gap-1.5 mt-1">
                  <button onClick={() => setPreviewImg(item)} className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleCopy(item.url, item.id)} className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => setConfirmDelete(item)} className="p-1.5 bg-amber-500/80 text-white rounded-lg hover:bg-amber-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewImg(null)}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewImg(null)} className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-700 hover:text-amber-600"><X className="w-4 h-4" /></button>
            <img src={previewImg.url} alt={previewImg.name} className="w-full rounded-2xl shadow-2xl" />
            <p className="text-white text-center text-sm mt-3 font-medium">{previewImg.name}</p>
          </motion.div>
        </div>
      )}

      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete}
        title="Delete Image" message={`Permanently delete "${confirmDelete?.name}"?`} confirmText="Delete" confirmVariant="danger" />
    </EditorPage>
  );
};

export default MediaUpload;
