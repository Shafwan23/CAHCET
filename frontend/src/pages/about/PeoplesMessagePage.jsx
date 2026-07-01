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
          let data = {}; try { if(chairmanSec && chairmanSec.content) { data = JSON.parse(chairmanSec.content); } } catch(e){}
          if (data && data.name) {
            newMessages = newMessages.map(m => m.id === 'chairman' ? data : m);
          }
        }
        
        if (principalSec) {
          let data = {}; try { if(principalSec && principalSec.content) { data = JSON.parse(principalSec.content); } } catch(e){}
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

      <main className="flex-1">
        {/* ── SPECTACULAR HEADER ──────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-primary-950 mb-16 shadow-2xl rounded-b-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-900 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute -top-20 -right-20 w-full sm:w-96 h-96 bg-accent-gold/20 rounded-full blur-[100px]" />
          <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 relative z-10 text-center flex flex-col items-center">
            <div className="inline-block px-4 py-1.5 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/30 mb-6">
              Leadership
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6 tracking-tight drop-shadow-lg">
              People's Message
            </h1>
            <p className="text-primary-200 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
              Hear from the visionaries who guide our institution towards excellence and innovation.
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
        </section>

        {/* ── MESSAGES ────────────────────────────────────────────────────── */}
        <div className="w-full flex flex-col">
          {messages.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <section key={item.id} className={`py-20 md:py-32 ${isEven ? 'bg-slate-100' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className={`flex flex-col lg:flex-row items-center gap-12 md:gap-20`}>
                    {/* Image */}
                    <motion.div
                      {...fadeUp(0.1)}
                      className={`w-full lg:w-2/5 ${isEven ? '' : 'lg:order-2'}`}
                    >
                      <div className="relative group">
                        {/* Decorative border */}
                        <div className="absolute -inset-6 rounded-[2.5rem] border border-primary-100 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute -inset-2 bg-gradient-to-tr from-accent-gold/20 to-primary-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent opacity-60" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      {...fadeUp(0.2)}
                      className={`w-full lg:w-3/5 space-y-8 ${isEven ? '' : 'lg:order-1'}`}
                    >
                      <div className="relative">
                        <Quote className="absolute -top-10 -left-10 w-20 h-20 text-primary-50 opacity-40 -z-10" />
                        <div className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                          {item.designation}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8">
                          {item.name}
                        </h2>
                      </div>

                      <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
                        {item.message.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      {item.signature && (
                        <div className="pt-8 border-t border-slate-100 mt-12 flex items-center gap-6">
                          <div className="w-12 h-px bg-slate-200" />
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Signature</p>
                            <p className="font-display text-3xl text-primary-900 italic">{item.signature}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
