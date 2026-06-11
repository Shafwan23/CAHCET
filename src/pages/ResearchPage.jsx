import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight, Download, ExternalLink, Globe, ZoomIn } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { functionalities, team, achievementGroups, stats as staticStats } from '../data/research.js';
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
    { id: 1, label: 'Publications', value: parseInt(cmsData.stats?.publications) || 0, suffix: '+', desc: 'Peer-reviewed articles' },
    { id: 2, label: 'Patents Filed', value: parseInt(cmsData.stats?.patents) || 0, suffix: '+', desc: 'Intellectual properties' },
    { id: 3, label: 'Grants', value: parseInt(cmsData.stats?.grants?.replace(/[^0-9]/g, '')) || 5, suffix: ' Cr+', desc: 'Research funding' },
    { id: 4, label: 'Scholars', value: parseInt(cmsData.stats?.scholars) || 0, suffix: '+', desc: 'Active researchers' }
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
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-accent-gold/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary-500/10 rounded-full blur-[80px]" />
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
              
              <div className="mt-8 flex gap-4">
                <button className="px-6 py-3 bg-accent-gold text-primary-950 rounded-full font-bold hover:bg-white transition-colors text-sm shadow-lg shadow-accent-gold/20">
                  Explore Research
                </button>
                <button className="px-6 py-3 border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-colors text-sm">
                  View Publications
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Premium Research Statistics (Glassmorphism on Dark) */}
        <section className="relative z-20 -mt-24">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {statsArray.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-between h-44 hover:-translate-y-1 group transition-all duration-300"
                >
                  <div className="text-4xl font-display font-bold text-accent-gold group-hover:text-white transition-colors">
                    <Counter value={stat.value} />{stat.suffix}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{stat.label}</h4>
                    <p className="text-xs text-primary-300">{stat.desc}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {functionalities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-primary-100 shadow-luxury hover:shadow-luxury-hover transition-all duration-500 flex gap-4 items-start group hover:-translate-y-1 hover:border-accent-gold/20"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-accent-gold/20 group-hover:text-accent-gold transition-colors text-primary-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-primary-900 font-medium leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                );
              })}
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
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group hover:border-accent-gold/40"
                      >
                        <h3 className="text-xl font-bold text-primary-950 group-hover:text-accent-gold transition-colors">{lab.name}</h3>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{lab.description}</p>
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
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
                      >
                        <h3 className="text-lg font-bold text-primary-950 mb-1">{pub.title}</h3>
                        <p className="text-sm text-gray-600 font-medium mb-3">By {pub.authors}</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                          <span>{pub.journal}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{pub.year}</span>
                        </div>
                        {pub.link && (
                          <a href={pub.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Read Paper
                          </a>
                        )}
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

        {/* 5. Research & Innovation Policy (Dark Banner with Glow) */}
        <section className="py-32">
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
                  <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-4 border border-white/20 text-white rounded-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-sm">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Policy</span>
                  </button>
                  <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-4 bg-accent-gold text-primary-950 rounded-xl font-bold hover:bg-accent-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm border border-transparent">
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => {
                const Icon = member.icon;
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white p-8 rounded-2xl border border-primary-100 shadow-luxury hover:shadow-luxury-hover transition-all duration-500 flex flex-col justify-between h-72 hover:-translate-y-1 group hover:border-accent-gold/20"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-accent-gold/20 group-hover:text-accent-gold transition-colors text-primary-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-1">{member.role}</h4>
                      <h3 className="text-xl font-bold text-primary-900 group-hover:text-accent-gold transition-colors">{member.name}</h3>
                      <p className="text-sm text-primary-500 mt-1">{member.designation}, {member.department}</p>
                    </div>
                    <div className="text-sm text-primary-400 font-bold group-hover:text-primary-900 transition-colors flex items-center gap-1 cursor-pointer pt-4 border-t border-primary-50">
                      <span>Contact Coordinator</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Smart India Hackathon Showcase (Dark Cinematic Spotlight) */}
        <section className="py-32 bg-primary-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[100px]" />
          
          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-2">
                <span className="w-10 h-[2px] bg-accent-gold" />
                <span>Flagship Achievement</span>
                <span className="w-10 h-[2px] bg-accent-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Smart India Hackathon 2025</h2>
              <p className="text-primary-300 mt-2 font-light text-lg">Proud of our student innovators reaching the national finals.</p>
            </div>

            <div className="relative h-[65vh] min-h-[450px] rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1504384308090-c564bd248275?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Hackathon" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/50 to-transparent flex flex-col justify-end p-8 md:p-12">
                <div className="text-accent-gold text-sm font-bold uppercase tracking-widest mb-2">National Finalists</div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">IIT Kharagpur & Dharwad</h3>
                <p className="text-primary-100 font-light max-w-2xl text-lg mb-6">
                  Our teams demonstrated exceptional problem-solving skills and technical expertise to secure spots in the prestigious finals at two premier locations.
                </p>
                <div className="flex items-center text-sm font-bold text-white group-hover:text-accent-gold transition-colors cursor-pointer">
                  <span>View Project Details</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ResearchPage;
