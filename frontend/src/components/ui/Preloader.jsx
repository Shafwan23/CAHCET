import React from 'react';
import { motion } from 'framer-motion';
import logoImg from '../../assets/images/logo.jfif';

const Preloader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 bg-primary-950 flex flex-col items-center justify-center z-[100] overflow-hidden"
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-4">
            <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
          </div>
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-accent-gold/20 blur-xl rounded-full -z-10" />
        </motion.div>

        {/* Text Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-white font-display font-bold text-3xl tracking-widest mb-2"
        >
          CAHCET
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/50 text-xs uppercase tracking-[0.4em] font-medium"
        >
          Engineering Excellence
        </motion.p>

        {/* Elegant Loading Indicator */}
        <div className="mt-12 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-accent-gold"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
