import React from 'react';
import { motion } from 'framer-motion';

// AdminInput - styled text/email/password/textarea input
export const AdminInput = React.forwardRef(({
  label, type = 'text', icon: Icon, error, hint,
  className = '', containerClass = '', suffix,
  ...props
}, ref) => (
  <div className={`flex flex-col gap-1.5 ${containerClass}`}>
    {label && (
      <label className="text-sm font-semibold text-slate-700">{label}</label>
    )}
    <div className="relative flex items-center">
      {Icon && (
        <span className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </span>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full rounded-xl border text-sm text-slate-800 placeholder-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_15px_rgba(0,0,0,0.04)]
          focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-300
          ${Icon ? 'pl-10' : 'pl-4'} ${suffix ? 'pr-10' : 'pr-4'} py-2.5
          ${error ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200/70 bg-white/50 hover:bg-white focus:bg-white'}
          ${className}
        `}
        {...props}
      />
      {suffix && (
        <span className="absolute right-3.5 text-slate-400 text-xs font-medium">{suffix}</span>
      )}
    </div>
    {error && <p className="text-xs text-amber-500 flex items-center gap-1">⚠ {error}</p>}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
));
AdminInput.displayName = 'AdminInput';

// AdminTextarea
export const AdminTextarea = ({ label, error, hint, className = '', containerClass = '', rows = 4, ...props }) => (
  <div className={`flex flex-col gap-1.5 ${containerClass}`}>
    {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
    <textarea
      rows={rows}
      className={`
        w-full rounded-xl border text-sm text-slate-800 placeholder-slate-400 px-4 py-2.5 resize-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_15px_rgba(0,0,0,0.04)]
        focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-300
        ${error ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200/70 bg-white/50 hover:bg-white focus:bg-white'}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-amber-500">⚠ {error}</p>}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

// AdminSelect
export const AdminSelect = ({ label, error, hint, className = '', containerClass = '', options = [], ...props }) => (
  <div className={`flex flex-col gap-1.5 ${containerClass}`}>
    {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
    <select
      className={`
        w-full rounded-xl border text-sm text-slate-800 px-4 py-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_15px_rgba(0,0,0,0.04)]
        focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-300
        ${error ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200/70 bg-white/50 hover:bg-white focus:bg-white'}
        ${className}
      `}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-amber-500">⚠ {error}</p>}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

// AdminToggle
export const AdminToggle = ({ label, checked, onChange, hint }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:ring-offset-2 ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`}
    >
      <motion.span 
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} 
      />
    </button>
  </div>
);

// AdminButton
export const AdminButton = ({ variant = 'primary', size = 'md', loading, icon: Icon, children, className = '', ...props }) => {
  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]',
    secondary: 'border border-slate-200/70 bg-white hover:bg-slate-50 text-slate-700 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]',
    danger: 'bg-red-500 hover:bg-red-600 text-white font-bold shadow-sm',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm',
    ghost: 'hover:bg-slate-100 text-slate-600 font-bold',
  };
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-2.5 text-sm rounded-xl',
  };

  return (
    <motion.button
      whileHover={!loading && !props.disabled ? { y: -1 } : {}}
      whileTap={!loading && !props.disabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  );
};
