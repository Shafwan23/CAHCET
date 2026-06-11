import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-amber-400" />,
  error: <XCircle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
};

const COLORS = {
  success: 'border-amber-500/30 bg-amber-500/10',
  error: 'border-amber-500/30 bg-amber-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
};

const ToastItem = ({ toast, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: 80, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 80, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-xl backdrop-blur-md max-w-sm w-full ${COLORS[toast.type] || COLORS.info} bg-slate-900/90`}
  >
    <div className="shrink-0 mt-0.5">{ICONS[toast.type]}</div>
    <div className="flex-1 min-w-0">
      {toast.title && <p className="text-sm font-semibold text-white leading-tight">{toast.title}</p>}
      {toast.message && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>}
    </div>
    <button onClick={() => onRemove(toast.id)} className="shrink-0 text-slate-400 hover:text-white transition-colors">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.addToast;
};
