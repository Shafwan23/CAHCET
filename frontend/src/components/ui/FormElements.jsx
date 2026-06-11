import React from 'react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-bold text-primary-900 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      <input
        className={cn(
          "bg-slate-50 border border-primary-100 rounded-xl px-5 py-4 text-sm outline-none transition-all duration-300",
          "focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10",
          error && "border-amber-500 focus:border-amber-500 focus:ring-amber-500/10"
        )}
        {...props}
      />
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-amber-500 text-[10px] font-medium ml-1"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Select = ({ label, options, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-bold text-primary-900 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          className={cn(
            "w-full bg-slate-50 border border-primary-100 rounded-xl px-5 py-4 text-sm outline-none transition-all duration-300 appearance-none",
            "focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10",
            error && "border-amber-500 focus:border-amber-500 focus:ring-amber-500/10"
          )}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((group) => (
            <optgroup key={group.category} label={group.category}>
              {group.items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-primary-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-amber-500 text-[10px] font-medium ml-1"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
