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
          setData(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
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
    <div className="pb-32 bg-primary-50 min-h-screen">
      {/* Premium Parallax Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-[2px] bg-accent-gold" />
              <span>Academics</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold mb-6 leading-tight tracking-tight">
              {data?.title || 'Our Educational Pedagogy'}
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 font-light leading-relaxed border-l-4 border-accent-gold pl-6">
              {data?.content || 'We believe in a holistic, industry-aligned pedagogy that prepares students for the future. Our approach is designed to foster critical thinking, innovation, and practical skills.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Large Content Blocks */}
      <section className="container mx-auto px-4 md:px-8 max-w-7xl space-y-12">
        {methods.map((topic, index) => {
          const Icon = typeof topic.icon === 'string' ? getIcon(topic.icon) : topic.icon;
          const colors = [
            'bg-amber-500/10 text-amber-500 border-amber-500/20',
            'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'bg-primary-500/10 text-primary-500 border-primary-500/20',
            'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
          ];
          const color = topic.color ? `${topic.color} border-current/20` : colors[index % colors.length];
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-8 md:p-12 shadow-luxury hover:shadow-glow-lg transition-all duration-700 group flex flex-col md:flex-row items-center gap-8 md:gap-12 hover:-translate-y-2 overflow-hidden z-10"
            >
              {/* Sweeping Shimmer Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/80 to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50/50 -z-10" />
              
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-[2rem] flex items-center justify-center shrink-0 border shadow-inner ${color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-10 bg-white/50 backdrop-blur-sm`}>
                <Icon className="w-12 h-12 md:w-14 md:h-14 drop-shadow-sm" />
              </div>
              <div className="space-y-4 flex-1 relative z-10">
                <div className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/20 shadow-sm">
                  Method 0{index + 1}
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-900 group-hover:to-accent-gold transition-all duration-500">
                  {topic.title}
                </h3>
                <p className="text-primary-600 text-lg font-medium leading-relaxed max-w-4xl">{topic.description || topic.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-900 via-accent-gold to-primary-900 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-[length:200%_auto] animate-[shimmer_2s_linear_infinite]" />
            </motion.div>
          );
        })}
      </section>
    </div>
  );
};

export default TeachingMethodologyPage;
