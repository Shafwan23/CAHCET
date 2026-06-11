import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, FileText, Plus, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const FloatingActionButtons = ({ onEnquiryClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { 
      label: 'Admission Enquiry', 
      icon: GraduationCap, 
      color: 'bg-primary-900', 
      textColor: 'text-white',
      onClick: onEnquiryClick 
    },
    { 
      label: 'Apply Now', 
      icon: FileText, 
      color: 'bg-accent-gold', 
      textColor: 'text-primary-900',
      onClick: () => {
        if (window.location.pathname === '/admissions/registration-2026') {
          const el = document.getElementById('apply-process');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.location.href = '/admissions/registration-2026#apply-process';
        }
      }
    },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[40] flex flex-col gap-px pointer-events-none">
      {actions.map((action, i) => (
        <motion.button
          key={i}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5 + i * 0.1, type: 'spring', damping: 20 }}
          whileHover={{ x: -5 }}
          onClick={action.onClick}
          className={cn(
            "pointer-events-auto flex flex-col items-center gap-2 lg:gap-4 py-4 px-2 lg:py-8 lg:px-4 font-bold text-[9px] lg:text-xs tracking-[0.1em] lg:tracking-[0.2em] uppercase rounded-l-xl lg:rounded-l-2xl shadow-[-5px_0_20px_rgba(0,0,0,0.15)] lg:shadow-[-10px_0_30px_rgba(0,0,0,0.2)] transition-all group relative border-l border-t border-b border-white/10",
            action.color,
            action.textColor
          )}
          style={{ writingMode: 'vertical-rl' }}
        >
          {/* Tab Background Overlay */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl lg:rounded-l-2xl" />
          
          <span className="whitespace-nowrap rotate-180 py-2 lg:py-4">
            {action.label}
          </span>
          
          {/* Glow Effect */}
          <div className={cn(
            "absolute inset-0 blur-xl lg:blur-2xl opacity-0 group-hover:opacity-20 transition-opacity -z-10",
            action.color
          )} />
        </motion.button>
      ))}
    </div>
  );
};

export default FloatingActionButtons;
