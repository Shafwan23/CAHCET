import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Cpu, Code, Printer, Plus, Minus, ChevronRight } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import { cn } from '../../../utils/cn';
import OptimizedImage from '../../ui/OptimizedImage';
import PremiumEmptyState from '../../ui/PremiumEmptyState';

const LabCard = ({ lab, isOpen, onToggle }) => {
  return (
    <motion.div 
      variants={departmentAnimations.fadeUp}
      className={cn(
        "relative rounded-3xl overflow-hidden transition-all duration-500 border group",
        isOpen ? "border-accent-gold shadow-glow-lg" : "border-primary-100 shadow-luxury hover:border-primary-300 hover:shadow-luxury-hover"
      )}
    >
      {/* Dynamic Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={lab.image || "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80"}
          alt={lab.name}
          className="w-full h-full object-cover opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/95 to-white/90 backdrop-blur-sm" />
      </div>

      <button 
        onClick={onToggle}
        className="relative z-10 w-full p-6 md:p-8 flex items-start md:items-center justify-between text-left"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className={cn(
            "p-4 rounded-2xl transition-all duration-500 relative overflow-hidden",
            isOpen ? "bg-primary-900 text-white" : "bg-primary-50 text-primary-400 group-hover:bg-accent-gold/10 group-hover:text-accent-gold"
          )}>
            {isOpen && <div className="absolute inset-0 bg-accent-gold/20 blur-md animate-pulse" />}
            <Monitor className="w-8 h-8 relative z-10" />
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl text-primary-900 mb-2">{lab.name}</h3>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="text-accent-gold bg-accent-gold/10 px-3 py-1 rounded-full border border-accent-gold/20">
                {lab.totalSystems} High-End Systems
              </span>
            </div>
          </div>
        </div>
        
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border shrink-0 mt-2 md:mt-0",
          isOpen ? "bg-primary-900 border-primary-900 text-white rotate-180" : "bg-white border-primary-200 text-primary-400 group-hover:border-accent-gold group-hover:text-accent-gold"
        )}>
          <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", isOpen ? "-rotate-90" : "rotate-90")} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={departmentAnimations.accordionContent}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            className="relative z-10 px-6 pb-6 md:px-8 md:pb-8"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-primary-100">
              
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-primary-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Cpu className="w-5 h-5" /></div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-primary-900">Hardware</h4>
                </div>
                <p className="text-primary-600 text-sm leading-relaxed">{lab.hardware}</p>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-primary-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg"><Code className="w-5 h-5" /></div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-primary-900">Software</h4>
                </div>
                <p className="text-primary-600 text-sm leading-relaxed">{lab.software}</p>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-primary-100/50 shadow-sm hover:shadow-md transition-shadow lg:col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Printer className="w-5 h-5" /></div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-primary-900">Network & Peripherals</h4>
                </div>
                <p className="text-primary-600 text-sm leading-relaxed">{lab.peripherals}</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FacilitiesSection = ({ data }) => {
  const [openLabId, setOpenLabId] = useState(data?.[0]?.id || null);

  const toggleLab = (id) => {
    setOpenLabId(openLabId === id ? null : id);
  };

  if (!data || data.length === 0) {
    return <PremiumEmptyState title="Facilities Updating" message="We are currently upgrading our lab facility data. Check back soon." />;
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl pb-4 mb-8 border-b border-primary-100/50 pt-2">
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase mb-2">
          <span>Department</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-accent-gold">Facilities</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-primary-900">Laboratory Facilities</h2>
      </div>

      <motion.div 
        variants={departmentAnimations.staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {data.map((lab) => (
          <LabCard 
            key={lab.id} 
            lab={lab} 
            isOpen={openLabId === lab.id}
            onToggle={() => toggleLab(lab.id)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default FacilitiesSection;
