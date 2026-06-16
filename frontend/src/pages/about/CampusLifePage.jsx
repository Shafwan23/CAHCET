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
          setData(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
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
    <div className="pb-32 bg-primary-50 min-h-screen">
      {/* Premium Parallax Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-[2px] bg-accent-gold" />
              <span>Academics</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold mb-6 leading-tight tracking-tight">
              {data?.title || 'Vibrant Student Life'}
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 font-light leading-relaxed border-l-4 border-accent-gold pl-6">
              {data?.content || 'A glimpse into the events, clubs, and activities that make CAHCET a lively place to learn. Experience the energy and diversity of our campus.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full-Width Spotlight Section */}
      {spotlightItem && (
        <section className="mb-24">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[60vh] min-h-[500px] rounded-[3rem] overflow-hidden shadow-luxury group cursor-pointer" 
              onClick={() => setSelectedImage(spotlightItem)}
            >
              <div className="absolute inset-0 bg-accent-gold/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src={spotlightItem.image} 
                alt={spotlightItem.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/40 to-transparent z-10 flex flex-col justify-end p-8 md:p-16">
                <div className="relative z-20">
                  <div className="inline-block px-4 py-1.5 bg-accent-gold/20 backdrop-blur-md text-accent-gold border border-accent-gold/30 text-xs font-bold uppercase tracking-widest rounded-full mb-4">Spotlight Event</div>
                  <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 group-hover:text-accent-gold transition-colors duration-500">{spotlightItem.title}</h2>
                  <p className="text-primary-100 font-light max-w-3xl text-xl mb-8">
                    {data?.content || 'Relive the moments of our grandest cultural festival. A celebration of talent, art, and diversity.'}
                  </p>
                  <div className="flex items-center text-sm font-bold text-white group-hover:text-accent-gold transition-colors w-fit border-b border-transparent group-hover:border-accent-gold pb-0.5">
                    <span>View Full Image</span>
                    <ZoomIn className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 z-20">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-accent-gold group-hover:border-accent-gold transition-all duration-500 hover:rotate-90">
                  <ZoomIn className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Masonry Grid */}
      {gridItems.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">Life on Campus</h2>
            <div className="h-[2px] flex-1 bg-primary-100 mx-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {gridItems.map((item, index) => {
              const span = item.span || ((index % 4 === 0) ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1');
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={item.id || index}
                  className={`relative rounded-[2rem] overflow-hidden group shadow-luxury hover:shadow-glow-lg cursor-pointer ${span}`}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="absolute inset-0 bg-accent-gold/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Image */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-luxury"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-10 translate-y-4 group-hover:translate-y-0">
                    <div className="inline-block px-3 py-1 bg-accent-gold/20 backdrop-blur-md text-accent-gold border border-accent-gold/30 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 w-fit">{item.category}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <div className="flex items-center text-sm text-primary-200 font-medium group-hover:text-accent-gold transition-colors">
                      <ZoomIn className="w-4 h-4 mr-1.5" />
                      <span>View Image</span>
                    </div>
                  </div>
                </motion.div>
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
