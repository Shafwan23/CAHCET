import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { valuesPhilosophyData } from '../../data/valuesPhilosophy';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, Quote, CheckCircle2, Target, Shield, Star, Lightbulb, Users, Heart, Award } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const iconMap = { Shield, Star, Lightbulb, Users, Heart, Target, Award };
const getIcon = (iconName, fallback) => {
  if (!iconName) return fallback;
  if (typeof iconName !== 'string') return iconName;
  return iconMap[iconName] || fallback;
};

export default function ValuesPhilosophyPage() {
  const [data, setData] = useState(valuesPhilosophyData);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const newState = { ...data };
        
        const visionSec = sections.find(s => s.sectionKey === 'about.vision');
        if (visionSec) newState.vision = JSON.parse(visionSec.content);
        
        const missionSec = sections.find(s => s.sectionKey === 'about.mission');
        if (missionSec) {
          newState.mission = JSON.parse(missionSec.content);
        }

        const valuesSec = sections.find(s => s.sectionKey === 'about.values');
        if (valuesSec) {
          const v = JSON.parse(valuesSec.content);
          if (v.qualityPolicy) newState.qualityPolicy = v.qualityPolicy;
          if (v.coreValues) newState.coreValues = v.coreValues;
          if (v.philosophy) newState.philosophy = v.philosophy;
          if (v.studentCentric) newState.studentCentric = v.studentCentric;
          if (v.ethics) newState.ethics = v.ethics;
        }
        
        setData(newState);
      } catch (err) {
        console.error('Failed to load CMS data:', err);
      }
    };
    fetchCMS();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── SPECTACULAR HEADER ──────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-primary-950 mb-16 shadow-2xl rounded-b-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent-gold/20 rounded-full blur-[100px]" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 relative z-10 text-center flex flex-col items-center">
            <div className="inline-block px-4 py-1.5 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/30 mb-6">
              Institutional Ethos
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6 tracking-tight drop-shadow-lg">
              Values & Philosophy
            </h1>
            <p className="text-primary-200 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
              Discover the core principles, vision, and educational philosophy that guide CAHCET.
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
        </section>

        <div className="w-full">
          
          {/* ── VISION ────────────────────────────────────────────────────── */}
          <section className="bg-white py-24 border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0)} className="relative max-w-4xl mx-auto">
                <div className="absolute -top-16 -left-8 text-primary-100 text-[180px] font-serif leading-none select-none opacity-50 z-0">“</div>
                <div className="relative z-10 bg-white border border-slate-100 rounded-[2rem] p-10 md:p-16 shadow-xl shadow-slate-200/50">
                  <div className="w-16 h-1.5 bg-accent-gold rounded-full mb-8" />
                  <p className="text-sm font-bold uppercase tracking-widest text-accent-gold mb-6">{data.vision.title}</p>
                  <p className="text-2xl md:text-3xl font-display font-light text-primary-900 leading-relaxed mb-8 italic">
                    "{data.vision.statement}"
                  </p>
                  <div className="flex items-center gap-4 text-base font-bold text-slate-400 uppercase tracking-wider">
                    <div className="w-12 h-px bg-slate-300" />
                    <span>{data.vision.author}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── MISSION ───────────────────────────────────────────────────── */}
          <section className="bg-slate-100 py-24 border-b border-slate-200/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-sm font-bold uppercase tracking-widest text-accent-gold mb-3">{data.mission.title}</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">Our Strategic Objectives</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {data.mission.statements.map((item, i) => {
                  const Icon = getIcon(item.icon, Target);
                  
                  return (
                    <motion.div
                      key={item.id || i}
                      whileHover={{ y: -10, scale: 1.03 }}
                      className="group bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-8 hover:border-accent-gold/50 shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-[100px] -z-10 group-hover:bg-accent-gold/5 transition-colors duration-500" />
                      <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm">
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <h3 className="text-xl font-bold text-primary-900 mb-3 group-hover:text-primary-700 transition-colors">{item.title}</h3>
                      <p className="text-base text-slate-500 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── QUALITY POLICY ────────────────────────────────────────────── */}
          <section className="bg-white py-24 border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0)} className="bg-primary-950 text-white rounded-[3rem] p-10 md:p-16 overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent-gold opacity-20 rounded-full blur-3xl" />
                <div className="relative z-10 grid lg:grid-cols-5 gap-12 items-center">
                  <div className="lg:col-span-3 space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/30">
                      {data.qualityPolicy.title}
                    </div>
                    <p className="text-xl md:text-2xl font-light text-primary-100 leading-relaxed">
                      {data.qualityPolicy.content}
                    </p>
                  </div>
                  <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-accent-gold mb-6">Key Focus Areas</p>
                    <ul className="space-y-4">
                      {data.qualityPolicy.focusAreas.map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-base text-primary-100 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-accent-gold mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── CORE VALUES ───────────────────────────────────────────────── */}
          <section className="bg-slate-100/50 py-24 border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">Our Pillars</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Core Values</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {data.coreValues.map((val, i) => {
                  const Icon = getIcon(val.icon, Shield);
                  return (
                    <motion.div
                      key={val.title}
                      whileHover={{ y: -10, scale: 1.05 }}
                      className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-3xl shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300"
                    >
                      <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                        <Icon className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{val.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── PHILOSOPHY ────────────────────────────────────────────────── */}
          <section className="bg-white py-24 border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0)} className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-accent-gold mb-3">{data.philosophy.title}</p>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-6">Nurturing Excellence</h2>
                  </div>
                  <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
                    {data.philosophy.content.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200/50 group">
                  <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-primary-900/0 transition-colors duration-500 z-10" />
                  <img
                    src="/images/Main_CAHCET.jpg"
                    alt="Educational Philosophy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── STUDENT CENTRIC ───────────────────────────────────────────── */}
          <section className="bg-slate-100 py-24 border-b border-slate-200/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">Approach</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Student-Centric Learning</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {data.studentCentric.map((item, i) => {
                  const Icon = getIcon(item.icon, Users);
                  return (
                    <motion.div
                      key={item.title}
                      {...fadeUp(i * 0.1)}
                      whileHover={{ y: -10, scale: 1.05 }}
                      className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] border-2 border-primary-100 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white border border-primary-100 flex items-center justify-center mb-6 shadow-sm">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── ETHICS ────────────────────────────────────────────────────── */}
          <section className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0)} className="text-center max-w-4xl mx-auto bg-slate-100 rounded-[3rem] p-12 md:p-20 shadow-inner border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-[80px]" />
                <div className="relative z-10">
                  <p className="text-sm font-bold uppercase tracking-widest text-primary-600 mb-6">{data.ethics.title}</p>
                  <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light italic">
                    "{data.ethics.content}"
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
