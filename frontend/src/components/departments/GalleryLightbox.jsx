import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { departmentAnimations } from '../../animations/departmentAnimations';
import OptimizedImage from '../ui/OptimizedImage';

const GalleryLightbox = ({ images, currentIndex, isOpen, onClose, onNavigate }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNavigate(1);
    if (e.key === 'ArrowLeft') onNavigate(-1);
  }, [onClose, onNavigate]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div>
              <h3 className="text-white font-bold text-lg">{currentImage.title}</h3>
              <p className="text-white/60 text-sm">{currentIndex + 1} / {images.length}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Controls */}
          <button 
            onClick={() => onNavigate(-1)}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black text-white backdrop-blur-md transition-all hover:scale-110 z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={() => onNavigate(1)}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black text-white backdrop-blur-md transition-all hover:scale-110 z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Main Image */}
          <div className="w-full h-full p-4 md:p-20 flex items-center justify-center">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center group"
            >
              <OptimizedImage
                src={currentImage.src}
                alt={currentImage.alt}
                containerClassName="w-auto h-auto max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden"
                className="object-contain"
                placeholderColor="bg-slate-800"
              />
              {/* Optional Zoom Hint */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:flex hidden">
                <ZoomIn className="w-4 h-4" />
                <span className="text-xs">Scroll to zoom (simulated)</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;
