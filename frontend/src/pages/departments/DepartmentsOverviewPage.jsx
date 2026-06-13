import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DepartmentTimelineSection from '../../components/sections/DepartmentTimelineSection';
import { departmentsTimelineData } from '../../data/departmentsOverviewData';
import { cmsService } from '../../services/cmsService';
import SuspenseLoader from '../../components/ui/SuspenseLoader';

const DepartmentsOverviewPage = () => {
  const [hero, setHero] = useState({
    title: 'Colleges & Departments',
    subtitle: 'Academic Excellence',
    description: 'Discover our world-class facilities, industry-integrated curriculum, and the visionary faculty shaping the next generation of global innovators.'
  });
  const [engineering, setEngineering] = useState(departmentsTimelineData.engineering);
  const [standalone, setStandalone] = useState(departmentsTimelineData.standalone);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getPage('departments_overview');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});

        if (map['departments_overview.hero']) {
          setHero(JSON.parse(map['departments_overview.hero'].content));
        }
        if (map['departments_overview.engineering']) {
          setEngineering(JSON.parse(map['departments_overview.engineering'].content));
        }
        if (map['departments_overview.standalone']) {
          setStandalone(JSON.parse(map['departments_overview.standalone'].content));
        }
      } catch (err) {
        console.error('Failed to load departments overview CMS', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCMS();
  }, []);

  if (loading) return <SuspenseLoader />;

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-primary-950">
        <Helmet>
          <title>Colleges and Departments | CAHCET</title>
          <meta name="description" content="Explore the diverse and future-ready engineering and standalone departments at CAHCET. A legacy of excellence." />
        </Helmet>

        <Navbar />

        <main>
          {/* Cinematic Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center justify-center min-h-[60vh]">
            {/* Background Mesh/Glow */}
            <div className="absolute inset-0 bg-primary-950 z-0" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full opacity-30 z-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-sm mb-6 block">
                  {hero.subtitle}
                </span>
                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-8 leading-tight">
                  {hero.title}
                </h1>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                  {hero.description}
                </p>
              </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-white/50 text-xs tracking-widest uppercase">Explore</span>
              <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                <motion.div 
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-full bg-accent-gold"
                />
              </div>
            </motion.div>
          </section>

          {/* Timelines */}
          <div className="relative z-10 bg-primary-950">
            <DepartmentTimelineSection 
              title="Engineering Programs" 
              data={engineering} 
            />
            
            {/* Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <DepartmentTimelineSection 
              title="Stand Alone Courses" 
              data={standalone} 
            />
          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default DepartmentsOverviewPage;
