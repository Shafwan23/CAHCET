import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, UserCog, Lock, Clock, Search } from 'lucide-react';

const ActivityAuditTab = ({ data }) => {
  const { activityLog = [] } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Activity & <span className="text-emerald-600">Audit Center</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Global system logs, security monitoring, and administrator action tracking.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">System Security</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <p className="text-xl font-black text-slate-900">Protected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GLOBAL AUDIT TRAIL */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words h-full hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl"><Activity className="w-5 h-5 text-blue-500" /></div>
              <h3 className="font-bold text-slate-800">Global Audit Trail</h3>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search logs..." className="bg-transparent border-none text-xs focus:outline-none w-32" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 max-h-[500px]">
            {activityLog.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Clock className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-500">No Recent Activity</p>
                <p className="text-xs text-slate-400 mt-1">Global audit logs will appear here when administrators perform actions.</p>
              </div>
            ) : (
              activityLog.map((log, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 hover:border-slate-200 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <UserCog className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      <span className="font-bold">{log.performedByName || log.performedBy || 'System'}</span> {log.action.toLowerCase().replace(/_/g, ' ')}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{log.section || 'General'}</span>
                      <span className="text-[10px] text-slate-400">&bull;</span>
                      <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* SECURITY & ROLE LOGS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 flex flex-col gap-6">
          
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex-1 flex flex-col hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-rose-50 rounded-xl"><Lock className="w-5 h-5 text-rose-500" /></div>
              <h3 className="font-bold text-slate-800">Security Events</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
               <ShieldCheck className="w-8 h-8 text-slate-300 mb-2" />
               <h4 className="font-bold text-slate-500 mb-1 text-sm">No Critical Events</h4>
               <p className="text-[10px] text-slate-400">Failed logins and permission escalations will be flagged here.</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex-1 flex flex-col hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-50 rounded-xl"><UserCog className="w-5 h-5 text-purple-500" /></div>
              <h3 className="font-bold text-slate-800">Role Assignments</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
               <h4 className="font-bold text-slate-500 mb-1 text-sm">Awaiting IAM Log</h4>
               <p className="text-[10px] text-slate-400">Identity and Access Management tracking unavailable.</p>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default ActivityAuditTab;
