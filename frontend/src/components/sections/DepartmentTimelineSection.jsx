import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Container } from '../ui/Layout';
import { cn } from '../../utils/cn';

const TimelineItem = ({ dept, index }) => {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { margin: "-40% 0px -40% 0px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={itemRef} className="relative w-full pb-32 md:pb-48 last:pb-0 group">
      
      {/* Timeline Node/Dot */}
      <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-20">
        <motion.div 
          animate={{
            scale: isInView ? 1.5 : 1,
            backgroundColor: isInView ? '#F59E0B' : '#0f172a',
            borderColor: isInView ? '#F59E0B' : '#ffffff20',
            boxShadow: isInView ? '0 0 30px 5px rgba(245, 158, 11, 0.4)' : '0 0 0px 0px rgba(245, 158, 11, 0)'
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-4 h-4 rounded-full border-2 transition-colors duration-500"
        />
      </div>

      <div className={cn(
        "flex flex-col md:flex-row items-center gap-12 md:gap-24 w-full relative z-10 pl-12 md:pl-0",
        !isEven && "md:flex-row-reverse"
      )}>
        
        {/* Content Panel */}
        <motion.div 
          initial={{ opacity: 0, x: isEven ? 50 : -50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "w-full md:w-1/2",
            isEven ? "md:pr-16 text-left" : "md:pl-16 md:text-right"
          )}
        >
          <div className="relative p-8 md:p-0 rounded-3xl md:bg-transparent bg-white/5 md:border-none border border-white/10 backdrop-blur-sm md:backdrop-blur-none">
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 leading-tight">
              {dept.title}
            </h3>
            <p className="text-accent-gold font-bold tracking-[0.2em] text-sm mb-6 uppercase">
              {dept.abbr}
            </p>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 font-light">
              {dept.description}
            </p>
            
            <div className={cn(
              "flex flex-wrap gap-3 mb-10",
              !isEven && "md:justify-end"
            )}>
              {dept.highlights.map((highlight, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 text-sm font-medium backdrop-blur-md shadow-lg"
                >
                  {highlight}
                </span>
              ))}
            </div>

            <a 
              href={dept.link}
              className="inline-flex items-center gap-2 text-white font-bold group/btn relative py-3 px-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-gold/50 transition-all duration-300 backdrop-blur-md"
            >
              <span className="relative z-10 group-hover/btn:text-accent-gold transition-colors duration-300">Explore Department</span>
              <ChevronRight className="w-5 h-5 transform group-hover/btn:translate-x-1 group-hover/btn:text-accent-gold transition-all duration-300" />
            </a>
          </div>
        </motion.div>

        {/* Cinematic Image Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[16/10] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 group-hover:border-white/20 transition-colors duration-500">
            {/* Ambient Image Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent z-10" />
            <motion.div
              animate={{ scale: isInView ? 1.05 : 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full"
            >
              <img 
                src={dept.image} 
                alt={dept.title} 
                className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-[2000ms] ease-out"
                loading="lazy"
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const DepartmentTimelineSection = ({ title, data }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  return (
    <div ref={containerRef} className="py-32 relative bg-primary-950 text-white overflow-hidden">
      
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-32 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white mb-6">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-gold/0 via-accent-gold to-accent-gold/0 mx-auto" />
        </motion.div>

        <div className="relative w-full max-w-7xl mx-auto">
          {/* Animated Sticky Timeline Background Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 rounded-full overflow-hidden z-0">
            {/* Fill Line */}
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent-gold to-accent-gold shadow-[0_0_15px_rgba(245,158,11,1)] origin-top"
              style={{ scaleY: scrollYProgress }}
            />
          </div>

          <div className="relative z-10 w-full">
            {data.map((dept, index) => (
              <TimelineItem key={dept.id} dept={dept} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DepartmentTimelineSection;
