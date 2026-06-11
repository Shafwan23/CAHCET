import React from 'react';
import { motion } from 'framer-motion';

const FloatingParticles = ({ count = 15, color = "rgba(212, 175, 55, 0.2)" }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[1px]"
          style={{
            backgroundColor: color,
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.4, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
