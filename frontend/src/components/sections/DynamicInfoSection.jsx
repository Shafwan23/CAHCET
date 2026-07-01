import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Briefcase, Megaphone, Newspaper, ArrowRight, Download, MapPin } from 'lucide-react';
import { Section, Container } from '../ui/Layout';
import { cn } from '../../utils/cn';

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

const DynamicInfoSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [expanded, setExpanded] = useState(false);

  const currentTabContent = data || tabContent;

  return (
    <Section id="dynamic-info" className="bg-slate-50 relative overflow-hidden py-24 md:py-32">
      {/* Premium Background Ambience */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-gradient-to-bl from-accent-gold/5 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-gradient-to-tr from-primary-900/5 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.15] mix-blend-overlay pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col gap-12 lg:gap-16 max-w-5xl mx-auto">
          
          {/* Header & Horizontal Tabs */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-accent-gold" />
                <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-xs">Stay Informed</span>
                <div className="w-12 h-[2px] bg-accent-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-primary-950 mb-6 leading-tight tracking-tight">
                Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-700">Updates</span>
              </h2>
              <p className="text-gray-500 font-light text-lg mb-12 max-w-2xl mx-auto">
                Discover the latest happenings, placement milestones, and critical announcements from the CAHCET campus.
              </p>
            </motion.div>

            {/* Horizontal Tabs */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 relative">
              {Object.keys(currentTabContent).map((tab) => {
                const Icon = tabIcons[tab];
                const isActive = activeTab === tab;
                
                return (
                  <motion.button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setExpanded(false);
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-full transition-all duration-500 relative group overflow-hidden",
                      isActive 
                        ? "bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100" 
                        : "bg-white/40 hover:bg-white/80 border border-white"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-tab-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent-gold rounded-t-full"
                      />
                    )}
                    
                    <div className={cn(
                      "transition-colors duration-500",
                      isActive ? "text-accent-gold" : "text-gray-400 group-hover:text-primary-900"
                    )}>
                      {Icon && <Icon className="w-5 h-5" />}
                    </div>
                    
                    <span className={cn(
                      "font-bold text-sm md:text-base transition-colors duration-300",
                      isActive ? "text-primary-950" : "text-gray-500 group-hover:text-primary-950"
                    )}>
                      {currentTabContent[tab].title}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Bottom Column: Content List */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                {currentTabContent[activeTab]?.items?.map((item, idx) => {
                  const dateStr = activeTab === 'events' ? (item.eventDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date))
                              : activeTab === 'placements' ? (item.driveDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date))
                              : activeTab === 'newsletters' ? (item.publishDate || `${item.month} ${item.year}`)
                              : (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date);

                  const desc = item.description || item.desc || '';
                  const img = item.image || item.thumbnailUrl;
                  const displayTitle = item.title || item.company || 'Update';

                  return (
                    <motion.div 
                      key={item.id || idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={cn(
                        "group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-500",
                        !expanded && idx >= 4 ? "hidden" : "flex"
                      )}
                    >
                      {/* Image Block (If exists) */}
                      {img && (
                        <div className="sm:w-48 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-gray-100">
                          <div className="absolute inset-0 bg-primary-950/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                          <img loading="lazy" decoding="async" src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                        </div>
                      )}
                      
                      {/* Content Block */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center relative">
                        {/* Hover Gradient Edge */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-gold to-yellow-400 transform scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500 ease-out" />
                        
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-accent-gold" />
                            {dateStr}
                          </span>
                          
                          {/* Tags */}
                          {item.packageRange && (
                            <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-widest">
                              {item.packageRange}
                            </span>
                          )}
                          {item.eventStatus && (
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${
                              item.eventStatus === 'Live' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' :
                              item.eventStatus === 'Completed' ? 'bg-gray-50 border border-gray-200 text-gray-500' :
                              'bg-blue-50 border border-blue-100 text-blue-700'
                            }`}>
                              {item.eventStatus}
                            </span>
                          )}
                          {item.priority && (
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${
                              item.priority === 'Critical' ? 'bg-red-50 border border-red-100 text-red-600' :
                              item.priority === 'High' ? 'bg-amber-50 border border-amber-100 text-amber-600' :
                              'bg-primary-50 border border-primary-100 text-primary-600'
                            }`}>
                              {item.priority} Priority {item.quickPublish && <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse ml-1" />}
                            </span>
                          )}
                          {item.editionNumber && (
                            <span className="px-3 py-1 bg-purple-50 border border-purple-100 text-purple-700 rounded-lg text-xs font-bold uppercase tracking-widest">
                              Edition {item.editionNumber}
                            </span>
                          )}
                        </div>
                        
                        <h4 className="text-xl md:text-2xl font-bold text-primary-950 mb-3 group-hover:text-primary-800 transition-colors leading-snug">
                          {displayTitle}
                        </h4>
                        
                        <p className="text-gray-500 leading-relaxed text-sm md:text-base font-light mb-5">
                          {desc}
                        </p>
                        
                        <div className="mt-auto flex flex-wrap items-center gap-4">
                          {item.venue && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              <MapPin className="w-4 h-4 text-accent-gold" />
                              {item.venue}
                            </div>
                          )}
                          
                          {item.placementStatistics && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              <Briefcase className="w-4 h-4 text-accent-gold" />
                              {item.placementStatistics}
                            </div>
                          )}
                          
                          {item.pdfUrl && (
                            <a 
                              href={item.pdfUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-2 text-sm font-bold text-primary-900 hover:text-accent-gold transition-colors group/link"
                            >
                              <Download className="w-4 h-4" />
                              Download Document
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* View All Button */}
                {currentTabContent[activeTab]?.items?.length > 4 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-6"
                  >
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="px-8 py-4 rounded-full bg-white border border-gray-200 text-primary-950 font-bold text-sm hover:bg-primary-50 hover:border-accent-gold hover:text-accent-gold transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      {expanded ? 'View Less' : `View All ${currentTabContent[activeTab].title}`}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
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
