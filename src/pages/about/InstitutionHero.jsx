import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cmsService } from '../../services/cmsService';

const InstitutionHero = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const heroSection = sections.find(s => s.sectionKey === 'about.hero');
        if (heroSection) {
          setData(JSON.parse(heroSection.content));
        }
      } catch (err) {
        console.error('Failed to load about hero:', err);
      }
    };
    fetchCMS();
  }, []);

  const content = data || {
    title: 'Nurturing Excellence, <br />Empowering Futures',
    subtitle: 'Discover the legacy, values, and vision of C. Abdul Hakeem College of Engineering and Technology.',
    bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1986&q=80'
  };
  return (
    <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      {/* Background Image with Parallax effect (simulated via scale) */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img 
          src={content.bannerUrl} 
          alt="College Campus" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/60 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 container mx-auto px-4 md:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 text-accent-gold text-sm font-bold tracking-widest uppercase mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span>About Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: content.title }}>
          </h1>
          <p className="text-xl text-primary-100 font-light">
            {content.subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default InstitutionHero;
