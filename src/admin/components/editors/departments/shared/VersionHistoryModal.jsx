/**
 * VersionHistoryModal.jsx — Shared component for restoring previous versions
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, RotateCcw, Clock, User } from 'lucide-react';

const VersionHistoryModal = ({ deptKey, section, cms, session, onClose }) => {
  const [versions, setVersions] = useState([]);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    setVersions(cms.getVersions(section));
  }, [section]);

  const handleRestore = async (v) => {
    setRestoring(v.id);
    await new Promise(r => setTimeout(r, 400));
    cms.restoreVersion(section, v.id, session?.username, session?.name);
    setRestoring(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800">Version History</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="w-10 h-10 text-slate-200 mb-3" />
              <p className="text-slate-500 font-medium">No previous versions</p>
              <p className="text-xs text-slate-400 mt-1">Versions are saved each time you publish changes.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {versions.map((v, idx) => (
                <div key={v.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      v{versions.length - idx}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(v.savedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <User className="w-2.5 h-2.5" />
                        <span>by {v.savedBy || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRestore(v)}
                    disabled={!!restoring}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors disabled:opacity-50"
                  >
                    {restoring === v.id ? (
                      <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RotateCcw className="w-3.5 h-3.5" />
                    )}
                    Restore
                  </motion.button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">Restoring a version will replace current content and save a new version.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default VersionHistoryModal;
