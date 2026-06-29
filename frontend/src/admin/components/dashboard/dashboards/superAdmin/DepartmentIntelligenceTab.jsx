import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Award, TrendingUp, Users, ArrowUpRight, GraduationCap } from 'lucide-react';
import { cn } from '../../../../../utils/cn';

const DepartmentIntelligenceTab = ({ data }) => {
  const { departmentIntelligence = [] } = data;
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });

  if (!departmentIntelligence || departmentIntelligence.length === 0) {
    return <div className="p-10 text-slate-500">Insufficient Department Data</div>;
  }

  // Sorting Logic
  const sortedDepartments = [...departmentIntelligence].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const bestPerformer = [...departmentIntelligence].sort((a,b) => b.score - a.score)[0];
  const fastestGrowing = [...departmentIntelligence].sort((a,b) => b.growth - a.growth)[0];
  const highestFaculty = [...departmentIntelligence].sort((a,b) => b.faculty - a.faculty)[0];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Department <span className="text-amber-500">Intelligence</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Comprehensive rankings, growth metrics, and structural analysis of academic divisions.</p>
        </div>
      </div>

      {/* HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100 transition-colors" />
          <Award className="w-8 h-8 text-amber-500 mb-4" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Top Performer</p>
          <h3 className="text-2xl font-black text-slate-900">{bestPerformer?.department}</h3>
          <p className="text-sm font-medium text-amber-600 mt-2">{bestPerformer?.score}/100 Performance Score</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
          <TrendingUp className="w-8 h-8 text-emerald-500 mb-4" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fastest Growing</p>
          <h3 className="text-2xl font-black text-slate-900">{fastestGrowing?.department}</h3>
          <p className="text-sm font-medium text-emerald-600 mt-2">+{fastestGrowing?.growth}% Year-over-Year</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl group-hover:bg-purple-100 transition-colors" />
          <GraduationCap className="w-8 h-8 text-purple-500 mb-4" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Highest Faculty Strength</p>
          <h3 className="text-2xl font-black text-slate-900">{highestFaculty?.department}</h3>
          <p className="text-sm font-medium text-purple-600 mt-2">{highestFaculty?.faculty} Active Members</p>
        </motion.div>
      </div>

      {/* DEPARTMENT LEADERBOARD MATRIX */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl"><Building2 className="w-5 h-5 text-slate-600" /></div>
          <h3 className="font-bold text-slate-800">Institution Leaderboard</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors rounded-tl-xl" onClick={() => handleSort('department')}>Department</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => handleSort('score')}>Performance Score</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => handleSort('students')}>Student Capacity</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => handleSort('ratio')}>Student:Faculty Ratio</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors rounded-tr-xl" onClick={() => handleSort('growth')}>YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {sortedDepartments.map((dept, idx) => (
                <tr key={dept.department} className="border-b border-slate-50 hover:bg-violet-50/50 hover:shadow-lg transition-all duration-300 group relative z-0 hover:z-10 transform hover:scale-[1.01] cursor-pointer">
                  <td className="p-4 rounded-l-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-violet-500 group-hover:text-white group-hover:shadow-md transition-all">
                        {idx + 1}
                      </div>
                      <span className="font-black text-slate-800 group-hover:text-violet-700 transition-colors">{dept.department}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 group-hover:bg-violet-500 transition-colors rounded-full" style={{ width: `${dept.score}%` }} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-violet-700 transition-colors">{dept.score}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 group-hover:text-violet-700 transition-colors">{dept.students} <span className="text-xs text-slate-400 group-hover:text-violet-400 font-normal">Enrolled</span></span>
                      <span className="text-[10px] text-slate-400 group-hover:text-violet-400 transition-colors">{dept.faculty} Faculty</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={cn(
                      "inline-flex px-2 py-1 rounded-md text-xs font-bold transition-colors",
                      dept.ratio > 20 ? "bg-red-50 text-red-600 group-hover:bg-red-100" : dept.ratio < 10 ? "bg-amber-50 text-amber-600 group-hover:bg-amber-100" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                    )}>
                      1 : {dept.ratio}
                    </div>
                  </td>
                  <td className="p-4 rounded-r-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-bold text-emerald-600 group-hover:text-emerald-500 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                        {dept.growth}%
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 shadow-sm" title="View details">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default DepartmentIntelligenceTab;
