import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  containerClassName, 
  placeholderColor = "bg-primary-900/10", 
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state if src changes
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Luxury Shimmer/Skeleton */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-shimmer",
          placeholderColor
        )}
        style={{ backdropFilter: 'blur(20px)' }}
      />

      {/* Actual Image */}
      {!error ? (
        <motion.img
          src={src}
          alt={alt}
          sizes={sizes}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setError(true);
            setIsLoaded(true);
          }}
          initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
            scale: isLoaded ? 1 : 1.05
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn("w-full h-full object-cover relative z-10 will-change-transform", className)}
          loading="lazy"
          decoding="async"
          {...props}
        />
      ) : (
        <div className={cn("absolute inset-0 flex items-center justify-center text-primary-400 text-xs z-10", placeholderColor)}>
          Image unavailable
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
