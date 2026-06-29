import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Calendar, ArrowRight, BarChart3, Building2 } from 'lucide-react';
import { cn } from '../../../../../utils/cn';

const AdmissionsAnalyticsTab = ({ data }) => {
  const { 
    admissionFunnel = [], 
    trendData = [], 
    departmentIntelligence = [],
    globalMetrics = {}
  } = data;

  // Derive conversions
  const registered = admissionFunnel.find(f => f.stage === 'Registered')?.count || 0;
  const admitted = admissionFunnel.find(f => f.stage === 'Completed')?.count || 0;
  const conversionRate = registered > 0 ? ((admitted / registered) * 100).toFixed(1) : 0;

  // Map trends to max value for relative bar sizing
  const maxTrend = Math.max(...trendData.map(t => t.applications), 1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Admissions <span className="text-blue-600">Analytics</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Deep dive into enrollment trends, conversion funnels, and department allocations.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Conversion Rate</p>
            <p className="text-xl font-black text-slate-900">{conversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FUNNEL ANALYSIS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-50 rounded-xl"><Users className="w-5 h-5 text-blue-500" /></div>
            <h3 className="font-bold text-slate-800">Application Funnel</h3>
          </div>
          
          <div className="space-y-6">
            {admissionFunnel.length === 0 ? (
              <p className="text-slate-500 text-sm">No funnel data available.</p>
            ) : admissionFunnel.map((stage, i) => {
              const width = `${Math.max(stage.percentage, 10)}%`;
              return (
                <div key={stage.stage} className="relative group">
                  {i > 0 && (
                    <div className="absolute -top-4 left-4 border-l-2 border-slate-200 h-4 ml-3" />
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 z-10 text-slate-500 font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-700">{stage.stage}</span>
                        <span className="text-xs font-bold text-slate-400">{stage.count}</span>
                      </div>
                      <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-200">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width }} transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* TRENDS & DEPARTMENT SPREAD */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timeline Trends */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl"><Calendar className="w-5 h-5 text-indigo-500" /></div>
                <h3 className="font-bold text-slate-800">Monthly Application Volume</h3>
              </div>
            </div>
            
            <div className="h-48 flex items-end justify-between gap-2 px-2">
              {trendData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No trend data available</div>
              ) : trendData.map((t, i) => {
                const height = `${(t.applications / maxTrend) * 100}%`;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 group flex-1">
                    <div className="w-full max-w-[40px] bg-indigo-50 rounded-t-xl overflow-hidden relative" style={{ height: '100%' }}>
                      <motion.div 
                        initial={{ height: 0 }} animate={{ height }} transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl group-hover:bg-indigo-600 transition-colors"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Department Demand */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 rounded-xl"><Building2 className="w-5 h-5 text-emerald-500" /></div>
              <h3 className="font-bold text-slate-800">Course Demand Spread</h3>
            </div>
            
            <div className="space-y-4">
              {departmentIntelligence.slice(0, 4).map((dept, i) => {
                const width = `${(dept.students / Math.max(...departmentIntelligence.map(d=>d.students), 1)) * 100}%`;
                return (
                  <div key={dept.department} className="flex items-center gap-4">
                    <div className="w-20 text-xs font-bold text-slate-600 text-right">{dept.department}</div>
                    <div className="flex-1 h-3 bg-slate-50 rounded-full border border-slate-200 overflow-hidden relative">
                       <motion.div initial={{ width: 0 }} animate={{ width }} transition={{ duration: 1, delay: 0.3 + (i * 0.1) }} className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full" />
                    </div>
                    <div className="w-12 text-xs font-black text-slate-800">{dept.students}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
      
    </div>
  );
};

export default AdmissionsAnalyticsTab;
