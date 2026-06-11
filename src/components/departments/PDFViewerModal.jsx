import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { departmentAnimations } from '../../animations/departmentAnimations';
import Button from '../ui/Button';

const PDFViewerModal = ({ pdfDoc, isOpen, onClose }) => {
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

  if (!pdfDoc) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            variants={departmentAnimations.modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="absolute inset-0 bg-primary-950/70 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            variants={departmentAnimations.modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary-900 p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4 text-white">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{pdfDoc.title}</h3>
                  <p className="text-primary-300 text-sm">{pdfDoc.fileSize || 'PDF Document'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={pdfDoc.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
                <a 
                  href={pdfDoc.fileUrl} 
                  download
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent-gold text-primary-900 hover:bg-yellow-400 rounded-lg transition-colors text-sm font-bold shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <div className="w-px h-8 bg-white/20 mx-2 hidden sm:block" />
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Actions (Visible only on small screens) */}
            <div className="bg-primary-50 p-4 flex sm:hidden gap-3 border-b border-primary-100 shrink-0">
               <Button variant="outline" className="flex-1 py-3 text-xs" onClick={() => window.open(pdfDoc.fileUrl, '_blank')}>
                 Open
               </Button>
               <Button variant="accent" className="flex-1 py-3 text-xs" onClick={() => {
                 const a = document.createElement('a');
                 a.href = pdfDoc.fileUrl;
                 a.download = true;
                 a.click();
               }}>
                 Download
               </Button>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 bg-slate-100 p-4 md:p-8 overflow-hidden relative">
              {/* Fake PDF Viewer placeholder for demonstration */}
              <div className="w-full h-full bg-white shadow-md rounded-xl border border-slate-200 overflow-y-auto p-8 md:p-16">
                 <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 border-b-2 border-slate-200 pb-8">
                       <h1 className="text-3xl font-display font-bold text-primary-900 mb-4">{pdfDoc.title}</h1>
                       <p className="text-slate-500">Official Curriculum & Syllabus Document</p>
                    </div>
                    {/* Skeleton Content */}
                    <div className="space-y-6">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                          <div className="h-6 bg-slate-200 rounded w-1/3" />
                          <div className="h-4 bg-slate-100 rounded w-full" />
                          <div className="h-4 bg-slate-100 rounded w-5/6" />
                          <div className="h-4 bg-slate-100 rounded w-4/6" />
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
              
              {/* Simulated Loading Overlay */}
              {/* <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                 <div className="w-12 h-12 border-4 border-primary-200 border-t-accent-gold rounded-full animate-spin" />
              </div> */}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PDFViewerModal;
