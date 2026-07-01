import React from 'react';
import { motion } from 'framer-motion';

const SuspenseLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-primary-950 flex flex-col items-center justify-center min-h-screen w-full">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 mb-8 rounded-full border-4 border-accent-gold/20 border-t-accent-gold animate-spin shadow-[0_0_30px_rgba(212,175,55,0.3)]"
      />
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-accent-gold font-display font-semibold tracking-[0.2em] uppercase text-sm"
      >
        Loading...
      </motion.div>
    </div>
  );
};

export default SuspenseLoader;
