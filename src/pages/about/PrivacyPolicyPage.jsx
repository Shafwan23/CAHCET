import React from 'react';
import { motion } from 'framer-motion';
import { privacyPolicyData } from '../../data/legalPolicies';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, Lock, Eye, CheckCircle2, Shield, Cookie, Share2, UserCheck, HardDrive, RefreshCw, Mail } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function PrivacyPolicyPage() {
  const data = privacyPolicyData;

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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          
          {/* ── 2. INTRODUCTION ────────────────────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              {data.intro}
            </p>
          </motion.section>

          {/* ── 3. INFORMATION WE COLLECT ──────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full bg-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Information We Collect</h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {data.collection.map((item, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.05)}
                  className="bg-white border border-slate-100 rounded-xl p-5 hover:shadow-sm transition-shadow flex flex-col gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-primary-600">
                    <Eye className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── 4. HOW WE USE INFORMATION ──────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full bg-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">How We Use Your Information</h2>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
              {data.usage.map((point, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.05)}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 font-light">{point}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── 5. ADDITIONAL SECTIONS ─────────────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Data Protection & Security */}
            <motion.div {...fadeUp(0)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-primary-600" />
                <h3 className="text-base font-bold text-slate-900">Data Protection & Security</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-light">{data.protection}</p>
            </motion.div>

            {/* Cookies & Website Analytics */}
            <motion.div {...fadeUp(0.1)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-5 h-5 text-primary-600" />
                <h3 className="text-base font-bold text-slate-900">Cookies & Website Analytics</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-light">{data.cookies}</p>
            </motion.div>

            {/* Third-Party Services */}
            <motion.div {...fadeUp(0.2)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-5 h-5 text-primary-600" />
                <h3 className="text-base font-bold text-slate-900">Third-Party Services</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-light">{data.thirdParty}</p>
            </motion.div>

            {/* User Rights */}
            <motion.div {...fadeUp(0.3)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-5 h-5 text-primary-600" />
                <h3 className="text-base font-bold text-slate-900">User Rights</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-light">{data.userRights}</p>
            </motion.div>

            {/* Data Retention Policy */}
            <motion.div {...fadeUp(0.4)} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <HardDrive className="w-5 h-5 text-primary-600" />
                <h3 className="text-base font-bold text-slate-900">Data Retention Policy</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-light">{data.retention}</p>
            </motion.div>

            {/* Policy Updates */}
            <motion.div {...fadeUp(0.5)} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-5 h-5 text-primary-600" />
                <h3 className="text-base font-bold text-slate-900">Policy Updates</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-light">{data.updates}</p>
            </motion.div>

          </div>

          {/* ── 6. CONTACT INFORMATION ─────────────────────────────────────── */}
          <motion.section {...fadeUp(0)} className="text-center max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Contact Information</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-light mb-4">
              For any queries regarding this Privacy Policy, please contact:
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
      </main>

      <Footer />
    </div>
  );
}
