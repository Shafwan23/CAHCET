import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, ArrowUp, ArrowDown, Building2, Cpu, Code, Printer, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import VersionHistoryModal from './shared/VersionHistoryModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import FacilitiesSection from '../../../../components/departments/sections/FacilitiesSection';

const emptyFacility = {
  id: '',
  name: 'New Laboratory',
  totalSystems: '50',
  hardware: 'Provide hardware details...',
  software: 'Provide software details...',
  peripherals: 'Provide peripheral details...',
  images: []
};

const DeptFacilitiesEditor = ({ deptKey, dept, cms, session }) => {
  const { addToast } = useToast?.() || { addToast: () => {} };
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (cms.data?.facilities) {
      setFacilities(Array.isArray(cms.data.facilities) ? cms.data.facilities : []);
    } else {
      setFacilities([]);
    }
  }, [deptKey, cms.data]);

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      cms.setSection('facilities', facilities); // updates the parent context
      await cms.saveSection('facilities', session?.username, session?.name, isSilent);
      if (!isSilent) addToast({ type: 'success', title: 'Draft Saved', message: `Facilities changes saved to draft.` });
    } catch(e) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    if (cms.publishSection) {
       await cms.publishSection('facilities');
       addToast({ type: 'success', title: 'Live', message: 'Facilities published to production.' });
    }
  };

  const handleReset = () => {
    const fresh = cms.data?.facilities || [];
    setFacilities(Array.isArray(fresh) ? fresh : []);
    cms.setSection('facilities', fresh);
    addToast({ type: 'info', title: 'Reset', message: 'Discarded unsaved changes.' });
  };

  const updateItem = (index, field, value) => {
    const updated = [...facilities];
    updated[index][field] = value;
    setFacilities(updated);
    cms.setSection('facilities', updated);
  };

  const moveItem = (index, direction) => {
    const list = [...facilities];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    setFacilities(list);
    cms.setSection('facilities', list);
  };

  const removeItem = (index) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      const updated = facilities.filter((_, i) => i !== index);
      setFacilities(updated);
      cms.setSection('facilities', updated);
    }
  };

  const addItem = () => {
    const newItem = { ...emptyFacility, id: `fac_${Date.now()}` };
    const updated = [...facilities, newItem];
    setFacilities(updated);
    cms.setSection('facilities', updated);
  };

  // Status mapping
  const validationIssues = [];
  facilities.forEach((fac, idx) => {
     if (!fac.name?.trim()) validationIssues.push(`Facility ${idx + 1} is missing a name.`);
  });

  return (
    <EditorPage
      title="Facilities Editor"
      description="Manage laboratories, equipment, hardware, and software resources for the department."
      breadcrumb={['Admin', 'Departments', dept.abbr, 'Facilities']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={cms.status?.facilities || 'DRAFT'}
      lastModified={cms.lastModified?.facilities}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Configuration Panel */}
        <div className="xl:col-span-7 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Facilities</p>
                   <Building2 className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {facilities.length}
                   </p>
                </div>
             </div>
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-36 relative overflow-hidden group text-white">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Systems</p>
                   <Monitor className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                <div className="relative z-10">
                   <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                      {facilities.reduce((sum, fac) => sum + parseInt(fac.totalSystems || 0, 10), 0) || 0}
                   </p>
                </div>
             </div>
          </div>

          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div>
               <h3 className="text-base font-bold text-slate-800">Laboratory Facilities</h3>
               <p className="text-xs text-slate-500 mt-1">Add or arrange lab rooms.</p>
             </div>
             <button
               onClick={addItem}
               className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
             >
               <Plus className="w-4 h-4" /> Add Facility
             </button>
          </div>

          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
            <AnimatePresence>
              {facilities.map((item, index) => (
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
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shadow-sm">{index + 1}</div>
                       <span className="text-sm font-bold text-slate-700">
                         {item.name || 'New Facility'}
                       </span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 transition-all duration-300">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(index, 1)}
                        disabled={index === facilities.length - 1}
                        className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 transition-all duration-300"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-slate-300 mx-1"></div>
                      <button onClick={() => removeItem(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl hover:shadow-sm transition-all duration-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <AdminInput
                          label="Facility Name"
                          value={item.name || ''}
                          onChange={e => updateItem(index, 'name', e.target.value)}
                          placeholder="e.g. Advanced Computing Lab"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <AdminInput
                          label="Total Systems"
                          type="number"
                          value={item.totalSystems || ''}
                          onChange={e => updateItem(index, 'totalSystems', e.target.value)}
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                       <AdminTextarea
                          label="Hardware Details"
                          icon={Cpu}
                          value={item.hardware || ''}
                          onChange={e => updateItem(index, 'hardware', e.target.value)}
                          placeholder="e.g. Intel Core i7, 16GB RAM..."
                          rows={2}
                       />
                       <AdminTextarea
                          label="Software Details"
                          icon={Code}
                          value={item.software || ''}
                          onChange={e => updateItem(index, 'software', e.target.value)}
                          placeholder="e.g. Visual Studio, MATLAB..."
                          rows={2}
                       />
                       <AdminTextarea
                          label="Peripherals & Network"
                          icon={Printer}
                          value={item.peripherals || ''}
                          onChange={e => updateItem(index, 'peripherals', e.target.value)}
                          placeholder="e.g. 1Gbps LAN, Printers..."
                          rows={2}
                       />
                    </div>
                  </div>
                </motion.div>
              ))}
              {facilities.length === 0 && (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                   <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                   <h3 className="text-sm font-bold text-slate-700">No Facilities Added</h3>
                   <p className="text-xs text-slate-500 mt-1 mb-4">Start adding laboratories to build the facilities page.</p>
                   <button onClick={addItem} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">Add Facility</button>
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
                  cahcet.edu.in/departments/{deptKey}/facilities
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto bg-primary-50/50 p-6 relative">
                 <div className="scale-[0.85] origin-top">
                    <FacilitiesSection data={facilities} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHistory && (
        <VersionHistoryModal
          deptKey={deptKey}
          section="facilities"
          cms={cms}
          session={session}
          onClose={() => setShowHistory(false)}
        />
      )}
    </EditorPage>
  );
};

export default DeptFacilitiesEditor;
