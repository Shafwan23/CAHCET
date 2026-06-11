import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useScroll } from '../../hooks/useScroll';

const NAV_ITEMS = [
  { id: 'methodology', label: 'Teaching Methodology', path: '/academics/teaching-methodology' },
  { id: 'facility',    label: 'Campus Facilities',    path: '/academics/campus-facility' },
  { id: 'sports',      label: 'Sports',               path: '/academics/sports' },
  { id: 'life',        label: 'Campus Life',          path: '/academics/campus-life' },
  { id: 'calendar',    label: 'Academic Calendar',    path: '/academics/academic-calendar' },
  { id: 'holidays',    label: 'List of Holidays',     path: '/academics/list-of-holidays' },
  { id: 'syllabus',    label: 'Syllabus',             path: '/academics/syllabus' },
];

const AcademicsLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrolled = useScroll(100);

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Sticky Tab Navigation */}
      <div className={cn(
        'sticky top-[72px] z-40 transition-all duration-500',
        scrolled
          ? 'py-4 bg-white/80 backdrop-blur-xl shadow-luxury border-b border-primary-100/50'
          : 'py-6 bg-transparent'
      )}>
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          {/* Desktop */}
          <div className="hidden md:flex justify-center">
            <div className="bg-primary-50/50 backdrop-blur-md p-1.5 rounded-full border border-primary-100/50 flex gap-1 relative flex-wrap justify-center">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative overflow-hidden whitespace-nowrap',
                      isActive ? 'text-white' : 'text-primary-600 hover:text-primary-900'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="academicsNavIndicator"
                        className="absolute inset-0 bg-primary-900 rounded-full shadow-md"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-2 -mx-4 px-4">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap border shrink-0',
                    isActive
                      ? 'bg-primary-900 text-white border-primary-900 shadow-lg'
                      : 'bg-white/80 text-primary-600 border-primary-100 hover:border-primary-300'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default AcademicsLayout;
