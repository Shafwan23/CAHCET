import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
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
  Download, 
  ArrowRight, 
  FileText 
} from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import * as Icons from 'lucide-react';
import FloatingParticles from '../../components/ui/FloatingParticles';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// Import PDF assets so Vite processes and compiles them correctly
import prospectusPdf from '../../assets/documents/prospectus.pdf';
import applicationPdf from '../../assets/documents/application.pdf';

// Data fetched from CMS

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const AdmissionProcedurePage = () => {
  const [loading, setLoading] = useState(true);
  const [cmsData, setCmsData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const programs = cmsData['admissions.programs']?.courses?.length ? cmsData['admissions.programs'].courses : DEFAULT_PROGRAMS;
  
  const ugCourses = programs.filter(course => !(course.duration && course.duration.toLowerCase().includes('2')));
  const pgCourses = programs.filter(course => course.duration && course.duration.toLowerCase().includes('2'));

  const heroTitle = cmsData['admissions.hero']?.title || 'Admission Procedure';

  const handleRegisterClick = () => {
    // Navigate to homepage registration section anchor
    window.location.href = '/#registration';
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden flex flex-col justify-between font-sans">
        <Helmet>
          <title>Admission Procedure | CAHCET</title>
          <meta name="description" content="Discover the admission procedure, course criteria, and documents required to join the undergraduate and postgraduate programs at CAHCET." />
        </Helmet>

        {/* Ambient Backlighting Mesh Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[700px] h-[700px] bg-primary-50/30 rounded-full blur-[160px]" />
        </div>

        <FloatingParticles count={25} color="rgba(37, 99, 235, 0.08)" />

        <Navbar />

        {/* Main Content */}
        <main className="flex-grow pt-32 pb-24 relative z-10 w-full">
          
          {/* Header/Hero Section */}
          <header className="relative pt-20 pb-20 overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white text-center rounded-b-[2.5rem] shadow-xl z-10 mb-16">
            {/* Geometric structural circles/effects */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
              <div className="absolute -left-16 -top-16 w-64 h-64 border border-white rounded-full" />
              <div className="absolute right-10 bottom-5 w-80 h-80 border border-white/40 rounded-full" />
              <div className="absolute left-1/3 top-10 w-96 h-96 border border-white/20 rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl px-6 mx-auto flex flex-col items-center">
              <div className="inline-flex items-center gap-2 text-accent-gold text-xs md:text-sm mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                Admissions Portal
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 tracking-tight leading-tight">
                {heroTitle}
              </h1>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-16">
            {/* Section 1: Introduction Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-14 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-x-10 -translate-y-10 group-hover:bg-blue-500/10 transition-all duration-700" />
                <p className="text-base md:text-xl text-slate-600 font-light leading-relaxed relative z-10 max-w-3xl mx-auto whitespace-pre-wrap text-center">
                  The College is approved by the All India Council for Technical Education(AICTE), New Delhi and affiliated to the Anna University, Chennai. The College offers 8 Under-Graduate Courses and 2 Post-Graduate Courses.
                </p>
              </div>
            </motion.div>

            {/* Section 2: UG Courses */}
            <div className="py-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-display font-bold text-primary-950">Under-Graduate Courses</h2>
                <div className="w-16 h-1 bg-accent-gold mx-auto mt-4 rounded-full" />
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto relative"
              >
                {ugCourses.map((course, idx) => {
                  const Icon = Icons[course.icon] || FileText;
                  return (
                    <motion.div
                      key={course.id || idx}
                      variants={itemVariants}
                      className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-5 transition-all duration-300 relative overflow-hidden shadow-sm hover:border-primary-600/30 hover:shadow-md group/card"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl text-primary-600 shrink-0 group-hover/card:bg-primary-600 group-hover/card:text-white transition-colors duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary-950 group-hover/card:text-primary-600 transition-colors duration-300 leading-snug">
                          {course.name}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Section 3: PG Courses */}
            <div className="py-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-display font-bold text-primary-950">Post-Graduate Courses</h2>
                <div className="w-16 h-1 bg-accent-gold mx-auto mt-4 rounded-full" />
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto relative"
              >
                {pgCourses.map((course, idx) => {
                  const Icon = Icons[course.icon] || FileText;
                  return (
                    <motion.div
                      key={course.id || idx}
                      variants={itemVariants}
                      className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-5 transition-all duration-300 relative overflow-hidden shadow-sm hover:border-accent-gold/30 hover:shadow-md group/card"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="p-4 bg-accent-gold/10 border border-accent-gold/20 rounded-2xl text-accent-gold shrink-0 group-hover/card:bg-accent-gold group-hover/card:text-white transition-colors duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary-950 group-hover/card:text-accent-gold transition-colors duration-300 leading-snug">
                          {course.name}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Section 4: Action Buttons Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-16 shadow-sm relative overflow-hidden text-center group">
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary-950 mb-4 tracking-tight">
                  Ready to take the next step?
                </h2>
                <p className="text-sm md:text-base text-slate-500 font-light mb-12 max-w-xl mx-auto leading-relaxed">
                  Download the official admission materials or complete your online registration in just a few clicks to lock in your seat for the academic year 2026.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center relative z-10 w-full">
                  {/* Download Prospectus */}
                  <a 
                    href={prospectusPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-accent-gold text-primary-950 font-extrabold px-6 py-4.5 rounded-2xl shadow-md hover:bg-primary-950 hover:text-white transition-all flex items-center justify-center gap-3 group active:scale-98 text-sm md:text-base"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
                    <span>Download Prospectus</span>
                  </a>

                  {/* Download Application Form */}
                  <a 
                    href={applicationPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-white border border-slate-250 text-slate-800 hover:text-primary-600 font-bold px-6 py-4.5 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group active:scale-98 shadow-sm text-sm md:text-base"
                  >
                    <FileText className="w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
                    <span>Download Application</span>
                  </a>

                  {/* Register Now */}
                  <button 
                    onClick={handleRegisterClick}
                    className="w-full sm:w-auto bg-primary-900 text-white font-extrabold px-6 py-4.5 rounded-2xl shadow-md hover:bg-primary-950 transition-all flex items-center justify-center gap-3 group active:scale-98 text-sm md:text-base"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default AdmissionProcedurePage;
