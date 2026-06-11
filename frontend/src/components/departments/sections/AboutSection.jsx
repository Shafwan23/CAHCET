import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Info, Target, Compass, BookOpen, Star } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import { cn } from '../../../utils/cn';

const AccordionItem = ({ title, icon: Icon, children, isOpen, onToggle }) => {
  return (
    <div className={cn(
      "border rounded-2xl overflow-hidden transition-colors duration-300",
      isOpen ? "border-accent-gold bg-white shadow-xl shadow-accent-gold/10" : "border-primary-100 bg-white hover:border-primary-300"
    )}>
      <button 
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-2 rounded-xl transition-colors",
            isOpen ? "bg-accent-gold/20 text-accent-gold" : "bg-primary-50 text-primary-400"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-primary-900">{title}</h3>
        </div>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
          isOpen ? "bg-accent-gold text-primary-900" : "bg-primary-50 text-primary-400"
        )}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={departmentAnimations.accordionContent}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            className="px-6 pb-6 text-primary-600 leading-relaxed"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AboutSection = ({ data }) => {
  const [openAccordion, setOpenAccordion] = useState('about');

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  if (!data) return null;

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-4">Department Overview</h2>
        <div className="w-20 h-1 bg-accent-gold rounded-full" />
      </div>

      <div className="space-y-4">
        <AccordionItem 
          title="About the Department" 
          icon={Info}
          isOpen={openAccordion === 'about'}
          onToggle={() => toggleAccordion('about')}
        >
          <p>{data.about}</p>
        </AccordionItem>

        <AccordionItem 
          title="Vision" 
          icon={Compass}
          isOpen={openAccordion === 'vision'}
          onToggle={() => toggleAccordion('vision')}
        >
          <p className="italic text-lg text-primary-700 border-l-4 border-accent-gold pl-4 py-2">
            "{data.vision}"
          </p>
        </AccordionItem>

        <AccordionItem 
          title="Mission" 
          icon={Target}
          isOpen={openAccordion === 'mission'}
          onToggle={() => toggleAccordion('mission')}
        >
          <ul className="space-y-3">
            {data.mission.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 text-xs font-bold">{idx + 1}</span>
                <span>{item.substring(item.indexOf(':') + 1).trim()}</span>
              </li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem 
          title="Program Educational Objectives (PEOs)" 
          icon={Star}
          isOpen={openAccordion === 'peos'}
          onToggle={() => toggleAccordion('peos')}
        >
          <ul className="space-y-3">
            {data.peos.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-2 shrink-0" />
                <span>{item.substring(item.indexOf(':') + 1).trim()}</span>
              </li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem 
          title="Program Outcomes (POs) & PSOs" 
          icon={BookOpen}
          isOpen={openAccordion === 'pos'}
          onToggle={() => toggleAccordion('pos')}
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-primary-900 mb-3 uppercase tracking-wider text-xs">Program Outcomes</h4>
              <ul className="space-y-2 text-sm">
                {data.pos.map((item, idx) => {
                  const [title, desc] = item.split(':');
                  return (
                    <li key={idx} className="border-b border-primary-50 pb-2 last:border-0">
                      <strong className="text-primary-800">{title}:</strong> {desc}
                    </li>
                  );
                })}
              </ul>
            </div>
            {data.psos && (
              <div>
                <h4 className="font-bold text-primary-900 mb-3 uppercase tracking-wider text-xs">Program Specific Outcomes</h4>
                <ul className="space-y-2 text-sm">
                  {data.psos.map((item, idx) => {
                    const [title, desc] = item.split(':');
                    return (
                      <li key={idx} className="border-b border-primary-50 pb-2 last:border-0">
                        <strong className="text-primary-800">{title}:</strong> {desc}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </AccordionItem>
      </div>
    </div>
  );
};

export default AboutSection;
