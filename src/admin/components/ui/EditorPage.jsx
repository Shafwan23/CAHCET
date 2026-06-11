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
  children,
}) => {
  const { canEditRoute, isSuperAdmin } = useAdminAuth();
  const location = useLocation();

  // Route-based Permission Engine Check
  // Note: We bypass this check for Super Admins automatically inside canEditRoute
  const hasAccess = canEditRoute(location.pathname);
  const isReadOnly = !hasAccess;

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        {breadcrumb && (
          <p className="text-xs text-slate-400 mb-1">
            {breadcrumb.map((b, i) => (
              <span key={i}>
                {b}
                {i < breadcrumb.length - 1 && <span className="mx-1.5 text-slate-300">/</span>}
              </span>
            ))}
          </p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
            {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {onReset && !isReadOnly && (
              <AdminButton variant="secondary" size="sm" icon={RotateCcw} onClick={onReset}>
                Reset
              </AdminButton>
            )}
            {onSave && !isReadOnly && (
              <AdminButton variant="secondary" size="sm" icon={Save} onClick={onSave} loading={isLoading}>
                Save Changes
              </AdminButton>
            )}
            {onPublish && !isReadOnly && (
              <AdminButton variant="primary" size="sm" icon={Globe} onClick={onPublish} loading={isLoading}>
                Publish
              </AdminButton>
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
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6 ${className}`}>
    {(title || description) && (
      <div className="px-6 py-4 border-b border-slate-50">
        {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
    )}
    <div className="px-6 py-5">
      {children}
    </div>
  </div>
);

export default EditorPage;
