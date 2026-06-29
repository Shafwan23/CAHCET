import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building, TrendingUp, Users, BookOpen, Activity, Search } from 'lucide-react';
import { cn } from '../../../../utils/cn';

// --- DRIVE OVERVIEW TAB ---
const DriveOverviewTab = ({ data }) => {
  const { metrics = {} } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Drive <span className="text-emerald-600">Overview</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Active recruitment drives, placement statistics, and highest package tracking.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Placement Season</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <p className="text-xs font-bold text-slate-900">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center min-w-0 break-words gap-4 relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center z-10">
            <Briefcase className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="z-10">
            <p className="text-3xl font-black text-slate-800">{metrics.totalPlaced || 0}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Students Placed</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center min-w-0 break-words gap-4 relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors" />
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center z-10">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div className="z-10">
            <p className="text-3xl font-black text-slate-800">{metrics.totalRecruiters || 0}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Active Recruiters</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center min-w-0 break-words gap-4 relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100 transition-colors" />
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center z-10">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <div className="z-10">
            <p className="text-3xl font-black text-slate-800">{metrics.highestPackage || '0 LPA'}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Highest Package</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6">Upcoming Drives</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h4 className="font-bold text-slate-500 mb-1">Awaiting Schedule</h4>
            <p className="text-xs text-slate-400 max-w-xs">Calendar synchronization for upcoming drives is pending.</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
          <h3 className="font-bold text-slate-800 mb-6">Recent Placements</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h4 className="font-bold text-slate-500 mb-1">No recent records</h4>
            <p className="text-xs text-slate-400 max-w-xs">Student placement records will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- RECRUITERS TAB ---
const RecruitersTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
          Recruiter <span className="text-blue-600">Management</span>
        </h2>
        <p className="text-slate-500 max-w-xl text-sm">Corporate partner database, hiring history, and contact management.</p>
      </div>
    </div>
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between min-h-[400px] hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
         <div className="p-2.5 bg-blue-50 rounded-xl"><Building className="w-5 h-5 text-blue-500" /></div>
         Corporate Partner Matrix
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <h4 className="font-bold text-slate-500 mb-1">Awaiting Recruiter Database</h4>
        <p className="text-xs text-slate-400 max-w-xs">Partner company profiles and historical hiring data will appear here.</p>
      </div>
    </div>
  </div>
);

// --- STUDENTS TAB ---
const StudentsTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
          Student <span className="text-amber-600">Placement DB</span>
        </h2>
        <p className="text-slate-500 max-w-xl text-sm">Eligible candidate rosters, interview tracking, and offer letters.</p>
      </div>
    </div>
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between min-h-[400px] hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
         <div className="p-2.5 bg-amber-50 rounded-xl"><Users className="w-5 h-5 text-amber-500" /></div>
         Candidate Master List
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <h4 className="font-bold text-slate-500 mb-1">Awaiting Candidate Profiles</h4>
        <p className="text-xs text-slate-400 max-w-xs">Student placement profiles and eligibility arrays are pending backend update.</p>
      </div>
    </div>
  </div>
);

// --- CMS & UPDATES TAB ---
const CMSUpdatesTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
          CMS & <span className="text-cyan-600">Updates</span>
        </h2>
        <p className="text-slate-500 max-w-xl text-sm">Manage public placement records, news, and recruitment announcements.</p>
      </div>
    </div>
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between min-h-[400px] hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
         <div className="p-2.5 bg-cyan-50 rounded-xl"><BookOpen className="w-5 h-5 text-cyan-500" /></div>
         Public Placements Portal
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <h4 className="font-bold text-slate-500 mb-1">No pending updates</h4>
        <p className="text-xs text-slate-400 max-w-xs">Placement announcements, news articles, and website banners will be managed here.</p>
      </div>
    </div>
  </div>
);

// --- MAIN SHELL ---
const PlacementCellDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!data) return null;

  const TABS = [
    { id: 'overview', label: 'Drive Overview', icon: Activity },
    { id: 'recruiters', label: 'Recruiter Management', icon: Building },
    { id: 'students', label: 'Student Placement DB', icon: Users },
    { id: 'cms', label: 'CMS & Updates', icon: BookOpen },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DriveOverviewTab data={data} />;
      case 'recruiters':
        return <RecruitersTab />;
      case 'students':
        return <StudentsTab />;
      case 'cms':
        return <CMSUpdatesTab />;
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
    <div className="flex min-h-screen bg-slate-50/50 text-slate-600 font-inter">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col min-w-0 break-words h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50/50 border border-slate-200 shadow-sm text-[10px] font-bold tracking-widest uppercase text-emerald-500 mb-4">
            <Briefcase className="w-4 h-4" /> Career Services
          </div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">
            Placements <span className="text-emerald-500">CRM</span>
          </h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-emerald-500" : "text-slate-400")} />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-slate-200 shadow-sm text-xs text-slate-400 text-center">
          Placement Cell Hub
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PlacementCellDashboard;
