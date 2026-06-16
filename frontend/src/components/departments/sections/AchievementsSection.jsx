import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, Calendar, Users, ChevronRight, Trophy } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import { cn } from '../../../utils/cn';
import PremiumEmptyState from '../../ui/PremiumEmptyState';

const MAIN_TABS = [
  { id: 'faculty', label: 'Faculty Achievements', icon: Users },
  { id: 'student', label: 'Student Achievements', icon: Award }
];

const SUB_TABS = {
  faculty: [
    { id: 'internationalJournal', label: 'International Journal' },
    { id: 'internationalConference', label: 'International Conference' },
    { id: 'nationalConference', label: 'National Conference' },
    { id: 'trainingProgram', label: 'Faculty Training Program' },
  ],
  student: [
    { id: 'coCurricular', label: 'Co-Curricular Achievements' },
    { id: 'extraCurricular', label: 'Extra-Curricular Achievements' },
    { id: 'internship', label: 'Internship' },
    { id: 'mooc', label: 'MOOC Courses' },
  ]
};

const AchievementCard = ({ item }) => {
  return (
    <motion.div 
      variants={departmentAnimations.fadeUp}
      className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white/40 shadow-luxury hover:shadow-glow-lg hover:-translate-y-2 transition-all duration-700 relative overflow-hidden group will-change-transform z-10"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50/50 -z-10" />
      
      {/* Sweeping Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/80 to-transparent z-20 pointer-events-none" />

      <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent-gold/10 rounded-full blur-2xl group-hover:bg-accent-gold/20 transition-colors duration-500 z-0" />
      <div className="absolute top-6 right-6 text-primary-200 group-hover:text-accent-gold transition-colors duration-500 group-hover:scale-125 z-10 group-hover:rotate-12">
        <Award className="w-8 h-8 drop-shadow-md" />
      </div>

      <div className="flex gap-4 items-start relative z-10">
        {item.image && (
          <div className="relative group/img">
            <div className="absolute inset-0 bg-accent-gold/20 blur-md rounded-2xl opacity-0 group-hover/img:opacity-100 transition-opacity" />
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-primary-100 shadow-sm relative z-10"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-xl text-primary-900 pr-12 mb-6 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-900 group-hover:to-accent-gold transition-all duration-500">
            {item.title}
          </h3>
          
          <div className="space-y-3">
            {[
              { label: 'Author(s)', value: item.author },
              { label: 'Journal', value: item.journal },
              { label: 'Conference', value: item.conference },
              { label: 'Location', value: item.location },
              { label: 'Organizer', value: item.organizer },
              { label: 'Date', value: item.date, isHighlight: true },
              { label: 'Year', value: item.year, isHighlight: true }
            ].map((field, idx) => field.value && (
              <div key={idx} className="flex items-start gap-3 group/row p-1.5 -mx-1.5 rounded-lg hover:bg-primary-50/50 transition-colors">
                <span className="font-bold text-accent-gold bg-accent-gold/10 border border-accent-gold/20 uppercase tracking-widest text-[9px] py-1 px-2 rounded-md shrink-0 w-24 text-center shadow-sm">
                  {field.label}
                </span>
                <span className={cn(
                  "text-sm font-medium pt-0.5",
                  field.isHighlight ? "text-primary-900 font-bold bg-primary-100/50 px-2 py-0.5 rounded" : "text-primary-600 group-hover/row:text-primary-900 transition-colors"
                )}>
                  {field.value}
                </span>
              </div>
            ))}
            
            {item.description && (
              <p className="text-sm text-primary-500 mt-4 pt-4 border-t border-primary-100/50 leading-relaxed italic">
                "{item.description}"
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-900 via-accent-gold to-primary-900 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-[length:200%_auto] animate-[shimmer_2s_linear_infinite]" />
    </motion.div>
  );
};

const AchievementsSection = ({ data }) => {
  const [activeMainTab, setActiveMainTab] = useState(MAIN_TABS[0].id);
  const [activeSubTab, setActiveSubTab] = useState(SUB_TABS[MAIN_TABS[0].id][0].id);
  const [activeYearTab, setActiveYearTab] = useState(null);

  if (!data) return <PremiumEmptyState title="Achievements Updating" message="We are currently compiling recent department achievements." />;

  let currentData = [];
  if (Array.isArray(data)) {
    const activeLabel = SUB_TABS[activeMainTab].find(t => t.id === activeSubTab)?.label;
    currentData = data.filter(item => item.category === activeSubTab || item.category === activeLabel);
  } else if (data && typeof data === 'object') {
    if (data[activeMainTab] && data[activeMainTab][activeSubTab]) {
      currentData = data[activeMainTab][activeSubTab];
    } else {
      // Fallback for older static data structure
      if (activeMainTab === 'faculty') {
        if (activeSubTab === 'internationalJournal') currentData = data.journals || [];
        if (activeSubTab === 'internationalConference') currentData = data.conferences || [];
        if (activeSubTab === 'trainingProgram') currentData = data.training || [];
      }
    }
  }

  const isTableView = ['trainingProgram', 'extraCurricular', 'coCurricular', 'internship', 'mooc'].includes(activeSubTab);
  let availableYears = [];
  if (isTableView && currentData.length > 0) {
    availableYears = Array.from(new Set(currentData.map(item => item.year || 'Unknown Year'))).sort((a, b) => b.localeCompare(a));
  }
  const currentYearTab = availableYears.includes(activeYearTab) ? activeYearTab : availableYears[0];
  const displayedData = isTableView ? currentData.filter(item => (item.year || 'Unknown Year') === currentYearTab) : currentData;

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl pb-4 mb-8 border-b border-primary-100/50 pt-2">
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase mb-2">
          <span>Department</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-accent-gold">Achievements</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-primary-900 mb-6">Department Achievements</h2>
        
        {/* Main Tabs */}
        <div className="flex gap-4 mb-4">
          {MAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setActiveSubTab(SUB_TABS[tab.id][0].id);
                  setActiveYearTab(null);
                }}
                className={cn(
                  "relative px-6 py-3 text-sm font-bold transition-all flex items-center gap-2 rounded-xl whitespace-nowrap",
                  isActive ? "bg-primary-900 text-white shadow-md border border-primary-800" : "bg-primary-50/80 text-primary-500 hover:text-primary-900 hover:bg-primary-100"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-accent-gold" : "")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub Tabs */}
        <div className="inline-flex p-1.5 bg-primary-50/80 backdrop-blur-sm rounded-2xl border border-primary-100 overflow-x-auto max-w-full hide-scrollbar">
          {SUB_TABS[activeMainTab].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  setActiveYearTab(null);
                }}
                className={cn(
                  "relative px-4 py-2 text-sm font-bold transition-all rounded-xl whitespace-nowrap",
                  isActive ? "text-white" : "text-primary-500 hover:text-primary-900 hover:bg-white/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="achievementsSubTabIndicator"
                    className="absolute inset-0 bg-primary-900 rounded-xl shadow-sm border border-primary-800"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Year Tabs (Tertiary) */}
        {isTableView && availableYears.length > 0 && (
          <div className="mt-6 flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {availableYears.map(year => {
              const isActive = currentYearTab === year;
              return (
                <button
                  key={year}
                  onClick={() => setActiveYearTab(year)}
                  className={cn(
                    "px-5 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap",
                    isActive ? "bg-accent-gold text-white shadow-md" : "bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-900"
                  )}
                >
                  {year.includes('Academic Year') ? year.replace('Academic Year ', '').replace(/[()]/g, '') : year}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab + currentYearTab}
          variants={departmentAnimations.staggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20, filter: 'blur(5px)', transition: { duration: 0.3 } }}
          className="grid md:grid-cols-2 gap-8"
        >
          {displayedData.length > 0 ? (
            isTableView ? (
              <div className="col-span-full space-y-8">
                {Array.from(new Set(displayedData.map(item => item.year || 'Unknown Year'))).sort((a, b) => b.localeCompare(a)).map(year => (
                  <div key={year} className="bg-white rounded-[2rem] border border-primary-100 shadow-luxury overflow-hidden">
                    <div className="bg-primary-900 text-white px-6 py-4">
                      <h3 className="font-display font-bold text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent-gold" />
                        {year.includes('Academic Year') ? year : `Academic Year (${year})`}
                      </h3>
                    </div>
                    <div className="overflow-x-auto p-4 md:p-6">
                      <table className="w-full text-left border-separate" style={{ borderSpacing: '0 12px' }}>
                        <thead>
                          <tr className="text-primary-400 uppercase tracking-widest text-[10px]">
                            {['internship', 'mooc'].includes(activeSubTab) ? (
                              <>
                                <th className="px-6 py-2 font-bold whitespace-nowrap">S.NO</th>
                                <th className="px-6 py-2 font-bold whitespace-nowrap">{activeSubTab === 'mooc' ? 'STUDENT NAME' : 'NAME'}</th>
                                <th className="px-6 py-2 font-bold whitespace-nowrap">{activeSubTab === 'mooc' ? 'COMPANY NAME' : 'COMPANY'}</th>
                                <th className="px-6 py-2 font-bold">{activeSubTab === 'mooc' ? 'COURSE NAME' : 'TOPIC'}</th>
                                <th className="px-6 py-2 font-bold whitespace-nowrap">DATE</th>
                              </>
                            ) : ['coCurricular', 'extraCurricular'].includes(activeSubTab) ? (
                              <>
                                <th className="px-6 py-2 font-bold whitespace-nowrap">Name</th>
                                <th className="px-6 py-2 font-bold">Details</th>
                              </>
                            ) : activeSubTab === 'trainingProgram' ? (
                              <>
                                <th className="px-6 py-2 font-bold">Details</th>
                                <th className="px-6 py-2 font-bold whitespace-nowrap">Date</th>
                              </>
                            ) : (
                              <>
                                <th className="px-6 py-2 font-bold whitespace-nowrap">Name</th>
                                <th className="px-6 py-2 font-bold">Details</th>
                                <th className="px-6 py-2 font-bold whitespace-nowrap">Date / Info</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {displayedData.filter(item => (item.year || 'Unknown Year') === year).map((item, index) => (
                            <tr key={item.id} className="group bg-white hover:bg-gradient-to-r hover:from-white hover:to-accent-gold/5 transition-all duration-300 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-luxury hover:-translate-y-1 relative">
                              {['internship', 'mooc'].includes(activeSubTab) ? (
                                <>
                                  <td className="p-5 text-sm text-primary-400 font-bold whitespace-nowrap align-top rounded-l-2xl border-y border-l border-primary-100 group-hover:border-accent-gold/30">{String(index + 1).padStart(2, '0')}</td>
                                  <td className="p-5 text-sm font-bold text-primary-900 whitespace-nowrap align-top border-y border-primary-100 group-hover:border-accent-gold/30">{item.author || item.organizer}</td>
                                  <td className="p-5 text-sm font-medium text-accent-gold whitespace-nowrap align-top border-y border-primary-100 group-hover:border-accent-gold/30">
                                    <span className="bg-accent-gold/10 px-3 py-1 rounded-full border border-accent-gold/20">{item.company || '-'}</span>
                                  </td>
                                  <td className="p-5 text-sm text-primary-600 align-top leading-relaxed border-y border-primary-100 group-hover:border-accent-gold/30">{item.topic || item.title}</td>
                                  <td className="p-5 text-sm text-primary-600 whitespace-nowrap align-top rounded-r-2xl border-y border-r border-primary-100 group-hover:border-accent-gold/30">
                                    {item.date && <span className="bg-primary-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md">{item.date}</span>}
                                  </td>
                                </>
                              ) : ['coCurricular', 'extraCurricular'].includes(activeSubTab) ? (
                                <>
                                  <td className="p-5 text-sm font-bold text-primary-900 whitespace-nowrap align-top rounded-l-2xl border-y border-l border-primary-100 group-hover:border-accent-gold/30">{item.author || item.organizer}</td>
                                  <td className="p-5 text-sm text-primary-600 align-top leading-relaxed rounded-r-2xl border-y border-r border-primary-100 group-hover:border-accent-gold/30">{item.title}</td>
                                </>
                              ) : activeSubTab === 'trainingProgram' ? (
                                <>
                                  <td className="p-5 text-sm text-primary-600 align-top leading-relaxed rounded-l-2xl border-y border-l border-primary-100 group-hover:border-accent-gold/30">{item.title}</td>
                                  <td className="p-5 text-sm text-primary-600 whitespace-nowrap align-top rounded-r-2xl border-y border-r border-primary-100 group-hover:border-accent-gold/30">
                                    {item.date && <span className="bg-primary-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md">{item.date}</span>}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="p-5 text-sm font-bold text-primary-900 whitespace-nowrap align-top rounded-l-2xl border-y border-l border-primary-100 group-hover:border-accent-gold/30">{item.author || item.organizer}</td>
                                  <td className="p-5 text-sm text-primary-600 align-top leading-relaxed border-y border-primary-100 group-hover:border-accent-gold/30">{item.title}</td>
                                  <td className="p-5 text-sm text-primary-600 whitespace-nowrap align-top rounded-r-2xl border-y border-r border-primary-100 group-hover:border-accent-gold/30">
                                    {item.date && <span className="bg-primary-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md">{item.date}</span>}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              displayedData.map((item) => (
                <AchievementCard key={item.id} item={item} />
              ))
            )
          ) : (
            <div className="col-span-full">
              <PremiumEmptyState 
                title="No Records Found" 
                message={`There are currently no records available in the ${SUB_TABS[activeMainTab].find(t => t.id === activeSubTab)?.label} category.`} 
                icon={Award}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AchievementsSection;
