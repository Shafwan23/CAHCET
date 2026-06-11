import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Container } from '../ui/Layout';

const Counter = ({ value, suffix = "", duration = 2 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, parseInt(value), { duration: duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, value, duration, count]);

  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>;
};

const StatsSection = ({ data }) => {
  const stats = data || [
    { label: 'Successful Placements', value: '95', suffix: '%', icon: '🎯' },
    { label: 'Expert Faculty', value: '250', suffix: '+', icon: '👨‍🏫' },
    { label: 'Companies Visited', value: '150', suffix: '+', icon: '🏢' },
    { label: 'Highest Package', value: '24', suffix: ' LPA', icon: '💰' },
  ];

  return (
    <section className="bg-primary-50 py-12">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-primary-200">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center px-4"
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium text-primary-600 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StatsSection;
