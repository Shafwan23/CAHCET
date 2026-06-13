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
    <div className="pb-32">
      {/* Header */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl text-center pt-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span>Academics</span>
            <span className="w-10 h-[2px] bg-accent-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">{data?.title || 'Schedules & Timelines'}</h1>
          <p className="text-xl text-primary-600 leading-relaxed font-light max-w-3xl mx-auto">
            {data?.description || 'Access the official academic calendar and important dates for the current academic year.'}
          </p>
        </motion.div>
      </section>

      {/* Document Portal UI */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="space-y-8">
          {/* Document Cards */}
          {documents.map((doc, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl border border-primary-100 shadow-luxury p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-accent-gold/30 transition-colors duration-500 group relative overflow-hidden"
            >
              {/* Decorative background shape */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent-gold/5 rounded-full blur-2xl group-hover:bg-accent-gold/10 transition-colors duration-500" />

              <div className="flex items-center gap-6 z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100 group-hover:bg-accent-gold/20 group-hover:text-accent-gold transition-colors">
                  <Calendar className="w-8 h-8 text-primary-600 group-hover:text-accent-gold transition-colors" />
                </div>
                <div>
                  <div className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full mb-2 border border-accent-gold/20">
                    {doc.type || 'Document'}
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-1">{doc.title}</h3>
                  <p className="text-sm text-primary-500">{doc.academicYear || 'Current Year'} | PDF</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-10">
                <a 
                  href={doc.pdfUrl || '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-4 border border-primary-200 text-primary-700 rounded-xl font-bold hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open PDF</span>
                </a>
                <a 
                  href={doc.pdfUrl || '#'} 
                  download
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-4 bg-primary-900 text-white rounded-xl font-bold hover:bg-primary-950 transition-all duration-300 shadow-lg hover:shadow-xl text-sm border border-transparent hover:border-white/10"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
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
