import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ShieldAlert, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const CMSIntelligenceTab = ({ data }) => {
  const { systemStatus = {}, globalMetrics = {}, contentHealth = null, seoHealth = null } = data;

  const totalPages = globalMetrics.activeCourses ? globalMetrics.activeCourses * 5 : 0; // rough estimation of pages just to show a metric based on real data (courses * 5 pages)
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            CMS <span className="text-cyan-600">Intelligence</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Content management health, SEO analytics, and publishing workflows.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">CMS Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <p className="text-xl font-black text-slate-900">Online</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PIPELINE OVERVIEW */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex-1 flex flex-col hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-slate-50 rounded-xl"><FileText className="w-5 h-5 text-slate-500" /></div>
              <h3 className="font-bold text-slate-800">Publishing Pipeline</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-slate-700 text-sm">Published Pages</span>
                </div>
                <span className="font-black text-emerald-600">--</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-700 text-sm">Pending Approval</span>
                </div>
                <span className="font-black text-amber-600">--</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <span className="font-bold text-slate-700 text-sm">Drafts</span>
                </div>
                <span className="font-black text-slate-600">--</span>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-6">Awaiting pipeline aggregation from CMS database.</p>
          </div>
        </motion.div>

        {/* HEALTH ENGINES PLACEHOLDER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words md:flex-row gap-6 hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="flex-1 border-r border-slate-200 pr-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-xl"><Search className="w-5 h-5 text-blue-500" /></div>
                <h3 className="font-bold text-slate-800">SEO Readiness</h3>
              </div>
              
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 min-h-[200px]">
                {seoHealth ? (
                   <div>Real SEO data rendering goes here</div>
                ) : (
                   <>
                     <AlertCircle className="w-8 h-8 text-slate-300 mb-4" />
                     <h4 className="font-bold text-slate-600">No sufficient data</h4>
                     <p className="text-[10px] text-slate-400 mt-2 max-w-[200px]">Meta tag completion ratios and keyword density reports unavailable.</p>
                   </>
                )}
              </div>
            </div>

            <div className="flex-1 pl-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-rose-50 rounded-xl"><ShieldAlert className="w-5 h-5 text-rose-500" /></div>
                <h3 className="font-bold text-slate-800">Content Health Engine</h3>
              </div>
              
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 min-h-[200px]">
                {contentHealth ? (
                   <div>Real Content Health data rendering goes here</div>
                ) : (
                   <>
                     <AlertCircle className="w-8 h-8 text-slate-300 mb-4" />
                     <h4 className="font-bold text-slate-600">No sufficient data</h4>
                     <p className="text-[10px] text-slate-400 mt-2 max-w-[200px]">Missing content alerts, broken links, and outdated page tracking unavailable.</p>
                   </>
                )}
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default CMSIntelligenceTab;
