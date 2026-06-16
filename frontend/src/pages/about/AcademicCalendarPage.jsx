import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Download, ExternalLink, ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const AcademicCalendarPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await cmsService.getPage('academics');
        const section = pageData?.sections?.find(s => s.sectionKey === 'academics.calendar');
        if (section && section.content) {
          setData(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-950">
        <div className="w-16 h-16 border-4 border-primary-800 border-t-accent-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const documents = data?.documents || [
    { title: 'Academic Calendar 2026-2027', academicYear: '2026-2027', type: 'Calendar', pdfUrl: '#' }
  ];

  return (
    <div className="pb-32 bg-primary-50 min-h-screen">
      {/* Premium Parallax Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-[2px] bg-accent-gold" />
              <span>Academics</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold mb-6 leading-tight tracking-tight">
              {data?.title || 'Schedules & Timelines'}
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 font-light leading-relaxed border-l-4 border-accent-gold pl-6">
              {data?.description || 'Access the official academic calendar and important dates for the current academic year.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Document Portal UI */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="space-y-8">
          {/* Document Cards */}
          {documents.map((doc, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-luxury hover:shadow-glow-lg p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:-translate-y-2 transition-all duration-700 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50/50 -z-10" />
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/80 to-transparent z-10 pointer-events-none" />
              
              {/* Decorative background shape */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/15 transition-colors duration-700 z-0" />

              <div className="flex items-center gap-6 z-20 w-full md:w-auto">
                <div className="w-20 h-20 rounded-[1.5rem] bg-primary-50 flex items-center justify-center border border-primary-100 group-hover:bg-accent-gold/20 group-hover:border-accent-gold/50 transition-colors duration-500 shrink-0">
                  <Calendar className="w-10 h-10 text-primary-600 group-hover:text-accent-gold transition-colors duration-500" />
                </div>
                <div>
                  <div className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 border border-accent-gold/20 shadow-sm">
                    {doc.type || 'Document'}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-900 group-hover:to-accent-gold transition-all duration-500 mb-2">{doc.title}</h3>
                  <p className="text-sm font-medium text-primary-500">{doc.academicYear || 'Current Year'} • <span className="text-accent-gold">PDF Format</span></p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-20 shrink-0">
                <a 
                  href={doc.pdfUrl || '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-4 border border-primary-200 text-primary-700 rounded-2xl font-bold hover:bg-primary-50 hover:border-accent-gold hover:text-accent-gold transition-all duration-500 text-sm shadow-sm hover:shadow"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open Document</span>
                </a>
                <a 
                  href={doc.pdfUrl || '#'} 
                  download
                  className="relative overflow-hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-4 bg-primary-900 text-white rounded-2xl font-bold hover:bg-accent-gold transition-all duration-500 shadow-luxury hover:shadow-glow-lg text-sm group/btn"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                  <Download className="w-5 h-5 relative z-20 group-hover/btn:-translate-y-1 transition-transform" />
                  <span className="relative z-20">Download PDF</span>
                </a>
              </div>
            </motion.div>
          ))}
          
          {documents.length === 0 && (
            <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <p>No documents currently available.</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default AcademicCalendarPage;
