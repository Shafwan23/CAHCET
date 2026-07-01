import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { governingCouncilData } from '../../data/governingCouncil';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, User, Shield, Briefcase, GraduationCap } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function GoverningCouncilPage() {
  const [data, setData] = useState({ members: governingCouncilData });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const sec = sections.find(s => s.sectionKey === 'about.governing_policy');
        if (sec) {
          let parsed = {}; try { if(sec && sec.content) { parsed = JSON.parse(sec.content); } } catch(e){}
          if (parsed.members && parsed.members.length > 0) {
            setData({ members: parsed.members });
          }
        }
      } catch (err) {
        console.error('Failed to load Governing Council CMS data:', err);
      }
    };
    fetchCMS();
  }, []);

  const membersList = (data.members || []).map((m, idx) => ({
    sno: idx + 1,
    name: m.name || '',
    qualification: m.qualification || '',
    designation: m.designation || '',
    position: m.position || '',
    category: m.category || 'Member',
    photoUrl: m.photoUrl || ''
  }));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── SPECTACULAR HEADER ──────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-primary-950 mb-16 shadow-2xl rounded-b-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-900 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute -top-20 -right-20 w-full sm:w-96 h-96 bg-accent-gold/20 rounded-full blur-[100px]" />
          <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 relative z-10 text-center flex flex-col items-center">
            <div className="inline-block px-4 py-1.5 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/30 mb-6">
              Leadership
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6 tracking-tight drop-shadow-lg">
              Governing Council
            </h1>
            <p className="text-primary-200 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
              Meet the distinguished members of our governing council who provide strategic direction and oversight.
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
        </section>

        <div className="w-full flex flex-col">
          
          {/* ── COUNCIL MEMBERS GRID ────────────────────────────────────────── */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {membersList.map((member) => (
                  <motion.div
                    key={member.sno}
                    variants={itemAnim}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="group relative bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-8 shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10 group-hover:bg-primary-50 transition-colors duration-500" />
                    <div className="absolute -inset-px bg-gradient-to-br from-primary-50/50 to-white opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />

                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors overflow-hidden shadow-sm group-hover:scale-105 duration-300">
                        {member.photoUrl ? (
                          <img loading="lazy" decoding="async" src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-full group-hover:border-primary-200 transition-colors">
                        {String(member.sno).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="mb-6 flex-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors mb-2">
                        {member.name}
                      </h3>
                      {member.qualification && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium tracking-wide">
                          <GraduationCap className="w-4 h-4 text-accent-gold" />
                          <span>{member.qualification}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                        <Briefcase className="w-4 h-4 mt-1 text-slate-400 flex-shrink-0" />
                        <p>{member.designation}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 group-hover:border-primary-100 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-bold text-slate-800">{member.position}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                        {member.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── NOTE ──────────────────────────────────────────────────────── */}
          <section className="py-20 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-primary-50 via-slate-50 to-primary-50 border border-primary-100/50 rounded-[2rem] p-8 md:p-12 text-center text-sm text-primary-900/60 font-medium max-w-3xl mx-auto shadow-inner">
                <p className="text-lg">The governing council meets regularly to review and guide the institution's strategic progress.</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
