import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, Calendar, Users, ChevronRight, Trophy } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import { cn } from '../../../utils/cn';
import PremiumEmptyState from '../../ui/PremiumEmptyState';

const TABS = [
  { id: 'Student', label: 'Student Achievements', icon: Award },
  { id: 'Faculty', label: 'Faculty Achievements', icon: Users },
  { id: 'Placement', label: 'Placement Achievements', icon: Award },
  { id: 'Research', label: 'Research Publications', icon: BookOpen },
  { id: 'Award', label: 'Awards & Honors', icon: Award },
  { id: 'Competition', label: 'Competitions & Hackathons', icon: Trophy },
  { id: 'Certification', label: 'Certifications', icon: BookOpen }
];

const AchievementCard = ({ item }) => {
  return (
    <motion.div 
      variants={departmentAnimations.fadeUp}
      className="bg-white p-8 rounded-[2rem] border border-primary-100 shadow-luxury hover:shadow-luxury-hover hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group will-change-transform"
    >
      {/* Decorative Background Elements */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent-gold/5 rounded-full blur-2xl group-hover:bg-accent-gold/10 transition-colors duration-500" />
      <div className="absolute top-6 right-6 text-primary-200 group-hover:text-accent-gold transition-colors duration-500 group-hover:scale-110">
        <Award className="w-8 h-8" />
      </div>

      <div className="flex gap-4 items-start relative z-10">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-primary-100 shadow-sm"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-xl text-primary-900 pr-12 mb-4 leading-snug group-hover:text-accent-gold transition-colors">
            {item.title}
          </h3>
          
          <div className="space-y-3 text-sm text-primary-600">
            {item.author && (
              <p className="flex items-start gap-2"><span className="font-bold text-primary-900 uppercase tracking-widest text-[10px] mt-1 shrink-0 w-20">Author(s)</span> <span>{item.author}</span></p>
            )}
            {item.journal && (
              <p className="flex items-start gap-2"><span className="font-bold text-primary-900 uppercase tracking-widest text-[10px] mt-1 shrink-0 w-20">Journal</span> <span>{item.journal}</span></p>
            )}
            {item.conference && (
              <p className="flex items-start gap-2"><span className="font-bold text-primary-900 uppercase tracking-widest text-[10px] mt-1 shrink-0 w-20">Conference</span> <span>{item.conference}</span></p>
            )}
            {item.location && (
              <p className="flex items-start gap-2"><span className="font-bold text-primary-900 uppercase tracking-widest text-[10px] mt-1 shrink-0 w-20">Location</span> <span>{item.location}</span></p>
            )}
            {item.organizer && (
              <p className="flex items-start gap-2"><span className="font-bold text-primary-900 uppercase tracking-widest text-[10px] mt-1 shrink-0 w-20">Organizer</span> <span>{item.organizer}</span></p>
            )}
            {item.date && (
              <p className="flex items-start gap-2"><span className="font-bold text-primary-900 uppercase tracking-widest text-[10px] mt-1 shrink-0 w-20">Date</span> <span className="bg-primary-50 px-2 py-0.5 rounded-md font-bold text-primary-900">{item.date}</span></p>
            )}
            {item.year && (
              <p className="flex items-start gap-2"><span className="font-bold text-primary-900 uppercase tracking-widest text-[10px] mt-1 shrink-0 w-20">Year</span> <span className="bg-primary-50 px-2 py-0.5 rounded-md font-bold text-primary-900">{item.year}</span></p>
            )}
            {item.description && (
              <p className="text-sm text-primary-600 mt-2">{item.description}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Animated Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gold/0 via-accent-gold to-accent-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const AchievementsSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  if (!data) return <PremiumEmptyState title="Achievements Updating" message="We are currently compiling recent department achievements." />;

  let currentData = [];
  if (Array.isArray(data)) {
    currentData = data.filter(item => item.category === activeTab);
  } else if (data && typeof data === 'object') {
    // Map old categories (journals, conferences, training) to the new categories
    if (activeTab === 'Research') {
      currentData = [...(data.journals || []), ...(data.conferences || [])];
    } else if (activeTab === 'Faculty') {
      currentData = data.training || [];
    } else {
      currentData = data[activeTab.toLowerCase()] || [];
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl pb-4 mb-8 border-b border-primary-100/50 pt-2">
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase mb-2">
          <span>Department</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-accent-gold">Achievements</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-primary-900 mb-6">Department Achievements</h2>
        
        {/* Elite Segmented Pill Control */}
        <div className="inline-flex p-1.5 bg-primary-50/80 backdrop-blur-sm rounded-2xl border border-primary-100 overflow-x-auto max-w-full hide-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-6 py-3 text-sm font-bold transition-all flex items-center gap-2 rounded-xl whitespace-nowrap",
                  isActive ? "text-white" : "text-primary-500 hover:text-primary-900 hover:bg-white/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="achievementsTabIndicator"
                    className="absolute inset-0 bg-primary-900 rounded-xl shadow-md border border-primary-800"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 relative z-10", isActive ? "text-accent-gold" : "")} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={departmentAnimations.staggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20, filter: 'blur(5px)', transition: { duration: 0.3 } }}
          className="grid md:grid-cols-2 gap-8"
        >
          {currentData.length > 0 ? (
            currentData.map((item) => (
              <AchievementCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full">
              <PremiumEmptyState 
                title="No Records Found" 
                message={`There are currently no records available in the ${TABS.find(t => t.id === activeTab)?.label} category.`} 
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
