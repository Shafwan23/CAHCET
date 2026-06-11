import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';
import { departmentAnimations } from '../../animations/departmentAnimations';

const PremiumEmptyState = ({ 
  title = "No Data Available", 
  message = "We are currently updating this section. Please check back later.",
  icon: Icon = FileQuestion
}) => {
  return (
    <motion.div 
      variants={departmentAnimations.fadeUp}
      initial="hidden"
      animate="visible"
      className="w-full py-16 md:py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-primary-100 shadow-luxury"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent-gold/20 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100 text-primary-400">
          <Icon className="w-10 h-10" />
        </div>
      </div>
      <h3 className="font-display font-bold text-2xl text-primary-900 mb-2">{title}</h3>
      <p className="text-primary-500 max-w-sm mx-auto">{message}</p>
    </motion.div>
  );
};

export default PremiumEmptyState;
