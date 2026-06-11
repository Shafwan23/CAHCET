import React from 'react';
import { motion } from 'framer-motion';
import { refundPolicyData } from '../../data/refundPolicy';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, FileText, Info, Building2, Mail, Phone, Clock, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function RefundPolicyPage() {
  const data = refundPolicyData;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* ── CINEMATIC HEADER ──────────────────────────────────────────────── */}
        <header className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white rounded-b-[2.5rem] shadow-xl z-10 mb-12 text-center">
          {/* Geometric structural circles/effects */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <div className="absolute -left-16 -top-16 w-64 h-64 border border-white rounded-full" />
            <div className="absolute right-10 bottom-5 w-80 h-80 border border-white/40 rounded-full" />
            <div className="absolute left-1/3 top-10 w-96 h-96 border border-white/20 rounded-full" />
          </div>
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px]" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-350 mb-6">
              <a href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </a>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span>About</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="text-accent-gold">Refund Policy</span>
            </nav>

            <div className="inline-flex items-center gap-2 text-accent-gold text-xs font-bold uppercase tracking-wider mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
              <span>Institutional Policies</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Refund Policy
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">
              Clear and transparent guidelines regarding fee refunds at CAHCET.
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          
          {/* ── 1. GENERAL GUIDELINES ───────────────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">General Guidelines</h2>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  {data.guidelines}
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── 2. REFUND POLICY TABLE ─────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full bg-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Fee Refund Structure</h2>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs uppercase tracking-wider text-slate-700 bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-bold">Fee Type</th>
                      <th scope="col" className="px-6 py-4 font-bold">Refund Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.table.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{row.feeType}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            row.policy === 'Non-refundable'
                              ? 'bg-primary-50 text-amber-600 border border-primary-100'
                              : 'bg-primary-50 text-primary-600 border border-primary-100'
                          }`}>
                            {row.policy}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── 3. ACADEMIC FEE REFUND CONTACT ─────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="bg-primary-950 text-white rounded-2xl p-6 md:p-8 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 rounded-full bg-accent-gold" />
                <h2 className="text-xl font-bold text-white">For Academic Fee Refunds</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-primary-300 uppercase tracking-wider font-bold mb-1">Location</p>
                    <p className="text-sm text-white font-light">{data.contact.office}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-primary-300 uppercase tracking-wider font-bold mb-1">Email</p>
                    <a href={`mailto:${data.contact.email}`} className="text-sm text-white font-light hover:text-accent-gold transition-colors">{data.contact.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-primary-300 uppercase tracking-wider font-bold mb-1">Phone</p>
                    <a href={`tel:${data.contact.phone}`} className="text-sm text-white font-light hover:text-accent-gold transition-colors">{data.contact.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-primary-300 uppercase tracking-wider font-bold mb-1">Working Hours</p>
                    <p className="text-sm text-white font-light">{data.contact.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── 4. REFUND PROCESS STEPS ───────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full bg-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Refund Process</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.process.map((step, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.1)}
                  className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <span className="text-3xl font-extrabold text-slate-100 group-hover:text-primary-50 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── 5. SPECIAL CIRCUMSTANCES ──────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full bg-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Special Circumstances</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {data.specialCircumstances.map((item, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.1)}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── 6. NON-REFUNDABLE ITEMS ──────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full bg-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Non-Refundable Items</h2>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {data.nonRefundableItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 7. NEED CLARIFICATION ─────────────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="text-center max-w-2xl mx-auto bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary-600 mx-auto mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Need Clarification?</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-light mb-6">
              For any queries regarding the refund policy, please contact:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium">
              <a href={`mailto:${data.support.email}`} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
                <Mail className="w-4 h-4" /> {data.support.email}
              </a>
              <span className="text-slate-300 hidden sm:block">|</span>
              <a href={`tel:${data.support.phone}`} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
                <Phone className="w-4 h-4" /> {data.support.phone}
              </a>
            </div>
          </motion.section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
