import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Calendar } from 'lucide-react';
import { useToast } from '../ui/Toast';
import EditorPage from '../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminSelect, AdminButton } from '../ui/AdminInput';
import Modal, { ConfirmDialog } from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import { cmsService } from '../../services/cmsService';

const CATEGORY_OPTIONS = [
  { value: 'Technical', label: 'Technical' },
  { value: 'Placement', label: 'Placement' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Other', label: 'Other' },
];
const STATUS_OPTIONS = [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }];
const EMPTY_EVENT = { title: '', date: '', description: '', category: 'Technical', status: 'published' };

const EventsEditor = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('updates');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['updates.events']) {
          setEvents(JSON.parse(map['updates.events'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Events data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm(EMPTY_EVENT); setModalOpen(true); };
  const openEdit = (e) => { setEditing(e.id); setForm({ ...e }); setModalOpen(true); };

  const handleSaveData = async (newEvents, isPublish = false) => {
    try {
      if (sectionsMap['updates.events']) {
        await cmsService.updateSection(sectionsMap['updates.events'].id, { content: JSON.stringify(newEvents) });
      }
      toast({ type: 'success', title: isPublish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save events.' });
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date) {
      toast({ type: 'error', title: 'Required', message: 'Title and date are required.' });
      return;
    }
    setLoading(true);
    const updated = editing
      ? events.map(e => e.id === editing ? { ...form, id: editing } : e)
      : [...events, { ...form, id: Date.now().toString() }];
    setEvents(updated);
    await handleSaveData(updated, false);
    setModalOpen(false);
    toast({ type: 'success', title: editing ? 'Updated' : 'Added', message: `"${form.title}" saved.` });
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const updated = events.filter(e => e.id !== confirmDelete.id);
    setEvents(updated);
    await handleSaveData(updated, false);
    setConfirmDelete(null);
    toast({ type: 'success', title: 'Deleted' });
    setLoading(false);
  };

  const handlePublishAll = async () => {
    setLoading(true);
    await handleSaveData(events, true);
    setLoading(false);
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Events Editor"
      description="Add and manage college events, placements drives, symposiums, and more."
      breadcrumb={['Admin', 'People', 'Events']}
      onPublish={handlePublishAll}
      isLoading={loading}
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all" />
        </div>
        <AdminButton variant="primary" icon={Plus} onClick={openAdd}>Add Event</AdminButton>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Calendar} title="No events found" description="Add your first event." action={<AdminButton variant="primary" icon={Plus} onClick={openAdd}>Add Event</AdminButton>} />
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(event => (
              <div key={event.id} className="flex items-start gap-4 p-4 hover:bg-slate-50/60 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-amber-600 font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg font-black text-amber-700 leading-tight">{new Date(event.date).getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{event.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={event.status} />
                      <button onClick={() => openEdit(event)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmDelete(event)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-primary-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <span className="inline-block mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{event.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Event' : 'Add Event'} size="md"
        footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton variant="primary" onClick={handleSave} loading={loading}>{editing ? 'Update' : 'Add'}</AdminButton></>}
      >
        <div className="space-y-4">
          <AdminInput label="Event Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Annual Tech Symposium 2026" />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Date *" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            <AdminSelect label="Category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} options={CATEGORY_OPTIONS} />
          </div>
          <AdminTextarea label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Event description..." />
          <AdminSelect label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete}
        title="Delete Event" message={`Remove "${confirmDelete?.title}"?`} confirmText="Delete" confirmVariant="danger" isLoading={loading} />
    </EditorPage>
  );
};

export default EventsEditor;
