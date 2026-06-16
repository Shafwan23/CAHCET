import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Briefcase, Megaphone, Newspaper } from 'lucide-react';
import { Section, Container } from '../ui/Layout';
import { cn } from '../../utils/cn';
import { slideUp } from '../../animations/variants';

const tabContent = {
  events: {
    title: 'Latest Events',
    items: [
      { date: 'May 15, 2026', title: 'Annual Tech Symposium "Xelerate 2026"', desc: 'A national level technical symposium showcasing student innovations.' },
      { date: 'May 10, 2026', title: 'Workshop on Quantum Computing', desc: 'Industry experts from IBM delivered hands-on training.' },
      { date: 'May 05, 2026', title: 'Cultural Fest "Aura 2026"', desc: 'A celebration of talent and diversity with over 50 events.' },
    ]
  },
  placements: {
    title: 'Placement Updates',
    items: [
      { date: 'May 12, 2026', title: '150+ Students Placed in TCS', desc: 'Mass recruitment drive yields excellent results for final year students.' },
      { date: 'May 08, 2026', title: 'Highest Package of 24 LPA Secured', desc: 'CSE student clears rigorous selection process at global tech giant.' },
      { date: 'May 02, 2026', title: 'Core Engineering Placements Rise', desc: 'Mechanical and Civil students secure roles in top infrastructure firms.' },
    ]
  },
  announcements: {
    title: 'Announcements',
    items: [
      { date: 'May 14, 2026', title: 'Odd Semester Results Published', desc: 'Students can check their results on the college portal.' },
      { date: 'May 09, 2026', title: 'Scholarship Applications Open', desc: 'Merit-cum-means scholarship applications are being accepted.' },
      { date: 'May 01, 2026', title: 'Hostel Re-registration Notice', desc: 'All hostel residents must re-register for the upcoming academic year.' },
    ]
  },
  newsletters: {
    title: 'Newsletters',
    items: [
      { date: 'April 2026', title: 'CAHCET Chronicle - Issue 45', desc: 'Quarterly newsletter covering campus achievements and research.' },
      { date: 'January 2026', title: 'CAHCET Chronicle - Issue 44', desc: 'New Year edition with focus on placement success.' },
      { date: 'October 2025', title: 'CAHCET Chronicle - Issue 43', desc: 'Coverage of cultural events and academic milestones.' },
    ]
  }
};

const tabIcons = {
  events: Calendar,
  placements: Briefcase,
  announcements: Megaphone,
  newsletters: Newspaper
};

const getThemeColors = (tab) => {
  switch (tab) {
    case 'events':
      return {
        mainBg: 'bg-slate-50 border-slate-200 shadow-slate-200/50',
        badge: 'bg-blue-100/90 text-blue-800 border-blue-200',
        bullet: 'bg-blue-600',
        glow: 'bg-blue-200',
        border: 'border-slate-200 hover:border-blue-300',
        cardBg: 'bg-white hover:bg-slate-50 shadow-md',
        text: 'text-slate-900',
        desc: 'text-slate-600'
      };
    case 'placements':
      return {
        mainBg: 'bg-slate-50 border-slate-200 shadow-slate-200/50',
        badge: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
        bullet: 'bg-emerald-600',
        glow: 'bg-emerald-200',
        border: 'border-slate-200 hover:border-emerald-300',
        cardBg: 'bg-white hover:bg-slate-50 shadow-md',
        text: 'text-slate-900',
        desc: 'text-slate-600'
      };
    case 'announcements':
      return {
        mainBg: 'bg-slate-50 border-slate-200 shadow-slate-200/50',
        badge: 'bg-amber-100/90 text-amber-800 border-amber-200',
        bullet: 'bg-amber-600',
        glow: 'bg-amber-200',
        border: 'border-slate-200 hover:border-amber-300',
        cardBg: 'bg-white hover:bg-slate-50 shadow-md',
        text: 'text-slate-900',
        desc: 'text-slate-600'
      };
    case 'newsletters':
      return {
        mainBg: 'bg-slate-50 border-slate-200 shadow-slate-200/50',
        badge: 'bg-indigo-100/90 text-indigo-800 border-indigo-200',
        bullet: 'bg-indigo-600',
        glow: 'bg-indigo-200',
        border: 'border-slate-200 hover:border-indigo-300',
        cardBg: 'bg-white hover:bg-slate-50 shadow-md',
        text: 'text-slate-900',
        desc: 'text-slate-600'
      };
    default:
      return {
        mainBg: 'bg-slate-50 border-slate-200 shadow-slate-200/50',
        badge: 'bg-slate-100/90 text-slate-800 border-slate-200',
        bullet: 'bg-slate-600',
        glow: 'bg-slate-200',
        border: 'border-slate-200 hover:border-slate-300',
        cardBg: 'bg-white hover:bg-slate-50 shadow-md',
        text: 'text-slate-900',
        desc: 'text-slate-600'
      };
  }
};

const DynamicInfoSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [expanded, setExpanded] = useState(false);

  const currentTabContent = data || tabContent;

  return (
    <Section id="dynamic-info" className="bg-white">
      <Container>
        {/* Section Heading Refinement */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent-gold font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 block">
            Campus Bulletins & Updates
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-900 mb-4 tracking-tight">
            Stay Updated with CAHCET
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 text-base md:text-lg leading-relaxed">
            Explore our latest campus events, placement drives, announcements, and newsletters.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Segmented Pill Tabs */}
          <div className="flex justify-center mb-10 md:mb-12">
            <div 
              role="tablist"
              aria-label="Campus Updates"
              className="inline-flex flex-wrap md:flex-nowrap p-1.5 bg-slate-50/95 backdrop-blur-md border border-slate-200/60 rounded-[2rem] md:rounded-full shadow-inner gap-1 md:gap-2 max-w-full justify-center"
            >
              {Object.keys(currentTabContent).map((tab) => {
                const Icon = tabIcons[tab];
                const isActive = activeTab === tab;
                
                return (
                  <motion.button
                    key={tab}
                    id={`tab-${tab}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setExpanded(false); // Reset expansion on tab switch
                    }}
                    whileHover={{ 
                      y: -2, 
                      scale: 1.02,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    className={cn(
                      "px-3.5 py-2.5 md:px-5 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-200 relative flex items-center justify-center gap-2 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2",
                      isActive
                        ? "text-white shadow-md shadow-primary-900/10"
                        : "text-slate-600 hover:text-primary-900 hover:bg-white/60 border border-transparent"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-primary-900 rounded-full z-0"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {Icon && (
                        <motion.span
                          animate={{
                            scale: isActive ? 1.15 : 1,
                            rotate: isActive ? [0, -6, 6, 0] : 0
                          }}
                          transition={{ duration: 0.35 }}
                          className="flex items-center"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.span>
                      )}
                      <span>{currentTabContent[tab].title}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className={cn(
            "rounded-3xl p-6 md:p-10 border shadow-2xl relative overflow-hidden transition-all duration-700 ease-in-out",
            getThemeColors(activeTab).mainBg
          )}>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                id={`tabpanel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentTabContent[activeTab]?.items?.map((item, idx) => {
                    const dateStr = activeTab === 'events' ? (item.eventDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date))
                                : activeTab === 'placements' ? (item.driveDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date))
                                : activeTab === 'newsletters' ? (`${item.month} ${item.year}`)
                                : (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date);

                    const desc = item.description || item.desc || '';
                    const img = item.image || item.thumbnailUrl;
                    const theme = getThemeColors(activeTab);
                    const Icon = tabIcons[activeTab];

                    return (
                      <motion.div 
                        key={item.id || idx}
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: -4 }}
                        whileHover={{ y: -10, scale: 1.015 }}
                        transition={{ type: "spring", stiffness: 150, damping: 15 }}
                        className={cn(
                          "group relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden transform hover:-translate-y-2",
                          theme.cardBg,
                          theme.border,
                          !expanded && idx >= 4 ? "hidden" : "flex"
                        )}
                      >
                        {/* Interactive Background Glow */}
                        <div className={cn(
                          "absolute -right-10 -bottom-10 w-28 h-28 rounded-full blur-2xl opacity-10 group-hover:opacity-[0.22] transition-all duration-500 pointer-events-none z-0",
                          theme.glow
                        )} />

                        {/* Faint Background Icon Watermark */}
                        <div className="absolute right-4 bottom-4 pointer-events-none transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-0">
                          {Icon && <Icon className="w-20 h-20 stroke-[0.75] text-slate-900/[0.03] group-hover:text-slate-900/[0.06] transition-colors" />}
                        </div>

                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-900 to-accent-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-10"></div>
                        {img && (
                          <div className="w-full h-48 overflow-hidden bg-slate-100 relative">
                            <div className="absolute inset-0 bg-primary-900/5 group-hover:bg-transparent transition-colors duration-300 z-10" />
                            <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col relative z-10">
                          <div className="mb-4 flex items-center justify-between">
                            <span className={cn("inline-flex items-center px-3 py-1.5 font-bold text-xs rounded-full uppercase tracking-wider border", theme.badge)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full mr-2 animate-pulse", theme.bullet)}></span>
                              {dateStr}
                            </span>
                          </div>
                          <h4 className={cn("text-lg md:text-xl font-bold mb-3 leading-snug transition-colors", theme.text)}>
                            {item.title}
                          </h4>
                          <p className={cn("text-sm leading-relaxed mb-6 flex-1", theme.desc)}>{desc}</p>
                          
                          {/* Metadata - Only render if metadata is present to prevent empty dividers */}
                          {(item.venue || item.packageRange || item.pdfUrl) && (
                            <div className="mt-auto space-y-3 pt-4 border-t border-slate-200">
                              {item.venue && (
                                <div className="flex items-center text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                  <span className="mr-2 text-base">📍</span> {item.venue}
                                </div>
                              )}
                              {item.packageRange && (
                                <div className="flex items-center text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                  <span className="mr-2 text-base">💰</span> <span>{item.packageRange}</span>
                                </div>
                              )}
                              {item.pdfUrl && (
                                <a 
                                  href={item.pdfUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="inline-flex items-center text-sm font-bold text-primary-900 hover:text-primary-800 transition-colors mt-2"
                                >
                                  Download PDF <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* View All Button */}
                {currentTabContent[activeTab]?.items?.length > 4 && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary-900 text-white font-bold text-sm hover:bg-primary-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {expanded ? 'Show Less' : `View All ${currentTabContent[activeTab].title}`}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default DynamicInfoSection;
