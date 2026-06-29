import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, CheckCircle, Clock, BookOpen, Activity, FileText, HelpCircle } from 'lucide-react';
import { cn } from '../../../../utils/cn';

// --- MY CONTENT TAB ---
const MyContentTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
          My <span className="text-violet-600">Content</span>
        </h2>
        <p className="text-slate-500 max-w-xl text-sm">Manage your assigned sections and update content on the live site.</p>
      </div>
    </div>
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between min-h-[400px] hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
         <div className="p-2.5 bg-violet-50 rounded-xl"><FileText className="w-5 h-5 text-violet-500" /></div>
         Assigned Pages
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <h4 className="font-bold text-slate-500 mb-1">No Pages Assigned</h4>
        <p className="text-xs text-slate-400 max-w-xs">Your Department Admin needs to assign specific sections for you to edit.</p>
      </div>
    </div>
  </div>
);

// --- DEPARTMENT INSIGHTS TAB ---
const InsightsTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
          Department <span className="text-emerald-600">Insights</span>
        </h2>
        <p className="text-slate-500 max-w-xl text-sm">Basic analytics and performance metrics for your department.</p>
      </div>
    </div>
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between min-h-[400px] hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
         <div className="p-2.5 bg-emerald-50 rounded-xl"><Activity className="w-5 h-5 text-emerald-500" /></div>
         Performance Overview
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <h4 className="font-bold text-slate-500 mb-1">Awaiting Data</h4>
        <p className="text-xs text-slate-400 max-w-xs">Department level analytics are not currently available for your role.</p>
      </div>
    </div>
  </div>
);

// --- EDIT HISTORY TAB ---
const EditHistoryTab = ({ activityLog }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
          Edit <span className="text-amber-600">History</span>
        </h2>
        <p className="text-slate-500 max-w-xl text-sm">Track your past updates and quickly resume editing.</p>
      </div>
    </div>
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
         <div className="p-2.5 bg-amber-50 rounded-xl"><Clock className="w-5 h-5 text-amber-500" /></div>
         Recent Activity
      </h3>
      <div className="space-y-4">
        {activityLog.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <Clock className="w-10 h-10 text-slate-200 mb-3" />
            <p className="text-sm font-bold text-slate-500">No recent CMS updates found.</p>
          </div>
        ) : activityLog.map(log => (
          <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-100 transition-colors group">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-slate-700">Section Updated</p>
                <p className="text-xs text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <button className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent group-hover:border-amber-200">
              <Edit3 className="w-3 h-3" /> Edit Again
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- SUPPORT TAB ---
const SupportTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
          Faculty <span className="text-blue-600">Support</span>
        </h2>
        <p className="text-slate-500 max-w-xl text-sm">Get help with the CMS, request permissions, or report issues.</p>
      </div>
    </div>
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-between min-h-[400px] hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
         <div className="p-2.5 bg-blue-50 rounded-xl"><HelpCircle className="w-5 h-5 text-blue-500" /></div>
         Help Center
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <h4 className="font-bold text-slate-500 mb-1">Contact your Department Admin</h4>
        <p className="text-xs text-slate-400 max-w-xs">For immediate assistance, please reach out to your designated Department Admin.</p>
      </div>
    </div>
  </div>
);

// --- MAIN SHELL ---
const FacultyEditorDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('content');

  if (!data) return null;
  const { activityLog = [] } = data;

  const TABS = [
    { id: 'content', label: 'My Content', icon: BookOpen },
    { id: 'insights', label: 'Department Insights', icon: Activity },
    { id: 'history', label: 'Edit History', icon: Clock },
    { id: 'support', label: 'Faculty Support', icon: HelpCircle },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <MyContentTab />;
      case 'insights':
        return <InsightsTab />;
      case 'history':
        return <EditHistoryTab activityLog={activityLog} />;
      case 'support':
        return <SupportTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-600 font-inter">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col min-w-0 break-words h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50/50 border border-slate-200 shadow-sm text-[10px] font-bold tracking-widest uppercase text-violet-500 mb-4">
            <Edit3 className="w-4 h-4" /> Workspace
          </div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">
            Faculty <span className="text-violet-500">Editor</span>
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
                    ? "bg-violet-50 text-violet-600 border border-violet-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-violet-500" : "text-slate-400")} />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-slate-200 shadow-sm text-xs text-slate-400 text-center">
          Faculty Publishing Hub
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

export default FacultyEditorDashboard;
