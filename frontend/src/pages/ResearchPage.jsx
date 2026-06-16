import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight, Download, ExternalLink, Globe, ZoomIn } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { functionalities, team, achievementsList, achievementGroups, stats as staticStats } from '../data/research.js';
import { cn } from '../utils/cn';
import { cmsService } from '../services/cmsService';
const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMilisecondDuraton = duration * 1000;
    let incrementTime = (totalMilisecondDuraton / end);

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

const ResearchPage = () => {
  const [cmsData, setCmsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await cmsService.getPage('research');
        const content = {};
        if (res.data && res.data.sections) {
          res.data.sections.forEach(sec => {
            const key = sec.sectionKey.replace('research.', '');
            try {
              content[key] = JSON.parse(sec.content);
            } catch {
              content[key] = sec.content;
            }
          });
        }
        setCmsData(content);
      } catch (err) {
        console.error("Failed to load research data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const statsArray = [
    { id: 1, label: 'Publications', value: parseInt(cmsData.stats?.publications) || 55, suffix: '+', desc: 'Peer-reviewed articles' },
    { id: 2, label: 'Patents Filed', value: parseInt(cmsData.stats?.patents) || 3, suffix: '+', desc: 'Intellectual properties' },
    { id: 3, label: 'Funding Proposals', value: parseInt(cmsData.stats?.grants?.replace(/[^0-9]/g, '')) || 14, suffix: '+', desc: 'Research funding' },
    { id: 4, label: 'Scholars', value: parseInt(cmsData.stats?.scholars) || 18, suffix: '+', desc: 'Active researchers' }
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-primary-50/30 flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1">
        {/* 1. Cinematic Hero Section (Dark & Immersive) */}
        <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden flex items-center bg-primary-950">
          {/* Animated Mesh Gradient & Particles */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
          </div>

          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-2 text-accent-gold text-sm font-bold tracking-widest uppercase mb-4">
                <span className="w-10 h-[2px] bg-accent-gold" />
                <span>Innovation & Discovery</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold">
                {cmsData.main?.title || cmsData.title || 'Research & Development'}
              </h1>
              <p className="text-xl text-primary-200 font-light max-w-2xl leading-relaxed whitespace-pre-wrap">
                {cmsData.main?.content || cmsData.content || 'Pushing the boundaries of knowledge, fostering innovation, and creating solutions for a better tomorrow.'}
              </p>
              
            </motion.div>
          </div>
        </section>

        {/* 2. Premium Research Statistics (Glassmorphism on Dark) */}
        <section className="relative z-20 py-20 bg-slate-50">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {statsArray.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-primary-50 rounded-[2rem] p-8 shadow-xl hover:shadow-[0_20px_40px_rgba(30,58,138,0.12)] flex flex-col justify-between h-48 group relative overflow-hidden border-2 border-slate-100 hover:border-primary-200 transition-all duration-500"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl group-hover:bg-accent-gold/20 transition-colors duration-500" />
                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl font-display font-extrabold text-primary-600 group-hover:text-primary-700 transition-colors duration-500 mb-2">
                      <Counter value={stat.value} />{stat.suffix}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">{stat.label}</h4>
                      <p className="text-xs text-slate-500 font-medium">{stat.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Functionalities of R&D Cell (Light background with popped glass cards) */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-primary-50/50" />
          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-2">
                <span className="w-10 h-[2px] bg-accent-gold" />
                <span>Core Activities</span>
                <span className="w-10 h-[2px] bg-accent-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900">Functionalities of R&D Cell</h2>
              <p className="text-primary-500 mt-2 font-light text-lg">Proactively managing and supporting research across all disciplines.</p>
            </div>

            <div className="flex flex-col gap-4 max-w-5xl mx-auto">
              {functionalities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-gradient-to-br from-white via-primary-50/50 to-accent-gold/5 hover:from-white hover:via-primary-50/80 hover:to-primary-100/30 p-8 rounded-[2rem] border-2 border-primary-100 shadow-xl hover:shadow-[0_20px_40px_rgba(30,58,138,0.12)] hover:border-primary-300 transition-all duration-500 flex gap-5 items-start group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-white border border-primary-100 flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all duration-300 text-primary-600 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="relative z-10 pt-2">
                      <p className="text-primary-950 font-bold leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Official Guidelines (Moved after Functionalities) */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="bg-gradient-to-br from-primary-950 to-primary-900 rounded-3xl p-10 md:p-16 text-white overflow-hidden relative shadow-luxury border border-white/5">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent-gold opacity-10 rounded-full blur-3xl" />
              <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl space-y-4">
                  <div className="text-accent-gold text-sm font-bold tracking-widest uppercase">Official Guidelines</div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white">Research & Innovation Policy</h3>
                  <p className="text-primary-200 text-lg font-light leading-relaxed">
                    Download our comprehensive policy document to understand the guidelines, ethics, and support systems available for researchers.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <a href="/pdf/RI-Policy-v1.pdf" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-4 border border-white/20 text-white rounded-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-sm">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Policy</span>
                  </a>
                  <a href="/pdf/RI-Policy-v1.pdf" download className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-4 bg-accent-gold text-primary-950 rounded-xl font-bold hover:bg-accent-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm border border-transparent">
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Sections (Replaces Achievements & Impact) */}
        {cmsData.sections && cmsData.sections.length > 0 && (
          <section className="py-32 space-y-32">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-2">
                <span className="w-10 h-[2px] bg-accent-gold" />
                <span>Focus Areas</span>
                <span className="w-10 h-[2px] bg-accent-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900">Research Sections</h2>
            </div>

            {cmsData.sections.map((sec, index) => {
              const isDark = index % 2 === 1;
              return (
                <div key={sec.id || index} className={cn(
                  "relative py-24",
                  isDark ? "bg-primary-950 text-white" : "bg-transparent"
                )}>
                  {isDark && (
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                  )}
                  
                  <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                    <div className={cn(
                      "flex flex-col gap-12 lg:gap-20 items-center",
                      index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                    )}>
                      {sec.images && sec.images.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full lg:w-1/2"
                        >
                          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
                            <img 
                              src={sec.images[0]} 
                              alt={sec.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-primary-950/10 group-hover:bg-primary-950/0 transition-colors duration-500" />
                          </div>
                        </motion.div>
                      )}

                      <motion.div 
                        initial={{ opacity: 0, x: index % 2 === 1 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full lg:w-1/2 space-y-6"
                      >
                        <h3 className={cn(
                          "text-3xl font-display font-bold",
                          isDark ? "text-white" : "text-primary-900"
                        )}>{sec.title}</h3>
                        <p className={cn(
                          "text-lg font-light leading-relaxed whitespace-pre-wrap",
                          isDark ? "text-primary-200" : "text-primary-600"
                        )}>{sec.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Labs & Publications Grid */}
        <section className="py-24 bg-slate-50 relative">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Labs */}
              {cmsData.labs && cmsData.labs.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-primary-900 mb-8">Research Laboratories</h2>
                  <div className="space-y-6">
                    {cmsData.labs.map((lab, idx) => (
                      <motion.div
                        key={lab.id || idx}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        whileHover={{ x: 10 }}
                        className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-primary-50 border-2 border-slate-100 p-8 rounded-3xl shadow-lg hover:shadow-[0_15px_30px_rgba(30,58,138,0.1)] hover:border-primary-300 transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary-400 to-accent-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                        <h3 className="text-2xl font-bold text-primary-950 group-hover:text-primary-600 transition-colors">{lab.name}</h3>
                        <p className="text-base text-slate-600 mt-3 leading-relaxed font-medium">{lab.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publications */}
              {cmsData.publications && cmsData.publications.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-primary-900 mb-8">Recent Publications</h2>
                  <div className="space-y-6">
                    {cmsData.publications.map((pub, idx) => (
                      <motion.div
                        key={pub.id || idx}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-white to-slate-50 hover:from-white hover:to-primary-50/60 border-2 border-slate-100 p-8 rounded-3xl shadow-lg hover:shadow-[0_20px_40px_rgba(30,58,138,0.1)] hover:border-primary-300 transition-all duration-300 flex flex-col group relative overflow-hidden"
                      >
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10">
                          <h3 className="text-xl font-bold text-primary-950 mb-2 leading-tight group-hover:text-primary-700 transition-colors">{pub.title}</h3>
                          <p className="text-sm text-slate-500 font-medium mb-4">By {pub.authors}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-primary-600 uppercase tracking-widest mb-6">
                            <span className="bg-primary-50 px-3 py-1 rounded-full">{pub.journal}</span>
                            <span className="w-1.5 h-1.5 bg-primary-300 rounded-full" />
                            <span className="bg-primary-50 px-3 py-1 rounded-full">{pub.year}</span>
                          </div>
                          {pub.link && (
                            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 px-5 py-2.5 rounded-xl transition-colors uppercase tracking-wider w-fit shadow-md group-hover:shadow-lg">
                              <ExternalLink className="w-4 h-4" />
                              Read Paper
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* Industry Collaborations */}
        {cmsData.collaborations && cmsData.collaborations.length > 0 && (
          <section className="py-24 relative overflow-hidden bg-primary-900 text-white">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-16">Industry & Academic Collaborations</h2>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {cmsData.collaborations.map((collab, idx) => (
                  <motion.div
                    key={collab.id || idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center gap-4 max-w-[200px]"
                  >
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-3 shadow-xl overflow-hidden group">
                      {collab.logoUrl ? (
                        <img src={collab.logoUrl} alt={collab.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                      ) : (
                        <Globe className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-lg mb-1">{collab.name}</h4>
                      <p className="text-xs text-primary-200 font-light leading-snug">{collab.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}



        {/* 6. Institute-Level R&I Team Structure (Popped grid with separation) */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-primary-50/50" />
          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-2">
                <span className="w-10 h-[2px] bg-accent-gold" />
                <span>Leadership</span>
                <span className="w-10 h-[2px] bg-accent-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900">R&I Team Structure</h2>
              <p className="text-primary-500 mt-2 font-light text-lg">The minds driving innovation and research strategy.</p>
            </div>

            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              {team.map((member, index) => {
                const Icon = member.icon;
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ x: 10, scale: 1.01 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-primary-300 hover:shadow-[0_15px_30px_rgba(30,58,138,0.08)] transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary-400 to-accent-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary-600 text-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-slate-100">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{member.name}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">{member.designation}, {member.department}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:text-right w-full sm:w-auto border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                      <h4 className="text-xs font-bold text-primary-600 bg-primary-50 border border-primary-100 px-4 py-2 rounded-full uppercase tracking-widest inline-block">{member.role}</h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Achievements Showcase */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-primary-600 text-xs font-bold tracking-widest uppercase mb-2">
                <span className="w-10 h-[2px] bg-primary-600" />
                <span>Impact</span>
                <span className="w-10 h-[2px] bg-primary-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-950">Research, Development & Innovation Achievements</h2>
              <p className="text-slate-600 mt-2 font-medium text-lg">Key milestones and success stories of our vibrant research ecosystem.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(30,58,138,0.08)] relative overflow-hidden border border-slate-100">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-gold/10 to-transparent rounded-full blur-3xl" />
              
              <ul className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {achievementsList.map((achievement, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="flex gap-5 items-start group p-5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-white flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 group-hover:text-white text-primary-600 shadow-sm transition-all duration-500 border border-primary-100 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-primary-600/30">
                      <span className="text-lg font-bold font-display">{idx + 1}</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed group-hover:text-primary-950 transition-colors flex-1 pt-1">{achievement}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ResearchPage;
