import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Monitor, 
  Users, 
  Award, 
  Image as ImageIcon, 
  BookOpen, 
  Phone,
  Menu,
  X
} from 'lucide-react';
import { departmentAnimations } from '../../animations/departmentAnimations';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { id: 'department', label: 'Department', icon: Building },
  { id: 'facilities', label: 'Facilities', icon: Monitor },
  { id: 'faculties', label: 'Faculties', icon: Users },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'events-gallery', label: 'Events Gallery', icon: ImageIcon },
  { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
  { id: 'contact-us', label: 'Contact Us', icon: Phone }
];

const DepartmentSidebar = ({ deptCode, activeSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when active section changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection]);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const activeItem = NAV_ITEMS.find(item => item.id === activeSection) || NAV_ITEMS[0];

  return (
    <>
      {/* Desktop Elite Glassmorphism Sidebar */}
      <div className="hidden md:block w-72 lg:w-80 shrink-0 relative z-20">
        <div className="sticky top-28 bg-white/60 backdrop-blur-3xl border border-white/40 rounded-[2rem] p-6 shadow-luxury">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-[2rem] pointer-events-none" />
          
          <h3 className="text-primary-900 font-display font-bold text-xl mb-6 px-4 relative z-10 flex items-center gap-2">
            <div className="w-2 h-6 bg-accent-gold rounded-full" />
            Navigation
          </h3>
          
          <nav className="flex flex-col gap-2 relative z-10">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.id}
                  to={`/departments/${deptCode}/${item.id}`}
                  state={{ fromDeptSidebar: true }}
                  onClick={handleNavClick}
                  className={cn(
                    "relative px-4 py-4 rounded-2xl transition-all duration-300 font-medium text-sm flex items-center gap-4 group overflow-hidden",
                    isActive ? "text-primary-900" : "text-primary-500 hover:text-primary-900 hover:bg-white/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      variants={departmentAnimations.activeIndicator}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 bg-white rounded-2xl -z-10 shadow-glow border border-accent-gold/20"
                    />
                  )}
                  
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive ? "bg-accent-gold/10 text-accent-gold" : "bg-primary-50 text-primary-400 group-hover:bg-primary-100 group-hover:text-primary-600"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Floating Pill Navigation (App-like UX) */}
      <div className="md:hidden fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-sm pointer-events-auto">
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="mb-4 bg-primary-950/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-luxury-hover overflow-hidden"
              >
                <nav className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto overscroll-contain">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        to={`/departments/${deptCode}/${item.id}`}
                        state={{ fromDeptSidebar: true }}
                        onClick={handleNavClick}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-colors w-full text-left",
                          isActive 
                            ? "bg-accent-gold/20 text-accent-gold border border-accent-gold/30" 
                            : "text-primary-200 hover:bg-white/10"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Floating Pill Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-primary-900/95 backdrop-blur-xl text-white px-6 py-4 rounded-full shadow-luxury-hover flex items-center justify-between border border-white/10 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-accent-gold/20 rounded-full text-accent-gold">
                {React.createElement(activeItem.icon, { className: "w-5 h-5" })}
              </div>
              <span className="font-bold">{activeItem.label}</span>
            </div>
            {isMobileMenuOpen ? <X className="w-6 h-6 text-primary-300" /> : <Menu className="w-6 h-6 text-primary-300" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default DepartmentSidebar;
