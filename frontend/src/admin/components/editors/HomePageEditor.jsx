import React, { useState, useEffect } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { 
  GripVertical, Eye, EyeOff, Edit3, Clock, 
  CheckCircle2, AlertCircle, PlaySquare, Copy, Settings,
  LayoutDashboard, Webhook, History, ChevronRight, Save
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { cmsService } from '../../../services/cmsService';
import { useNavigate } from 'react-router-dom';
import SectionPreviewModal from '../ui/SectionPreviewModal';

const DEFAULT_SECTIONS = [
  { key: 'home.hero', name: 'Hero Video', path: 'homepage/hero' },
  { key: 'home.welcome', name: 'Welcome Message', path: 'homepage/welcome' },
  { key: 'home.dynamicinfo', name: 'Dynamic Information', path: 'homepage/stats' },
  { key: 'home.departments', name: 'Academic Departments', path: 'homepage/academic' },
  { key: 'home.gallery', name: 'Campus Gallery', path: 'homepage/gallery' },
  { key: 'home.placements', name: 'Placement Excellence', path: 'homepage/placement-excellence' },
  { key: 'home.videos', name: 'Video Showcase', path: 'homepage/videos' },
  { key: 'home.cta', name: 'Admissions CTA', path: 'homepage/cta' },
  { key: 'home.contact', name: 'Contact Section', path: 'homepage/contact' }
];

const HomePageEditor = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, layout, history
  const [previewSection, setPreviewSection] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPage('home');
      const dbSections = res.data?.sections || [];
      
      // Merge DB state with Default registry to ensure all are visible
      let merged = DEFAULT_SECTIONS.map((def, idx) => {
        const dbEntry = dbSections.find(s => s.sectionKey === def.key);
        return {
          id: dbEntry?.id || `new-${def.key}`,
          sectionKey: def.key,
          name: def.name,
          path: def.path,
          isVisible: dbEntry ? dbEntry.isVisible : true,
          sortOrder: dbEntry && dbEntry.sortOrder !== 0 ? dbEntry.sortOrder : idx * 10,
          status: dbEntry?.draftContent ? 'DRAFT' : (dbEntry?.content ? 'PUBLISHED' : 'EMPTY'),
          updatedAt: dbEntry?.updatedAt || new Date().toISOString(),
          isNew: !dbEntry,
          rawDbEntry: dbEntry
        };
      });

      merged.sort((a, b) => a.sortOrder - b.sortOrder);
      setSections(merged);
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load sections' });
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newOrder) => {
    setSections(newOrder);
  };

  const saveLayout = async () => {
    setSavingOrder(true);
    try {
      const updates = sections.map((sec, idx) => {
        if (sec.isNew) {
          // If it's new, we skip for layout saving for now
          return null;
        }
        return cmsService.updateSection(sec.id, { 
          sortOrder: idx * 10,
          _isSilentDraft: true // Tell service not to prompt
        });
      }).filter(Boolean);

      await Promise.all(updates);
      toast({ type: 'success', title: 'Layout Saved', message: 'The homepage layout order has been successfully updated.' });
    } catch (err) {
      toast({ type: 'error', title: 'Save Failed', message: err.message });
    } finally {
      setSavingOrder(false);
    }
  };

  const toggleVisibility = async (section) => {
    if (section.isNew) {
      toast({ type: 'info', title: 'Notice', message: 'Cannot hide a section that hasn\'t been created yet. Edit it first.' });
      return;
    }
    
    try {
      const newVisible = !section.isVisible;
      setSections(prev => prev.map(s => s.id === section.id ? { ...s, isVisible: newVisible } : s));
      
      await cmsService.updateSection(section.id, { 
        isVisible: newVisible,
        _isSilentDraft: true 
      });
      toast({ type: 'success', title: 'Visibility Updated', message: `${section.name} is now ${newVisible ? 'visible' : 'hidden'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  };

  const publishSection = async (section) => {
    if (section.isNew || section.status !== 'DRAFT') return;
    try {
      await cmsService.publishSection(section.id);
      setSections(prev => prev.map(s => s.id === section.id ? { ...s, status: 'PUBLISHED' } : s));
      toast({ type: 'success', title: 'Published', message: `${section.name} changes are now live.` });
    } catch (err) {
      toast({ type: 'error', title: 'Publish Failed', message: err.message });
    }
  };

  const handleEdit = (section) => {
    if (section.path) {
      navigate(`../${section.path}`);
    } else {
      toast({ type: 'info', title: 'Notice', message: 'Standalone editor for this section is under construction. Please use the legacy editor.' });
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading CMS Architecture...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-amber-500" />
            Homepage CMS
          </h1>
          <p className="text-slate-500 mt-2">Enterprise Content Management & Layout Engine</p>
        </div>
        
        <div className="flex bg-slate-100/80 p-1 rounded-xl shadow-inner border border-slate-200">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('layout')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'layout' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Layout Manager
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sections.map((sec) => (
              <div key={sec.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group">
                
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1 ${sec.status === 'PUBLISHED' ? 'bg-emerald-500' : sec.status === 'DRAFT' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                
                <div className="flex justify-between items-start mb-4 mt-1">
                  <div>
                    <h3 className="font-bold text-slate-900">{sec.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">{sec.sectionKey}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${sec.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : sec.status === 'DRAFT' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    {sec.status}
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5"><Eye className="w-4 h-4" /> Visibility</span>
                    <span className="font-medium text-slate-900">{sec.isVisible ? 'Visible' : 'Hidden'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Updated</span>
                    <span className="font-medium text-slate-900">{new Date(sec.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 mt-auto">
                  <button onClick={() => handleEdit(sec)} className="flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200">
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                  {sec.status === 'DRAFT' ? (
                    <button onClick={() => setPreviewSection(sec)} className="flex items-center justify-center gap-2 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-amber-500/20">
                      <Webhook className="w-4 h-4" /> Review & Publish
                    </button>
                  ) : (
                    <button className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-400 text-sm font-semibold rounded-lg border border-slate-100 cursor-not-allowed">
                      <CheckCircle2 className="w-4 h-4" /> Live
                    </button>
                  )}
                </div>

              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'layout' && (
          <motion.div
            key="layout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">Drag to Reorder</h3>
                  <p className="text-sm text-slate-500">Changes here affect the live public homepage layout instantly.</p>
                </div>
                <button 
                  onClick={saveLayout}
                  disabled={savingOrder}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-slate-900/10"
                >
                  <Save className="w-4 h-4" />
                  {savingOrder ? 'Saving...' : 'Save Layout'}
                </button>
              </div>

              <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="space-y-3">
                {sections.map((sec) => (
                  <Reorder.Item 
                    key={sec.id} 
                    value={sec}
                    className={`flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm cursor-grab active:cursor-grabbing transition-colors hover:border-amber-300 ${!sec.isVisible ? 'opacity-50 grayscale' : 'border-slate-200'}`}
                  >
                    <GripVertical className="w-5 h-5 text-slate-400" />
                    
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{sec.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{sec.sectionKey}</p>
                    </div>

                    <div className="flex items-center gap-3">
                       <button
                        onClick={() => toggleVisibility(sec)}
                        className={`p-2 rounded-lg transition-colors ${sec.isVisible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                        title={sec.isVisible ? 'Hide Section' : 'Show Section'}
                      >
                        {sec.isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => handleEdit(sec)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Content"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {previewSection && (
        <SectionPreviewModal 
          section={previewSection}
          onClose={() => setPreviewSection(null)}
          onPublish={async (sec) => {
            await publishSection(sec);
            setPreviewSection(null);
          }}
          onRestore={() => {
            fetchData(); // Refresh overview to pull draft updates
          }}
        />
      )}
    </div>
  );
};

export default HomePageEditor;
