import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { valuesPhilosophyData } from '../../data/valuesPhilosophy';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, Quote, CheckCircle2, Target } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

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
          const m = JSON.parse(missionSec.content);
          // Restore icon components from strings if possible, though they might not be easily restored.
          // In the data file, they are actual Lucide icons. For now, we will map them by name.
          newState.mission = m;
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

      <main className="flex-1 pt-20">
        {/* ── COMPACT HEADER ──────────────────────────────────────────────── */}
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4">
              <a href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </a>
              <ChevronRight className="w-3 h-3" />
              <span>About</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary-600">Values & Philosophy</span>
            </nav>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 rounded-full bg-primary-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Institutional Ethos</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Values & Philosophy
            </h1>

            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Discover the core principles, vision, and educational philosophy that guide CAHCET.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          
          {/* ── VISION ────────────────────────────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="relative">
            <div className="absolute -top-10 -left-10 text-slate-100 text-[120px] font-serif leading-none select-none">“</div>
            <div className="relative bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-3">{data.vision.title}</p>
              <p className="text-xl md:text-2xl font-light text-slate-700 leading-relaxed mb-6">
                {data.vision.statement}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-6 h-px bg-slate-200" />
                <span>{data.vision.author}</span>
              </div>
            </div>
          </motion.section>

          {/* ── MISSION ───────────────────────────────────────────────────── */}
          <section>
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">{data.mission.title}</p>
              <h2 className="text-2xl font-bold text-slate-900">Our Strategic Objectives</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {data.mission.statements.map((item, i) => {
                // If icon is a string, we might want to map it to an actual component if needed,
                // but since we only have the component reference in valuesPhilosophyData,
                // we'll just fall back to a default or skip rendering icon if it's a string that we can't map here easily.
                // For simplicity, we just use the original icon from valuesPhilosophyData if item.icon is string
                let Icon = item.icon;
                if (typeof Icon === 'string') {
                  const origItem = valuesPhilosophyData.mission.statements.find(s => s.id === item.id);
                  Icon = origItem ? origItem.icon : Target;
                }
                
                return (
                  <motion.div
                    key={item.id}
                    {...fadeUp(i * 0.1)}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-primary-100 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                      {Icon && <Icon className="w-5 h-5 text-primary-600" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── QUALITY POLICY ────────────────────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="bg-primary-950 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-3">{data.qualityPolicy.title}</p>
                <p className="text-lg font-light text-primary-100 leading-relaxed">
                  {data.qualityPolicy.content}
                </p>
              </div>
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">Key Focus Areas</p>
                <ul className="space-y-3">
                  {data.qualityPolicy.focusAreas.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-primary-200">
                      <CheckCircle2 className="w-4 h-4 text-accent-gold mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* ── CORE VALUES ───────────────────────────────────────────────── */}
          <section>
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">Our Pillars</p>
              <h2 className="text-2xl font-bold text-slate-900">Core Values</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {data.coreValues.map((val, i) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.title}
                    {...fadeUp(i * 0.05)}
                    className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{val.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── PHILOSOPHY ────────────────────────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">{data.philosophy.title}</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Nurturing Excellence</h2>
              <div className="space-y-4 text-sm text-slate-500 leading-relaxed font-light">
                {data.philosophy.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1523050874726-83616d02d535?auto=format&fit=crop&w=800&q=80" // College library/campus image
                alt="Educational Philosophy"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.section>

          {/* ── STUDENT CENTRIC ───────────────────────────────────────────── */}
          <section>
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">Approach</p>
              <h2 className="text-2xl font-bold text-slate-900">Student-Centric Learning</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {data.studentCentric.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    {...fadeUp(i * 0.1)}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── ETHICS ────────────────────────────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">{data.ethics.title}</p>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              {data.ethics.content}
            </p>
          </motion.section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
