import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { governmentApprovalData as fallbackData } from '../../data/governmentApproval';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, FileText, Download, ExternalLink, X } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

// ── Document Card ────────────────────────────────────────────────────────────
function DocumentCard({ title, desc, status, url, index }) {
  return (
    <motion.a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      {...fadeUp(index * 0.05)}
      whileHover={{ y: -10, scale: 1.03 }}
      className="group relative bg-gradient-to-br from-primary-50 via-white to-accent-gold/10 border-2 border-primary-100 rounded-[2rem] p-8 shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300 flex flex-col justify-between gap-6 overflow-hidden block"
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Background glow */}
      <div className="absolute -inset-px bg-gradient-to-br from-primary-50/50 to-white opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:scale-110">
            <FileText className="w-6 h-6" />
          </div>
          {status && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${
              status === 'Accredited' || status === 'Approved' || status === 'Affiliated'
                ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              {status}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-4 flex items-center justify-between text-sm font-medium border-t border-slate-50 group-hover:border-primary-50 transition-colors mt-auto">
        <span className="text-primary-600 group-hover:text-primary-700 flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> View Document
        </span>
        <span className="text-slate-300 group-hover:text-primary-300 flex items-center gap-1">
          PDF <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </motion.a>
  );
}

export default function GovernmentApprovalPage() {
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('about');
        const sections = res.data?.sections || [];
        const newState = { ...data };
        
        const aicteSec = sections.find(s => s.sectionKey === 'about.accreditation');
        if (aicteSec) {
          let parsed = {}; try { if(aicteSec && aicteSec.content) { parsed = JSON.parse(aicteSec.content); } } catch(e){}
          if (parsed.documents) newState.aicte = parsed.documents;
        }
        
        const recognitionSec = sections.find(s => s.sectionKey === 'about.recognition');
        const affiliationSec = sections.find(s => s.sectionKey === 'about.affiliation');
        
        let accList = [];
        if (recognitionSec) {
          let parsed = {}; try { if(recognitionSec && recognitionSec.content) { parsed = JSON.parse(recognitionSec.content); } } catch(e){}
          if (parsed.documents) accList = [...accList, ...parsed.documents];
        }
        if (affiliationSec) {
          let parsed = {}; try { if(affiliationSec && affiliationSec.content) { parsed = JSON.parse(affiliationSec.content); } } catch(e){}
          if (parsed.documents) accList = [...accList, ...parsed.documents];
        }
        
        if (accList.length > 0) {
          newState.accreditations = accList;
        }
        
        setData(newState);
      } catch (err) {
        console.error('Failed to load government approval data:', err);
      }
    };
    fetchCMS();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── SPECTACULAR HEADER ──────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-primary-950 mb-16 shadow-2xl rounded-b-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-950 via-primary-900 to-indigo-900 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-full sm:w-96 h-96 bg-accent-gold/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 relative z-10 text-center flex flex-col items-center">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20 mb-6">
              Compliance & Recognition
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6 tracking-tight drop-shadow-lg">
              Government Approvals
            </h1>
            <p className="text-primary-200 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
              CAHCET is approved by AICTE and affiliated to Anna University. Explore our official statutory approval documents.
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </section>

        <div className="w-full flex flex-col">
          
          {/* ── AICTE SECTION ─────────────────────────────────────────────── */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="w-12 h-1 bg-accent-gold rounded-full mb-4" />
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">AICTE EOA Reports</h2>
                  <p className="text-slate-500 mt-2 text-lg font-light">All India Council for Technical Education</p>
                </div>
                <div className="text-sm text-slate-400 font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                  <span className="text-primary-600 font-bold">{data.aicte?.length || 0}</span> documents available
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {data.aicte?.map((doc, i) => (
                  <DocumentCard key={doc.id} {...doc} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* ── ACCREDITATION SECTION ─────────────────────────────────────── */}
          <section className="py-20 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-slate-200 pb-6">
                <div>
                  <div className="w-12 h-1 bg-accent-gold rounded-full mb-4" />
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">Accreditations & Recognitions</h2>
                  <p className="text-slate-500 mt-2 text-lg font-light">National and state level compliance</p>
                </div>
                <div className="text-sm text-slate-400 font-medium bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                  <span className="text-primary-600 font-bold">{data.accreditations?.length || 0}</span> documents available
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {data.accreditations?.map((doc, i) => (
                  <DocumentCard key={doc.id} {...doc} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* ── NOTE ──────────────────────────────────────────────────────── */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-primary-50 via-slate-50 to-primary-50 border border-primary-100/50 rounded-[2rem] p-8 md:p-12 text-center text-sm text-primary-900/60 font-medium max-w-3xl mx-auto shadow-inner">
                <p className="text-lg">All documents are official statutory records of CAHCET.</p>
                <p className="mt-2 font-light">For any verification or queries, please contact the administrative office.</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
