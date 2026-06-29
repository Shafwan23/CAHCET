import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { refundPolicyData } from '../../data/refundPolicy';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, FileText, Info, Building2, Mail, Phone, Clock, CheckCircle2, AlertTriangle, HelpCircle, RefreshCw } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function RefundPolicyPage() {
  const [data, setData] = useState(refundPolicyData);
  const [cmsContent, setCmsContent] = useState(null);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const sec = sections.find(s => s.sectionKey === 'about.refund_policy');
        if (sec) {
          let parsed = {}; try { if(sec && sec.content) { parsed = JSON.parse(sec.content) || {}; } } catch(e){}
          setData(prev => ({
            ...prev,
            contact: {
              ...prev.contact,
              office: parsed.officeAddress || prev.contact.office,
              email: parsed.email || prev.contact.email,
              phone: parsed.phone || prev.contact.phone
            },
            support: {
              ...prev.support,
              email: parsed.email || prev.support.email,
              phone: parsed.phone || prev.support.phone
            }
          }));

          if (parsed.content) {
            setCmsContent(parsed.content);
          }
        }
      } catch (err) {
        console.error('Failed to load Refund Policy CMS data:', err);
      }
    };
    fetchCMS();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
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

        <div className="w-full flex flex-col">
          {cmsContent ? (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 w-full">
              <div 
                className="prose prose-slate prose-lg max-w-none bg-white border border-slate-100 rounded-[3rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-700 leading-relaxed font-light refund-policy-content"
                dangerouslySetInnerHTML={{ __html: cmsContent }}
              />

              {/* ── 3. ACADEMIC FEE REFUND CONTACT ─────────────────────────────── */}
              <motion.section {...fadeUp(0)} className="bg-primary-950 text-white rounded-[2rem] p-10 md:p-12 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-8 rounded-full bg-accent-gold" />
                    <h2 className="text-3xl font-display font-bold text-white">For Academic Fee Refunds</h2>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent-gold backdrop-blur-sm">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-primary-300 uppercase tracking-wider font-bold mb-1">Location</p>
                        <a href="https://maps.app.goo.gl/88DFCxj4PDQGCSNm9" target="_blank" rel="noopener noreferrer" className="text-sm text-white font-light hover:text-accent-gold transition-colors block">
                          {data.contact.office}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent-gold backdrop-blur-sm">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-primary-300 uppercase tracking-wider font-bold mb-1">Email</p>
                        <a href={`mailto:${data.contact.email}`} className="text-sm text-white font-light hover:text-accent-gold transition-colors">{data.contact.email}</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent-gold backdrop-blur-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-primary-300 uppercase tracking-wider font-bold mb-1">Phone</p>
                        <a href={`tel:${data.contact.phone}`} className="text-sm text-white font-light hover:text-accent-gold transition-colors">{data.contact.phone}</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent-gold backdrop-blur-sm">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-primary-300 uppercase tracking-wider font-bold mb-1">Working Hours</p>
                        <p className="text-sm text-white font-light">{data.contact.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {/* ── 1. GENERAL GUIDELINES ───────────────────────────────────────── */}
              <section className="py-20 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.section {...fadeUp(0)}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                        <Info className="w-6 h-6" />
                      </div>
                      <h2 className="text-3xl font-display font-bold text-slate-900">General Guidelines</h2>
                    </div>
                    <div className="bg-gradient-to-br from-white via-primary-50/30 to-accent-gold/5 border-2 border-primary-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-accent-gold to-primary-600" />
                      <p className="text-lg text-slate-700 leading-relaxed font-medium">
                        {data.guidelines}
                      </p>
                    </div>
                  </motion.section>
                </div>
              </section>

              {/* ── 2. REFUND POLICY TABLE ─────────────────────────────────────── */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Fee Refund Structure</h2>
                  </div>

                  <div className="bg-gradient-to-br from-white to-primary-50 border-2 border-primary-100 rounded-[2rem] overflow-hidden shadow-xl p-2">
                    <div className="overflow-x-auto rounded-2xl">
                      <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs uppercase tracking-wider text-primary-900 bg-primary-100/50 border-b-2 border-primary-100">
                          <tr>
                            <th scope="col" className="px-6 py-5 font-bold">Fee Type</th>
                            <th scope="col" className="px-6 py-5 font-bold">Refund Policy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.table.map((row, i) => (
                            <motion.tr
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              whileHover={{ scale: 1.01, backgroundColor: '#f0f9ff' }}
                              key={i} 
                              className="bg-white border-b border-primary-50 hover:shadow-md transition-all duration-300 relative z-10 cursor-pointer"
                            >
                              <td className="px-6 py-5 font-medium text-slate-800 text-base">{row.feeType}</td>
                              <td className="px-6 py-5">
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm ${
                                  row.policy === 'Non-refundable'
                                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                    : 'bg-primary-100 text-primary-700 border border-primary-200'
                                }`}>
                                  {row.policy}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 3. ACADEMIC FEE REFUND CONTACT ─────────────────────────────── */}
              <section className="py-20 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.section {...fadeUp(0)} className="bg-primary-950 text-white rounded-[2rem] p-10 md:p-12 overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-2 h-8 rounded-full bg-accent-gold" />
                        <h2 className="text-3xl font-display font-bold text-white">For Academic Fee Refunds</h2>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent-gold backdrop-blur-sm border border-white/10">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs text-primary-300 uppercase tracking-widest font-bold mb-1">Location</p>
                            <a href="https://maps.app.goo.gl/88DFCxj4PDQGCSNm9" target="_blank" rel="noopener noreferrer" className="text-sm text-white font-light hover:text-accent-gold transition-colors block">
                              {data.contact.office}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent-gold backdrop-blur-sm border border-white/10">
                            <Mail className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs text-primary-300 uppercase tracking-widest font-bold mb-1">Email</p>
                            <a href={`mailto:${data.contact.email}`} className="text-sm text-white font-light hover:text-accent-gold transition-colors">{data.contact.email}</a>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent-gold backdrop-blur-sm border border-white/10">
                            <Phone className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs text-primary-300 uppercase tracking-widest font-bold mb-1">Phone</p>
                            <a href={`tel:${data.contact.phone}`} className="text-sm text-white font-light hover:text-accent-gold transition-colors">{data.contact.phone}</a>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent-gold backdrop-blur-sm border border-white/10">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs text-primary-300 uppercase tracking-widest font-bold mb-1">Working Hours</p>
                            <p className="text-sm text-white font-light">{data.contact.hours}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                </div>
              </section>

              {/* ── 4. REFUND PROCESS STEPS ───────────────────────────────────── */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Refund Process</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.process.map((step, i) => (
                      <motion.div
                        key={i}
                        {...fadeUp(i * 0.1)}
                        whileHover={{ y: -10, scale: 1.05 }}
                        className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-8 flex flex-col justify-between gap-6 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 group"
                      >
                        <span className="text-6xl font-display font-extrabold text-primary-200 group-hover:text-primary-500 transition-colors drop-shadow-sm">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-base text-slate-600 leading-relaxed font-light">
                          {step}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 5. SPECIAL CIRCUMSTANCES ──────────────────────────────────── */}
              <section className="py-20 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Special Circumstances</h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    {data.specialCircumstances.map((item, i) => (
                      <motion.div
                        key={i}
                        {...fadeUp(i * 0.1)}
                        whileHover={{ y: -10, scale: 1.05 }}
                        className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-8 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] flex flex-col gap-4 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-primary-50 flex items-center justify-center text-primary-600 transition-colors shadow-sm">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-light">
                          {item.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 6. NON-REFUNDABLE ITEMS ──────────────────────────────────── */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Non-Refundable Items</h2>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-2 border-amber-200 rounded-[2.5rem] p-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-[80px]" />
                    {data.nonRefundableItems.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5, scale: 1.05 }}
                        key={i} 
                        className="flex flex-col items-center justify-center text-center gap-4 text-base bg-white p-6 rounded-2xl shadow-lg border-2 border-amber-100 hover:border-amber-400 hover:shadow-[0_15px_40px_rgba(245,158,11,0.2)] transition-all duration-300 z-10"
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-amber-600" />
                        </div>
                        <span className="font-bold text-slate-800">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 7. NEED CLARIFICATION ─────────────────────────────────────── */}
              <section className="py-20 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.section {...fadeUp(0)} className="text-center max-w-4xl mx-auto bg-gradient-to-br from-primary-950 to-primary-900 border border-primary-800 rounded-[3rem] p-16 shadow-2xl relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-accent-gold mx-auto mb-8 shadow-inner border border-white/20">
                        <HelpCircle className="w-10 h-10" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Need Clarification?</h2>
                      <p className="text-lg text-primary-200 leading-relaxed font-light mb-10 max-w-2xl mx-auto">
                        For any queries regarding the refund policy, please contact our administrative office:
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-base font-bold">
                        <a href={`mailto:${data.support.email}`} className="flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-primary-600/50 hover:-translate-y-1">
                          <Mail className="w-5 h-5" /> {data.support.email}
                        </a>
                        <a href={`tel:${data.support.phone}`} className="flex items-center justify-center gap-3 bg-white hover:bg-primary-50 text-primary-900 px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1">
                          <Phone className="w-5 h-5" /> {data.support.phone}
                        </a>
                      </div>
                    </div>
                  </motion.section>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
