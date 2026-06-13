import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, BookOpen, GraduationCap, Award, Briefcase, Phone, Linkedin } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';
import { departmentAnimations } from '../../animations/departmentAnimations';

const FacultyProfileModal = ({ faculty, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!faculty) return null;

  const photoSrc = faculty.photo || faculty.image || faculty.photoUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            variants={departmentAnimations.modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="absolute inset-0 bg-primary-950/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            variants={departmentAnimations.modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-full"
          >
            {/* Left/Top Sidebar (Image & Quick Info) */}
            <div className="w-full md:w-1/3 bg-primary-900 text-white p-8 flex flex-col items-center text-center relative shrink-0">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
              
              <OptimizedImage
                src={photoSrc}
                alt={faculty.name}
                containerClassName="w-40 h-40 rounded-full border-4 border-accent-gold/50 shadow-xl mb-6 shadow-black/50"
              />
              <h3 className="text-2xl font-display font-bold mb-1">{faculty.name}</h3>
              <p className="text-accent-gold font-medium text-sm tracking-wider uppercase mb-6">{faculty.designation}</p>
              
              <div className="w-full h-px bg-white/10 mb-6" />
              
              <div className="w-full space-y-3">
                {faculty.email && (
                  <a 
                    href={`mailto:${faculty.email}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-accent-gold hover:text-primary-900 transition-colors border border-white/10 hover:border-transparent font-medium text-sm truncate"
                    title={faculty.email}
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate text-left">{faculty.email}</span>
                  </a>
                )}
                
                {faculty.phone && (
                  <a 
                    href={`tel:${faculty.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-accent-gold hover:text-primary-900 transition-colors border border-white/10 hover:border-transparent font-medium text-sm truncate"
                    title={faculty.phone}
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="truncate text-left">{faculty.phone}</span>
                  </a>
                )}

                {faculty.linkedin && (
                  <a 
                    href={faculty.linkedin.startsWith('http') ? faculty.linkedin : `https://${faculty.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-accent-gold hover:text-primary-900 transition-colors border border-white/10 hover:border-transparent font-medium text-sm truncate"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4 shrink-0" />
                    <span className="truncate text-left">LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right/Bottom Content (Details) */}
            <div className="flex-1 p-8 md:p-10 overflow-y-auto bg-slate-50 relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full text-primary-400 hover:text-primary-900 hover:bg-primary-100 transition-colors hidden md:block"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-8">
                {/* Section */}
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <GraduationCap className="text-primary-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-400 mb-2">Qualifications</h4>
                    <p className="text-primary-900 font-medium">{faculty.qualification}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <Briefcase className="text-primary-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-400 mb-2">Experience</h4>
                    <p className="text-primary-900 font-medium">{faculty.experience}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <Award className="text-primary-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-400 mb-2">Specialization & Research</h4>
                    <div className="space-y-2">
                      <p className="text-primary-900 font-medium"><span className="text-primary-500 font-normal">Core:</span> {faculty.specialization}</p>
                      {faculty.researchInterests && (
                        <p className="text-primary-900 font-medium"><span className="text-primary-500 font-normal">Interests:</span> {faculty.researchInterests}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <BookOpen className="text-primary-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-400 mb-2">Publications & Research</h4>
                    {(() => {
                      const pub = faculty.publications;
                      if (!pub) return <p className="text-primary-900/50 italic text-sm">No publications listed yet.</p>;
                      const isNumeric = !isNaN(pub) && !isNaN(parseFloat(pub));
                      if (isNumeric) {
                        return (
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-display font-bold text-primary-900 leading-none">{pub}</span>
                            <span className="text-primary-500 text-sm pb-1">Papers Published</span>
                          </div>
                        );
                      }
                      return (
                        <p className="text-primary-900 text-sm whitespace-pre-wrap leading-relaxed">{pub}</p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FacultyProfileModal;
