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
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs uppercase tracking-wider text-slate-700 bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-semibold">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
            >
              {Object.values(row).map((val, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
          const parsed = JSON.parse(sec.content);
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
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
              <a href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </a>
              <ChevronRight className="w-3 h-3" />
              <span>About</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary-600">Anti Ragging Policy</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 rounded-full bg-amber-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Zero Tolerance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Anti Ragging Policy
            </h1>

            <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
              CAHCET maintains a strict zero-tolerance policy towards ragging. We are committed to providing a safe and welcoming environment for all students.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          
          {/* ── INSTRUCTIONS ────────────────────────────────────────────────── */}
          <motion.section {...fadeUp(0)}>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900">Important Instructions</h2>
            </div>
            <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-6 md:p-8">
              <ul className="space-y-4">
                {data.instructions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 text-sm md:text-base leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* ── COMMITTEE TABLE ─────────────────────────────────────────────── */}
          <motion.section {...fadeUp(0.1)}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Anti Ragging Committee</h2>
            </div>
            <DataTable
              columns={['S.No.', 'Staff Name', 'Designation', 'Position', 'Contact No.']}
              data={formattedCommittee}
            />
          </motion.section>

          {/* ── SQUADS TABLE ────────────────────────────────────────────────── */}
          <motion.section {...fadeUp(0.2)}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Anti Ragging Squads</h2>
            </div>
            <DataTable
              columns={['S.No.', 'Staff Name', 'Designation', 'Position', 'Contact No.']}
              data={formattedSquads}
            />
          </motion.section>

          {/* ── OBJECTIVES & FUNCTIONS ──────────────────────────────────────── */}
          <motion.section {...fadeUp(0.3)} className="grid md:grid-cols-2 gap-8">
            {/* Objectives */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold text-slate-900">Objectives</h2>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                {data.objectives.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Functions */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold text-slate-900">Functions</h2>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                {data.functions.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── GENERAL COMMITTEE TABLE ─────────────────────────────────────── */}
          <motion.section {...fadeUp(0.4)}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">General Committee Members</h2>
            </div>
            <DataTable
              columns={['S.No.', 'Name & Designation', 'Position', 'Mobile']}
              data={formattedGeneral}
            />
          </motion.section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
