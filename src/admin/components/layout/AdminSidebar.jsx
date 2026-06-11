import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search as SearchIcon, Home, Menu,
  AlignJustify, Image as ImageIcon, Binary, BookOpen, 
  TrendingUp, Phone, Footprints, Calendar, Megaphone, 
  Newspaper, Briefcase, Star, Upload, FileText, FileBadge,
  Images, UserCircle, Lock, Activity, Bell, LogOut,
  Building2, ChevronRight, X, Layers, Trophy, BookOpenCheck, MapPin,
  Shield, Heart, CheckCircle, Receipt, Scroll, Info,
  Edit3, FileCheck, Award, Landmark, CreditCard, FlaskConical, PhoneCall,
  Settings, Bot, Users
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DEPARTMENTS } from '../../services/departmentService';
import { roleService } from '../../services/roleService';

/* ─────────────────────────────────────────
   Navigation definitions
───────────────────────────────────────── */
const OVERVIEW_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'SEO Settings', icon: SearchIcon,      path: '/admin/dashboard/seo' },
];

const INSTITUTION_ITEMS = [
  { label: 'Courses', icon: BookOpen, path: '/admin/dashboard/courses' },
  { label: 'Faculty', icon: Users, path: '/admin/dashboard/faculty' },
  { label: 'Gallery', icon: Images, path: '/admin/dashboard/gallery' },
];

const HOMEPAGE_ITEMS = [
  { label: 'Full Homepage Editor',         icon: Home,         path: '/admin/dashboard/home' },
  { label: 'Navbar',                       icon: AlignJustify, path: '/admin/dashboard/homepage/navbar' },
  { label: 'Hero Section',                 icon: ImageIcon,    path: '/admin/dashboard/homepage/hero' },
  { label: 'Animation Numbers Section',    icon: Binary,       path: '/admin/dashboard/homepage/stats' },
  { label: 'Academic Department Section',  icon: BookOpen,     path: '/admin/dashboard/homepage/academic' },
  { label: 'Placement Excellence Section', icon: TrendingUp,   path: '/admin/dashboard/homepage/placement-excellence' },
  { label: 'Contact Section',              icon: Phone,        path: '/admin/dashboard/homepage/contact' },
  { label: 'Footer',                       icon: Footprints,   path: '/admin/dashboard/homepage/footer' },
];

const UPDATES_ITEMS = [
  { label: 'Latest Events',     icon: Calendar,   path: '/admin/dashboard/updates/events' },
  { label: 'Announcements',     icon: Megaphone,  path: '/admin/dashboard/updates/announcements' },
  { label: 'Newsletters',       icon: Newspaper,  path: '/admin/dashboard/updates/newsletters' },
  { label: 'Placement Updates', icon: TrendingUp, path: '/admin/dashboard/updates/placements' },
];

const DEPT_SECTIONS = [
  { key: 'overview',      label: 'Department Overview', icon: Building2 },
  { key: 'facilities',    label: 'Facilities',          icon: Layers },
  { key: 'faculties',     label: 'Faculties',           icon: UserCircle },
  { key: 'achievements',  label: 'Achievements',        icon: Trophy },
  { key: 'gallery',       label: 'Events Gallery',      icon: Images },
  { key: 'curriculum',    label: 'Curriculum',          icon: BookOpenCheck },
  { key: 'contact',       label: 'Contact Us',          icon: MapPin },
];

const PLACEMENTS_ITEMS = [
  { label: 'Recruiters',      icon: Briefcase, path: '/admin/dashboard/placements/recruiters' },
  { label: 'Students Placed', icon: Star,      path: '/admin/dashboard/placements/students' },
];

const ABOUT_ITEMS = [
  { label: 'Full About Editor', icon: Info, path: '/admin/dashboard/about' },
  { label: 'Institution', icon: Building2, path: '/admin/dashboard/about/institution' },
  { label: "People's Messages", icon: UserCircle, path: '/admin/dashboard/about/peoples-messages' },
  { label: 'Anti Ragging', icon: Shield, path: '/admin/dashboard/about/anti-ragging' },
  { label: 'Values & Philosophy', icon: Heart, path: '/admin/dashboard/about/values' },
  { label: 'Govt Approval', icon: CheckCircle, path: '/admin/dashboard/about/approval' },
  { label: 'Governing Policy', icon: FileText, path: '/admin/dashboard/about/governing-policy' },
  { label: 'Refund Policy', icon: Receipt, path: '/admin/dashboard/about/refund-policy' },
  { label: 'Terms & Conditions', icon: Scroll, path: '/admin/dashboard/about/terms' },
  { label: 'Privacy Policy', icon: Lock, path: '/admin/dashboard/about/privacy' },
];

const ACADEMICS_ITEMS = [
  { label: 'Full Academics Editor', icon: BookOpenCheck, path: '/admin/dashboard/academics' },
  { label: 'Teaching Methodology', icon: BookOpen, path: '/admin/dashboard/academics/teaching-methodology' },
  { label: 'Campus Facilities', icon: Building2, path: '/admin/dashboard/academics/facilities' },
  { label: 'Sports', icon: Trophy, path: '/admin/dashboard/academics/sports' },
  { label: 'Campus Life', icon: Heart, path: '/admin/dashboard/academics/campus-life' },
  { label: 'Academic Calendar', icon: Calendar, path: '/admin/dashboard/academics/calendar' },
  { label: 'List of Holidays', icon: Calendar, path: '/admin/dashboard/academics/holidays' },
  { label: 'Syllabus', icon: FileText, path: '/admin/dashboard/academics/syllabus' },
];

const ADMISSIONS_ITEMS = [
  { label: 'Full Admissions Editor', icon: FileBadge, path: '/admin/dashboard/admissions' },
  { label: 'Registration 2026', icon: Edit3, path: '/admin/dashboard/admissions/registration' },
  { label: 'Procedure', icon: FileCheck, path: '/admin/dashboard/admissions/procedure' },
  { label: 'Scholarships', icon: Award, path: '/admin/dashboard/admissions/scholarships' },
  { label: 'Education Loan', icon: Landmark, path: '/admin/dashboard/admissions/loan' },
  { label: 'Payments', icon: CreditCard, path: '/admin/dashboard/admissions/payments' },
];

const RESEARCH_ITEMS = [
  { label: 'Research Center', icon: FlaskConical, path: '/admin/dashboard/research/main' },
];

const CONTACT_ITEMS = [
  { label: 'Contact Us', icon: PhoneCall, path: '/admin/dashboard/contact/main' },
];

const ADMIN_ITEMS = [
  { label: 'User Management',  icon: Settings,   path: '/admin/dashboard/users' },
  { label: 'Activity Logs',    icon: Activity,   path: '/admin/dashboard/admin/activity' },
];

const CHATBOT_ITEMS = [
  { label: 'Chatbot Settings', icon: Bot, path: '/admin/dashboard/chatbot/settings' },
  { label: 'Welcome Onboarding', icon: Edit3, path: '/admin/dashboard/chatbot/welcome' },
  { label: 'Admission Leads', icon: Users, path: '/admin/dashboard/chatbot/leads' },
];

/* ─────────────────────────────────────────
   SidebarNavLink
───────────────────────────────────────── */
const SidebarNavLink = ({ item, collapsed, onClose, indent = false }) => {
  const unreadCount = 0;
  const Icon = item.icon;
  const showBadge = item.badge && unreadCount > 0;
  
  return (
    <NavLink
      to={item.path}
      end={item.path === '/admin/dashboard'}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative
        ${indent ? 'px-2.5 ml-4 text-xs' : 'px-3'}
        ${isActive
          ? 'bg-amber-500/15 text-amber-400 font-semibold'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <Icon className={`${indent ? 'w-3.5 h-3.5' : 'w-[18px] h-[18px]'} shrink-0`} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {showBadge && (
        <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center`}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </NavLink>
  );
};

/* ─────────────────────────────────────────
   CollapsibleGroup (for CMS sections)
───────────────────────────────────────── */
const CollapsibleGroup = ({ label, icon: GroupIcon, items, collapsed, onClose, storageKey }) => {
  const location = useLocation();
  const isAnyActive = items.some(i => location.pathname.startsWith(i.path));
  
  const [open, setOpen] = useState(() => {
    if (isAnyActive) return true;
    try { return sessionStorage.getItem(storageKey) === '1'; } catch { return false; }
  });

  const toggle = () => setOpen(o => {
    const next = !o;
    try { sessionStorage.setItem(storageKey, next ? '1' : '0'); } catch {}
    return next;
  });

  return (
    <div>
      <button
        onClick={toggle}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
          ${isAnyActive ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
      >
        <GroupIcon className="w-[18px] h-[18px] shrink-0" />
        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left">{label}</span>
            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </motion.span>
          </>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-3 border-l border-white/5 mt-0.5 space-y-0.5 pb-1">
              {items.map(item => (
                <SidebarNavLink key={item.path} item={item} collapsed={false} onClose={onClose} indent />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────
   Department Accordion
───────────────────────────────────────── */
const DeptAccordion = ({ dept, collapsed, onClose }) => {
  const location = useLocation();
  const isActive = location.pathname.includes(`/departments/${dept.key}`);
  const SK = `cahcet_dept_open_${dept.key}`;

  const [open, setOpen] = useState(() => {
    if (isActive) return true;
    try { return sessionStorage.getItem(SK) === '1'; } catch { return false; }
  });

  const toggle = () => setOpen(o => {
    const next = !o;
    try { sessionStorage.setItem(SK, next ? '1' : '0'); } catch {}
    return next;
  });

  return (
    <div>
      <button
        onClick={toggle}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
          ${isActive ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
      >
        <span
          className="w-[18px] h-[18px] rounded-md shrink-0 flex items-center justify-center text-[10px] font-black text-white"
          style={{ backgroundColor: dept.color }}
        >
          {dept.label.slice(0, 2)}
        </span>
        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left">{dept.label}</span>
            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </motion.span>
          </>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-3 border-l border-white/5 mt-0.5 space-y-0.5 pb-1">
              {DEPT_SECTIONS.map(sec => {
                const path = `/admin/dashboard/departments/${dept.key}/${sec.key}`;
                return (
                  <SidebarNavLink key={sec.key} item={{ ...sec, path }} collapsed={false} onClose={onClose} indent />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────
   Section heading
───────────────────────────────────────── */
const SectionHeading = ({ label }) => (
  <p className="text-[10px] uppercase tracking-widest font-bold px-3 mt-6 mb-2 text-slate-500">
    {label}
  </p>
);

/* ─────────────────────────────────────────
   MAIN SIDEBAR
───────────────────────────────────────── */
const AdminSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { logout, admin, isSuperAdmin, role } = useAdminAuth();
  const navigate = useNavigate();

  // Scroll preservation: ref + restore on every render
  const navScrollRef = useRef(null);
  const SCROLL_KEY = 'cahcet_sidebar_scroll_v3';

  const saveScroll = useCallback(() => {
    if (navScrollRef.current) {
      try { sessionStorage.setItem(SCROLL_KEY, String(navScrollRef.current.scrollTop)); } catch {}
    }
  }, []);

  const restoreScroll = useCallback(() => {
    if (navScrollRef.current) {
      try {
        const saved = parseInt(sessionStorage.getItem(SCROLL_KEY) || '0', 10);
        requestAnimationFrame(() => {
          if (navScrollRef.current) navScrollRef.current.scrollTop = saved;
        });
      } catch {}
    }
  }, []);

  useEffect(() => { restoreScroll(); }, [restoreScroll]);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  // Visibility Rules based on exact requirements:
  // - SUPER_ADMIN: sees everything
  // - DEPARTMENT_ADMIN & FACULTY_EDITOR: sees all departments, about, academics, admissions, research (to trigger read only) but NOT global settings or admin users.
  // - PLACEMENT_CELL: sees Placements, Notifications, Profile (Updates placement tab is part of Updates).

  const showGlobalSettings = isSuperAdmin;
  const showDepartments = role !== 'PLACEMENT_CELL';
  const showAcademicsAboutAdmissions = role !== 'PLACEMENT_CELL';
  const showPlacements = isSuperAdmin || role === 'PLACEMENT_CELL';

  const SidebarContent = ({ onClose }) => {
    useEffect(() => { restoreScroll(); }, []);

    return (
      <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/5 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-black text-sm">C</div>
              <div>
                <span className="text-white font-bold text-sm">CAHCET</span>
                <p className="text-[10px] text-slate-500 leading-tight">Enterprise CMS</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors hidden lg:flex"
          >
            <Menu className="w-4 h-4" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors lg:hidden">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── SCROLLABLE NAV ── */}
        <nav
          ref={navScrollRef}
          onScroll={saveScroll}
          className="flex-1 overflow-y-auto px-3 py-2 min-h-0"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* OVERVIEW */}
          {!collapsed && <SectionHeading label="Overview" />}
          <div className="space-y-0.5">
            {OVERVIEW_ITEMS.map(item => (
              (isSuperAdmin || item.label === 'Dashboard') && 
              <SidebarNavLink key={item.path} item={item} collapsed={collapsed} onClose={() => { saveScroll(); onClose?.(); }} />
            ))}
          </div>

          {showGlobalSettings && (
            <>
              {/* HOMEPAGE */}
              {!collapsed && <SectionHeading label="Homepage" />}
              <div className="space-y-0.5">
                <CollapsibleGroup
                  label="Homepage Editor"
                  icon={Home}
                  items={HOMEPAGE_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_homepage_open"
                />
              </div>

              {/* UPDATES */}
              {!collapsed && <SectionHeading label="Updates" />}
              <div className="space-y-0.5">
                <CollapsibleGroup
                  label="Updates Manager"
                  icon={Megaphone}
                  items={UPDATES_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_updates_open"
                />
              </div>
            </>
          )}

          {/* DEPARTMENTS */}
          {showDepartments && (
            <>
              {!collapsed && <SectionHeading label="Departments" />}
              <div className="space-y-0.5">
                {DEPARTMENTS.map(dept => (
                  <DeptAccordion
                    key={dept.key}
                    dept={dept}
                    collapsed={collapsed}
                    onClose={() => { saveScroll(); onClose?.(); }}
                  />
                ))}
              </div>
            </>
          )}

          {/* PLACEMENTS */}
          {showPlacements && (
            <>
              {!collapsed && <SectionHeading label="Placements" />}
              <div className="space-y-0.5">
                <CollapsibleGroup
                  label="Placements CRM"
                  icon={Briefcase}
                  items={PLACEMENTS_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_placements_open"
                />
              </div>
            </>
          )}

          {/* GENERAL PAGES (Read Only for Dept/Faculty) */}
          {showAcademicsAboutAdmissions && (
            <>
              {/* INSTITUTION DATA */}
              {!collapsed && <SectionHeading label="Institution Data" />}
              <div className="space-y-0.5 mb-2">
                <CollapsibleGroup
                  label="Institution Records"
                  icon={Building2}
                  items={INSTITUTION_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_institution_open"
                />
              </div>

              {/* ABOUT */}
              {!collapsed && <SectionHeading label="About" />}
              <div className="space-y-0.5 mb-2">
                <CollapsibleGroup
                  label="About Sections"
                  icon={Info}
                  items={ABOUT_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_about_open"
                />
              </div>

              {/* ACADEMICS */}
              {!collapsed && <SectionHeading label="Academics" />}
              <div className="space-y-0.5 mb-2">
                <CollapsibleGroup
                  label="Academics Pages"
                  icon={BookOpenCheck}
                  items={ACADEMICS_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_academics_open"
                />
              </div>

              {/* ADMISSIONS */}
              {!collapsed && <SectionHeading label="Admissions" />}
              <div className="space-y-0.5 mb-2">
                <CollapsibleGroup
                  label="Admissions Pages"
                  icon={FileBadge}
                  items={ADMISSIONS_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_admissions_open"
                />
              </div>

              {/* RESEARCH */}
              {!collapsed && <SectionHeading label="Research" />}
              <div className="space-y-0.5 mb-2">
                <CollapsibleGroup
                  label="Research Pages"
                  icon={FlaskConical}
                  items={RESEARCH_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_research_open"
                />
              </div>

              {/* CONTACT US */}
              {!collapsed && <SectionHeading label="Contact Us" />}
              <div className="space-y-0.5 mb-2">
                <CollapsibleGroup
                  label="Contact Pages"
                  icon={PhoneCall}
                  items={CONTACT_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_contact_open"
                />
              </div>

              {/* CHATBOT AI */}
              {!collapsed && <SectionHeading label="AI Assistant" />}
              <div className="space-y-0.5 mb-2">
                <CollapsibleGroup
                  label="Chatbot Manager"
                  icon={Bot}
                  items={CHATBOT_ITEMS}
                  collapsed={collapsed}
                  onClose={() => { saveScroll(); onClose?.(); }}
                  storageKey="cahcet_chatbot_open"
                />
              </div>
            </>
          )}

          {/* SETTINGS / PROFILE */}
          {!collapsed && <SectionHeading label="Account" />}
          <div className="space-y-0.5">
            <SidebarNavLink item={{ label: 'Profile Settings', icon: UserCircle, path: '/admin/dashboard/admin/profile' }} collapsed={collapsed} onClose={() => { saveScroll(); onClose?.(); }} />
            {isSuperAdmin && ADMIN_ITEMS.map(item => (
              <SidebarNavLink key={item.path} item={item} collapsed={collapsed} onClose={() => { saveScroll(); onClose?.(); }} />
            ))}
          </div>

          <div className="h-6" />
        </nav>

        {/* User Info & Logout Fixed at Bottom */}
        <div className="border-t border-white/5 shrink-0 bg-slate-900/95 backdrop-blur-md">
          {!collapsed && (
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0">
                  {admin?.initials || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{admin?.name || 'Admin'}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {roleService.getRoleLabel(admin?.role)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="p-3">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-amber-500/10 hover:text-primary-300 transition-all font-semibold"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && 'Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="hidden lg:flex flex-col bg-[#0f172a] border-r border-white/5 h-screen sticky top-0 shrink-0 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        <SidebarContent onClose={null} />
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => { saveScroll(); setMobileOpen(false); }}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#0f172a] z-50 lg:hidden flex flex-col"
            >
              <SidebarContent onClose={() => { saveScroll(); setMobileOpen(false); }} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
