import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <style>{`
            .font-sans { font-family: 'Inter', sans-serif !important; }
            .font-display { font-family: 'Outfit', sans-serif !important; }
          `}</style>
        </Helmet>

        {/* Premium ambient background (light theme compatible) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
          <div className="absolute top-0 right-0 w-[500px] max-w-full h-[500px] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
          <div className="absolute bottom-1/4 left-0 w-[600px] max-w-full h-[600px] bg-amber-50/50 rounded-full blur-[150px] mix-blend-multiply opacity-60" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-20" />
        </div>

        {/* ========================================================
            1. DEDICATED ADMISSION NAVBAR (Matches main site dark navy styling)
           ======================================================== */}
        <nav className="fixed top-0 inset-x-0 z-50 bg-primary-950/95 backdrop-blur-md border-b border-white/10 py-3.5 px-6 md:px-12 flex items-center justify-between shadow-xl">
          {/* Left: Logo & Branding */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="p-1 bg-white/5 rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-105">
              <img loading="lazy" decoding="async" src={logoImg} alt="CAHCET Logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col text-white">
              <span className="text-lg font-display font-extrabold leading-none tracking-tight flex items-center gap-1.5">
                CAHCET
                <span className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-accent-gold/90">Admissions 2026</span>
            </div>
          </Link>

          {/* Center: Main Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-white/90">
            <Link to="/" className="hover:text-accent-gold transition-colors duration-200">HOME</Link>
            
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
            
            <Link to="/contact" className="hover:text-accent-gold transition-colors duration-200">CONTACT US</Link>
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
                <Link to="/" className="text-white/80 hover:text-white py-2 border-b border-white/5">HOME</Link>
                
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

                <Link to="/contact" className="text-white/80 hover:text-white py-2 border-b border-white/5">CONTACT US</Link>
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
        <header className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden z-10 rounded-b-[4rem] shadow-luxury mb-20">
          {/* Background parallax container */}
          <div className="absolute inset-0 z-0">
            <img loading="lazy" decoding="async" 
              src={cahcetHeroImg} 
              alt="Premium College Gate" 
              className="w-full h-full object-cover object-center scale-105 transform-gpu motion-safe:animate-[pulse_20s_ease-in-out_infinite_alternate]"
            />
            {/* Cinematic dark gradient overlay ensuring high sharpness while keeping image beautifully visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-primary-950/30 to-primary-950/95" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.15] mix-blend-overlay" />
          </div>
 
          <div className="relative z-10 text-center max-w-6xl px-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center w-full"
            >
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-8 w-full">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="flex items-center gap-2 text-white/90 text-sm font-bold uppercase tracking-widest drop-shadow-md"
                >
                  <GraduationCap className="w-5 h-5 text-accent-gold" />
                  Admissions 2026
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="w-1.5 h-1.5 rounded-full bg-accent-gold hidden sm:block shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                />

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="hidden sm:flex items-center gap-2 text-accent-gold text-sm font-bold uppercase tracking-widest drop-shadow-md"
                >
                  <Award className="w-5 h-5" />
                  NAAC Accredited
                </motion.div>
              </div>

              <div className="mb-12 w-full" style={{ perspective: "1000px" }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.2] mb-8 text-white w-full text-center">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
                    }}
                    className="flex flex-col items-center justify-center gap-3 w-full"
                  >
                    <motion.span
                      variants={{
                        hidden: { opacity: 0, y: 80, rotateX: -60 },
                        visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } }
                      }}
                      className="inline-block origin-bottom text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 pb-2 drop-shadow-sm"
                    >
                      C. Abdul Hakeem
                    </motion.span>
                    <motion.span
                      variants={{
                        hidden: { opacity: 0, y: 80, rotateX: -60 },
                        visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } }
                      }}
                      className="inline-block origin-bottom pb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-yellow-200 to-accent-gold"
                    >
                      College of Engineering & Technology
                    </motion.span>
                  </motion.div>
                </h1>
   
                <motion.p 
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto"
                >
                  Transforming futures through innovation and excellence in education. Join the league of extraordinary minds.
                </motion.p>
              </div>
 
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-sm sm:max-w-none sm:w-auto mx-auto">
                <button
                  onClick={() => scrollToSection('apply-process')}
                  className="w-full sm:w-auto bg-gradient-to-r from-accent-gold to-yellow-600 text-white font-extrabold px-10 py-5 rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_10px_40px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group active:scale-95 text-lg"
                >
                  <span>Apply Now 2026</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
 
                <button
                  onClick={() => scrollToSection('courses-section')}
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-10 py-5 rounded-full hover:bg-white/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg text-lg"
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
        <section id="courses-section" className="py-24 md:py-32 px-6 md:px-12 relative z-10 w-full bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center max-w-3xl mx-auto mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-gold/20 rounded-full blur-[100px] -z-10" />
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-800 mb-8 tracking-tight"
            >
              Programs of Excellence
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-primary-600 md:text-xl font-light leading-relaxed"
            >
              Explore our comprehensive range of undergraduate engineering domains and professional postgraduate courses, designed for the innovators of tomorrow.
            </motion.p>

            {/* Segmented Filter Control (Premium Glassmorphism) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex bg-white/90 border border-gray-200 rounded-full p-2 max-w-md mx-auto relative backdrop-blur-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              {['all', 'ug', 'pg'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider rounded-full transition-all relative z-10 duration-500 ${
                    activeFilter === filter ? 'text-white' : 'text-primary-600 hover:text-primary-900'
                  }`}
                >
                  {filter === 'all' && 'All Courses'}
                  {filter === 'ug' && 'UG Courses'}
                  {filter === 'pg' && 'PG Courses'}
                  
                  {activeFilter === filter && (
                    <motion.div
                      layoutId="filterPill"
                      className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-950 rounded-full -z-10 shadow-[0_4px_20px_rgba(30,58,138,0.3)] border border-primary-800"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Courses grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, idx) => {
                const Icon = Icons[course.icon] || Globe;
                const isUg = !(course.duration && course.duration.toLowerCase().includes('2'));
                return (
                  <motion.div
                    key={course.id || idx}
                    layout
                    initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`bg-white rounded-[2.5rem] transition-all duration-500 relative overflow-hidden group flex flex-col justify-between min-h-[380px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] hover:-translate-y-3 cursor-pointer border ${course.featured ? 'border-accent-gold/40' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    {/* Architect Dot Pattern Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40 pointer-events-none z-0" />
                    
                    {/* Corner Accent Shape */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none z-0" />

                    {/* Inner 3D Highlight */}
                    <div className="absolute inset-0 rounded-[2.5rem] border-[3px] border-white/50 pointer-events-none z-20 mix-blend-overlay" />
                    {/* Subtle top gradient */}
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-50/80 to-transparent pointer-events-none z-0" />

                    {/* Glowing glassmorphism hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                    
                    {/* A massive watermark icon that rotates and scales on hover */}
                    <Icon className="absolute -bottom-10 -right-10 w-64 h-64 text-slate-100 group-hover:text-yellow-400/10 transition-all duration-700 -rotate-45 group-hover:rotate-0 group-hover:scale-110 z-0 pointer-events-none" />

                    <div className="relative z-10 p-8 flex-1 flex flex-col">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary-500 group-hover:bg-accent-gold group-hover:text-white transition-colors duration-500 mb-8 border border-gray-100 group-hover:border-accent-gold/50 relative overflow-hidden shadow-sm">
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] z-0" />
                        <Icon className="w-6 h-6 relative z-10" />
                      </div>
 
                      <span className="text-[10px] font-black tracking-widest text-gray-400 group-hover:text-accent-gold block mb-3 uppercase font-display transition-colors duration-500">
                        {isUg ? 'UG' : 'PG'} • {course.department}
                      </span>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-primary-950 group-hover:text-primary-700 transition-colors duration-500 mb-4 leading-tight">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-500 font-light leading-relaxed mb-6 line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="p-8 pt-0 relative z-10 mt-auto flex items-center justify-between">
                      <a 
                        href={getDepartmentPath(course.department)}
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-950 group-hover:text-accent-gold transition-colors duration-500 group/link"
                      >
                        <span className="relative">
                          Know More
                          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-accent-gold group-hover/link:w-full transition-all duration-300" />
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform duration-300" />
                      </a>
                      <span className="text-xs font-bold text-gray-400 group-hover:text-white/50 transition-colors duration-500">
                        {course.duration || (isUg ? '4 Years' : '2 Years')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          </div>
        </section>

        {/* ========================================================
            4. ACCREDITATIONS SECTION (Light background)
           ======================================================== */}
        <section className="py-24 md:py-32 bg-slate-50 relative z-10 px-6 md:px-12 w-full overflow-hidden">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {accreditations.map((item, idx) => {
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      delay: idx * 0.15, 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 20 
                    }}
                    whileHover={{ 
                      y: -15, 
                      rotateY: idx === 0 ? 5 : idx === 2 ? -5 : 0, 
                      scale: 1.05 
                    }}
                    className="bg-white rounded-[2.5rem] p-10 relative group shadow-[0_30px_60px_rgba(30,58,138,0.08)] hover:shadow-[0_40px_80px_rgba(30,58,138,0.15)] hover:-translate-y-3 flex flex-col items-center text-center transition-all duration-500 cursor-pointer border-2 border-gray-200 hover:border-accent-gold"
                  >
                    {/* Spinning dashed ring on hover */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-28 border-2 border-dashed border-accent-gold/0 rounded-full group-hover:border-accent-gold/40 group-hover:animate-[spin_4s_linear_infinite] transition-colors duration-500" />
                    
                    {/* Glowing Orb */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-accent-gold/20 rounded-full blur-xl group-hover:bg-accent-gold/40 transition-colors duration-500" />

                    <div className="w-20 h-20 bg-white shadow-md border border-gray-100 rounded-full flex items-center justify-center text-accent-gold mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                      {item.logoUrl ? (
                        <img loading="lazy" decoding="async" src={item.logoUrl} alt={item.title} className="w-10 h-10 object-contain mix-blend-multiply" />
                      ) : (
                        <Award className="w-8 h-8" />
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-black text-primary-950 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-950 group-hover:to-accent-gold transition-all duration-500">
                      {item.title}
                    </h3>
                    
                    <div className="w-8 h-1 bg-gray-200 rounded-full mb-5 group-hover:w-16 group-hover:bg-accent-gold transition-all duration-500" />
                    
                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 flex-1">
                      {item.description}
                    </p>
                    
                    {item.pdfUrl && (
                      <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center w-full py-3 rounded-xl bg-gray-50 text-sm font-bold text-gray-500 group-hover:bg-accent-gold group-hover:text-white transition-colors duration-500">
                        View Approval Letter
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
        <section id="apply-process" className="py-24 md:py-32 px-6 md:px-12 relative z-10 w-full overflow-hidden">
          <div className="absolute inset-0 bg-primary-950 z-0" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay z-0" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -right-1/4 w-[1000px] max-w-full h-[1000px] bg-accent-gold/10 rounded-full blur-[150px] pointer-events-none z-0" 
          />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white mb-6 tracking-tight"
              >
                How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-600">Apply</span>
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1.5 bg-gradient-to-r from-accent-gold to-yellow-500 mx-auto mb-8 rounded-full shadow-glow-sm" 
              />
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-primary-200 text-lg md:text-xl font-light leading-relaxed"
              >
                Our streamlined admissions portal enables you to register, submit particulars, and pay the fee digitally in 5 easy steps.
              </motion.p>
            </div>

            {/* Timeline steps */}
            <div className="relative flex flex-col gap-10 md:gap-16 max-w-4xl mx-auto">
              {/* Vertical connector line */}
              <div className="absolute left-[39px] md:left-[47px] top-10 bottom-10 w-1 bg-gradient-to-b from-accent-gold via-primary-500 to-primary-900 hidden md:block rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />

              {steps.map((step, idx) => {
                const Icon = Icons[step.icon] || CheckCircle;
                return (
                  <motion.div
                    key={step.id || idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: idx * 0.15 }}
                    className="flex items-start gap-6 md:gap-14 relative group"
                  >
                    {/* Step circle */}
                    <div className="relative z-10 shrink-0">
                      <div className="absolute inset-0 bg-accent-gold/40 rounded-full blur-xl group-hover:bg-accent-gold/60 transition-colors duration-500" />
                      <motion.div 
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: 360,
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-3xl font-black bg-primary-950 border-4 border-accent-gold shadow-glow-md text-accent-gold relative cursor-pointer overflow-hidden z-20 group-hover:bg-accent-gold group-hover:text-primary-950 transition-colors duration-500"
                      >
                        <span className="group-hover:opacity-0 transition-opacity duration-300 absolute">{step.stepNumber}</span>
                        <Icon className="w-10 h-10 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    </div>
    
                    <motion.div 
                      whileHover={{ 
                        scale: 1.02, 
                        x: 10,
                        backgroundColor: "rgba(255,255,255,0.05)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex-1 shadow-2xl duration-500 transition-all cursor-pointer group/card hover:border-accent-gold/50 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-gold/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 group-hover/card:text-accent-gold duration-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-base md:text-lg text-primary-200 font-light leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Begin Application Button */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-28 text-center flex flex-col items-center gap-6 relative z-10"
            >
              <button
                onClick={() => navigate('/admissions/register')}
                className="bg-gradient-to-r from-accent-gold to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold text-lg md:text-2xl px-12 md:px-16 py-6 rounded-full shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.6)] hover:-translate-y-2 transition-all inline-flex items-center gap-4 active:scale-95 group"
              >
                <span>Begin Application</span>
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              
              <Link 
                to="/contact" 
                className="text-primary-300 hover:text-accent-gold font-medium text-base transition-colors duration-300 flex items-center gap-2 mt-4 hover:underline"
              >
                Need assistance? Contact our admissions team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
        {/* Footer (Matches main site dark navy styling) */}
        <footer className="bg-primary-950 border-t border-white/20 py-12 px-6 text-center text-sm text-white/50 relative z-10 w-full shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img loading="lazy" decoding="async" src={logoImg} alt="CAHCET" className="w-8 h-8 object-contain opacity-70" />
              <span className="font-semibold text-white/80">CAHCET Admissions</span>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} C. Abdul Hakeem College of Engineering & Technology. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-white/70">
              <Link to="/about/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/about/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>

      </div>
    </HelmetProvider>
  );
};

export default RegistrationPage2026;
