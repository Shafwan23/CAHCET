import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, GraduationCap, Building2, Activity,
  Server, PieChart, Star, TrendingUp, AlertCircle, HelpCircle,
  Filter, ChevronDown, Award, ShieldCheck
} from 'lucide-react';
import { cn } from '../../../../utils/cn';
import AdmissionsAnalyticsTab from './superAdmin/AdmissionsAnalyticsTab';
import DepartmentIntelligenceTab from './superAdmin/DepartmentIntelligenceTab';
import FacultyAnalyticsTab from './superAdmin/FacultyAnalyticsTab';
import PlacementAnalyticsTab from './superAdmin/PlacementAnalyticsTab';
import CMSIntelligenceTab from './superAdmin/CMSIntelligenceTab';
import ReportsCenterTab from './superAdmin/ReportsCenterTab';
import ActivityAuditTab from './superAdmin/ActivityAuditTab';

// --- Shared Components ---
const InfoTooltip = ({ content }) => (
  <div className="relative group flex items-center">
    <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-help ml-1.5" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-100 text-slate-600 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-200">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
    </div>
  </div>
);

// --- 1. Institution Health Gauge ---
const HealthGauge = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 2000, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimatedScore(Math.floor(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  let color = '#10b981'; // Emerald
  if (score < 85) color = '#f59e0b'; // Amber
  if (score < 60) color = '#ef4444'; // Red

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90 drop-shadow-2xl">
          {/* Background circle */}
          <circle cx="70" cy="70" r="60" stroke="#e2e8f0" strokeWidth="8" fill="none" />
          {/* Progress circle */}
          <motion.circle
            cx="70" cy="70" r="60"
            stroke={color} strokeWidth="8" fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-slate-900">{animatedScore}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">out of 100</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center text-xs font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
        Status: <span className="ml-2 font-bold" style={{ color }}>{score >= 85 ? 'EXCELLENT' : score >= 60 ? 'NEEDS ATTENTION' : 'CRITICAL'}</span>
      </div>
    </div>
  );
};

// --- 2. Interactive Department Donut ---
const InteractiveDonut = ({ data, hoveredDept, onHover }) => {
  if (!data || data.length === 0) return <div className="p-10 text-slate-400">Insufficient Data</div>;
  
  const total = data.reduce((sum, d) => sum + d.students, 0);
  let currentAngle = 0;
  // Deep vibrant colors for dark mode
  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#06b6d4', '#f97316', '#64748b', '#14b8a6'];

  return (
    <div className="relative w-56 h-56 max-w-full flex items-center justify-center mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90 overflow-visible">
        {data.slice(0, 8).map((dept, i) => {
          const percentage = dept.students / (total || 1);
          const strokeDasharray = `${percentage * 314} 314`;
          const offset = -(currentAngle * 314);
          currentAngle += percentage;
          const isHovered = hoveredDept?.department === dept.department;
          
          return (
            <motion.circle
              key={dept.department}
              initial={{ strokeDashoffset: 314 }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
              cx="60" cy="60" r="50"
              fill="transparent"
              stroke={colors[i]}
              strokeWidth={isHovered ? 14 : 10}
              strokeDasharray={strokeDasharray}
              onMouseEnter={() => onHover({ ...dept, color: colors[i], percent: (percentage*100).toFixed(1) })}
              onMouseLeave={() => onHover(null)}
              className="transition-all duration-300 cursor-pointer drop-shadow-sm"
              style={isHovered ? { filter: `drop-shadow(0 0 6px ${colors[i]}80)` } : {}}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
        <AnimatePresence mode="wait">
          {hoveredDept ? (
            <motion.div key="hover" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center w-full h-full">
              <span className="text-3xl font-black leading-none mb-1" style={{ color: hoveredDept.color }}>{hoveredDept.percent}%</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 leading-tight line-clamp-2">{hoveredDept.department}</span>
              <span className="text-xs font-bold text-slate-400 mt-1">{hoveredDept.students} Users</span>
            </motion.div>
          ) : (
            <motion.div key="total" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center w-full h-full">
              <span className="text-3xl font-black text-slate-900 leading-none mb-1">{total}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Total</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- 3. Admission Funnel ---
const AdmissionFunnel = ({ funnelData }) => {
  if (!funnelData || funnelData.length === 0) return <div className="text-slate-400 p-6">Insufficient Data</div>;

  return (
    <div className="flex flex-col gap-2 w-full mt-6">
      {funnelData.map((stage, i) => {
        const width = `${Math.max(stage.percentage, 15)}%`; // Keep a minimum width for visibility
        // Color gradient from blue (top) to emerald (bottom)
        const bgColors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-emerald-500'];
        
        return (
          <div key={stage.stage} className="relative group">
            {/* Drop off arrow */}
            {i > 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 flex items-center">
                 ↓ -{funnelData[i-1].count - stage.count}
              </div>
            )}
            
            <div className="flex items-center gap-4 mt-2">
              <div className="w-32 text-right">
                <p className="text-xs font-bold text-slate-600">{stage.stage}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{stage.count} Users</p>
              </div>
              
              <div className="flex-1 bg-white rounded-lg h-10 flex items-center p-1 border border-slate-200 shadow-sm">
                <motion.div
                  initial={{ width: 0 }} animate={{ width }} transition={{ duration: 1, delay: i * 0.1 }}
                  className={cn("h-full rounded flex items-center justify-end px-3 shadow-[0_0_15px_rgba(255,255,255,0.1)] relative overflow-hidden", bgColors[i] || 'bg-slate-500')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                  <span className="text-xs font-black text-slate-900 z-10">{stage.percentage}%</span>
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Executive Overview Tab (Legacy Dashboard) ---
const ExecutiveOverviewTab = ({ data }) => {
  const [hoveredDept, setHoveredDept] = useState(null);

  const { 
    globalMetrics = {}, 
    healthIndex = 0, 
    admissionFunnel = [], 
    departmentIntelligence = [], 
    trendData = [], 
    systemStatus = {}, 
    activityLog = [] 
  } = data;

  // Execute Insights Logic Dynamically
  const sortedByGrowth = [...departmentIntelligence].sort((a,b)=>b.growth - a.growth);
  const sortedByRatio = [...departmentIntelligence].sort((a,b)=>{
    const aR = Math.abs(a.ratio - 15); // Target ideal ratio is 1:15
    const bR = Math.abs(b.ratio - 15);
    return aR - bR;
  });
  
  const largestDept = departmentIntelligence[0] || {};
  const fastestGrowing = sortedByGrowth[0] || {};
  const bestBalance = sortedByRatio[0] || {};
  const highestScore = [...departmentIntelligence].sort((a,b)=>b.score - a.score)[0] || {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-2">
            Executive <span className="text-blue-600">Overview</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm">Real-time institutional health, academic scale, and performance analytics.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Infrastructure</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <p className="text-xs font-bold text-slate-900">{systemStatus.serverUptime} Online</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ROW 1: HEALTH & SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Institution Health Widget */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col min-w-0 break-words items-center justify-center relative group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out z-10 hover:z-20">
          <div className="absolute top-0 right-0 p-6 flex justify-between w-full">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center z-50">Institution Health <InfoTooltip content="Calculated using aggregate department scores, capacity utilization, and faculty strength metrics." /></h3>
            </div>
          </div>
          <div className="mt-10">
            <HealthGauge score={healthIndex} />
          </div>
        </motion.div>

        {/* Campus Snapshot Grid */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-center relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
            <Users className="w-6 h-6 text-blue-600 mb-4" />
            <span className="text-3xl font-black text-slate-900">{globalMetrics.totalApplications}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Admissions</span>
          </div>
          
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-center relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
            <GraduationCap className="w-6 h-6 text-purple-400 mb-4" />
            <span className="text-3xl font-black text-slate-900">{globalMetrics.totalFaculty}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Faculty</span>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-center relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
            <Building2 className="w-6 h-6 text-amber-400 mb-4" />
            <span className="text-3xl font-black text-slate-900">{globalMetrics.activeCourses}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Departments</span>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col min-w-0 break-words justify-center relative overflow-hidden group hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
            <TrendingUp className="w-6 h-6 text-emerald-400 mb-4" />
            <span className="text-3xl font-black text-slate-900">{globalMetrics.placementCount}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Placements</span>
          </div>
        </motion.div>
      </div>

      {/* ROW 2: VISUAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Interactive Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-8 hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out z-10 hover:z-20">
          <div className="flex-1 w-full flex flex-col">
            <h3 className="font-bold text-slate-900 mb-2">Student Allocation Matrix</h3>
            <p className="text-xs text-slate-400 mb-6">Interactive graphical representation</p>
            
            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-2 styled-scrollbar">
              {departmentIntelligence.slice(0, 6).map((dept, i) => {
                const colors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#06b6d4'];
                const color = colors[i % colors.length];
                const isHovered = hoveredDept?.department === dept.department;
                const totalStudents = departmentIntelligence.reduce((sum, d) => sum + d.students, 0);
                
                return (
                  <div 
                    key={dept.department} 
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200", 
                      isHovered ? "bg-slate-50 border border-slate-200 shadow-sm" : "border border-transparent hover:bg-slate-50/50"
                    )}
                    onMouseEnter={() => setHoveredDept({...dept, color, percent: (dept.students/(totalStudents||1)*100).toFixed(1)})} 
                    onMouseLeave={() => setHoveredDept(null)}
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs font-bold text-slate-700 flex-1 truncate pr-2">{dept.department}</span>
                    <span className="text-sm font-black text-slate-900 flex-shrink-0">{dept.students}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="shrink-0 relative">
            <InteractiveDonut data={departmentIntelligence} hoveredDept={hoveredDept} onHover={setHoveredDept} />
          </div>
        </motion.div>

        {/* Admission Funnel Analytics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm shadow-xl hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
           <h3 className="font-bold text-slate-900 mb-2 flex items-center">Pipeline Diagnostics <InfoTooltip content="Calculated strictly from database Application Status arrays." /></h3>
           <p className="text-xs text-slate-400 mb-4">Conversion and drop-off analysis</p>
           <AdmissionFunnel funnelData={admissionFunnel} />
        </motion.div>

      </div>

      {/* ROW 3: EXECUTIVE INSIGHTS ENGINE */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Executive Insights Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Largest Department</p>
            <p className="text-2xl font-black text-slate-900">{largestDept.department || 'N/A'}</p>
            <p className="text-xs text-slate-500 mt-2">{largestDept.students || 0} enrolled students</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Highest Faculty Strength</p>
            <p className="text-2xl font-black text-slate-900">{[...departmentIntelligence].sort((a,b)=>b.faculty-a.faculty)[0]?.department || 'N/A'}</p>
            <p className="text-xs text-slate-500 mt-2">{[...departmentIntelligence].sort((a,b)=>b.faculty-a.faculty)[0]?.faculty || 0} members</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Ideal Students per Faculty</p>
            <p className="text-2xl font-black text-slate-900">{bestBalance.department || 'N/A'}</p>
            <p className="text-xs text-slate-500 mt-2">1 : {bestBalance.ratio || 0} ratio achieved</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100 relative overflow-hidden">
            <Star className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-500/10" />
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Top Performer</p>
            <p className="text-2xl font-black text-slate-900">{highestScore.department || 'N/A'}</p>
            <p className="text-xs text-slate-500 mt-2">{highestScore.score || 0}/100 Performance Score</p>
          </div>
        </div>
      </div>

    </div>
  );
};

// --- Main Super Admin Dashboard (Platform Shell) ---
const SuperAdminDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('executive');

  if (!data) return null;

  const TABS = [
    { id: 'executive', label: 'Executive Overview', icon: Activity },
    { id: 'admissions', label: 'Admissions Analytics', icon: Users },
    { id: 'departments', label: 'Department Intelligence', icon: Building2 },
    { id: 'faculty', label: 'Faculty Analytics', icon: GraduationCap },
    { id: 'placements', label: 'Placement Analytics', icon: TrendingUp },
    { id: 'cms', label: 'CMS Intelligence', icon: BookOpen },
    { id: 'reports', label: 'Reports Center', icon: PieChart },
    { id: 'audit', label: 'Activity & Audit', icon: ShieldCheck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveOverviewTab data={data} />;
      case 'admissions':
        return <AdmissionsAnalyticsTab data={data} />;
      case 'departments':
        return <DepartmentIntelligenceTab data={data} />;
      case 'faculty':
        return <FacultyAnalyticsTab data={data} />;
      case 'placements':
        return <PlacementAnalyticsTab data={data} />;
      case 'cms':
        return <CMSIntelligenceTab data={data} />;
      case 'reports':
        return <ReportsCenterTab data={data} />;
      case 'audit':
        return <ActivityAuditTab data={data} />;
      default:
        return (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-dashed border-slate-200 shadow-sm animate-in fade-in hover:-translate-y-1.5 hover:border-violet-300/60 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-300 ease-out">
            <Activity className="w-12 h-12 mb-4 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-500">Module Under Construction</h3>
            <p className="text-sm mt-2 max-w-sm text-center">
              The {TABS.find(t => t.id === activeTab)?.label} module is currently being implemented as part of the Institutional Intelligence Platform upgrade.
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50/50 border border-slate-200 shadow-sm text-[10px] font-bold tracking-widest uppercase text-amber-500 mb-4">
            <ShieldCheck className="w-4 h-4" /> Global Intelligence
          </div>
          <h1 className="text-2xl font-display font-black tracking-tight text-slate-900">
            CAHCET <span className="text-blue-500">MIS</span>
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
                    ? "bg-blue-50 text-blue-600 border border-blue-100" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-slate-200 shadow-sm text-xs text-slate-400 text-center">
          Super Admin Workspace &copy; 2026
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
