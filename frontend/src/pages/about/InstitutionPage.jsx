import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const DEFAULT_STORY_SECTIONS = [
  {
    id: 1,
    title: 'A Legacy of Excellence',
    text: 'Founded with a vision to empower minds and transform futures, our institution has been at the forefront of technical education for over two decades. We combine rigorous academics with a vibrant campus culture to create an environment where students can thrive.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756defe12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    align: 'left'
  },
  {
    id: 2,
    title: 'Innovative Learning Spaces',
    text: 'Our campus features state-of-the-art laboratories, modern classrooms, and collaborative spaces designed to foster innovation and creativity. We believe that the right environment plays a crucial role in shaping the learning experience.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    align: 'right'
  }
];

const InstitutionPage = () => {
  const [data, setData] = useState({
    college: { title: 'An Education That Inspires', overview: 'C. Abdul Hakeem College of Engineering and Technology is more than just a place of learning. It is a community where ideas are born, leaders are forged, and futures are shaped. We are dedicated to providing a transformative educational experience.' },
    history: { sections: DEFAULT_STORY_SECTIONS },
    parentOrg: { title: 'Melvisharam Muslim Educational Society', description: 'Founded in 1918, MMES has been a pioneer in education for over a century. The society is dedicated to raising the standard of education in the region and providing opportunities for all sections of society to excel in various fields.', shortName: 'MMES', since: 'Since 1918' }
  });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const newState = { ...data };
        
        const collegeSec = sections.find(s => s.sectionKey === 'about.college');
        if (collegeSec) newState.college = JSON.parse(collegeSec.content);
        
        const historySec = sections.find(s => s.sectionKey === 'about.history');
        if (historySec) newState.history = JSON.parse(historySec.content);
        
        const parentOrgSec = sections.find(s => s.sectionKey === 'about.parentOrganization');
        if (parentOrgSec) newState.parentOrg = JSON.parse(parentOrgSec.content);
        
        setData(newState);
      } catch (err) {
        console.error('Failed to load institution data:', err);
      }
    };
    fetchCMS();
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* 1. About College Editorial Content */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span>Institution</span>
            <span className="w-10 h-[2px] bg-accent-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6 leading-tight">
            {data.college.title}
          </h2>
          <p className="text-xl text-primary-600 leading-relaxed font-light max-w-3xl mx-auto">
            {data.college.overview}
          </p>
        </motion.div>
      </section>

      {/* 2. Premium Image/Content Storytelling Sections */}
      <section className="space-y-32">
        {data.history.sections?.map((section, index) => (
          <div key={section.id || index} className="relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
              <div className={cn(
                "flex flex-col gap-12 lg:gap-20 items-center",
                section.align === 'right' ? "lg:flex-row-reverse" : "lg:flex-row"
              )}>
                {/* Image Block */}
                <motion.div 
                  initial={{ opacity: 0, x: section.align === 'right' ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                    <img 
                      src={section.image} 
                      alt={section.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-primary-950/10 group-hover:bg-primary-950/0 transition-colors duration-500" />
                  </div>
                </motion.div>

                {/* Text Block */}
                <motion.div 
                  initial={{ opacity: 0, x: section.align === 'right' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full lg:w-1/2 space-y-6"
                >
                  <div className="text-accent-gold text-sm font-bold tracking-widest uppercase">
                    Section 0{section.id}
                  </div>
                  <h3 className="text-3xl font-display font-bold text-primary-900">{section.title}</h3>
                  <p className="text-primary-600 text-lg leading-relaxed font-light">{section.text}</p>
                  <button className="flex items-center text-primary-900 font-bold hover:text-accent-gold transition-colors group text-sm">
                    <span>Read More</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Parent Organization Section */}
      <section className="container mx-auto px-4 md:px-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary-950 rounded-3xl p-10 md:p-16 text-white overflow-hidden relative shadow-luxury"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent-gold opacity-10 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/30">
                Parent Organization
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white">{data.parentOrg.title}</h3>
              <p className="text-primary-200 text-lg leading-relaxed font-light">
                {data.parentOrg.description}
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-500 cursor-pointer group">
                <div className="text-center">
                  <span className="text-white font-display font-bold text-3xl block mb-1 group-hover:text-accent-gold transition-colors">{data.parentOrg.shortName}</span>
                  <span className="text-primary-400 text-xs tracking-widest uppercase">{data.parentOrg.since}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

// Helper function for classNames (if not imported)
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default InstitutionPage;
