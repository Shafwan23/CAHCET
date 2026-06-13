import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ChevronRight, Image as ImageIcon, Calendar, Layers } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import OptimizedImage from '../../ui/OptimizedImage';
import GalleryLightbox from '../GalleryLightbox';
import PremiumEmptyState from '../../ui/PremiumEmptyState';
import { cn } from '../../../utils/cn';

const CATEGORIES = ['All', 'Symposium', 'Workshop', 'Industrial Visit', 'Hackathon', 'Placement Training', 'Cultural Events', 'Student Projects', 'Other'];

const GallerySection = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);

  if (!data || data.length === 0) {
    return <PremiumEmptyState title="Gallery Updating" message="We are currently organizing our event photos. Check back later." icon={ImageIcon} />;
  }

  // Normalize data into albums structure
  let albums = [];
  if (Array.isArray(data)) {
    if (data.length > 0) {
      if (data[0].images) {
        // New album-based structure
        albums = data;
      } else {
        // Old flat image list structure
        albums = [
          {
            id: 'legacy',
            albumName: 'General Events',
            category: 'Other',
            date: '',
            images: data.map(item => ({
              url: item.src || item.url,
              caption: item.title || item.alt || ''
            }))
          }
        ];
      }
    }
  }

  // Filter albums by category
  const filteredAlbums = activeCategory === 'All' 
    ? albums 
    : albums.filter(a => (a.category || 'Other').toLowerCase() === activeCategory.toLowerCase());

  const openAlbumLightbox = (albumIdx) => {
    // Find actual album index in the full albums array
    const album = filteredAlbums[albumIdx];
    const originalIdx = albums.findIndex(a => a.id === album.id);
    setActiveAlbumIndex(originalIdx >= 0 ? originalIdx : 0);
    setCurrentIndex(0);
    setLightboxOpen(true);
  };

  const handleNavigate = (direction) => {
    const activeAlbum = albums[activeAlbumIndex];
    if (!activeAlbum || !activeAlbum.images) return;
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = activeAlbum.images.length - 1;
    if (newIndex >= activeAlbum.images.length) newIndex = 0;
    setCurrentIndex(newIndex);
  };

  const currentAlbum = albums[activeAlbumIndex] || { images: [], albumName: '' };
  const lightboxImages = (currentAlbum.images || []).map(img => ({
    src: img.url,
    alt: img.caption || currentAlbum.albumName,
    title: img.caption || currentAlbum.albumName
  }));

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl pb-4 mb-8 border-b border-primary-100/50 pt-2">
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase mb-2">
          <span>Department</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-accent-gold">Events Gallery</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-primary-900 mb-6">Events Gallery</h2>

        {/* Categories Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            const count = cat === 'All' 
              ? albums.length 
              : albums.filter(a => (a.category || 'Other').toLowerCase() === cat.toLowerCase()).length;
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                  isActive 
                    ? "bg-primary-900 text-white border-primary-900 shadow-md" 
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                {cat}
                <span className="ml-1.5 text-[10px] opacity-65">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div 
        variants={departmentAnimations.staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredAlbums.length > 0 ? (
          filteredAlbums.map((album, idx) => {
            const coverImage = album.images?.[0]?.url || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800';
            return (
              <motion.div 
                key={album.id || idx}
                variants={departmentAnimations.fadeUp}
                className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-luxury hover:shadow-luxury-hover bg-slate-100 aspect-[4/3] border border-slate-100"
                onClick={() => openAlbumLightbox(idx)}
              >
                <OptimizedImage
                  src={coverImage}
                  alt={album.albumName}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
                />
                
                {/* Premium Album Details Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-accent-gold uppercase tracking-wider bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                      {album.category || 'Other'}
                    </span>
                    {album.date && (
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{album.date}</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-white font-display font-bold text-xl md:text-2xl leading-tight mb-2 group-hover:text-accent-gold transition-colors duration-300">
                    {album.albumName}
                  </h4>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/60 text-xs font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-accent-gold" />
                      {album.images?.length || 0} Images
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-accent-gold transform group-hover:scale-110 transition-transform duration-300">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                {/* Ambient Border Glow */}
                <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-accent-gold/30 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full">
            <PremiumEmptyState 
              title="No Albums Found" 
              message={`There are no albums in the ${activeCategory} category yet.`} 
              icon={ImageIcon} 
            />
          </div>
        )}
      </motion.div>

      {lightboxOpen && (
        <GalleryLightbox 
          images={lightboxImages}
          currentIndex={currentIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default GallerySection;
