import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

const DepartmentNotFound = () => {
  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-3xl text-center shadow-2xl"
      >
        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
          <AlertCircle className="w-12 h-12 text-amber-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Department Not Found
        </h1>
        
        <p className="text-primary-200 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The department page you are looking for does not exist, has been moved, or is currently under construction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 py-4 px-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          <a href="/">
            <Button variant="accent" className="w-full sm:w-auto py-4 px-8">
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default DepartmentNotFound;
