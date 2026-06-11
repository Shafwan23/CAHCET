import React, { useState, Suspense } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { departmentAnimations } from '../../animations/departmentAnimations';
import DepartmentHero from './DepartmentHero';
import DepartmentSidebar from './DepartmentSidebar';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import SuspenseLoader from '../ui/SuspenseLoader';
import { useLocation } from 'react-router-dom';

const DepartmentLayout = ({ data, activeSection, children }) => {
  const location = useLocation();

  React.useEffect(() => {
    if (!location.state?.fromDeptSidebar) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.state]);
  if (!data) return null;

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-primary-50/50 flex flex-col relative overflow-hidden">
        {/* Ambient Background Lighting */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[120px] opacity-50 mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[100px] opacity-50 mix-blend-multiply" />
        </div>

        <Helmet>
          <title>{data.heroData.title} | CAHCET</title>
          <meta name="description" content={data.heroData.tagline} />
        </Helmet>

        <Navbar />

        <main className="flex-1 relative z-10 pb-24 md:pb-0">
          <DepartmentHero data={data.heroData} />

          <div className="container mx-auto px-4 md:px-8 py-12 md:py-24 relative max-w-7xl">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
              
              <DepartmentSidebar 
                deptCode={data.id}
                activeSection={activeSection} 
              />

              {/* Dynamic Dashboard Content Area */}
              <div 
                id="department-content-area" 
                className="flex-1 w-full min-h-[60vh] bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-12 border border-white/60 shadow-luxury relative"
              >
                <Suspense fallback={<SuspenseLoader />}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      variants={departmentAnimations.cinematicPageTransition}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="w-full h-full will-change-transform"
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>
                </Suspense>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default DepartmentLayout;
