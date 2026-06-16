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

// Removed PDF imports to use direct public paths as requested

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

  // Direct links will be used instead of this handler

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
          
          {/* Premium Parallax Header */}
          <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center text-center"
              >
                <div className="inline-flex items-center gap-2 text-accent-gold text-xs md:text-sm mb-6 px-5 py-2.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 backdrop-blur-md font-bold uppercase tracking-widest shadow-glow-sm">
                  <GraduationCap className="w-4 h-4" />
                  Admissions Portal
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold mb-6 tracking-tight leading-tight">
                  {heroTitle}
                </h1>
                <p className="text-xl text-primary-200 font-light leading-relaxed max-w-2xl mx-auto">
                  Take the first step towards your future. Explore our comprehensive procedure for both undergraduate and postgraduate admissions.
                </p>
              </motion.div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
            {/* Section 1: Introduction Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-gold/5 pointer-events-none rounded-[3rem]" />
              <div className="bg-white/90 backdrop-blur-3xl border border-primary-100 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-32 -left-32 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/10 transition-all duration-700 z-0 pointer-events-none" 
                />
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="p-6 bg-gradient-to-br from-primary-950 to-primary-800 rounded-[2rem] shadow-luxury shrink-0">
                    <Compass className="w-12 h-12 text-accent-gold" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-extrabold text-primary-950 mb-4">Accredited Excellence</h2>
                    <p className="text-xl md:text-2xl text-primary-700 font-light leading-relaxed">
                      The College is approved by the <strong className="font-bold text-primary-950">All India Council for Technical Education (AICTE)</strong>, New Delhi and affiliated to <strong className="font-bold text-primary-950">Anna University</strong>, Chennai. The College offers 8 Under-Graduate Courses and 2 Post-Graduate Courses.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 2: UG Courses */}
            <div className="relative">
              <div className="text-center mb-16">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-display font-extrabold text-primary-950 tracking-tight"
                >
                  Under-Graduate Courses
                </motion.h2>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "6rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1.5 bg-gradient-to-r from-accent-gold to-yellow-500 mx-auto mt-6 rounded-full shadow-glow-sm" 
                />
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
              >
                {ugCourses.map((course, idx) => {
                  const Icon = Icons[course.icon] || FileText;
                  return (
                    <motion.div
                      key={course.id || idx}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      className="bg-white border border-primary-100 rounded-[2.5rem] p-8 transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-luxury hover:border-accent-gold/40 group/card flex flex-col"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-gold/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover/card:scale-110 group-hover/card:bg-accent-gold/10 transition-all duration-500 shadow-inner border border-primary-100 group-hover/card:border-accent-gold/30">
                        <Icon className="w-8 h-8 text-primary-500 group-hover/card:text-accent-gold transition-colors duration-500" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-primary-950 mb-3 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-primary-950 group-hover/card:to-primary-700 transition-colors leading-tight">
                        {course.name}
                      </h3>
                      <p className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-4 bg-primary-50 px-3 py-1 rounded-lg w-fit">
                        Duration: {course.duration}
                      </p>
                      <p className="text-base text-primary-600 font-light leading-relaxed flex-1">
                        {course.description}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Section 3: PG Courses */}
            <div className="relative">
              <div className="text-center mb-16">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-display font-extrabold text-primary-950 tracking-tight"
                >
                  Post-Graduate Courses
                </motion.h2>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "6rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1.5 bg-gradient-to-r from-accent-gold to-yellow-500 mx-auto mt-6 rounded-full shadow-glow-sm" 
                />
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10"
              >
                {pgCourses.map((course, idx) => {
                  const Icon = Icons[course.icon] || FileText;
                  return (
                    <motion.div
                      key={course.id || idx}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      className="bg-primary-950 text-white border border-primary-800 rounded-[2.5rem] p-10 transition-all duration-500 relative overflow-hidden shadow-luxury hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:border-accent-gold/40 group/card flex flex-col"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-gold/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="w-16 h-16 bg-primary-900 rounded-2xl flex items-center justify-center mb-6 group-hover/card:scale-110 group-hover/card:bg-accent-gold/20 transition-all duration-500 border border-primary-800 group-hover/card:border-accent-gold/50 shadow-inner">
                        <Icon className="w-8 h-8 text-accent-gold transition-colors duration-500" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 group-hover/card:text-accent-gold transition-colors leading-tight">
                        {course.name}
                      </h3>
                      <p className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-4 bg-accent-gold/10 px-3 py-1 rounded-lg w-fit border border-accent-gold/20">
                        Duration: {course.duration}
                      </p>
                      <p className="text-base text-primary-200 font-light leading-relaxed flex-1 relative z-10">
                        {course.description}
                      </p>
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
              className="w-full relative z-20"
            >
              <div className="bg-white/95 backdrop-blur-3xl border border-primary-100 rounded-[3rem] p-12 md:p-20 shadow-luxury relative overflow-hidden text-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-accent-gold/5 z-0 pointer-events-none" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" 
                />

                <h2 className="text-4xl md:text-6xl font-display font-extrabold text-primary-950 mb-6 tracking-tight relative z-10">
                  Ready to take the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-600">Next Step?</span>
                </h2>
                <p className="text-xl text-primary-700 font-light mb-12 max-w-3xl mx-auto leading-relaxed relative z-10">
                  Download the official admission materials or complete your online registration in just a few clicks to lock in your seat for the academic year 2026.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10 w-full max-w-4xl mx-auto">
                  {/* Download Prospectus */}
                  <a 
                    href="/pdf/FINAL-PROSPECTUS-CAHCET.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden w-full sm:w-auto bg-white border border-primary-200 text-primary-800 font-bold px-8 py-5 rounded-[1.5rem] shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:border-accent-gold hover:text-accent-gold transition-all duration-500 flex items-center justify-center gap-3 group/btn text-base"
                  >
                    <Download className="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform duration-300 text-primary-400 group-hover/btn:text-accent-gold" />
                    <span>Download Prospectus</span>
                  </a>

                  {/* Download Application Form */}
                  <a 
                    href="/pdf/application.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden w-full sm:w-auto bg-white border border-primary-200 text-primary-800 font-bold px-8 py-5 rounded-[1.5rem] shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:border-accent-gold hover:text-accent-gold transition-all duration-500 flex items-center justify-center gap-3 group/btn text-base"
                  >
                    <FileText className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300 text-primary-400 group-hover/btn:text-accent-gold" />
                    <span>Application Form</span>
                  </a>

                  {/* Register Now */}
                  <a 
                    href="/admissions/registration-2026#apply-process"
                    className="relative overflow-hidden w-full sm:w-auto bg-primary-950 text-white font-bold px-10 py-5 rounded-[1.5rem] shadow-luxury hover:shadow-glow-lg transition-all duration-500 flex items-center justify-center gap-3 group/btn text-base hover:bg-accent-gold hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                    <span className="relative z-20">Register Now</span>
                    <ArrowRight className="w-5 h-5 relative z-20 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </a>
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
