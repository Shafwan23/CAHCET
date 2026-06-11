import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, BookOpen } from 'lucide-react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminSelect, AdminButton } from '../ui/AdminInput';
import Modal, { ConfirmDialog } from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import { cmsService } from '../../../services/cmsService';

const EMPTY_COURSE = { name: '', code: '', seats: 60, duration: '4 Years', status: 'published' };
const DURATION_OPTIONS = [
  { value: '2 Years', label: '2 Years (PG)' },
  { value: '4 Years', label: '4 Years (UG)' },
];
const STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const CoursesEditor = () => {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_COURSE);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('academics');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['academics.courses']) {
          setCourses(JSON.parse(map['academics.courses'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Courses data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setEditing(null); setForm(EMPTY_COURSE); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c.id); setForm({ ...c }); setModalOpen(true); };

  const saveToBackend = async (updatedCourses, publish = false) => {
    if (sectionsMap['academics.courses']) {
      await cmsService.updateSection(sectionsMap['academics.courses'].id, { content: JSON.stringify(updatedCourses) });
    }
    toast({ type: 'success', title: publish ? 'Published!' : 'Saved', message: publish ? 'All courses are now live.' : 'Changes saved.' });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast({ type: 'error', title: 'Validation Error', message: 'Course name and code are required.' });
      return;
    }
    setLoading(true);
    try {
      let updated;
      if (editing) {
        updated = courses.map(c => c.id === editing ? { ...form, id: editing } : c);
      } else {
        updated = [...courses, { ...form, id: Date.now().toString() }];
      }
      setCourses(updated);
      await saveToBackend(updated, false);
      setModalOpen(false);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Course data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const updated = courses.filter(c => c.id !== confirmDelete.id);
      setCourses(updated);
      await saveToBackend(updated, false);
      setConfirmDelete(null);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to delete Course.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await saveToBackend(courses, true);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to publish Course data.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Courses Editor"
      description="Add, edit, or remove degree programs and courses."
      breadcrumb={['Admin', 'Content', 'Courses']}
      onPublish={handlePublish}
      onSave={() => saveToBackend(courses, false)}
      isLoading={loading}
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <AdminButton variant="primary" icon={Plus} onClick={openAdd}>Add Course</AdminButton>
      </div>

      {/* Summary */}
      <div className="flex gap-4 mb-5 text-sm">
        <span className="text-slate-500">{courses.length} total · <strong>{courses.filter(c => c.status === 'published').length} published</strong></span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses found" description="Try adjusting your search or add a new course." action={<AdminButton variant="primary" icon={Plus} onClick={openAdd}>Add Course</AdminButton>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Course Name', 'Code', 'Seats', 'Duration', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-800">{course.name}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs bg-slate-50/50">{course.code}</td>
                    <td className="px-4 py-3.5 text-slate-600">{course.seats}</td>
                    <td className="px-4 py-3.5 text-slate-600">{course.duration}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={course.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(course)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(course)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Course' : 'Add New Course'}
        size="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={loading}>
              {editing ? 'Update Course' : 'Add Course'}
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminInput label="Course Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="B.E. Computer Science & Engineering" />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Course Code *" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="CSE" />
            <AdminInput label="Intake Seats" type="number" value={form.seats} onChange={e => setForm(p => ({ ...p, seats: parseInt(e.target.value) || 0 }))} placeholder="60" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect label="Duration" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} options={DURATION_OPTIONS} />
            <AdminSelect label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS} />
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={loading}
      />
    </EditorPage>
  );
};

export default CoursesEditor;
