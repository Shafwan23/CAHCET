import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useScroll as useScrollHook } from '../../hooks/useScroll';
import FloatingParticles from '../ui/FloatingParticles';

// Asset imports for optimized loading
import campusVideo from '../../assets/videos/hero-campus-video.mp4';
import campusVideoMV from '../../assets/videos/heroViideoMV.mp4';

const HeroVideoSection = ({ data }) => {
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const y1 = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, isMobile ? 1 : 1.1]);
  const scrolled = useScrollHook(50);

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-primary-950">
      {/* Background Video Layer with Parallax & Zoom */}
      <motion.div 
        style={{ y: y1, scale }}
        className="absolute inset-0 z-0"
      >
        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-transparent to-primary-950/80 z-10" />
        <div className="absolute inset-0 bg-primary-950/20 z-10" />
        
        {/* Mobile Video (portrait-optimized) */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="block md:hidden w-full h-full object-cover object-center pointer-events-none"
          poster="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800"
        >
          <source src={campusVideoMV} type="video/mp4" />
        </video>

        {/* Desktop Video (landscape) */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="hidden md:block w-full h-full object-cover object-center pointer-events-none"
          poster="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000"
        >
          <source src={campusVideo} type="video/mp4" />
          {/* Fallback image */}
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000" 
            alt="University Campus"
            className="w-full h-full object-cover"
          />
        </video>
      </motion.div>

      {/* Floating Particles for Atmospheric Depth */}
      <FloatingParticles count={20} color="rgba(212, 175, 55, 0.15)" />

      {/* Text Overlay Removed per User Request */}

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Discover</span>
        <ChevronDown className="text-accent-gold w-6 h-6" />
      </motion.div>
    </section>
  );
};

export default HeroVideoSection;
