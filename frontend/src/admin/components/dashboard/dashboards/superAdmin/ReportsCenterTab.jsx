import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Download, FileText, Calendar, Filter, Archive } from 'lucide-react';

const ReportsCenterTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Reports <span className="text-indigo-600">Center</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Automated digests, exportable datasets, and institutional compliance reporting.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Archive className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Report Engine</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_#818cf8]" />
              <p className="text-xl font-black text-slate-900">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* EXPORTABLE REPORTS (COMPLIANCE) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-rose-50 rounded-xl"><FileText className="w-5 h-5 text-rose-500" /></div>
            <h3 className="font-bold text-slate-800">Compliance & Exportable Reports</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAAC Report */}
            <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500 font-black">
                  N
                </div>
                <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">NAAC Criteria Data</h4>
              <p className="text-xs text-slate-500">Auto-generated datasets for National Assessment and Accreditation Council.</p>
            </div>

            {/* NBA Report */}
            <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500 font-black">
                  NB
                </div>
                <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">NBA Accreditation Data</h4>
              <p className="text-xs text-slate-500">Auto-generated datasets for National Board of Accreditation mapping.</p>
            </div>

            {/* Management Digest */}
            <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500">
                  <PieChart className="w-5 h-5" />
                </div>
                <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Executive Management Digest</h4>
              <p className="text-xs text-slate-500">Complete institutional health summary for board members.</p>
            </div>

            {/* AICTE Report */}
            <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500 font-black">
                  A
                </div>
                <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">AICTE Mandatory Disclosures</h4>
              <p className="text-xs text-slate-500">Required faculty/student ratio and infrastructure reports.</p>
            </div>
          </div>
        </motion.div>

        {/* CUSTOM DIGEST BUILDER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 rounded-xl"><Filter className="w-5 h-5 text-emerald-500" /></div>
              <h3 className="font-bold text-slate-800">Custom Report Builder</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">Select specific parameters to generate a custom CSV export of backend data.</p>
            
            <div className="space-y-3 mb-8">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                <span className="text-sm font-bold text-slate-600">Select Module</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                <span className="text-sm font-bold text-slate-600">Date Range</span>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-not-allowed border border-slate-200">
            Generate Export (Awaiting API)
          </button>
        </motion.div>

      </div>
    </div>
  );
};

// Quick ChevronDown component since it wasn't imported
const ChevronDown = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default ReportsCenterTab;
