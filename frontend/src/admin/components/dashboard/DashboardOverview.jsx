import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, GraduationCap, Image, Calendar, LayoutDashboard,
  TrendingUp, Globe, Edit3, Upload, Bell, Settings,
  ChevronRight, Activity, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

// Animated counter hook
const useCounter = (target, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const end = parseInt(target) || 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const StatCard = ({ stat, index }) => {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const count = useCounter(stat.value, 1500, started);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const Icon = stat.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${stat.color}`} />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend > 0 ? 'bg-primary-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
          {stat.trend > 0 ? '↑' : '→'} {stat.trendLabel}
        </span>
      </div>
      <p className="text-3xl font-black text-slate-800 mb-1">
        {started ? count.toLocaleString() : '0'}{stat.suffix}
      </p>
      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
    </motion.div>
  );
};

const QuickActionCard = ({ item, index }) => {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.06 }}
    >
      <Link
        to={item.path}
        className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-amber-200 transition-all duration-300 group"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${item.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{item.label}</p>
          <p className="text-xs text-slate-400">{item.desc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
      </Link>
    </motion.div>
  );
};

// Simple bar chart component
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((item, i) => (
        <motion.div
          key={i}
          className="flex-1 flex flex-col items-center gap-1.5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: 'bottom' }}
        >
          <div
            className="w-full rounded-lg bg-gradient-to-t from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 transition-colors cursor-default"
            style={{ height: `${(item.value / max) * 100}%`, minHeight: 4 }}
            title={`${item.label}: ${item.value}`}
          />
          <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const ActivityTimeline = ({ activities }) => {
  const icons = {
    Published: <Globe className="w-3.5 h-3.5 text-amber-500" />,
    Edited: <Edit3 className="w-3.5 h-3.5 text-blue-500" />,
    Uploaded: <Upload className="w-3.5 h-3.5 text-primary-500" />,
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No recent activity yet.</p>
        <p className="text-xs text-slate-300 mt-1">Your changes will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 8).map((item, i) => (
        <motion.div
          key={item.id || i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-3"
        >
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
            {icons[item.action] || <Activity className="w-3.5 h-3.5 text-slate-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 font-medium">
              <span className="text-amber-600">{item.action}</span> · {item.section}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {formatTime(item.timestamp)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const DashboardOverview = () => {
  const data = {};

  const stats = [
    { label: 'Total Students', value: data?.stats?.[0]?.value || '5000', suffix: '+', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600', trend: 1, trendLabel: 'Enrolled' },
    { label: 'Active Courses', value: String((data?.courses || []).filter(c => c.status === 'published').length || 11), suffix: '', icon: BookOpen, bg: 'bg-primary-50', color: 'text-amber-600', trend: 1, trendLabel: 'Live' },
    { label: 'Faculty Members', value: data?.stats?.[1]?.value || '200', suffix: '+', icon: GraduationCap, bg: 'bg-primary-50', color: 'text-primary-600', trend: 0, trendLabel: 'Total' },
    { label: 'Gallery Images', value: String(data?.gallery?.length || 3), suffix: '', icon: Image, bg: 'bg-pink-50', color: 'text-pink-600', trend: 0, trendLabel: 'Published' },
    { label: 'Placement Rate', value: data?.stats?.[3]?.value || '95', suffix: '%', icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600', trend: 1, trendLabel: 'This year' },
    { label: 'Upcoming Events', value: String((data?.events || []).filter(e => e.status === 'published').length || 2), suffix: '', icon: Calendar, bg: 'bg-primary-50', color: 'text-amber-600', trend: 0, trendLabel: 'Scheduled' },
  ];

  const chartData = [
    { label: 'CSE', value: 120 },
    { label: 'ECE', value: 60 },
    { label: 'EEE', value: 60 },
    { label: 'MECH', value: 60 },
    { label: 'IT', value: 60 },
    { label: 'AIDS', value: 60 },
    { label: 'AIML', value: 60 },
    { label: 'Civil', value: 60 },
    { label: 'MBA', value: 60 },
  ];

  const quickActions = [
    { label: 'Add Event', desc: 'Create a new campus event', path: '/admin/dashboard/updates/events', icon: Calendar, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Add Faculty', desc: 'Add new staff members', path: '/admin/dashboard/departments/cse/faculties', icon: Users, bg: 'bg-primary-50', color: 'text-primary-600' },
    { label: 'Upload Curriculum', desc: 'Update syllabus files', path: '/admin/dashboard/departments/cse/curriculum', icon: BookOpen, bg: 'bg-primary-50', color: 'text-amber-600' },
    { label: 'Add Placement Record', desc: 'Log new student offers', path: '/admin/dashboard/placements/students', icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600' },
    { label: 'Upload Gallery Images', desc: 'Add to event galleries', path: '/admin/dashboard/content/gallery', icon: Image, bg: 'bg-pink-50', color: 'text-pink-600' },
    { label: 'Edit Hero Section', desc: 'Update homepage banner', path: '/admin/dashboard/homepage/hero', icon: LayoutDashboard, bg: 'bg-primary-50', color: 'text-primary-600' },
    { label: 'Media Uploads', desc: 'Central file storage', path: '/admin/dashboard/content/media', icon: Upload, bg: 'bg-cyan-50', color: 'text-cyan-600' },
    { label: 'System Settings', desc: 'SEO & Config', path: '/admin/dashboard/seo', icon: Settings, bg: 'bg-slate-100', color: 'text-slate-600' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right, #d4af37, transparent)' }} />
        <div className="relative z-10">
          <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
          <h1 className="text-2xl font-black mb-1">CAHCET Admin Portal</h1>
          <p className="text-slate-400 text-sm">Manage your college website content from one place.</p>
        </div>
        <div className="absolute top-4 right-6 hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          System Online
        </div>
      </motion.div>

      {/* Stats grid */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
        </div>
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Enrollment Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">Department Intake</h3>
              <p className="text-xs text-slate-400">Approved seats per department</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">2025-26</span>
          </div>
          <BarChart data={chartData} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
              <p className="text-xs text-slate-400">Your latest changes</p>
            </div>
            <Link to="/admin/dashboard/notifications" className="text-xs text-amber-600 hover:text-amber-700 font-semibold">
              View all →
            </Link>
          </div>
          <ActivityTimeline activities={data.activityLog || []} />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {quickActions.map((item, i) => <QuickActionCard key={i} item={item} index={i} />)}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Website', status: 'operational', icon: Globe },
            { label: 'CMS Storage', status: 'operational', icon: CheckCircle },
            { label: 'Media Storage', status: data.media?.length >= 50 ? 'warning' : 'operational', icon: Upload },
            { label: 'Content Sync', status: data.hasDraft ? 'warning' : 'operational', icon: Activity },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`w-2 h-2 rounded-full ${item.status === 'operational' ? 'bg-amber-500' : 'bg-amber-500'} animate-pulse`} />
                <Icon className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                  <p className={`text-[10px] capitalize ${item.status === 'operational' ? 'text-amber-500' : 'text-amber-500'}`}>{item.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
