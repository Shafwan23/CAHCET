import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, ChevronRight } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import PDFViewerModal from '../PDFViewerModal';
import PremiumEmptyState from '../../ui/PremiumEmptyState';

const CurriculumSection = ({ data }) => {
  const [selectedPdf, setSelectedPdf] = useState(null);

  if (!data || data.length === 0) {
    return <PremiumEmptyState title="Curriculum Updating" message="The latest academic regulations and syllabus documents are currently being uploaded." icon={FileText} />;
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] pb-4 mb-8 border-b border-primary-100/50 pt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase mb-2">
            <span>Department</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent-gold">Curriculum</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-primary-900 mb-2">Curriculum & Syllabus</h2>
          <p className="text-primary-500 max-w-lg text-sm">
            Access the latest academic regulations and curriculum structures prescribed by the university.
          </p>
        </div>
      </div>

      <motion.div 
        variants={departmentAnimations.staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {data.map((item) => (
          <motion.div 
            key={item.id}
            variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } } }}
            className="group bg-white p-8 rounded-[2.5rem] border border-primary-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]-hover hover:border-accent-gold/50 transition-all duration-500 flex flex-col h-full relative overflow-hidden will-change-transform hover:-translate-y-3 hover:scale-[1.02]"
          >
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-50 rounded-full blur-3xl -z-10 group-hover:bg-accent-gold/10 transition-colors duration-700" />
            
            <div className="w-14 h-14 bg-primary-50 text-primary-400 border border-primary-100 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary-900 group-hover:text-accent-gold group-hover:border-primary-900 transition-colors duration-500 shadow-sm">
              <FileText className="w-7 h-7" />
            </div>

            <h3 className="font-display font-bold text-xl text-primary-900 mb-2 flex-1 pr-4 group-hover:text-accent-gold transition-colors">{item.title}</h3>
            <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-8 bg-primary-50 px-3 py-1 rounded-full w-fit border border-primary-100/50">
              {item.fileSize}
            </p>

            <div className="flex items-center gap-3 pt-6 border-t border-primary-100/50">
              <button 
                onClick={() => setSelectedPdf(item)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-50 hover:bg-primary-900 text-primary-700 hover:text-white rounded-xl transition-colors text-sm font-bold border border-transparent hover:border-primary-800"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <a 
                href={item.fileUrl}
                download
                className="p-3 bg-primary-50 hover:bg-accent-gold text-primary-700 hover:text-primary-900 rounded-xl transition-colors border border-transparent hover:border-accent-gold/50"
                title="Download PDF"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <PDFViewerModal 
        pdfDoc={selectedPdf} 
        isOpen={!!selectedPdf} 
        onClose={() => setSelectedPdf(null)} 
      />
    </div>
  );
};

export default CurriculumSection;
