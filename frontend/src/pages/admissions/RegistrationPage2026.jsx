import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Cpu, 
  Database, 
  BrainCircuit, 
  Network, 
  Radio, 
  Zap, 
  Wrench, 
  Compass, 
  Terminal, 
  Briefcase, 
  UserPlus, 
  LogIn, 
  ArrowRight, 
  CheckCircle,
  Award,
  Mail,
  User,
  Lock,
  Menu,
  X,
  ChevronDown,
  Globe
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import logoImg from '../../assets/images/logo.jfif';
import cahcetHeroImg from '../../assets/images/cahcet.webp';

// Data will be fetched from CMS

const getDepartmentPath = (abbr) => {
  switch (abbr.toUpperCase()) {
    case 'CSE': return '/departments/cse';
    case 'AI & DS': return '/departments/aids';
    case 'AI & ML': return '/departments/aiml';
    case 'IT': return '/departments/it';
    case 'ECE': return '/departments/ece';
    case 'EEE': return '/departments/eee';
    case 'MECH': return '/departments/mech';
    case 'CIVIL': return '/departments/civil';
    case 'MCA': return '/departments/mca';
    case 'MBA': return '/departments/management';
    default: return '/departments';
  }
};

const RegistrationPage2026 = () => {
  const [loading, setLoading] = useState(true);
  const [cmsData, setCmsData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await cmsService.getPage('admissions');
      const sectionsArray = res.data?.sections || [];
      const dataMap = {};
      sectionsArray.forEach(sec => {
        try {
          dataMap[sec.sectionKey] = JSON.parse(sec.content);
        } catch(e) {}
      });
      setCmsData(dataMap);
    } catch (err) {
      console.error('Failed to fetch admissions CMS data', err);
    } finally {
      setLoading(false);
    }
  };

  const DEFAULT_PROGRAMS = [
    { id: 1, department: 'cse', name: 'B.E. Computer Science and Engineering', icon: 'Cpu', duration: '4 Years', description: 'Comprehensive study of computer systems and software development.', featured: true },
    { id: 2, department: 'ece', name: 'B.E. Electronics & Communication', icon: 'Radio', duration: '4 Years', description: 'Core electronics and modern communication systems.', featured: false },
    { id: 3, department: 'eee', name: 'B.E. Electrical & Electronics', icon: 'Zap', duration: '4 Years', description: 'Advanced electrical systems and power engineering.', featured: false },
    { id: 4, department: 'civil', name: 'B.E. Civil Engineering', icon: 'Compass', duration: '4 Years', description: 'Infrastructure, construction, and structural engineering.', featured: false },
    { id: 5, department: 'mech', name: 'B.E. Mechanical Engineering', icon: 'Wrench', duration: '4 Years', description: 'Design, manufacturing, and mechanics of machines.', featured: false },
    { id: 6, department: 'aids', name: 'B.Tech AI & Data Science', icon: 'Database', duration: '4 Years', description: 'Specialized program in artificial intelligence and data analytics.', featured: true },
    { id: 7, department: 'aiml', name: 'B.Tech AI & Machine Learning', icon: 'BrainCircuit', duration: '4 Years', description: 'Focus on machine learning models and intelligent systems.', featured: false },
    { id: 8, department: 'it', name: 'B.Tech Information Technology', icon: 'Network', duration: '4 Years', description: 'Modern software development and IT infrastructure.', featured: false },
    { id: 9, department: 'mca', name: 'Master of Computer Applications', icon: 'Terminal', duration: '2 Years', description: 'Advanced professional program in software applications.', featured: false },
    { id: 10, department: 'mba', name: 'Master of Business Administration', icon: 'Briefcase', duration: '2 Years', description: 'Professional management and leadership program.', featured: true },
  ];

  const DEFAULT_STEPS = [
    { id: 1, stepNumber: '1', title: 'Create an Account', description: 'Sign up and verify your email to begin the application process', icon: 'UserPlus' },
    { id: 2, stepNumber: '2', title: 'Fill Personal Details', description: 'Provide your contact information and personal background', icon: 'User' },
    { id: 3, stepNumber: '3', title: 'Academic Information', description: 'Enter your educational history and academic achievements', icon: 'GraduationCap' },
    { id: 4, stepNumber: '4', title: 'Choose Courses', description: 'Select your preferred courses and specializations', icon: 'BookOpen' },
    { id: 5, stepNumber: '5', title: 'Make Payment', description: 'Pay the application fee securely through our portal', icon: 'CreditCard' },
  ];

  const DEFAULT_ACCREDITATIONS = [
    { id: 1, title: 'Anna University', description: 'Affiliated to Anna University', logoUrl: '' },
    { id: 2, title: 'NBA', description: 'National Board of Accreditation', logoUrl: '' },
    { id: 3, title: 'AICTE', description: 'Approved by AICTE', logoUrl: '' }
  ];

  const programs = cmsData['admissions.programs']?.courses?.length ? cmsData['admissions.programs'].courses : DEFAULT_PROGRAMS;
  const steps = cmsData['admissions.process']?.steps?.length ? cmsData['admissions.process'].steps : DEFAULT_STEPS;
  const accreditations = cmsData['admissions.accreditations']?.accreditations?.length ? cmsData['admissions.accreditations'].accreditations : DEFAULT_ACCREDITATIONS;

  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredCourses = programs.filter(course => {
    if (activeFilter === 'all') return true;
    const isPg = course.duration && course.duration.toLowerCase().includes('2');
    if (activeFilter === 'ug' && isPg) return false;
    if (activeFilter === 'pg' && !isPg) return false;
    return true;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-50 text-gray-800 relative overflow-hidden flex flex-col justify-between selection:bg-accent-gold/30 selection:text-primary-950 font-sans">
        <Helmet>
          <title>Admission 2026 Portal | CAHCET</title>
          <meta name="description" content="Join the league of excellence. Complete your registration for CAHCET Admission 2026. Explore premium programs and download application resources." />
        </Helmet>

        {/* Premium ambient background (light theme compatible) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
          <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-amber-50/50 rounded-full blur-[150px] mix-blend-multiply opacity-60" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        {/* ========================================================
            1. DEDICATED ADMISSION NAVBAR (Matches main site dark navy styling)
           ======================================================== */}
        <nav className="fixed top-0 inset-x-0 z-50 bg-primary-950/95 backdrop-blur-md border-b border-white/10 py-3.5 px-6 md:px-12 flex items-center justify-between shadow-xl">
          {/* Left: Logo & Branding */}
          <a href="/" className="flex items-center gap-3.5 group">
            <div className="p-1 bg-white/5 rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-105">
              <img src={logoImg} alt="CAHCET Logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col text-white">
              <span className="text-lg font-display font-extrabold leading-none tracking-tight flex items-center gap-1.5">
                CAHCET
                <span className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-accent-gold/90">Admissions 2026</span>
            </div>
          </a>

          {/* Center: Main Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-white/90">
            <a href="/" className="hover:text-accent-gold transition-colors duration-200">HOME</a>
            
            {/* Hoverable Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1.5 hover:text-accent-gold transition-colors duration-200 focus:outline-none uppercase font-medium">
                <span>Explore Portal</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-primary-950 border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button 
                  onClick={() => scrollToSection('courses-section')}
                  className="w-full text-left px-4 py-3 text-xs font-semibold text-white/90 hover:text-accent-gold hover:bg-white/5 rounded-xl transition-all"
                >
                  Courses Offered
                </button>
                <a 
                  href="/about/institution" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 text-xs font-semibold text-white/90 hover:text-accent-gold hover:bg-white/5 rounded-xl transition-all"
                >
                  About Us
                </a>
                <a 
                  href="/academics/campus-life" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 text-xs font-semibold text-white/90 hover:text-accent-gold hover:bg-white/5 rounded-xl transition-all"
                >
                  Campus Life
                </a>
                <a 
                  href="/academics/campus-facility" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 text-xs font-semibold text-white/90 hover:text-accent-gold hover:bg-white/5 rounded-xl transition-all"
                >
                  Facilities
                </a>
              </div>
            </div>
            
            <a href="/contact" className="hover:text-accent-gold transition-colors duration-200">CONTACT US</a>
          </div>

          {/* Right: CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/admissions/login')}
              className="text-sm font-semibold text-white/90 hover:text-white px-5 py-2.5 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button 
              onClick={() => scrollToSection('apply-process')}
              className="bg-accent-gold hover:bg-amber-600 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-[0_4px_12px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_16px_rgba(212,175,55,0.4)] hover:scale-[1.03] transition-all"
            >
              Apply Now
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Overlay Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 w-full bg-primary-950 border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl z-50 md:hidden text-white"
              >
                <a href="/" className="text-white/80 hover:text-white py-2 border-b border-white/5">HOME</a>
                
                {/* Mobile Portal Navigation Links */}
                <div className="flex flex-col gap-2 pl-4 border-l border-white/10 my-1">
                  <span className="text-[10px] uppercase tracking-widest text-accent-gold font-bold mb-1">Explore Portal</span>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); scrollToSection('courses-section'); }}
                    className="text-left text-sm text-white/70 hover:text-white py-1.5"
                  >
                    Courses Offered
                  </button>
                  <a 
                    href="/about/institution" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-left text-sm text-white/70 hover:text-white py-1.5"
                  >
                    About Us
                  </a>
                  <a 
                    href="/academics/campus-life" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-left text-sm text-white/70 hover:text-white py-1.5"
                  >
                    Campus Life
                  </a>
                  <a 
                    href="/academics/campus-facility" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-left text-sm text-white/70 hover:text-white py-1.5"
                  >
                    Facilities
                  </a>
                </div>

                <a href="/contact" className="text-white/80 hover:text-white py-2 border-b border-white/5">CONTACT US</a>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => navigate('/admissions/login')}
                    className="flex-1 border border-white/10 text-white py-3 rounded-xl"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); scrollToSection('apply-process'); }}
                    className="flex-1 bg-accent-gold text-white font-bold py-3 rounded-xl"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ========================================================
            2. CINEMATIC HERO SECTION
           ======================================================== */}
        <header className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden z-10">
          {/* Background parallax container */}
          <div className="absolute inset-0 z-0">
            <img 
              src={cahcetHeroImg} 
              alt="Premium College Gate" 
              className="w-full h-full object-cover object-center scale-105 transform-gpu motion-safe:animate-[pulse_20s_ease-in-out_infinite_alternate]"
            />
            {/* Cinematic dark gradient overlay ensuring high sharpness */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 via-primary-950/60 to-primary-950" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
          </div>
 
          <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/15 border border-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-accent-gold mb-6">
                <GraduationCap className="w-4 h-4" />
                Admission Registration 2026-27 Open
              </div>
 
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-tight mb-8">
                C. Abdul Hakeem College of Engineering and Technology
              </h1>
 
              <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-2xl mb-12">
                Transforming futures through innovation and excellence in education.
              </p>
 
              <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-sm sm:max-w-none sm:w-auto mx-auto">
                <button
                  onClick={() => scrollToSection('apply-process')}
                  className="w-full sm:w-auto bg-accent-gold hover:bg-amber-600 text-white font-extrabold px-8 py-4.5 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.03] transition-all flex items-center justify-center gap-2 group active:scale-98"
                >
                  <span>Apply Now 2026</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
 
                <button
                  onClick={() => scrollToSection('courses-section')}
                  className="w-full sm:w-auto bg-white/10 border border-white/20 text-white font-bold px-8 py-4.5 rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md"
                >
                  Explore Courses
                </button>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ========================================================
            3. DYNAMIC COURSES OFFERED SECTION
           ======================================================== */}
        <section id="courses-section" className="py-24 md:py-32 px-6 md:px-12 relative z-10 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-gold/20 rounded-full blur-3xl -z-10" />
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-800 mb-6 tracking-tight">
              Programs of Excellence
            </h2>
            <p className="text-gray-600 md:text-lg font-light leading-relaxed">
              Explore our comprehensive range of undergraduate engineering domains and professional postgraduate courses, designed for the innovators of tomorrow.
            </p>

            {/* Segmented Filter Control (Light theme styled) */}
            <div className="mt-10 flex bg-gray-200/60 border border-gray-300/40 rounded-2xl p-1.5 max-w-md mx-auto relative backdrop-blur-md">
              {['all', 'ug', 'pg'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition-all relative z-10 duration-200 ${
                    activeFilter === filter ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter === 'all' && 'All Courses'}
                  {filter === 'ug' && 'UG Courses'}
                  {filter === 'pg' && 'PG Courses'}
                  
                  {activeFilter === filter && (
                    <motion.div
                      layoutId="filterPill"
                      className="absolute inset-0 bg-primary-950 rounded-xl -z-10 shadow-md border border-primary-900"
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Courses grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, idx) => {
                const Icon = Icons[course.icon] || Globe;
                const isUg = !(course.duration && course.duration.toLowerCase().includes('2'));
                return (
                  <motion.div
                    key={course.id || idx}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -8 }}
                    className={`bg-white border ${course.featured ? 'border-accent-gold shadow-lg' : 'border-gray-200'} rounded-3xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden group shadow-md hover:border-accent-gold/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[280px] md:min-h-[360px]`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div>
                      <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl w-fit text-primary-900 group-hover:bg-accent-gold/15 group-hover:text-accent-gold duration-300 shadow-inner mb-6">
                        <Icon className="w-6 h-6" />
                      </div>
 
                      <span className="text-xs font-bold tracking-[0.2em] text-accent-gold block mb-2 uppercase font-display">
                        {isUg ? 'UG' : 'PG'} • {course.department}
                      </span>
                      <h3 className="text-lg font-bold text-primary-950 mb-3 group-hover:text-accent-gold transition-colors duration-300 min-h-[3.5rem] leading-snug">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between relative z-10">
                      <a 
                        href={getDepartmentPath(course.department)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-950 hover:text-accent-gold transition-colors duration-300 group/link"
                      >
                        <span>Know More</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1.5 transition-transform duration-300 text-accent-gold" />
                      </a>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                        {course.duration || (isUg ? '4 Years' : '2 Years')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ========================================================
            4. ACCREDITATIONS SECTION (Light background)
           ======================================================== */}
        <section className="py-24 md:py-32 bg-white border-y border-gray-100 relative z-10 px-6 md:px-12 w-full overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Global Recognition</span>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-primary-950 mb-6">
                Our Accreditations
              </h2>
              <p className="text-gray-600 md:text-lg font-light leading-relaxed">
                CAHCET is officially audited and approved by national and global education regulatory bodies ensuring the highest standards of learning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {accreditations.map((item, idx) => {
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-[2rem] p-8 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex flex-col transition-all duration-500"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-gold/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="p-4 bg-white shadow-sm border border-gray-50 rounded-2xl w-fit text-accent-gold mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
                      {item.logoUrl ? (
                        <img src={item.logoUrl} alt={item.title} className="w-12 h-12 object-contain mix-blend-multiply" />
                      ) : (
                        <Award className="w-7 h-7" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-primary-950 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed mb-6 flex-1">
                      {item.description}
                    </p>
                    {item.pdfUrl && (
                      <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-accent-gold hover:text-amber-600 transition-colors">
                        View Approval Letter <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            5. APPLY NOW PROCESS SECTION
           ======================================================== */}
        <section id="apply-process" className="py-24 md:py-32 px-6 md:px-12 relative z-10 max-w-6xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary-950 mb-6">
              How to Apply
            </h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Our streamlined admissions portal enables you to register, submit particulars, and pay the fee digitally.
            </p>
          </div>

          {/* Timeline steps */}
          <div className="relative flex flex-col gap-8 md:gap-12">
            {/* Vertical connector line */}
            <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent-gold via-primary-500 to-gray-200 hidden md:block" />

            {steps.map((step, idx) => {
              const Icon = Icons[step.icon] || CheckCircle;
              return (
                <motion.div
                  key={step.id || idx}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex items-start gap-4 md:gap-12 relative group"
                >
                  {/* Step circle */}
                  <motion.div 
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: 360,
                      backgroundColor: "#0f172a",
                      color: "#f59e0b",
                      borderColor: "#f59e0b"
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full shrink-0 flex items-center justify-center text-base md:text-xl font-black bg-white border-2 border-accent-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] text-accent-gold z-10 relative cursor-pointer overflow-hidden"
                  >
                    <span className="group-hover:opacity-0 transition-opacity absolute">{step.stepNumber}</span>
                    <Icon className="w-6 h-6 absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
  
                  <motion.div 
                    whileHover={{ 
                      scale: 1.025, 
                      x: 10,
                      borderColor: "rgba(212, 175, 55, 0.4)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 flex-1 shadow-md duration-300 transition-all cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-primary-950 mb-2 group-hover:text-accent-gold duration-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Begin Application Button */}
          <div className="mt-20 text-center flex flex-col items-center gap-5">
            <button
              onClick={() => navigate('/admissions/register')}
              className="bg-primary-950 hover:bg-primary-900 text-white font-extrabold text-base md:text-lg px-8 md:px-12 py-4 md:py-5 rounded-2xl shadow-lg hover:scale-[1.03] transition-all inline-flex items-center gap-3 active:scale-98"
            >
              <span>Begin Application</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <a 
              href="/contact" 
              className="text-gray-500 hover:text-accent-gold font-semibold text-sm transition-colors duration-300 flex items-center gap-1.5 mt-3 hover:underline"
            >
              Need assistance? Contact our admissions team
              <ArrowRight className="w-4 h-4 text-accent-gold" />
            </a>
          </div>
        </section>
        {/* Footer (Matches main site dark navy styling) */}
        <footer className="bg-primary-950 border-t border-white/5 py-12 px-6 text-center text-sm text-white/50 relative z-10 w-full">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="CAHCET" className="w-8 h-8 object-contain opacity-70" />
              <span className="font-semibold text-white/80">CAHCET Admissions</span>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} C. Abdul Hakeem College of Engineering & Technology. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-white/70">
              <a href="/about/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/about/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>

      </div>
    </HelmetProvider>
  );
};

export default RegistrationPage2026;
