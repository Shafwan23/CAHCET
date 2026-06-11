import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../ui/Toast';
import EditorPage from '../ui/EditorPage';
import { AdminInput, AdminSelect, AdminButton } from '../ui/AdminInput';
import Modal, { ConfirmDialog } from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import { cmsService } from '../../../services/cmsService';

const CATEGORY_OPTIONS = [
  { value: 'Campus', label: 'Campus' },
  { value: 'Labs', label: 'Labs' },
  { value: 'Events', label: 'Events' },
  { value: 'Placement', label: 'Placement' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Faculty', label: 'Faculty' },
];
const STATUS_OPTIONS = [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }];
const EMPTY_IMAGE = { title: '', url: '', category: 'Campus', status: 'published' };

const GalleryEditor = () => {
  const toast = useToast();
  const [gallery, setGallery] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState(EMPTY_IMAGE);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('gallery');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['gallery.images']) {
          setGallery(JSON.parse(map['gallery.images'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Gallery data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const filtered = gallery.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || g.category === catFilter;
    return matchSearch && matchCat;
  });

  const saveToBackend = async (updatedGallery, publish = false) => {
    if (sectionsMap['gallery.images']) {
      await cmsService.updateSection(sectionsMap['gallery.images'].id, { content: JSON.stringify(updatedGallery) });
    }
    toast({ type: 'success', title: publish ? 'Published!' : 'Saved', message: publish ? 'Gallery is now live.' : 'Changes saved.' });
  };

  const handleAdd = async () => {
    if (!form.url.trim() || !form.title.trim()) {
      toast({ type: 'error', title: 'Required', message: 'Title and image URL are required.' });
      return;
    }
    setLoading(true);
    try {
      const updated = [...gallery, { ...form, id: Date.now().toString() }];
      setGallery(updated);
      await saveToBackend(updated, false);
      setModalOpen(false);
      setForm(EMPTY_IMAGE);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to add image.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const updated = gallery.map(g => g.id === id ? { ...g, status: g.status === 'published' ? 'draft' : 'published' } : g);
      setGallery(updated);
      await saveToBackend(updated, false);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to toggle status.' });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const updated = gallery.filter(g => g.id !== confirmDelete.id);
      setGallery(updated);
      await saveToBackend(updated, false);
      setConfirmDelete(null);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to delete image.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await saveToBackend(gallery, true);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to publish Gallery data.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Gallery Editor"
      description="Manage campus gallery images. Add, remove, or toggle visibility."
      breadcrumb={['Admin', 'Media', 'Gallery']}
      onPublish={handlePublish}
      isLoading={loading}
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search images..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white">
          <option value="all">All Categories</option>
          {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <AdminButton variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>Add Image</AdminButton>
      </div>

      <p className="text-sm text-slate-500 mb-4">{gallery.length} images · {filtered.length} shown</p>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={Image} title="No images found" description="Add your first gallery image." action={<AdminButton variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>Add Image</AdminButton>} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="group relative bg-slate-100 rounded-2xl overflow-hidden aspect-square border border-slate-200 hover:shadow-md transition-shadow"
            >
              <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523050338691-c1e53d076efd?w=400&q=60'; }} />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs text-white font-semibold truncate">{img.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <StatusBadge status={img.status} />
                    <div className="flex gap-1.5">
                      <button onClick={() => setPreviewImg(img)} className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmDelete(img)} className="p-1.5 bg-amber-500/80 text-white rounded-lg hover:bg-amber-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              {img.status === 'draft' && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded-full">DRAFT</div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Gallery Image" size="md"
        footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton variant="primary" onClick={handleAdd} loading={loading}>Add Image</AdminButton></>}
      >
        <div className="space-y-4">
          <AdminInput label="Image Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Main Block" />
          <AdminInput label="Image URL *" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." hint="Paste a direct image URL" />
          {form.url && (
            <div className="rounded-xl overflow-hidden h-40 bg-slate-100">
              <img src={form.url} alt="Preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect label="Category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} options={CATEGORY_OPTIONS} />
            <AdminSelect label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS} />
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewImg} onClose={() => setPreviewImg(null)} title={previewImg?.title || 'Preview'} size="lg">
        {previewImg && <img src={previewImg.url} alt={previewImg.title} className="w-full rounded-xl object-contain max-h-96" />}
      </Modal>

      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete}
        title="Delete Image" message={`Remove "${confirmDelete?.title}" from the gallery?`} confirmText="Delete" confirmVariant="danger" isLoading={loading} />
    </EditorPage>
  );
};

export default GalleryEditor;
