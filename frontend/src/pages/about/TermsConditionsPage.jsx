import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { termsConditionsData } from '../../data/legalPolicies';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, Scale, CheckCircle2, AlertCircle, FileText, Shield, Globe, RefreshCw, Mail } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function TermsConditionsPage() {
  const [data, setData] = useState(termsConditionsData);
  const [cmsContent, setCmsContent] = useState(null);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const sec = sections.find(s => s.sectionKey === 'about.terms');
        if (sec) {
          let parsed = {}; try { if(sec && sec.content) { parsed = JSON.parse(sec.content) || {}; } } catch(e){}
          if (parsed.content) {
            setCmsContent(parsed.content);
          }
        }
      } catch (err) {
        console.error('Failed to load Terms CMS data:', err);
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
              <span className="text-accent-gold">Terms & Conditions</span>
            </nav>

            <div className="inline-flex items-center gap-2 text-accent-gold text-xs font-bold uppercase tracking-wider mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
              <span>Legal Framework</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Terms & Conditions
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">
              Please read these terms carefully before using our website and services.
            </p>
          </div>
        </header>

        <div className="w-full flex flex-col">
          {cmsContent ? (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 w-full">
              <div 
                className="prose prose-slate prose-lg max-w-none bg-white border border-slate-100 rounded-[3rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-700 leading-relaxed font-light terms-conditions-content"
                dangerouslySetInnerHTML={{ __html: cmsContent }}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {/* ── 2. INTRODUCTION ────────────────────────────────────────────── */}
              <section className="py-20 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.section {...fadeUp(0)} className="prose prose-slate max-w-none bg-white border border-slate-100 rounded-[2rem] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <p className="text-lg text-slate-600 leading-relaxed font-light m-0">
                      {data.intro}
                    </p>
                  </motion.section>
                </div>
              </section>

              {/* ── 3. ACCEPTANCE OF TERMS ─────────────────────────────────────── */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.section {...fadeUp(0.1)} className="bg-slate-100 border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-start gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary-400 to-primary-600" />
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary-600 flex-shrink-0 shadow-sm border border-slate-100">
                      <Scale className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Acceptance of Terms</h2>
                      <p className="text-base text-slate-600 leading-relaxed font-light">
                        {data.acceptance}
                      </p>
                    </div>
                  </motion.section>
                </div>
              </section>

              {/* ── 4. USE OF WEBSITE ──────────────────────────────────────────── */}
              <section className="py-20 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Use of Website</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {data.useOfWebsite.map((point, i) => (
                      <motion.div
                        key={i}
                        {...fadeUp(i * 0.05)}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border border-primary-100 rounded-[1.5rem] p-6 flex items-start gap-4 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all group"
                      >
                        <CheckCircle2 className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <p className="text-base text-slate-600 font-light leading-relaxed">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 5. APPLICATION PROCESS ─────────────────────────────────────── */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Application Process</h2>
                  </div>

                  <div className="space-y-6">
                    {data.applicationProcess.map((point, i) => (
                      <motion.div
                        key={i}
                        {...fadeUp(i * 0.05)}
                        whileHover={{ x: 10 }}
                        className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border border-primary-100 rounded-[2rem] p-6 flex items-start gap-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-primary-100/50 flex items-center justify-center text-xl font-display font-bold text-primary-700 flex-shrink-0 shadow-sm">
                          {i + 1}
                        </div>
                        <p className="text-lg text-slate-600 font-light leading-relaxed pt-2">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 6. ADDITIONAL SECTIONS ─────────────────────────────────────── */}
              <section className="py-20 bg-slate-100 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-8 mb-16">
                    
                    {/* User Responsibilities */}
                    <motion.div {...fadeUp(0)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-100 transition-colors">
                          <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">User Responsibilities</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.userResponsibilities}</p>
                    </motion.div>

                    {/* Intellectual Property Rights */}
                    <motion.div {...fadeUp(0.1)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-100 transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">Intellectual Property Rights</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.intellectualProperty}</p>
                    </motion.div>

                    {/* Limitation of Liability */}
                    <motion.div {...fadeUp(0.2)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm group-hover:bg-amber-100 transition-colors">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">Limitation of Liability</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.limitationOfLiability}</p>
                    </motion.div>

                    {/* External Links Disclaimer */}
                    <motion.div {...fadeUp(0.3)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-100 transition-colors">
                          <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">External Links Disclaimer</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.externalLinks}</p>
                    </motion.div>

                  </div>

                  {/* Policy Updates */}
                  <motion.section {...fadeUp(0)} className="bg-white border border-slate-100 rounded-[2rem] p-10 text-center max-w-4xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-primary-600 mx-auto mb-6 shadow-sm border border-slate-100">
                      <RefreshCw className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">Policy Updates</h3>
                    <p className="text-base text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
                      {data.policyUpdates}
                    </p>
                  </motion.section>
                </div>
              </section>

              {/* ── 7. CONTACT INFORMATION ─────────────────────────────────────── */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.section {...fadeUp(0)} className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Contact Information</h2>
                    <p className="text-base text-slate-500 leading-relaxed font-light mb-8">
                      For any queries regarding these Terms, please contact:
                    </p>
                    <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2.5rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all">
                      <p className="text-xl font-bold text-slate-900 mb-2">{data.contact.name}</p>
                      <p className="text-base text-slate-500 mb-8">{data.contact.address}</p>
                      <a href={`mailto:${data.contact.email}`} className="text-base font-bold text-primary-600 hover:text-primary-700 transition-colors flex items-center justify-center gap-3 bg-white py-4 px-8 rounded-2xl shadow-md border border-primary-100 max-w-sm mx-auto hover:bg-primary-50">
                        <Mail className="w-5 h-5" /> {data.contact.email}
                      </a>
                    </motion.div>
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
