import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Rocket, Globe, Lightbulb } from 'lucide-react';
import { Section, Container } from '../ui/Layout';
import { slideUp, staggerContainer } from '../../animations/variants';

const ResearchSection = () => {
  const initiatives = [
    {
      title: 'Innovation Lab',
      desc: 'Focused on AI, IoT, and Robotics research projects.',
      icon: Microscope,
      stats: '40+ Active Projects'
    },
    {
      title: 'Startup Incubator',
      desc: 'Nurturing student entrepreneurs with funding and mentorship.',
      icon: Rocket,
      stats: '12 Startups Funded'
    },
    {
      title: 'Global Research',
      desc: 'Partnerships with international universities for R&D.',
      icon: Globe,
      stats: '150+ Publications'
    },
    {
      title: 'Patent Cell',
      desc: 'Dedicated cell for filing and managing intellectual property.',
      icon: Lightbulb,
      stats: '25 Patents Filed'
    }
  ];

  return (
    <Section id="research" className="bg-primary-50">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">Innovation & Impact</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-8 leading-tight">
              Driving the Future through <span className="text-accent-gold">Cutting-Edge Research</span>
            </h2>
            <p className="text-lg text-primary-600 mb-8 leading-relaxed">
              At CAHCET, research is not just about publications; it's about solving real-world problems. Our research ecosystem is designed to inspire students and faculty to push the boundaries of technology.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="bg-white px-4 py-2 rounded-lg border border-primary-100 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-gold rounded-full" />
                <span className="text-primary-900 font-bold text-sm">DST-FIST Sponsored</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-primary-100 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-gold rounded-full" />
                <span className="text-primary-900 font-bold text-sm">AICTE-IDEA Lab</span>
              </div>
            </div>
            <button className="btn-primary">Learn More About Research</button>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {initiatives.map((item, idx) => (
              <motion.div
                key={idx}
                variants={slideUp}
                className="bg-white p-8 rounded-2xl shadow-sm border border-primary-100 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-900 transition-colors">
                  <item.icon className="text-primary-900 w-6 h-6 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-primary-900 mb-2">{item.title}</h4>
                <p className="text-primary-500 text-sm mb-4">{item.desc}</p>
                <div className="text-accent-gold font-bold text-sm">{item.stats}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default ResearchSection;
