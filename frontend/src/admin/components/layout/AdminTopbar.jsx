import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, ExternalLink, LogOut, User, Settings, ChevronDown, Search, Moon, Sun } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const BREADCRUMB_MAP = {
  '/admin/dashboard': 'Dashboard',
  '/admin/dashboard/seo': 'SEO Settings',
  
  // Homepage
  '/admin/dashboard/homepage/navbar': 'Navbar Editor',
  '/admin/dashboard/homepage/hero': 'Hero Section Editor',
  '/admin/dashboard/homepage/stats': 'Animation Numbers Editor',
  '/admin/dashboard/homepage/academic': 'Academic Department Section Editor',
  '/admin/dashboard/homepage/placement-excellence': 'Placement Excellence Section Editor',
  '/admin/dashboard/homepage/contact': 'Contact Section Editor',
  '/admin/dashboard/homepage/footer': 'Footer Editor',
  '/admin/dashboard/homepage/gallery': 'Homepage Gallery Editor',
  '/admin/dashboard/homepage/videos': 'Video Showcase Editor',
  '/admin/dashboard/homepage/facilities': 'Campus Facilities Editor',
  '/admin/dashboard/departments/overview': 'Departments Overview Editor',
  
  // Updates
  '/admin/dashboard/updates/events': 'Latest Events',
  '/admin/dashboard/updates/placements': 'Placement Updates',
  '/admin/dashboard/updates/announcements': 'Announcements',
  '/admin/dashboard/updates/newsletters': 'Newsletters',
  
  // Placements
  '/admin/dashboard/placements/recruiters': 'Recruiters Management',
  '/admin/dashboard/placements/students': 'Students Placed',
  
  // About
  '/admin/dashboard/about/institution': 'Institution Info',
  '/admin/dashboard/about/peoples-messages': "People's Messages",
  '/admin/dashboard/about/anti-ragging': 'Anti Ragging Policy',
  '/admin/dashboard/about/values': 'Values & Philosophy',
  '/admin/dashboard/about/approval': 'Government Approval',
  '/admin/dashboard/about/governing-policy': 'Governing Policy',
  '/admin/dashboard/about/refund-policy': 'Refund Policy',
  '/admin/dashboard/about/terms': 'Terms & Conditions',
  '/admin/dashboard/about/privacy': 'Privacy Policy',

  // Academics
  '/admin/dashboard/academics/teaching-methodology': 'Teaching Methodology',
  '/admin/dashboard/academics/facilities': 'Campus Facilities',
  '/admin/dashboard/academics/sports': 'Sports',
  '/admin/dashboard/academics/campus-life': 'Campus Life',
  '/admin/dashboard/academics/calendar': 'Academic Calendar',
  '/admin/dashboard/academics/holidays': 'List of Holidays',
  '/admin/dashboard/academics/syllabus': 'Syllabus Archive',

  // Admissions
  '/admin/dashboard/admissions/registration': 'Registration 2026',
  '/admin/dashboard/admissions/procedure': 'Admission Procedure',
  '/admin/dashboard/admissions/scholarships': 'Scholarships & Awards',
  '/admin/dashboard/admissions/loan': 'Education Loans',
  '/admin/dashboard/admissions/payments': 'Fee Payments',

  // Research
  '/admin/dashboard/research/main': 'Research Center',

  // Contact
  '/admin/dashboard/contact/main': 'Contact Us',
  
  // Admin
  '/admin/dashboard/admin/profile': 'Profile Settings',
  '/admin/dashboard/admin/password': 'Change Password',
  '/admin/dashboard/admin/activity': 'Activity Logs',
  '/admin/dashboard/admin/notifications': 'Notifications',
  '/admin/dashboard/users': 'User Management',
};

const DEPT_SECTION_LABELS = {
  overview: 'Department Overview',
  facilities: 'Facilities',
  faculties: 'Faculties',
  achievements: 'Achievements',
  gallery: 'Events Gallery',
  curriculum: 'Curriculum',
  contact: 'Contact',
};

function getDeptBreadcrumb(pathname) {
  const match = pathname.match(/\/admin\/dashboard\/departments\/([^/]+)\/?([^/]*)?/);
  if (!match) return null;
  const deptKey = match[1]?.toUpperCase();
  const section = match[2];
  if (section && DEPT_SECTION_LABELS[section]) return `${deptKey} — ${DEPT_SECTION_LABELS[section]}`;
  return `${deptKey} Department`;
}

const AdminTopbar = ({ onMenuClick }) => {
  const { admin, logout } = useAdminAuth();
  const unreadCount = 0;
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);

  const pageTitle = getDeptBreadcrumb(location.pathname) || BREADCRUMB_MAP[location.pathname] || 'Admin Panel';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-slate-100 h-16 flex items-center px-4 gap-4 shrink-0 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="hidden sm:block">
        <h2 className="text-sm font-semibold text-slate-800">{pageTitle}</h2>
        <p className="text-xs text-slate-400">CAHCET Admin Panel</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2" ref={profileRef}>
        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Site
        </a>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(false); navigate('/admin/dashboard/notifications'); }}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(p => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xs">
              {admin?.initials || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-700 leading-tight">{admin?.name}</p>
              <p className="text-[10px] text-slate-400">{admin?.role}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-sm font-semibold text-slate-800">{admin?.name}</p>
                  <p className="text-xs text-slate-400">{admin?.role}</p>
                </div>
                <div className="py-1.5">
                  <Link
                    to="/admin/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-500 hover:bg-primary-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
