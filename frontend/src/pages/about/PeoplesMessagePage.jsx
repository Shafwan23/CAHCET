import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { peoplesMessages as fallbackMessages } from '../../data/peoplesMessages';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, Quote } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function PeoplesMessagePage() {
  const [messages, setMessages] = useState(fallbackMessages);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        
        const chairmanSec = sections.find(s => s.sectionKey === 'about.chairman');
        const principalSec = sections.find(s => s.sectionKey === 'about.principal');
        
        let newMessages = [...fallbackMessages];
        
        if (chairmanSec) {
          const data = JSON.parse(chairmanSec.content);
          if (data && data.name) {
            newMessages = newMessages.map(m => m.id === 'chairman' ? data : m);
          }
        }
        
        if (principalSec) {
          const data = JSON.parse(principalSec.content);
          if (data && data.name) {
            newMessages = newMessages.map(m => m.id === 'principal' ? data : m);
          }
        }
        
        setMessages(newMessages);
      } catch (err) {
        console.error('Failed to load peoples messages:', err);
      }
    };
    fetchCMS();
  }, []);
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
              <span className="text-primary-600">People's Message</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 rounded-full bg-primary-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Leadership</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              People's Message
            </h1>

            <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
              Hear from the visionaries who guide our institution towards excellence and innovation.
            </p>
          </div>
        </section>

        {/* ── MESSAGES ────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32">
            {messages.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  className="flex flex-col lg:flex-row items-center gap-12 md:gap-16"
                >
                  {/* Image */}
                  <motion.div
                    {...fadeUp(0.1)}
                    className={`w-full lg:w-2/5 ${isEven ? '' : 'lg:order-2'}`}
                  >
                    <div className="relative group">
                      {/* Decorative border */}
                      <div className="absolute -inset-4 rounded-3xl border border-primary-100 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 shadow-luxury">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/20 to-transparent" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    {...fadeUp(0.2)}
                    className={`w-full lg:w-3/5 space-y-6 ${isEven ? '' : 'lg:order-1'}`}
                  >
                    <div className="relative">
                      <Quote className="absolute -top-6 -left-6 w-12 h-12 text-primary-50 opacity-50" />
                      <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-1">
                        {item.designation}
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        {item.name}
                      </h2>
                    </div>

                    <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed font-light">
                      {item.message.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {item.signature && (
                      <div className="pt-6 border-t border-slate-100 mt-8">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Signature</p>
                        <p className="font-display text-xl text-primary-900">{item.signature}</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
