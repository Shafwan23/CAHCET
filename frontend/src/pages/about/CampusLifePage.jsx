import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const GALLERY_ITEMS = [
  { 
    id: 1, 
    title: 'Cultural Fest 2025', 
    category: 'Events', 
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-2 md:row-span-2'
  },
  { 
    id: 2, 
    title: 'Robotics Workshop', 
    category: 'Workshops', 
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    span: 'md:col-span-1 md:row-span-1'
  },
  { 
    id: 3, 
    title: 'Sports Day - Cricket', 
    category: 'Sports', 
    image: 'https://images.unsplash.com/photo-1531415080294-436e89fbcbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    span: 'md:col-span-1 md:row-span-1'
  },
  { 
    id: 4, 
    title: 'Coding Club Meetup', 
    category: 'Clubs', 
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    span: 'md:col-span-1 md:row-span-2'
  },
  { 
    id: 5, 
    title: 'Annual Day Celebrations', 
    category: 'Events', 
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    span: 'md:col-span-1 md:row-span-1'
  },
  { 
    id: 6, 
    title: 'Green Campus Initiative', 
    category: 'Activities', 
    image: 'https://images.unsplash.com/photo-1542601906960-da15109dcb70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-2 md:row-span-1'
  },
];

const CampusLifePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await cmsService.getPage('academics');
        const section = pageData?.sections?.find(s => s.sectionKey === 'academics.campusLife');
        if (section && section.content) {
          setData(section.content);
        }
      } catch (error) {
        console.error('Error fetching campus life data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-950">
        <div className="w-16 h-16 border-4 border-primary-800 border-t-accent-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  // Use sections or clubs/events to construct gallery items
  // Mapping CMS data to the required format for masonry grid.
  const galleryItems = [];
  
  if (data?.sections && data.sections.length > 0) {
    data.sections.forEach((sec, idx) => {
      if (sec.images && sec.images.length > 0) {
        sec.images.forEach((img, imgIdx) => {
          galleryItems.push({
            id: `sec-${idx}-${imgIdx}`,
            title: sec.title || 'Campus Event',
            category: 'Event',
            image: img,
            span: imgIdx === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
          });
        });
      }
    });
  }

  const itemsToDisplay = galleryItems.length > 0 ? galleryItems : GALLERY_ITEMS;
  const spotlightItem = itemsToDisplay[0];
  const gridItems = itemsToDisplay.slice(1);

  return (
    <div className="pb-32">
      {/* Header */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl text-center pt-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span>Academics</span>
            <span className="w-10 h-[2px] bg-accent-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">{data?.title || 'Vibrant Student Life'}</h1>
          <p className="text-xl text-primary-600 leading-relaxed font-light max-w-3xl mx-auto">
            {data?.content || 'A glimpse into the events, clubs, and activities that make CAHCET a lively place to learn. Experience the energy and diversity of our campus.'}
          </p>
        </motion.div>
      </section>

      {/* Full-Width Spotlight Section */}
      {spotlightItem && (
        <section className="mb-24">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="relative h-[60vh] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setSelectedImage(spotlightItem)}>
              <img 
                src={spotlightItem.image} 
                alt={spotlightItem.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                <div className="text-accent-gold text-sm font-bold uppercase tracking-widest mb-2">Spotlight Event</div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{spotlightItem.title}</h2>
                <p className="text-primary-100 font-light max-w-2xl text-lg mb-6">
                  {data?.content || 'Relive the moments of our grandest cultural festival. A celebration of talent, art, and diversity.'}
                </p>
                <div className="flex items-center text-sm font-bold text-white group-hover:text-accent-gold transition-colors">
                  <span>View Highlights</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Masonry Grid */}
      {gridItems.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-2xl font-display font-bold text-primary-900 mb-8">Life on Campus</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {gridItems.map((item, index) => {
              const span = item.span || ((index % 4 === 0) ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1');
              return (
                <div 
                  key={item.id || index}
                  className={`relative rounded-2xl overflow-hidden group shadow-luxury cursor-pointer ${span}`}
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Image */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-luxury"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <div className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-1">{item.category}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <div className="flex items-center text-xs text-white/70 font-medium">
                      <ZoomIn className="w-4 h-4 mr-1" />
                      <span>View Full Size</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-950/95 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-5xl w-full bg-transparent overflow-hidden rounded-2xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title} 
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
              />
              <div className="text-center mt-6">
                <div className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-1">{selectedImage.category}</div>
                <h3 className="text-2xl font-display font-bold text-white">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampusLifePage;
