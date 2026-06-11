import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const DynamicInfoSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [expanded, setExpanded] = useState(false);

  const currentTabContent = data || tabContent;

  return (
    <Section id="dynamic-info" className="bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center mb-12">
            {Object.keys(currentTabContent).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setExpanded(false); // Reset expansion on tab switch
                }}
                className={cn(
                  "px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 relative overflow-hidden",
                  activeTab === tab
                    ? "text-white shadow-lg"
                    : "text-primary-600 bg-primary-50 hover:bg-primary-100"
                )}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-primary-900"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{currentTabContent[tab].title}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl p-8 border border-primary-100 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {currentTabContent[activeTab]?.items?.map((item, idx) => {
                    const date = activeTab === 'events' ? (item.eventDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date))
                               : activeTab === 'placements' ? (item.driveDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date))
                               : activeTab === 'newsletters' ? (`${item.month} ${item.year}`)
                               : (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date);

                    const desc = item.description || item.desc || '';
                    const img = item.image || item.thumbnailUrl;

                    return (
                      <div 
                        key={item.id || idx}
                        className={cn(
                          "flex flex-col md:flex-row md:items-start gap-4 pb-6 border-b border-primary-100 last:border-0 last:pb-0",
                          !expanded && idx >= 2 ? "hidden" : "flex"
                        )}
                      >
                        {img && (
                          <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-1 hidden sm:block">
                            <img src={img} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="mb-1">
                            <span className="text-accent-gold font-bold text-sm">{date}</span>
                          </div>
                          <h4 className="text-lg font-bold text-primary-900 mb-1 leading-snug">{item.title}</h4>
                          <p className="text-primary-600 text-sm line-clamp-2">{desc}</p>
                          
                          <div className="mt-2 space-y-1">
                            {item.venue && <p className="text-xs font-semibold text-slate-500">📍 Venue: {item.venue}</p>}
                            {item.packageRange && <p className="text-xs font-semibold text-slate-500">💰 Package: {item.packageRange}</p>}
                            {item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">Download Newsletter PDF</a>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View All Button */}
                {currentTabContent[activeTab]?.items?.length > 2 && (
                  <div className="text-center mt-6 pt-4 border-t border-primary-100">
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-primary-900 font-bold text-sm hover:text-accent-gold transition-colors"
                    >
                      {expanded ? 'Show Less' : 'View All'}
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
