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
          const parsed = JSON.parse(sec.content);
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* ── COMPACT HEADER ──────────────────────────────────────────────── */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4">
              <a href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </a>
              <ChevronRight className="w-3 h-3" />
              <span>About</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary-600">Governing Council</span>
            </nav>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 rounded-full bg-primary-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Leadership</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Governing Council
            </h1>

            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Meet the distinguished members of our governing council who provide strategic direction and oversight.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* ── COUNCIL MEMBERS LIST ────────────────────────────────────────── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {membersList.map((member) => (
              <motion.div
                key={member.sno}
                variants={itemAnim}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-px bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-500 opacity-0 group-hover:opacity-100" />

                <div className="relative z-10 grid md:grid-cols-12 gap-4 items-center">
                  
                  {/* S.No & Avatar fallback */}
                  <div className="md:col-span-1 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-primary-400 transition-colors">
                      {String(member.sno).padStart(2, '0')}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors overflow-hidden">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Name & Qualification */}
                  <div className="md:col-span-4">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                      {member.name}
                    </h3>
                    {member.qualification && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{member.qualification}</span>
                      </div>
                    )}
                  </div>

                  {/* Designation */}
                  <div className="md:col-span-4">
                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                      <Briefcase className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                      <p className="leading-relaxed">{member.designation}</p>
                    </div>
                  </div>

                  {/* Position & Category */}
                  <div className="md:col-span-3 flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary-500" />
                      <span className="text-xs font-bold text-slate-700">{member.position}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-full">
                      {member.category}
                    </span>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── NOTE ──────────────────────────────────────────────────────── */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400 font-medium max-w-2xl mx-auto mt-12">
            The governing council meets regularly to review and guide the institution's progress.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
