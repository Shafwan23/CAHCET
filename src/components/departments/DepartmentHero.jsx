import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { departmentAnimations } from '../../animations/departmentAnimations';
import FloatingParticles from '../ui/FloatingParticles';

const DepartmentHero = ({ data }) => {
  if (!data) return null;

  return (
    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10">
      {/* Animated Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={data.backgroundImage} 
            alt={data.title}
            className="w-full h-full object-cover opacity-30"
          />
        </motion.div>
        
        {/* Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
        
        {/* Animated Accent Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
      </div>

      <FloatingParticles count={25} color="rgba(212, 175, 55, 0.25)" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-5xl">
          {/* Breadcrumb Navigation */}
          <motion.div 
            variants={departmentAnimations.fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 text-primary-200 text-xs md:text-sm mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md uppercase tracking-widest font-bold"
          >
            <a href="/" className="hover:text-accent-gold transition-colors flex items-center gap-1">
              <Home className="w-3 h-3 md:w-4 md:h-4" />
              Home
            </a>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
            <span className="opacity-80">Departments</span>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
            <span className="text-accent-gold">{data.title}</span>
          </motion.div>

          {/* Hero Content */}
          <motion.h1 
            variants={departmentAnimations.fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight"
          >
            {data.title}
          </motion.h1>
          
          <motion.p 
            variants={departmentAnimations.fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-xl md:text-3xl text-primary-200 font-light border-l-4 border-accent-gold pl-6 py-2 leading-relaxed max-w-3xl"
          >
            {data.tagline}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentHero;
