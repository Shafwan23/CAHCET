import React from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Globe, Clock, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminButton } from './AdminInput';

// Reusable wrapper for every editor page
const EditorPage = ({
  title,
  description,
  sectionKey,
  breadcrumb,
  onSave,
  onPublish,
  onReset,
  isLoading,
  status = 'DRAFT',
  lastModified,
  lastPublished,
  validationIssues = [],
  children,
}) => {
  const { canEditRoute, isSuperAdmin } = useAdminAuth();
  const location = useLocation();

  // Route-based Permission Engine Check
  // Note: We bypass this check for Super Admins automatically inside canEditRoute
  const hasAccess = canEditRoute(location.pathname);
  const isReadOnly = !hasAccess;

  return (
    <div className="flex flex-col h-full relative bg-[#FAFAFA]">
      {/* Sticky Page Header */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 px-8 py-5 sticky top-0 z-30 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] transition-all">
        {breadcrumb && (
          <p className="text-[10px] font-bold text-amber-500/90 mb-1.5 tracking-widest uppercase flex items-center gap-2">
            {breadcrumb.join(' / ')}
          </p>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-1">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
              {status === 'PUBLISHED' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
                </span>
              )}
              {status === 'DRAFT' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Draft
                </span>
              )}
              {status === 'MODIFIED' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Unpublished Changes
                </span>
              )}
            </div>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            
            {(lastModified || lastPublished) && (
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                {lastModified && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Modified: {new Date(lastModified).toLocaleString()}</span>}
                {lastPublished && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5"/> Published: {new Date(lastPublished).toLocaleString()}</span>}
              </div>
            )}
            
            {validationIssues.length > 0 && (
              <div className="mt-3">
                 <span className="px-2 py-1 rounded-md bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                   {validationIssues.length} Validation Issue{validationIssues.length > 1 ? 's' : ''}
                 </span>
                 <div className="mt-2 space-y-1">
                   {validationIssues.map((issue, idx) => (
                     <p key={idx} className={`text-xs ${issue.type === 'error' ? 'text-red-500' : 'text-amber-500'}`}>
                       • {issue.message}
                     </p>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {onReset && !isReadOnly && (
              <AdminButton variant="secondary" size="sm" icon={RotateCcw} onClick={onReset} className="hover:bg-slate-100/50">
                Discard Draft
              </AdminButton>
            )}
            {onSave && !isReadOnly && (
              <AdminButton variant="secondary" size="sm" icon={Save} onClick={onSave} loading={isLoading} className="hover:bg-slate-100/50 border-slate-200 shadow-sm">
                Save Draft
              </AdminButton>
            )}
            {onPublish && !isReadOnly && (
              <button 
                onClick={onPublish} 
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Globe className="w-4 h-4" />
                {isLoading ? 'Processing...' : 'Review & Publish'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Read Only Banner */}
      {isReadOnly && (
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center justify-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Lock className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">Read-Only Mode</p>
            <p className="text-xs text-slate-500 font-medium">You do not have permission to edit this section.</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-y-auto p-6 relative ${isReadOnly ? 'bg-slate-50' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isReadOnly ? (
            <fieldset disabled className="opacity-90 group read-only-mode">
              {/* Optional grey overlay to make it visibly locked */}
              <div className="absolute inset-0 z-10 pointer-events-auto bg-transparent cursor-not-allowed" title="You don't have permission to edit this section." />
              {children}
            </fieldset>
          ) : (
            children
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Reusable section card
export const EditorCard = ({ title, description, children, className = '' }) => (
  <div className={`bg-white rounded-3xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden mb-8 relative group ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/50 -z-10" />
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-slate-100/50 rounded-3xl transition-colors duration-500 pointer-events-none" />
    
    {(title || description) && (
      <div className="px-8 py-5 border-b border-slate-100/50 bg-white/50 backdrop-blur-md">
        {title && <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>}
        {description && <p className="text-sm text-slate-500 mt-1 font-medium">{description}</p>}
      </div>
    )}
    <div className="px-8 py-6 relative z-10">
      {children}
    </div>
  </div>
);

export default EditorPage;
