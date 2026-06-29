import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Briefcase, Building, AlertCircle, Award } from 'lucide-react';

const PlacementAnalyticsTab = ({ data }) => {
  const { globalMetrics = {} } = data;

  const totalPlacements = globalMetrics.placementCount || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Placement <span className="text-emerald-500">Analytics</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Corporate relations, recruitment funnels, and student outcome tracking.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Offers Secured</p>
            <p className="text-xl font-black text-slate-900">{totalPlacements}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECRUITER ANALYTICS PLACEHOLDER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-50 rounded-xl"><Building className="w-5 h-5 text-blue-500" /></div>
            <h3 className="font-bold text-slate-800">Recruiter Analytics & Hiring Trends</h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <AlertCircle className="w-10 h-10 text-slate-300 mb-4" />
            <h4 className="font-bold text-slate-600 mb-2">No sufficient data available</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Recruiter historical tracking requires linking the Placement Drive database module, which currently lacks sufficient active records for visual aggregation.
            </p>
          </div>
        </motion.div>

        {/* PACKAGE & FUNNEL PLACEHOLDER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Package Analytics */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex-1 flex flex-col hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 rounded-xl"><TrendingUp className="w-5 h-5 text-amber-500" /></div>
              <h3 className="font-bold text-slate-800">Package Matrix</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
               <h4 className="font-bold text-slate-500 mb-1 text-sm">Awaiting CTC Data</h4>
               <p className="text-[10px] text-slate-400">Salary aggregations will appear here.</p>
            </div>
          </div>

          {/* Placement Funnel */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex-1 flex flex-col hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-50 rounded-xl"><Briefcase className="w-5 h-5 text-purple-500" /></div>
              <h3 className="font-bold text-slate-800">Placement Funnel</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
               <h4 className="font-bold text-slate-500 mb-1 text-sm">Awaiting Drive Data</h4>
               <p className="text-[10px] text-slate-400">Eligible vs Interviewed vs Placed.</p>
            </div>
          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default PlacementAnalyticsTab;
