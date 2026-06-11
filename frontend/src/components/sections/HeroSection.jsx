import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { Container } from '../ui/Layout';
import { slideUp, fadeIn } from '../../animations/variants';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-primary-950">
      {/* Background Image with Zoom */}
      <motion.div 
        style={{ y: y1, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/40 to-primary-950/90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000" 
          alt="University Campus"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Floating Particles Placeholder (Simulated with simple dots for performance) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute bg-accent-gold/20 w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <Container className="relative z-20 text-center text-white">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mb-6"
        >
          <span className="inline-block py-1 px-4 rounded-full border border-accent-gold/30 bg-accent-gold/10 text-accent-gold text-xs font-bold tracking-widest uppercase">
            ESTD 1998 • NAAC A+ ACCREDITED
          </span>
        </motion.div>

        <motion.h1
          variants={slideUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8"
        >
          Empowering <span className="text-accent-gold">Future</span> <br className="hidden md:block" /> 
          Innovators Through Excellence
        </motion.h1>

        <motion.p
          variants={slideUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-10 leading-relaxed"
        >
          Join a community of researchers, engineers, and visionaries shaping 
          the next generation of global technological advancements.
        </motion.p>

        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          custom={0.8}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            variant="accent" 
            className="min-w-[180px] group"
            onClick={() => window.location.href = '/admissions/registration-2026#apply-process'}
          >
            Apply Now 2026
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" className="min-w-[180px] border-white text-white hover:bg-white hover:text-primary-950">
            Explore Campus
          </Button>
        </motion.div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <ChevronDown className="text-white/50 w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
