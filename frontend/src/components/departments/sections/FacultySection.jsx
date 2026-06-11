import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, ChevronRight } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import OptimizedImage from '../../ui/OptimizedImage';
import FacultyProfileModal from '../FacultyProfileModal';
import PremiumEmptyState from '../../ui/PremiumEmptyState';

const FacultyCard = ({ faculty, onClick }) => {
  return (
    <motion.div 
      variants={departmentAnimations.fadeUp}
      className="relative rounded-[2rem] p-1 bg-gradient-to-b from-white/40 to-white/0 group shadow-luxury hover:shadow-luxury-hover transition-all duration-500 hover:-translate-y-2 will-change-transform h-full flex flex-col"
    >
      {/* Animated Glowing Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/40 via-transparent to-primary-900/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative bg-white rounded-[1.8rem] overflow-hidden flex flex-col h-full z-10 border border-white/60">
        <div className="h-56 overflow-hidden relative">
          <OptimizedImage
            src={faculty.photo}
            alt={faculty.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-luxury">
            <button onClick={onClick} className="w-full py-3 bg-white/10 hover:bg-accent-gold backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors border border-white/20 hover:border-accent-gold">
              View Full Profile
            </button>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1 relative z-10 bg-white">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold mb-2 block bg-accent-gold/10 inline-block px-2 py-1 rounded-md w-fit">
            {faculty.designation}
          </span>
          <h3 className="font-display font-bold text-xl text-primary-900 mb-1 group-hover:text-accent-gold transition-colors">{faculty.name}</h3>
          <p className="text-primary-500 text-sm font-medium mb-4 flex-1">
            {faculty.qualification}
          </p>
          
          <div className="pt-4 border-t border-primary-50 mt-auto">
            <button 
              onClick={onClick}
              className="flex items-center justify-between w-full text-sm font-bold text-primary-900 group-hover:text-accent-gold transition-colors"
            >
              Quick View
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
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
      faculty.specialization.toLowerCase().includes(lowerSearch)
    );
  }, [data, searchTerm]);

  if (!data || data.length === 0) {
    return <PremiumEmptyState title="Faculty Data Updating" message="We are currently updating our distinguished faculty list." />;
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl pb-4 mb-8 border-b border-primary-100/50 pt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase mb-2">
            <span>Department</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent-gold">Faculties</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-primary-900">Eminent Faculties</h2>
        </div>

        {/* Premium Live Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary-50/50 border border-primary-100 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none transition-all focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 shadow-inner"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredFaculty.length > 0 ? (
          <motion.div 
            key="grid"
            variants={departmentAnimations.staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
