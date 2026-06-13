import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { cmsService } from '../../../../services/cmsService';
import { antiRaggingData } from '../../../../data/antiRagging';

const AntiRaggingTable = ({ title, data, onUpdate }) => {
  const [items, setItems] = useState(data || []);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { setItems(data || []); }, [data]);

  const addRow = () => {
    const newItems = [...items, { id: Date.now(), name: '', designation: '', role: '', department: '', phone: '' }];
    setItems(newItems);
    onUpdate(newItems);
  };

  const updateRow = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    onUpdate(newItems);
  };

  const deleteRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onUpdate(newItems);
  };

  const filteredItems = items.filter(item => 
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <EditorCard title={title}>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search records..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <button onClick={addRow} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Row
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredItems.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No records found.</td></tr>
            ) : (
              filteredItems.map((item, i) => {
                const originalIndex = items.findIndex(x => x.id === item.id);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-2"><input type="text" value={item.name} onChange={e => updateRow(originalIndex, 'name', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg" placeholder="Name" /></td>
                    <td className="p-2"><input type="text" value={item.designation} onChange={e => updateRow(originalIndex, 'designation', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg" placeholder="Designation" /></td>
                    <td className="p-2"><input type="text" value={item.role} onChange={e => updateRow(originalIndex, 'role', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg" placeholder="Role" /></td>
                    <td className="p-2"><input type="text" value={item.department} onChange={e => updateRow(originalIndex, 'department', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg" placeholder="Department" /></td>
                    <td className="p-2"><input type="text" value={item.phone} onChange={e => updateRow(originalIndex, 'phone', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg" placeholder="Phone" /></td>
                    <td className="p-2 text-center">
                      <button onClick={() => deleteRow(originalIndex)} className="p-1.5 text-amber-500 hover:bg-primary-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </EditorCard>
  );
};

const AntiRaggingEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    committee: antiRaggingData.committee.map(c => ({ id: Date.now() + Math.random(), ...c })),
    squads: antiRaggingData.squads.map(s => ({ id: Date.now() + Math.random(), ...s })),
    members: antiRaggingData.generalCommittee.map(m => ({ id: Date.now() + Math.random(), ...m })),
    instructions: antiRaggingData.instructions,
    objectives: antiRaggingData.objectives,
    functions: antiRaggingData.functions
  });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('about');
        setPageId(res.data?.id);
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['about.anti_ragging']) {
          setForm(JSON.parse(map['about.anti_ragging'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Anti Ragging data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['about.anti_ragging']) {
        await cmsService.updateSection(sectionsMap['about.anti_ragging'].id, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'about.anti_ragging',
          title: 'Anti Ragging Policy',
          content
        });
        setSectionsMap(prev => ({ ...prev, 'about.anti_ragging': newSec.data }));
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Anti Ragging data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      committee: antiRaggingData.committee.map(c => ({ id: Date.now() + Math.random(), ...c })),
      squads: antiRaggingData.squads.map(s => ({ id: Date.now() + Math.random(), ...s })),
      members: antiRaggingData.generalCommittee.map(m => ({ id: Date.now() + Math.random(), ...m })),
      instructions: antiRaggingData.instructions,
      objectives: antiRaggingData.objectives,
      functions: antiRaggingData.functions
    });
    toast({ type: 'info', title: 'Reset', message: 'Reverted to defaults.' });
  };

  if (loading && !pageId) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Anti Ragging Policy"
      description="Manage the Anti Ragging Committee, Squads, and General Members tables."
      breadcrumb={['Admin', 'About', 'Anti Ragging']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <div className="space-y-6">
        <AntiRaggingTable 
          title="Anti Ragging Committee" 
          data={form.committee} 
          onUpdate={val => setForm(p => ({ ...p, committee: val }))} 
        />
        <AntiRaggingTable 
          title="Anti Ragging Squads" 
          data={form.squads} 
          onUpdate={val => setForm(p => ({ ...p, squads: val }))} 
        />
        <AntiRaggingTable 
          title="General Committee Members" 
          data={form.members} 
          onUpdate={val => setForm(p => ({ ...p, members: val }))} 
        />
      </div>
    </EditorPage>
  );
};

export default AntiRaggingEditor;
