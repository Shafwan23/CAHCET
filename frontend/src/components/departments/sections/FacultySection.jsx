import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, BookOpen, Mail, ArrowRight, UserCircle } from 'lucide-react';
import OptimizedImage from '../../ui/OptimizedImage';
import FacultyProfileModal from '../FacultyProfileModal';
import PremiumEmptyState from '../../ui/PremiumEmptyState';

const premiumAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  }
};

const FacultyCard = ({ faculty, onClick }) => {
  const isNumeric = (val) => {
    if (typeof val === 'number') return true;
    if (typeof val !== 'string') return false;
    return !isNaN(val) && !isNaN(parseFloat(val));
  };

  const hasPublicationsBadge = faculty.publications && (isNumeric(faculty.publications) ? parseInt(faculty.publications) > 0 : true);

  return (
    <motion.div 
      variants={premiumAnimations.item}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative rounded-3xl p-px bg-gradient-to-br from-white/40 via-white/10 to-transparent group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 will-change-transform flex flex-col h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-amber-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10" />
      
      <div className="relative bg-white/70 backdrop-blur-2xl rounded-[23px] overflow-hidden flex flex-col h-full z-10 border border-white/60 group-hover:border-white/80 transition-colors">
        {/* Image Header */}
        <div className="h-64 overflow-hidden relative bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          
          <motion.div 
            initial={false}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full relative z-10"
          >
            {faculty.photo || faculty.image || faculty.photoUrl ? (
              <OptimizedImage
                src={faculty.photo || faculty.image || faculty.photoUrl}
                alt={faculty.name}
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            ) : (
               <div className="w-full h-full flex items-center justify-center"><UserCircle className="w-20 h-20 text-slate-300" /></div>
            )}
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          
          {hasPublicationsBadge && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 bg-white/90 text-slate-900 border border-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl flex items-center gap-1.5 z-20 backdrop-blur-md"
            >
              <BookOpen className="w-3 h-3 text-indigo-500" />
              {isNumeric(faculty.publications) ? `${faculty.publications} Pubs` : 'Research'}
            </motion.div>
          )}

          <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
            {faculty.profilePdf ? (
              <a href={faculty.profilePdf} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors shadow-2xl">
                View Full Profile <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <button onClick={onClick} className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors shadow-2xl">
                Quick Overview <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Content Body */}
        <div className="p-6 flex flex-col flex-1 relative z-10">
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-3 block bg-indigo-50/80 px-2.5 py-1 rounded w-fit border border-indigo-100/50">
            {faculty.designation}
          </span>
          <h3 className="font-display font-bold text-2xl text-slate-900 mb-1 tracking-tight">{faculty.name}</h3>
          <p className="text-slate-500 text-sm font-semibold mb-3">
            {faculty.qualification}
          </p>
          
          {faculty.email && (
            <a 
              href={`mailto:${faculty.email}`} 
              className="group/mail inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors mb-4 bg-slate-100/50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="w-3.5 h-3.5 group-hover/mail:text-indigo-500" />
              <span className="truncate">{faculty.email}</span>
            </a>
          )}
          
          <div className="flex-1" />
          
          <div className="pt-5 border-t border-slate-100 mt-4">
            {faculty.profilePdf ? (
              <a 
                href={faculty.profilePdf} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
              >
                View Profile
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            ) : (
              <button 
                onClick={onClick}
                className="flex items-center justify-between w-full text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
              >
                Quick View
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FacultySection = ({ data, departmentName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const filteredFaculty = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(faculty => 
      faculty.name.toLowerCase().includes(lowerSearch) ||
      faculty.designation.toLowerCase().includes(lowerSearch) ||
      (faculty.specialization && faculty.specialization.toLowerCase().includes(lowerSearch))
    );
  }, [data, searchTerm]);

  if (!data || data.length === 0) {
    return <PremiumEmptyState title="Faculty Data Updating" message="We are currently updating our distinguished faculty list." />;
  }

  return (
    <div className="relative z-10">
      {/* Sticky Header with Glassmorphism */}
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-2xl pb-5 mb-10 border-b border-slate-200/50 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] px-2">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black tracking-widest uppercase mb-2">
            <span>Department</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-indigo-600">Faculties</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Eminent Faculties</h2>
        </div>

        {/* Linear/Vercel style Search Bar */}
        <div className="relative w-full md:w-full sm:w-96 shrink-0 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredFaculty.length > 0 ? (
          <motion.div 
            key="grid"
            variants={premiumAnimations.container}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2 pb-20"
          >
            {filteredFaculty.map((faculty) => (
              <FacultyCard 
                key={faculty.id} 
                faculty={faculty} 
                onClick={() => setSelectedFaculty(faculty)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-10">
            <PremiumEmptyState 
              title="No faculty found" 
              message={`We couldn't find anyone matching "${searchTerm}". Please try a different term.`} 
              icon={Search}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <FacultyProfileModal 
        faculty={selectedFaculty} 
        isOpen={!!selectedFaculty} 
        onClose={() => setSelectedFaculty(null)} 
      />
    </div>
  );
};

export default FacultySection;
