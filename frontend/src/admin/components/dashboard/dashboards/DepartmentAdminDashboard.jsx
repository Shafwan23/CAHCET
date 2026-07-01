import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Building2, Activity, Clock, BookOpen, ShieldCheck } from 'lucide-react';
import { cn } from '../../../../utils/cn';

// --- OVERVIEW TAB ---
const DepartmentOverviewTab = ({ data }) => {
  const { departmentName = 'N/A', metrics = {}, activityLog = [] } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Department <span className="text-blue-600">Overview</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Real-time health pulse, student ratio metrics, and faculty strength for {departmentName}.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Department Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <p className="text-xs font-bold text-slate-900">Active</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center min-w-0 break-words gap-4 relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors" />
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center z-10">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="z-10">
            <p className="text-3xl font-black text-slate-800">{metrics.studentsCount || 0}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Enrolled Students</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center min-w-0 break-words gap-4 relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl group-hover:bg-purple-100 transition-colors" />
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center z-10">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <div className="z-10">
            <p className="text-3xl font-black text-slate-800">{metrics.facultyCount || 0}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Faculty Members</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center min-w-0 break-words gap-4 relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center z-10">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="z-10">
            <p className="text-3xl font-black text-slate-800">1 : {metrics.ratio || 0}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Students per Faculty</p>
          </div>
        </motion.div>
      </div>

      {/* Activity Log */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="p-2.5 bg-slate-50 rounded-xl"><Clock className="w-5 h-5 text-slate-500" /></div>
          Department Content Activity
        </h3>
        <div className="space-y-4">
          {activityLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-sm text-slate-400 font-bold">No recent CMS updates for this department.</p>
            </div>
          ) : activityLog.map(log => (
            <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-100 transition-colors">
              <div>
                <p className="text-sm font-bold text-slate-700">{log.action} <span className="text-blue-600 uppercase text-xs ml-2">{log.section}</span></p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- STUDENT ANALYTICS TAB ---
const StudentAnalyticsTab = ({ data }) => {
  const { departmentName = 'N/A', metrics = {} } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Student <span className="text-indigo-600">Analytics</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Enrollment capacity, demographic breakdowns, and funnel drops for {departmentName}.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Enrolled</p>
            <p className="text-xl font-black text-slate-900">{metrics.studentsCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Placeholders for missing deep data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6">Enrollment Funnel</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h4 className="font-bold text-slate-500 mb-1">No sufficient data</h4>
            <p className="text-xs text-slate-400 max-w-xs">Department-specific funnel data requires an update to the backend aggregation engine.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6">Demographics & Growth</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h4 className="font-bold text-slate-500 mb-1">No sufficient data</h4>
            <p className="text-xs text-slate-400 max-w-xs">Demographics arrays and historical growth tracks are awaiting database implementation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- FACULTY ANALYTICS TAB ---
const FacultyAnalyticsTab = ({ data }) => {
  const { departmentName = 'N/A', metrics = {} } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Faculty <span className="text-purple-600">Analytics</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Staff allocation, academic qualifications, and workload distribution for {departmentName}.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Staff</p>
            <p className="text-xl font-black text-slate-900">{metrics.facultyCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Placeholders for missing deep data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6">Qualification Spread</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h4 className="font-bold text-slate-500 mb-1">Awaiting Credentials</h4>
            <p className="text-xs text-slate-400 max-w-xs">Ph.D. and Masters distributions will sync from the HR database module.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6">Workload Allocation</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h4 className="font-bold text-slate-500 mb-1">No sufficient data</h4>
            <p className="text-xs text-slate-400 max-w-xs">Credit hours and subject allocations are not yet available for this department.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CMS HEALTH TAB ---
const CMSHealthTab = ({ data }) => {
  const { departmentName = 'N/A' } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Content <span className="text-cyan-600">Health</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">SEO readiness and content audits for {departmentName} pages.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between min-h-[300px] hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
             <div className="p-2.5 bg-cyan-50 rounded-xl"><BookOpen className="w-5 h-5 text-cyan-500" /></div>
             SEO Readiness
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h4 className="font-bold text-slate-500 mb-1">Awaiting Scanner</h4>
            <p className="text-xs text-slate-400 max-w-xs">Meta tag completion ratios will appear here once the CMS crawler completes.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between min-h-[300px] hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
             <div className="p-2.5 bg-rose-50 rounded-xl"><Activity className="w-5 h-5 text-rose-500" /></div>
             Content Audit
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h4 className="font-bold text-slate-500 mb-1">No missing content</h4>
            <p className="text-xs text-slate-400 max-w-xs">No broken links or outdated department pages detected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AUDIT & ACTIVITY TAB ---
const AuditActivityTab = ({ data }) => {
  const { activityLog = [] } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Audit & <span className="text-emerald-600">Activity</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Chronological log of all actions performed within this department.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl"><Clock className="w-5 h-5 text-blue-500" /></div>
          Local Audit Trail
        </h3>
        
        <div className="flex-1 overflow-y-auto pr-4 space-y-4 max-h-[500px]">
          {activityLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <Clock className="w-10 h-10 text-slate-200 mb-3" />
              <p className="text-sm font-bold text-slate-500">No Recent Activity</p>
              <p className="text-xs text-slate-400 mt-1">Logs will appear here when department members perform actions.</p>
            </div>
          ) : (
            activityLog.map((log, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 hover:border-slate-200 transition-colors group">
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
      </div>
    </div>
  );
};


// --- MAIN SHELL ---
const DepartmentAdminDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!data) return null;
  const { departmentName = 'N/A', noData = false } = data;

  if (noData) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500">
        <Building2 className="w-12 h-12 mb-4 text-slate-300" />
        <h2 className="text-xl font-bold">Unassigned Department</h2>
        <p className="text-sm mt-2">Your account is not linked to a specific department. Please contact Super Admin.</p>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Department Overview', icon: Activity },
    { id: 'students', label: 'Student Analytics', icon: Users },
    { id: 'faculty', label: 'Faculty Analytics', icon: GraduationCap },
    { id: 'cms', label: 'Content Health', icon: BookOpen },
    { id: 'audit', label: 'Audit & Activity', icon: ShieldCheck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DepartmentOverviewTab data={data} />;
      case 'students':
        return <StudentAnalyticsTab data={data} />;
      case 'faculty':
        return <FacultyAnalyticsTab data={data} />;
      case 'cms':
        return <CMSHealthTab data={data} />;
      case 'audit':
        return <AuditActivityTab data={data} />;
      default:
        return (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-dashed border-slate-200 shadow-sm animate-in fade-in hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <Activity className="w-12 h-12 mb-4 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-500">Module Under Construction</h3>
            <p className="text-sm mt-2 max-w-sm text-center">
              The {TABS.find(t => t.id === activeTab)?.label} module is currently being implemented.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50/50 text-slate-600 font-inter">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 shadow-sm flex flex-col min-w-0 break-words h-auto lg:h-screen lg:sticky top-0 z-40">
        <div className="p-6 border-b border-slate-200 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50/50 border border-slate-200 shadow-sm text-[10px] font-bold tracking-widest uppercase text-blue-500 mb-4">
            <Building2 className="w-4 h-4" /> Dept Intelligence
          </div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900 truncate" title={departmentName}>
            {departmentName}
          </h1>
        </div>
        
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-2 lg:p-4 gap-2 lg:gap-1 whitespace-nowrap scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-auto lg:w-full flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-50 text-blue-600 border border-blue-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-slate-400")} />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-slate-200 shadow-sm text-xs text-slate-400 text-center">
          Department Admin Hub
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-[1400px] max-w-full mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DepartmentAdminDashboard;
