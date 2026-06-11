import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, Cpu, Briefcase, Atom, Compass, ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const TOPICS = [
  { 
    id: 'creativity', 
    title: 'Creativity', 
    icon: Lightbulb, 
    desc: 'Fostering out-of-the-box thinking and creative problem solving in every discipline. We encourage students to question norms and explore unconventional solutions.',
    color: 'bg-amber-500/10 text-amber-500'
  },
  { 
    id: 'innovation', 
    title: 'Innovation', 
    icon: Zap, 
    desc: 'Encouraging students to develop new ideas, products, and solutions for real-world challenges. Our innovation cell provides the resources to turn ideas into reality.',
    color: 'bg-blue-500/10 text-blue-500'
  },
  { 
    id: 'practical', 
    title: 'Practical Learning', 
    icon: Cpu, 
    desc: 'Hands-on experience in state-of-the-art labs and workshops to bridge theory and practice. We believe in learning by doing.',
    color: 'bg-amber-500/10 text-amber-500'
  },
  { 
    id: 'industry', 
    title: 'Industry Exposure', 
    icon: Briefcase, 
    desc: 'Regular industrial visits, internships, and guest lectures from industry experts. We ensure our students are industry-ready from day one.',
    color: 'bg-primary-500/10 text-primary-500'
  },
  { 
    id: 'research', 
    title: 'Research-Oriented', 
    icon: Atom, 
    desc: 'Promoting research culture and inquiry-based learning from the undergraduate level. Students are encouraged to publish papers and participate in projects.',
    color: 'bg-amber-500/10 text-amber-500'
  },
  { 
    id: 'skill', 
    title: 'Skill Development', 
    icon: Compass, 
    desc: 'Soft skills, coding bootcamps, and value-added courses to ensure career readiness. We focus on holistic development.',
    color: 'bg-cyan-500/10 text-cyan-500'
  },
];

const TeachingMethodologyPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await cmsService.getPage('academics');
        const section = pageData?.sections?.find(s => s.sectionKey === 'academics.teachingMethodology');
        if (section && section.content) {
          setData(section.content);
        }
      } catch (error) {
        console.error('Error fetching teaching methodology:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-950">
        <div className="w-16 h-16 border-4 border-primary-800 border-t-accent-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const methods = data?.methods || TOPICS; // Fallback to topics if methods not loaded
  
  // Icon mapping helper
  const iconMap = { Lightbulb, Zap, Cpu, Briefcase, Atom, Compass };
  const getIcon = (iconName) => iconMap[iconName] || Lightbulb;

  return (
    <div className="pb-32">
      {/* Header */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl text-center pt-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span>Academics</span>
            <span className="w-10 h-[2px] bg-accent-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">{data?.title || 'Our Educational Pedagogy'}</h1>
          <p className="text-xl text-primary-600 leading-relaxed font-light max-w-3xl mx-auto">
            {data?.content || 'We believe in a holistic, industry-aligned pedagogy that prepares students for the future. Our approach is designed to foster critical thinking, innovation, and practical skills.'}
          </p>
        </motion.div>
      </section>

      {/* Large Content Blocks */}
      <section className="container mx-auto px-4 md:px-8 max-w-7xl space-y-12">
        {methods.map((topic, index) => {
          const Icon = typeof topic.icon === 'string' ? getIcon(topic.icon) : topic.icon;
          const colors = [
            'bg-amber-500/10 text-amber-500',
            'bg-blue-500/10 text-blue-500',
            'bg-primary-500/10 text-primary-500',
            'bg-cyan-500/10 text-cyan-500',
          ];
          const color = topic.color || colors[index % colors.length];
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-primary-100 rounded-3xl p-8 md:p-12 shadow-luxury hover:shadow-luxury-hover transition-all duration-500 group flex flex-col md:flex-row items-center gap-8 md:gap-12 hover:-translate-y-1"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shrink-0 ${color} group-hover:scale-105 transition-transform duration-500`}>
                <Icon className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="text-accent-gold text-xs font-bold uppercase tracking-widest">Method 0{index + 1}</div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-900 group-hover:text-accent-gold transition-colors">{topic.title}</h3>
                <p className="text-primary-600 text-lg font-light leading-relaxed">{topic.description || topic.desc}</p>
                <div className="flex items-center text-sm font-bold text-primary-400 group-hover:text-accent-gold transition-colors pt-2">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
};

export default TeachingMethodologyPage;
