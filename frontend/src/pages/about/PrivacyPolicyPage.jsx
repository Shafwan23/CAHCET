import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { privacyPolicyData } from '../../data/legalPolicies';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, Lock, Eye, CheckCircle2, Shield, Cookie, Share2, UserCheck, HardDrive, RefreshCw, Mail } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function PrivacyPolicyPage() {
  const [data, setData] = useState(privacyPolicyData);
  const [cmsContent, setCmsContent] = useState(null);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const sec = sections.find(s => s.sectionKey === 'about.privacy');
        if (sec) {
          let parsed = {}; try { if(sec && sec.content) { parsed = JSON.parse(sec.content) || {}; } } catch(e){}
          if (parsed.content) {
            setCmsContent(parsed.content);
          }
        }
      } catch (err) {
        console.error('Failed to load Privacy Policy CMS data:', err);
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
              <span className="text-accent-gold">Privacy Policy</span>
            </nav>

            <div className="inline-flex items-center gap-2 text-accent-gold text-xs font-bold uppercase tracking-wider mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
              <span>Data Protection</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Privacy Policy
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">
              We are committed to protecting your privacy and ensuring your personal information is handled securely.
            </p>
          </div>
        </header>

        <div className="w-full flex flex-col">
          {cmsContent ? (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 w-full">
              <div 
                className="prose prose-slate prose-lg max-w-none bg-white border border-slate-100 rounded-[3rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-700 leading-relaxed font-light privacy-policy-content"
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

              {/* ── 3. INFORMATION WE COLLECT ──────────────────────────────────── */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <Eye className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Information We Collect</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {data.collection.map((item, i) => (
                      <motion.div
                        key={i}
                        {...fadeUp(i * 0.05)}
                        whileHover={{ y: -10, scale: 1.05 }}
                        className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-8 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 flex flex-col gap-4 group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-colors">
                          <Eye className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-slate-900">{item.title}</h3>
                        <p className="text-base text-slate-500 leading-relaxed font-light">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 4. HOW WE USE INFORMATION ──────────────────────────────────── */}
              <section className="py-20 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">How We Use Your Information</h2>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[2rem] p-10 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary-400 to-primary-600" />
                    {data.usage.map((point, i) => (
                      <motion.div
                        key={i}
                        {...fadeUp(i * 0.05)}
                        className="flex items-start gap-4 group"
                      >
                        <CheckCircle2 className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <p className="text-base text-slate-600 font-light leading-relaxed">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 5. ADDITIONAL SECTIONS ─────────────────────────────────────── */}
              <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-8 mb-16">
                    
                    {/* Data Protection & Security */}
                    <motion.div {...fadeUp(0)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-100 transition-colors">
                          <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">Data Protection & Security</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.protection}</p>
                    </motion.div>

                    {/* Cookies & Website Analytics */}
                    <motion.div {...fadeUp(0.1)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-100 transition-colors">
                          <Cookie className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">Cookies & Website Analytics</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.cookies}</p>
                    </motion.div>

                    {/* Third-Party Services */}
                    <motion.div {...fadeUp(0.2)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-100 transition-colors">
                          <Share2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">Third-Party Services</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.thirdParty}</p>
                    </motion.div>

                    {/* User Rights */}
                    <motion.div {...fadeUp(0.3)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-100 transition-colors">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">User Rights</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.userRights}</p>
                    </motion.div>

                    {/* Data Retention Policy */}
                    <motion.div {...fadeUp(0.4)} whileHover={{ y: -10, scale: 1.02 }} className="bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-100 transition-colors">
                          <HardDrive className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">Data Retention Policy</h3>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed font-light">{data.retention}</p>
                    </motion.div>

                  </div>

                  {/* Policy Updates */}
                  <motion.section {...fadeUp(0.5)} className="bg-white border border-slate-100 rounded-[2rem] p-10 text-center max-w-4xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-primary-600 mx-auto mb-6 shadow-sm border border-slate-100">
                      <RefreshCw className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">Policy Updates</h3>
                    <p className="text-base text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
                      {data.updates}
                    </p>
                  </motion.section>
                </div>
              </section>

              {/* ── 6. CONTACT INFORMATION ─────────────────────────────────────── */}
              <section className="py-20 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.section {...fadeUp(0)} className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Contact Information</h2>
                    <p className="text-base text-slate-500 leading-relaxed font-light mb-8">
                      For any queries regarding this Privacy Policy, please contact:
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
