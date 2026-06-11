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
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        {...fadeUp(index * 0.05)}
        className="group relative bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4 overflow-hidden"
      >
        {/* Glow effect on hover */}
        <div className="absolute -inset-px bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-500 opacity-0 group-hover:opacity-100" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            {status && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                status === 'Accredited' || status === 'Approved' || status === 'Affiliated'
                  ? 'bg-primary-50 text-amber-600 border border-primary-100'
                  : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                {status}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {desc}
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-2 flex items-center justify-between text-xs font-medium">
          <button
            onClick={() => setShowModal(true)}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> View Approval
          </button>
          <span className="text-slate-300">PDF</span>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-luxury border border-slate-100"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="text-xs text-slate-500">Document Preview</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center mb-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  In a real-world scenario, this would open a PDF viewer or download the document for:
                  <span className="block font-bold mt-1 text-slate-900">{title}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
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
          const parsed = JSON.parse(aicteSec.content);
          if (parsed.documents) newState.aicte = parsed.documents;
        }
        
        const recognitionSec = sections.find(s => s.sectionKey === 'about.recognition');
        const affiliationSec = sections.find(s => s.sectionKey === 'about.affiliation');
        
        let accList = [];
        if (recognitionSec) {
          const parsed = JSON.parse(recognitionSec.content);
          if (parsed.documents) accList = [...accList, ...parsed.documents];
        }
        if (affiliationSec) {
          const parsed = JSON.parse(affiliationSec.content);
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* ── COMPACT HEADER ──────────────────────────────────────────────── */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4">
              <a href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </a>
              <ChevronRight className="w-3 h-3" />
              <span>About</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary-600">Government Approval</span>
            </nav>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 rounded-full bg-primary-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Compliance & Recognition</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Government Approval & Recognition
            </h1>

            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              CAHCET is approved by AICTE and affiliated to Anna University. Explore our official approval documents.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          
          {/* ── AICTE SECTION ─────────────────────────────────────────────── */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-1">Approvals</p>
                <h2 className="text-xl font-bold text-slate-900">AICTE EOA Reports</h2>
                <p className="text-xs text-slate-500 mt-0.5">All India Council for Technical Education</p>
              </div>
              <div className="text-xs text-slate-400 font-medium">{data.aicte?.length || 0} documents available</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {data.aicte?.map((doc, i) => (
                <DocumentCard key={doc.id} {...doc} index={i} />
              ))}
            </div>
          </section>

          {/* ── ACCREDITATION SECTION ─────────────────────────────────────── */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-1">Certifications</p>
                <h2 className="text-xl font-bold text-slate-900">Accreditations & Recognitions</h2>
                <p className="text-xs text-slate-500 mt-0.5">National and state level compliance</p>
              </div>
              <div className="text-xs text-slate-400 font-medium">{data.accreditations?.length || 0} documents available</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {data.accreditations?.map((doc, i) => (
                <DocumentCard key={doc.id} {...doc} index={i} />
              ))}
            </div>
          </section>

          {/* ── NOTE ──────────────────────────────────────────────────────── */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400 font-medium max-w-2xl mx-auto">
            All documents are official records of CAHCET. For any verification, please contact the administrative office.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
