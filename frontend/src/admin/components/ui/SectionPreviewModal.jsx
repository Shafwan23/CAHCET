import React, { useState, useEffect, Suspense, lazy } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, RotateCcw, GitCompare, Eye, LayoutTemplate, FileCode, History, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cmsService } from '../../../services/cmsService';
import { diffJSON } from '../../utils/diffEngine';
import { validateContent } from '../../utils/contentValidator';
import SectionErrorBoundary from '../../../components/ui/SectionErrorBoundary';
import SuspenseLoader from '../../../components/ui/SuspenseLoader';

import HeroVideoSection from '../../../components/sections/HeroVideoSection';
import WelcomeSection from '../../../components/sections/WelcomeSection';
const DynamicInfoSection = lazy(() => import('../../../components/sections/DynamicInfoSection'));
const DepartmentsSection = lazy(() => import('../../../components/sections/DepartmentsSection'));
const GallerySection = lazy(() => import('../../../components/sections/GallerySection'));
const PlacementsSection = lazy(() => import('../../../components/sections/PlacementsSection'));
const VideoShowcaseSection = lazy(() => import('../../../components/sections/VideoShowcaseSection'));
const AdmissionsCTA = lazy(() => import('../../../components/sections/AdmissionsCTA'));
const ContactSection = lazy(() => import('../../../components/sections/ContactSection'));

const ComponentRegistry = {
  'home.hero': HeroVideoSection,
  'home.welcome': WelcomeSection,
  'home.dynamicinfo': DynamicInfoSection,
  'home.departments': DepartmentsSection,
  'home.gallery': GallerySection,
  'home.placements': PlacementsSection,
  'home.videos': VideoShowcaseSection,
  'home.cta': AdmissionsCTA,
  'home.contact': ContactSection,
};

const SectionPreviewModal = ({ section, onClose, onPublish, onRestore }) => {
  const [activeTab, setActiveTab] = useState('diff'); // diff, visual, validation, versions
  const [versions, setVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [compareVersionId, setCompareVersionId] = useState(null);

  // Handle both raw Prisma models and mapped objects from HomePageEditor
  const actualSection = section.rawDbEntry || section;

  const draftData = typeof actualSection.draftContent === 'string' ? JSON.parse(actualSection.draftContent || '{}') : (actualSection.draftContent || {});
  const liveData = typeof actualSection.content === 'string' ? JSON.parse(actualSection.content || '{}') : (actualSection.content || {});
  
  // Choose comparison base (either live data, or a selected version history)
  const compareBase = compareVersionId 
    ? JSON.parse(versions.find(v => v.id === compareVersionId)?.content || '{}')
    : liveData;

  // Calculate status for display
  const diffs = diffJSON(compareBase, draftData);
  const isModified = diffs.length > 0;

  let status = 'DRAFT';
  if (actualSection.draftContent && !actualSection.content) status = 'DRAFT';
  else if (isModified) status = 'MODIFIED';
  else status = 'PUBLISHED';

  // diffs is already calculated above
  const validations = validateContent(draftData, section.sectionKey);
  const hasErrors = validations.some(v => v.type === 'error');

  useEffect(() => {
    if (activeTab === 'versions' && versions.length === 0) {
      fetchVersions();
    }
  }, [activeTab]);

  const fetchVersions = async () => {
    setLoadingVersions(true);
    try {
      const res = await cmsService.getSectionVersions(section.id);
      setVersions(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (!window.confirm("Restore this version to your Draft? (This will not overwrite live data yet)")) return;
    try {
      await cmsService.restoreSectionVersion(section.id, versionId);
      onRestore && onRestore();
      onClose();
    } catch(e) {
      alert("Failed to restore version");
    }
  };

  const renderComponent = () => {
    const Component = ComponentRegistry[section.sectionKey];
    if (!Component) return <div className="p-8 text-center text-slate-500">Preview not available for this section type.</div>;
    return (
      <div className="border-4 border-dashed border-slate-200 rounded-2xl overflow-hidden shadow-inner relative bg-white">
        <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded z-50">DRAFT RENDERER</div>
        <div className="pointer-events-none">
          {/* We wrap in pointer-events-none so admin can't accidentally click links during preview */}
          <SectionErrorBoundary sectionKey={section.sectionKey}>
            <Suspense fallback={<SuspenseLoader />}>
              <Component data={draftData} liveData={{ recruiters: [], students: [] }} liveStats={{}} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Content Governance: {section.title || 'Section Preview'}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{section.sectionKey} • Status: {status}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button onClick={() => setActiveTab('diff')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'diff' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <FileCode className="w-4 h-4" /> Content Diff
          </button>
          <button onClick={() => setActiveTab('visual')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'visual' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <LayoutTemplate className="w-4 h-4" /> Visual Preview
          </button>
          <button onClick={() => setActiveTab('validation')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'validation' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <CheckCircle className="w-4 h-4" /> Pre-Publish Validation
            {validations.length > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] text-white ${hasErrors ? 'bg-red-500' : 'bg-amber-500'}`}>{validations.length}</span>
            )}
          </button>
          <button onClick={() => setActiveTab('versions')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'versions' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <History className="w-4 h-4" /> Version History
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <AnimatePresence mode="wait">
            
            {activeTab === 'diff' && (
              <motion.div key="diff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {status === 'PUBLISHED' && !compareVersionId ? (
                  <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">Everything is up to date</h3>
                    <p className="text-slate-500 text-sm">There are no unpublished drafts for this section.</p>
                  </div>
                ) : diffs.length === 0 ? (
                  <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
                    <p className="text-slate-500 text-sm">No exact field differences detected.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-900 px-4 py-2 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Changes Detected</span>
                      {compareVersionId && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Comparing vs History</span>}
                    </div>
                    <div className="divide-y divide-slate-100">
                      {diffs.map((diff, i) => (
                        <div key={i} className="p-4 flex gap-4">
                          <div className="w-24 shrink-0 pt-0.5">
                            {diff.type === 'ADDED' && <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider">Added</span>}
                            {diff.type === 'MODIFIED' && <span className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase tracking-wider">Modified</span>}
                            {diff.type === 'REMOVED' && <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wider">Removed</span>}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-mono text-slate-400 mb-1">{diff.path}</p>
                            {diff.type === 'MODIFIED' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-red-50/50 p-2 rounded border border-red-100">
                                  <p className="text-xs text-red-400 font-bold mb-1">Published</p>
                                  <p className="text-sm text-slate-700 break-words">{JSON.stringify(diff.oldValue)}</p>
                                </div>
                                <div className="bg-emerald-50/50 p-2 rounded border border-emerald-100">
                                  <p className="text-xs text-emerald-500 font-bold mb-1">Draft</p>
                                  <p className="text-sm text-slate-700 break-words">{JSON.stringify(diff.newValue)}</p>
                                </div>
                              </div>
                            )}
                            {diff.type === 'ADDED' && (
                               <div className="bg-emerald-50/50 p-2 rounded border border-emerald-100">
                                 <p className="text-sm text-slate-700 break-words">{JSON.stringify(diff.newValue)}</p>
                               </div>
                            )}
                            {diff.type === 'REMOVED' && (
                               <div className="bg-red-50/50 p-2 rounded border border-red-100 line-through opacity-70">
                                 <p className="text-sm text-slate-700 break-words">{JSON.stringify(diff.oldValue)}</p>
                               </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'visual' && (
              <motion.div key="visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {renderComponent()}
              </motion.div>
            )}

            {activeTab === 'validation' && (
              <motion.div key="validation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {validations.length === 0 ? (
                  <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">All checks passed</h3>
                    <p className="text-slate-500 text-sm">Content is safe to publish to production.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {validations.map((val, i) => (
                      <div key={i} className={`p-4 flex gap-3 border-b border-slate-100 last:border-0 ${val.type === 'error' ? 'bg-red-50/30' : 'bg-amber-50/30'}`}>
                        {val.type === 'error' ? <XCircle className="w-5 h-5 text-red-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                        <div>
                          <p className={`text-sm font-bold ${val.type === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
                            {val.type === 'error' ? 'Blocking Error' : 'Warning'}
                          </p>
                          <p className="text-sm text-slate-600 mt-0.5">{val.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'versions' && (
              <motion.div key="versions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {loadingVersions ? (
                   <div className="p-8 text-center text-slate-500">Loading history ledger...</div>
                ) : versions.length === 0 ? (
                   <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">No version history</h3>
                    <p className="text-slate-500 text-sm">Publish some changes to start generating an audit trail.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {versions.map((ver, idx) => (
                      <div key={ver.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-2">
                            Version {versions.length - idx}
                            {idx === 0 && <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 uppercase tracking-wider">Live</span>}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Published by <span className="font-semibold text-slate-700">{ver.publishedBy}</span> on {new Date(ver.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setCompareVersionId(ver.id); setActiveTab('diff'); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <GitCompare className="w-3.5 h-3.5" /> Compare vs Draft
                          </button>
                          <button 
                            onClick={() => handleRestore(ver.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore to Draft
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center">
          <p className="text-xs text-slate-500 flex items-center gap-1">
             <AlertCircle className="w-3.5 h-3.5" /> Review carefully before pushing to production.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
            <button 
              onClick={() => {
                if (hasErrors) {
                  if(!window.confirm("There are blocking errors. Publish anyway?")) return;
                }
                onPublish(section);
              }}
              disabled={status === 'PUBLISHED'}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                status === 'PUBLISHED' 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
              }`}
            >
              Confirm & Publish Live
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionPreviewModal;
