import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminSelect, AdminButton } from '../ui/AdminInput';
import Modal, { ConfirmDialog } from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import { cmsService } from '../../../services/cmsService';

const DEPT_OPTIONS = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'EEE', label: 'Electrical & Electronics' },
  { value: 'MECH', label: 'Mechanical Engineering' },
  { value: 'CIVIL', label: 'Civil Engineering' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'AIDS', label: 'AI & Data Science' },
  { value: 'AIML', label: 'AI & Machine Learning' },
  { value: 'MBA', label: 'Business Administration' },
  { value: 'MCA', label: 'Computer Applications' },
  { value: 'Administration', label: 'Administration' },
];
const STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];
const EMPTY_FACULTY = { name: '', designation: '', department: 'CSE', qualification: 'M.E.', email: '', phone: '', photoUrl: '', status: 'published' };

const FacultyEditor = () => {
  const toast = useToast();
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FACULTY);
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('faculty');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['faculty.list']) {
          setFaculty(JSON.parse(map['faculty.list'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Faculty data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const filtered = faculty.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.designation.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'all' || f.department === deptFilter;
    return matchSearch && matchDept;
  });

  const openAdd = () => { setEditing(null); setForm(EMPTY_FACULTY); setModalOpen(true); };
  const openEdit = (f) => { setEditing(f.id); setForm({ ...f }); setModalOpen(true); };

  const saveToBackend = async (updatedFaculty, publish = false) => {
    if (sectionsMap['faculty.list']) {
      await cmsService.updateSection(sectionsMap['faculty.list'].id, { content: JSON.stringify(updatedFaculty) });
    }
    toast({ type: 'success', title: publish ? 'Published!' : 'Saved', message: publish ? 'Faculty list is now live.' : 'Changes saved.' });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.designation.trim()) {
      toast({ type: 'error', title: 'Required', message: 'Name and designation are required.' });
      return;
    }
    setLoading(true);
    try {
      let updated;
      if (editing) {
        updated = faculty.map(f => f.id === editing ? { ...form, id: editing } : f);
      } else {
        updated = [...faculty, { ...form, id: Date.now().toString() }];
      }
      setFaculty(updated);
      await saveToBackend(updated, false);
      setModalOpen(false);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Faculty data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const updated = faculty.filter(f => f.id !== confirmDelete.id);
      setFaculty(updated);
      await saveToBackend(updated, false);
      setConfirmDelete(null);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to delete Faculty data.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await saveToBackend(faculty, true);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to publish Faculty data.' });
    } finally {
      setLoading(false);
    }
  };

  const uniqueDepts = ['all', ...new Set(faculty.map(f => f.department))];

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Faculty Editor"
      description="Manage faculty members across all departments."
      breadcrumb={['Admin', 'People', 'Faculty']}
      onPublish={handlePublish}
      onSave={() => saveToBackend(faculty, false)}
      isLoading={loading}
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Search faculty..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
          />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none">
          {uniqueDepts.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
        <AdminButton variant="primary" icon={Plus} onClick={openAdd}>Add Faculty</AdminButton>
      </div>

      <p className="text-sm text-slate-500 mb-4">{faculty.length} faculty members · {filtered.length} shown</p>

      {/* Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No faculty found" description="Add faculty members or adjust your filter." action={<AdminButton variant="primary" icon={Plus} onClick={openAdd}>Add First Faculty</AdminButton>} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Faculty', 'Designation', 'Department', 'Qualification', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {f.photoUrl ? (
                            <img src={f.photoUrl} alt={f.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                              {f.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800">{f.name}</p>
                            {f.email && <p className="text-xs text-slate-400">{f.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{f.designation}</td>
                      <td className="px-4 py-3.5"><span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded-lg">{f.department}</span></td>
                      <td className="px-4 py-3.5 text-slate-600">{f.qualification}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={f.status} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(f)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setConfirmDelete(f)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-primary-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-50">
              {filtered.map(f => (
                <div key={f.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                      {f.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{f.name}</p>
                      <p className="text-xs text-slate-500">{f.designation} · {f.department}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(f)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setConfirmDelete(f)} className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Faculty' : 'Add Faculty'} size="lg"
        footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton variant="primary" onClick={handleSave} loading={loading}>{editing ? 'Update' : 'Add'}</AdminButton></>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput label="Full Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. A. Example" containerClass="sm:col-span-2" />
          <AdminInput label="Designation *" value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} placeholder="Professor & HOD" />
          <AdminSelect label="Department" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} options={DEPT_OPTIONS} />
          <AdminInput label="Qualification" value={form.qualification} onChange={e => setForm(p => ({ ...p, qualification: e.target.value }))} placeholder="Ph.D." />
          <AdminSelect label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS} />
          <AdminInput label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="faculty@cahcet.edu.in" />
          <AdminInput label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9XXXXXXXXX" />
          <AdminInput label="Photo URL" value={form.photoUrl} onChange={e => setForm(p => ({ ...p, photoUrl: e.target.value }))} placeholder="https://..." containerClass="sm:col-span-2" />
          {form.photoUrl && <img src={form.photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 sm:col-span-2" onError={e => { e.target.style.display = 'none'; }} />}
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete}
        title="Delete Faculty Member" message={`Remove "${confirmDelete?.name}" from faculty records?`}
        confirmText="Delete" confirmVariant="danger" isLoading={loading} />
    </EditorPage>
  );
};

export default FacultyEditor;

