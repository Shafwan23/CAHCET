import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const DEFAULT_STORY_SECTIONS = [
  {
    id: 1,
    title: 'About the Institution',
    text: 'A well-established and well-organized College of Engineering is the desired destination of vast majority of students. One such role model of a college is located at a distance of 100 kms from Anna International Airport, Chennai and at 4 kms from Arcot, the capital of Nawabs who ruled one-fourth of South India. Right from the year of its inception, the college is consistently producing scores of first class graduates, scores of graduates with high distinction and graduates with University Rank or other academic credentials.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756defe12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    align: 'left'
  }
];

const InstitutionPage = () => {
  const [data, setData] = useState({
    college: { title: 'An Education That Inspires', overview: 'C. Abdul Hakeem College of Engineering and Technology is more than just a place of learning. It is a community where ideas are born, leaders are forged, and futures are shaped. We are dedicated to providing a transformative educational experience.' },
    history: { sections: DEFAULT_STORY_SECTIONS },
    parentOrg: { 
      title: 'Melvisharam Muslim Educational Society (MMES) – Estd. in 1918', 
      description: `The fabulous jewel of Madras Presidency, Nawab C. Abdul Hakeem Saheb, one of the best respected natives of Melvisharam, was Prince among traders and one time Sheriff of Madras. He cherished a golden dream of transforming his town into a splendid seat of great learning to cater to the educational needs of youth. Like the winds that have no barriers of caste or community, the Nawab’s munificence lighted the lamp of joy and contentment in several poverty-ridden families. His colorful dreams have all been realized by the Melvisharam Muslim Educational Society founded in 1918 that strove hard to metamorphose Primary, Secondary and Higher Education into splendid segments of prestine enlightenment irrespective of caste, creed, community or social status. The work continues even now with redoubled zeal and rejuvenating spirit, with student ́s progress and welfare as ultimate goals. The MMES manages and maintains the following prominent institutions.

C. Abdul Hakeem College of Engineering and Technology
C.Abdul Hakeem College of Arts and Science (Autonomous) (for Men) (Re-Accredited by NAAC with B++ Grade)
M.M.E.S Women s Arts & Science College
Islamiah Boys Higher Secondary School
Islamiah Girls Higher Secondary School
Islamiah Primary School for Boys
Islamiah Primary School for Girls
Hakeem Matriculation School
F.M. Primary School
R.A. Primary School
Madarasa -e- Umar
MMES Public School(CBSE)`, 
      shortName: 'MMES', 
      since: 'Since 1918' 
    }
  });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const newState = { ...data };
        
        const collegeSec = sections.find(s => s.sectionKey === 'about.college');
        if (collegeSec) try { if(collegeSec && collegeSec.content) { let _p = {}; try { if(collegeSec && collegeSec.content) { _p = JSON.parse(collegeSec.content); } } catch(e){} if (Object.keys(_p).length) newState.college = _p; } } catch(e) {}
        
        const historySec = sections.find(s => s.sectionKey === 'about.history');
        if (historySec) try { if(historySec && historySec.content) { let _p = {}; try { if(historySec && historySec.content) { _p = JSON.parse(historySec.content); } } catch(e){} if (Object.keys(_p).length) newState.history = _p; } } catch(e) {}
        
        const parentOrgSec = sections.find(s => s.sectionKey === 'about.parentOrganization');
        if (parentOrgSec) try { if(parentOrgSec && parentOrgSec.content) { let _p = {}; try { if(parentOrgSec && parentOrgSec.content) { _p = JSON.parse(parentOrgSec.content); } } catch(e){} if (Object.keys(_p).length) newState.parentOrg = _p; } } catch(e) {}
        
        setData(newState);
      } catch (err) {
        console.error('Failed to load institution data:', err);
      }
    };
    fetchCMS();
  }, []);

  return (
    <div className="pb-32 bg-slate-100 min-h-screen">
      {/* Spectacular Premium Header */}
      <div className="relative w-full overflow-hidden bg-primary-950 mb-24 rounded-b-[3rem] shadow-2xl">
        {/* Animated Background Mesh & Orbs */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          
          {/* Animated Glowing Orbs */}
          <motion.div 
            animate={{ 
              x: [0, 100, -50, 0],
              y: [0, -50, 100, 0],
              scale: [1, 1.2, 0.8, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-accent-gold/20 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 50, 0],
              y: [0, 100, -50, 0],
              scale: [1, 0.8, 1.2, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]"
          />
          <motion.div 
            animate={{ 
              x: [0, 50, -100, 0],
              y: [0, 50, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute -bottom-40 right-1/3 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px]"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center justify-center text-center min-h-[40vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex flex-col items-center p-8 md:p-12 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
          >
            <div className="inline-block px-4 py-1.5 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/30 mb-6">
              Our Legacy
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6 tracking-tight drop-shadow-lg">
              About the Institution
            </h1>
            <p className="text-primary-200 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
              Discover the history, philosophy, and visionary foundation that drives our excellence in engineering education.
            </p>
          </motion.div>
        </div>
        
        {/* Bottom decorative divider */}
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
      </div>

      {/* 2. Premium Image/Content Storytelling Sections */}
      <div className="w-full flex flex-col">
        {data.history.sections?.map((section, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={section.id || index} className={`py-20 md:py-32 relative overflow-hidden ${isEven ? 'bg-white' : 'bg-slate-100'}`}>
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
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] group">
                      <div className="absolute inset-0 border border-primary-100 rounded-3xl z-10 opacity-50 pointer-events-none" />
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
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full lg:w-1/2 space-y-6 bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 p-8 md:p-12 rounded-[2rem] shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] border-2 border-primary-100 relative"
                  >
                    <div className="absolute top-0 left-10 w-16 h-1.5 bg-gradient-to-r from-accent-gold to-yellow-300 rounded-b-full" />
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-900">{section.title}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed font-light">{section.text}</p>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* 3. Parent Organization Section */}
      <section className="container mx-auto px-4 md:px-8 max-w-7xl pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 rounded-[2.5rem] p-8 md:p-16 relative shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] border-2 border-primary-100"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/20">
                Parent Organization
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-primary-900">{data.parentOrg.title}</h3>
              
              {data.parentOrg.description && (
                <div className="text-slate-600 text-lg leading-relaxed">
                  {data.parentOrg.description.split('\n\n').map((part, idx) => {
                    if (idx === 0) return <p key={idx} className="mb-8">{part}</p>;
                    
                    const listItems = part.split('\n').filter(Boolean);
                    return (
                      <ul key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 bg-slate-100 p-6 rounded-2xl border border-slate-100">
                        {listItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-accent-gold rounded-full mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                            <span className="text-slate-700 font-medium text-sm md:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors duration-500 cursor-pointer group">
                <div className="text-center">
                  <span className="text-primary-900 font-display font-bold text-3xl block mb-1 group-hover:text-accent-gold transition-colors">{data.parentOrg.shortName}</span>
                  <span className="text-primary-600 text-xs tracking-widest uppercase">{data.parentOrg.since}</span>
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
