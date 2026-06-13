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
          const parsed = JSON.parse(sec.content);
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {cmsContent ? (
            <div 
              className="prose prose-slate max-w-none bg-white border border-slate-100 rounded-2xl p-8 md:p-12 shadow-sm text-slate-600 leading-relaxed terms-conditions-content"
              dangerouslySetInnerHTML={{ __html: cmsContent }}
            />
          ) : (
            <div className="space-y-12">
              {/* ── 2. INTRODUCTION ────────────────────────────────────────────── */}
              <motion.section {...fadeUp(0)} className="prose prose-slate max-w-none">
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  {data.intro}
                </p>
              </motion.section>

              {/* ── 3. ACCEPTANCE OF TERMS ─────────────────────────────────────── */}
              <motion.section {...fadeUp(0.1)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Acceptance of Terms</h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {data.acceptance}
                  </p>
                </div>
              </motion.section>

              {/* ── 4. USE OF WEBSITE ──────────────────────────────────────────── */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-5 rounded-full bg-primary-600" />
                  <h2 className="text-xl font-bold text-slate-900">Use of Website</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {data.useOfWebsite.map((point, i) => (
                    <motion.div
                      key={i}
                      {...fadeUp(i * 0.05)}
                      className="bg-white border border-slate-100 rounded-xl p-4 flex items-start gap-3 hover:border-primary-100 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600 font-light">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ── 5. APPLICATION PROCESS ─────────────────────────────────────── */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-5 rounded-full bg-primary-600" />
                  <h2 className="text-xl font-bold text-slate-900">Application Process</h2>
                </div>

                <div className="space-y-4">
                  {data.applicationProcess.map((point, i) => (
                    <motion.div
                      key={i}
                      {...fadeUp(i * 0.05)}
                      className="bg-white border border-slate-100 rounded-xl p-4 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-600 font-light">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ── 6. ADDITIONAL SECTIONS ─────────────────────────────────────── */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* User Responsibilities */}
                <motion.div {...fadeUp(0)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <h3 className="text-base font-bold text-slate-900">User Responsibilities</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">{data.userResponsibilities}</p>
                </motion.div>

                {/* Intellectual Property Rights */}
                <motion.div {...fadeUp(0.1)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="text-base font-bold text-slate-900">Intellectual Property Rights</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">{data.intellectualProperty}</p>
                </motion.div>

                {/* Limitation of Liability */}
                <motion.div {...fadeUp(0.2)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-primary-600" />
                    <h3 className="text-base font-bold text-slate-900">Limitation of Liability</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">{data.limitationOfLiability}</p>
                </motion.div>

                {/* External Links Disclaimer */}
                <motion.div {...fadeUp(0.3)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <h3 className="text-base font-bold text-slate-900">External Links Disclaimer</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">{data.externalLinks}</p>
                </motion.div>

              </div>

              {/* Policy Updates */}
              <motion.section {...fadeUp(0)} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center max-w-3xl mx-auto">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 mx-auto mb-3 shadow-sm">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Policy Updates</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  {data.policyUpdates}
                </p>
              </motion.section>

              {/* ── 7. CONTACT INFORMATION ─────────────────────────────────────── */}
              <motion.section {...fadeUp(0)} className="text-center max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Contact Information</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-light mb-4">
                  For any queries regarding these Terms, please contact:
                </p>
                <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-2">
                  <p className="text-sm font-bold text-slate-900">{data.contact.name}</p>
                  <p className="text-xs text-slate-500">{data.contact.address}</p>
                  <a href={`mailto:${data.contact.email}`} className="text-xs text-primary-600 hover:text-primary-700 transition-colors flex items-center justify-center gap-1 mt-2">
                    <Mail className="w-3.5 h-3.5" /> {data.contact.email}
                  </a>
                </div>
              </motion.section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
