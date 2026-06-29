import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, AlertCircle } from 'lucide-react';

const FacultyAnalyticsTab = ({ data }) => {
  const { departmentIntelligence = [], globalMetrics = {}, facultyQualifications = null } = data;

  const totalFaculty = globalMetrics.totalFaculty || 0;
  
  // Highest Faculty Department
  const highestFaculty = [...departmentIntelligence].sort((a,b) => b.faculty - a.faculty)[0];
  const lowestRatio = [...departmentIntelligence].sort((a,b) => a.ratio - b.ratio)[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Faculty <span className="text-purple-600">Analytics</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Distribution, strength matrices, and academic qualification insights.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Active Faculty</p>
            <p className="text-xl font-black text-slate-900">{totalFaculty}</p>
          </div>
        </div>
      </div>

      {/* HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex items-center min-w-0 break-words gap-6 hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="p-4 bg-indigo-50 rounded-2xl">
            <Users className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Highest Department Strength</p>
            <h3 className="text-2xl font-black text-slate-900">{highestFaculty?.department || 'N/A'}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">{highestFaculty?.faculty || 0} Faculty Members</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex items-center min-w-0 break-words gap-6 hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="p-4 bg-emerald-50 rounded-2xl">
            <BookOpen className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Optimal Student Ratio</p>
            <h3 className="text-2xl font-black text-slate-900">{lowestRatio?.department || 'N/A'}</h3>
            <p className="text-sm font-medium text-emerald-600 mt-1">1 : {lowestRatio?.ratio || 0} (Faculty : Students)</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FACULTY DISTRIBUTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6">Faculty Distribution Spread</h3>
          <div className="space-y-4">
            {departmentIntelligence.map((dept, i) => {
              const width = `${(dept.faculty / Math.max(...departmentIntelligence.map(d=>d.faculty), 1)) * 100}%`;
              return (
                <div key={dept.department} className="flex items-center gap-4">
                  <div className="w-24 text-xs font-bold text-slate-600 text-right truncate" title={dept.department}>{dept.department}</div>
                  <div className="flex-1 h-4 bg-slate-50 rounded-full border border-slate-200 overflow-hidden relative">
                     <motion.div initial={{ width: 0 }} animate={{ width }} transition={{ duration: 1, delay: 0.2 + (i * 0.1) }} className="absolute inset-y-0 left-0 bg-purple-500 rounded-full" />
                  </div>
                  <div className="w-12 text-sm font-black text-slate-800">{dept.faculty}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* QUALIFICATIONS METRICS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div>
            <h3 className="font-bold text-slate-800 mb-2">Qualification Breakdown</h3>
            <p className="text-xs text-slate-500 mb-8">Ph.D vs Masters vs Bachelors spread</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            {facultyQualifications ? (
               // If backend API is updated to return this payload in the future
               <div>Real qualification data rendering goes here</div>
            ) : (
               <>
                 <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                 <h4 className="text-lg font-bold text-slate-600">No sufficient data available</h4>
                 <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                   Qualification analytics require an active connection to the HR/Faculty database module which is currently unlinked or empty.
                 </p>
               </>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default FacultyAnalyticsTab;
