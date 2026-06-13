/**
 * DeptGalleryEditor.jsx — Gallery CMS Editor
 * Album-based management with multiple image upload, lightbox preview, and delete.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, X, Upload, Images, Expand, ChevronLeft,
  ChevronRight, Eye, Pencil, Save, CheckCircle,
} from 'lucide-react';
import { fileService } from '../../../services/fileService';

const emptyAlbum = { albumName: '', date: '', images: [] };
const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all bg-white text-slate-800";

/* ─── Lightbox ─── */
const Lightbox = ({ images, startIdx, onClose }) => {
  const [idx, setIdx] = useState(startIdx);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  useKeyDown('ArrowLeft', prev);
  useKeyDown('ArrowRight', next);
  useKeyDown('Escape', onClose);

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <motion.img
        key={idx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        src={images[idx]}
        alt=""
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
        onClick={e => e.stopPropagation()}
      />
      <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
        <ChevronRight className="w-6 h-6" />
      </button>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white">
        <X className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 text-white/60 text-sm">{idx + 1} / {images.length}</div>
    </div>
  );
};

function useKeyDown(key, fn) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === key) fn(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [fn, key]);
}

/* ─── Album Modal ─── */
const AlbumModal = ({ initial, deptKey, onSave, onClose }) => {
  const [form, setForm] = useState({ ...emptyAlbum, category: 'Other', ...initial });
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const newImages = [];
    for (const file of files) {
      try {
        const compressed = await fileService.compressImage(file, 1200, 0.85);
        const rec = await fileService.upload(compressed, deptKey, 'gallery');
        newImages.push({ url: rec.url, caption: '' });
      } catch {}
    }
    const currentImages = (form.images || []).map(img => typeof img === 'string' ? { url: img, caption: '' } : img);
    update('images', [...currentImages, ...newImages]);
    setUploading(false);
  };

  const removeImage = (idx) => update('images', form.images.filter((_, i) => i !== idx));

  const ALBUM_CATEGORIES = ['Symposium', 'Workshop', 'Industrial Visit', 'Hackathon', 'Placement Training', 'Cultural Events', 'Student Projects', 'Other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-slate-800">{initial?.id ? 'Edit Album' : 'Create Album'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Album Name *</label>
              <input className={inputCls} value={form.albumName} onChange={e => update('albumName', e.target.value)} placeholder="e.g. Tech Fest 2025" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category *</label>
              <select className={inputCls} value={form.category || 'Other'} onChange={e => update('category', e.target.value)}>
                {ALBUM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Event Date</label>
              <input className={inputCls} type="date" value={form.date} onChange={e => update('date', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Images ({form.images.length})</label>
            <label className="flex items-center gap-3 px-4 py-4 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 cursor-pointer hover:border-amber-400 hover:text-amber-500 transition-colors">
              <Upload className="w-5 h-5" />
              <div>
                <p className="font-medium">{uploading ? 'Uploading...' : 'Click to upload images'}</p>
                <p className="text-xs text-slate-400">Multiple files supported, JPG/PNG</p>
              </div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} disabled={uploading} />
            </label>

            {uploading && (
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
                <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                Processing images...
              </div>
            )}

            {form.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                {form.images.map((imgObj, i) => {
                  const img = typeof imgObj === 'string' ? { url: imgObj, caption: '' } : imgObj;
                  return (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex gap-3 items-center">
                      <div className="relative group w-16 h-16 shrink-0">
                        <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg border border-slate-200 cursor-pointer" onClick={() => setLightbox(i)} />
                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button onClick={() => setLightbox(i)} className="p-1 bg-white/95 rounded-lg"><Expand className="w-3 h-3 text-slate-700" /></button>
                          <button onClick={() => removeImage(i)} className="p-1 bg-amber-500 rounded-lg"><X className="w-3 h-3 text-white" /></button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                          placeholder="Image caption..."
                          value={img.caption || ''}
                          onChange={e => {
                            const list = [...form.images];
                            list[i] = { url: img.url, caption: e.target.value };
                            update('images', list);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={() => form.albumName.trim() && onSave(form)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">
            <Save className="w-4 h-4" /> {initial?.id ? 'Update Album' : 'Create Album'}
          </button>
        </div>
      </motion.div>
      {lightbox !== null && <Lightbox images={form.images.map(img => typeof img === 'string' ? img : img.url)} startIdx={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
};

/* ─── Album Card ─── */
const AlbumCard = ({ album, onEdit, onDelete, onView }) => {
  const cover = album.images?.[0];
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
      <div className="h-40 bg-slate-100 relative cursor-pointer" onClick={() => onView(album)}>
        {cover ? (
          <>
            <img src={cover} alt="" className="w-full h-full object-cover" />
            {album.images.length > 1 && (
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
                {album.images.slice(0, 4).map((url, i) => (
                  <img key={i} src={url} alt="" className={`object-cover w-full h-full ${i === 0 ? 'rounded-tl-xl' : i === 1 ? 'rounded-tr-xl' : i === 2 ? 'rounded-bl-xl' : 'rounded-br-xl'}`} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Images className="w-10 h-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {album.images.length} photos
        </div>
      </div>
      <div className="p-3">
        <p className="font-bold text-slate-800 text-sm">{album.albumName}</p>
        {album.date && <p className="text-xs text-slate-400 mt-0.5">{new Date(album.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(album)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50">
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button onClick={() => onDelete(album)} className="px-3 py-1.5 text-xs text-amber-500 border border-primary-200 rounded-lg hover:bg-primary-50">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main ─── */
const DeptGalleryEditor = ({ deptKey, dept, cms, session }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [lightboxAlbum, setLightboxAlbum] = useState(null);
  const [saved, setSaved] = useState(false);

  const gallery = cms.data?.gallery || [];

  const handleSave = (form) => {
    if (form.id) cms.updateItem('gallery', form.id, form, session?.username, session?.name);
    else cms.addItem('gallery', form, session?.username, session?.name);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Events Gallery</h2>
          <p className="text-sm text-slate-400 mt-0.5">{gallery.length} album{gallery.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-primary-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" /> Saved!</div>}
          <button onClick={() => setEditing(emptyAlbum)} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> Create Album
          </button>
        </div>
      </div>

      {gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Images className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium">No albums yet.</p>
          <p className="text-xs text-slate-400 mt-1">Create an album and upload event photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {gallery.map(album => (
              <AlbumCard key={album.id} album={album} onEdit={setEditing} onDelete={setDeleting} onView={(a) => setLightboxAlbum(a)} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {editing && <AlbumModal initial={editing} deptKey={deptKey} onSave={handleSave} onClose={() => setEditing(null)} />}
        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
              <Trash2 className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">Delete Album?</h3>
              <p className="text-sm text-slate-500 mb-4"><strong>{deleting.albumName}</strong> ({deleting.images?.length} photos)</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleting(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
                <button onClick={() => { cms.deleteItem('gallery', deleting.id, session?.username, session?.name, deleting.albumName); setDeleting(null); }}
                  className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {lightboxAlbum && lightboxAlbum.images?.length > 0 && (
        <Lightbox images={lightboxAlbum.images} startIdx={0} onClose={() => setLightboxAlbum(null)} />
      )}
    </div>
  );
};

export default DeptGalleryEditor;
