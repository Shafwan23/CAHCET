import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { antiRaggingData } from '../../data/antiRagging';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, Scale, Shield, AlertTriangle } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

// ── Reusable Table Component ─────────────────────────────────────────────────
function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-[2rem] border-2 border-primary-100 shadow-xl bg-gradient-to-br from-white to-primary-50 p-2 mt-8">
      <div className="w-full overflow-x-auto">
<table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs uppercase tracking-wider text-primary-900 bg-primary-100/50 border-b-2 border-primary-100">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-5 font-bold whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: rowIndex * 0.05 }}
              whileHover={{ scale: 1.01, backgroundColor: '#f0f9ff' }}
              key={rowIndex}
              className="bg-white border-b border-primary-50 last:border-b-0 hover:shadow-md transition-all duration-300 relative z-10"
            >
              {Object.values(row).map((val, cellIndex) => (
                <td key={cellIndex} className="px-6 py-5 font-medium text-slate-800">{val}</td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
</div>
    </div>
  );
}

export default function AntiRaggingPage() {
  const [data, setData] = useState(antiRaggingData);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const sec = sections.find(s => s.sectionKey === 'about.anti_ragging');
        if (sec) {
          let parsed = {}; try { if(sec && sec.content) { parsed = JSON.parse(sec.content); } } catch(e){}
          setData(prev => ({
            ...prev,
            committee: parsed.committee || prev.committee,
            squads: parsed.squads || prev.squads,
            generalCommittee: parsed.members || parsed.generalCommittee || prev.generalCommittee
          }));
        }
      } catch (err) {
        console.error('Failed to load Anti Ragging CMS data:', err);
      }
    };
    fetchCMS();
  }, []);

  const formattedCommittee = (data.committee || []).map((item, idx) => ({
    sno: idx + 1,
    name: item.name || '',
    designation: item.department ? `${item.designation} (${item.department})` : (item.designation || ''),
    position: item.role || item.position || '',
    contact: item.phone || item.contact || ''
  }));

  const formattedSquads = (data.squads || []).map((item, idx) => ({
    sno: idx + 1,
    name: item.name || '',
    designation: item.department ? `${item.designation} (${item.department})` : (item.designation || ''),
    position: item.role || item.position || '',
    contact: item.phone || item.contact || ''
  }));

  const formattedGeneral = (data.generalCommittee || []).map((item, idx) => ({
    sno: idx + 1,
    name: item.name || '',
    position: item.role || item.position || '',
    mobile: item.phone || item.mobile || ''
  }));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── SPECTACULAR HEADER ──────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-primary-950 mb-16 shadow-2xl rounded-b-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-900 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute -top-20 -right-20 w-full sm:w-96 h-96 bg-amber-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 relative z-10 text-center flex flex-col items-center">
            <div className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full border border-amber-500/30 mb-6">
              Zero Tolerance
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6 tracking-tight drop-shadow-lg">
              Anti Ragging Policy
            </h1>
            <p className="text-primary-200 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
              CAHCET maintains a strict zero-tolerance policy towards ragging. We are committed to providing a safe and welcoming environment for all students.
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        </section>

        <div className="w-full flex flex-col">
          
          {/* ── INSTRUCTIONS ────────────────────────────────────────────────── */}
          <section className="py-20 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0)}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">Important Instructions</h2>
                </div>
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
                  <ul className="space-y-6">
                    {data.instructions.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-700 text-base leading-relaxed group">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                        <span className="group-hover:text-slate-900 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── COMMITTEE TABLE ─────────────────────────────────────────────── */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0.1)}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">Anti Ragging Committee</h2>
                </div>
                <DataTable
                  columns={['S.No.', 'Staff Name', 'Designation', 'Position', 'Contact No.']}
                  data={formattedCommittee}
                />
              </motion.div>
            </div>
          </section>

          {/* ── SQUADS TABLE ────────────────────────────────────────────────── */}
          <section className="py-20 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0.2)}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">Anti Ragging Squads</h2>
                </div>
                <DataTable
                  columns={['S.No.', 'Staff Name', 'Designation', 'Position', 'Contact No.']}
                  data={formattedSquads}
                />
              </motion.div>
            </div>
          </section>

          {/* ── OBJECTIVES & FUNCTIONS ──────────────────────────────────────── */}
          <section className="py-20 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0.3)} className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Objectives */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10" />
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <Scale className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Objectives</h2>
                  </div>
                  <motion.div whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-8 md:p-10 space-y-6 shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300">
                    {data.objectives.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 text-slate-600 text-base leading-relaxed">
                        <div className="w-2 h-2 rounded-full bg-primary-600 mt-2.5 flex-shrink-0" />
                        <p>{item}</p>
                      </div>
                    ))}
                    </motion.div>
                </div>

                {/* Functions */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-l from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10" />
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <Scale className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Functions</h2>
                  </div>
                  <motion.div whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-8 md:p-10 space-y-6 shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300">
                    {data.functions.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 text-slate-600 text-base leading-relaxed">
                        <div className="w-2 h-2 rounded-full bg-primary-600 mt-2.5 flex-shrink-0" />
                        <p>{item}</p>
                      </div>
                    ))}
                    </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── GENERAL COMMITTEE TABLE ─────────────────────────────────────── */}
          <section className="py-20 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp(0.4)}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-slate-900">General Committee Members</h2>
                </div>
                <DataTable
                  columns={['S.No.', 'Name & Designation', 'Position', 'Mobile']}
                  data={formattedGeneral}
                />
              </motion.div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
