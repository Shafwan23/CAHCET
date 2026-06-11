import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import OptimizedImage from '../../ui/OptimizedImage';
import GalleryLightbox from '../GalleryLightbox';
import PremiumEmptyState from '../../ui/PremiumEmptyState';

const GallerySection = ({ data }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return <PremiumEmptyState title="Gallery Updating" message="We are currently organizing our event photos. Check back later." icon={ImageIcon} />;
  }

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNavigate = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = data.length - 1;
    if (newIndex >= data.length) newIndex = 0;
    setCurrentIndex(newIndex);
  };

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl pb-4 mb-8 border-b border-primary-100/50 pt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase mb-2">
            <span>Department</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent-gold">Events Gallery</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-primary-900">Events Gallery</h2>
        </div>
      </div>

      <motion.div 
        variants={departmentAnimations.staggerContainer}
        initial="hidden"
        animate="visible"
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {data.map((item, index) => (
          <motion.div 
            key={item.id}
            variants={departmentAnimations.fadeUp}
            className="break-inside-avoid relative group rounded-[2rem] overflow-hidden cursor-pointer shadow-luxury hover:shadow-luxury-hover bg-slate-100 will-change-transform"
            onClick={() => openLightbox(index)}
          >
            <OptimizedImage
              src={item.src}
              alt={item.alt}
              className="w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
            />
            {/* Premium Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500 ease-luxury flex flex-col justify-end p-8">
              <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-luxury">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 text-accent-gold">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <h4 className="text-white font-display font-bold text-2xl leading-tight mb-2">{item.title}</h4>
                <div className="w-8 h-1 bg-accent-gold rounded-full" />
              </div>
            </div>
            
            {/* Ambient Border Glow */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-accent-gold/30 transition-colors duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>

      <GalleryLightbox 
        images={data}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default GallerySection;
