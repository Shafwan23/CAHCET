import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Briefcase, Brain, Building2,
  ChevronRight, History, Play, Sparkles, MessageSquare
} from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { useChatbotContext } from '../../context/ChatbotContext';
import { cn } from '../../utils/cn';
import { chatbotAnalyticsService } from '../../services/chatbotAnalyticsService';

const IconMap = {
  GraduationCap, Briefcase, Brain, Building2, MessageSquare
};

const getIcon = (name) => {
  const IconComponent = IconMap[name];
  return IconComponent || MessageSquare;
};

export default function ChatbotWelcomeScreen({ isFullscreen, handleSend }) {
  const { setMessages } = useChatbotContext();
  const [chatbotSettings, setChatbotSettings] = useState({});
  const welcomeScreen = chatbotSettings.welcomeScreen || {};
  const animationIntensity = chatbotSettings.animationIntensity || 'high';
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await cmsService.getPage('system');
        const sections = res.data?.sections || [];
        const botSection = sections.find(s => s.sectionKey === 'system.chatbot');
        if (botSection) {
          setChatbotSettings(JSON.parse(botSection.content));
        }
      } catch (err) {
        console.error("Failed to load chatbot settings", err);
      }
    };
    fetchSettings();
  }, []);
  
  const [previousSession, setPreviousSession] = useState(null);
  
  // Animation settings
  const isReduced = animationIntensity === 'none' || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const isLow = animationIntensity === 'low';

  // Load returning user data on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('cahcet_chatbot_previous_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.length > 0) {
          setPreviousSession(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load returning user data", e);
    }
  }, []);

  const handlePromptClick = (type, itemId, label, query) => {
    chatbotAnalyticsService.logOnboardingClick(type, itemId, label);
    handleSend(query);
  };

  const handleRestoreSession = () => {
    if (previousSession && previousSession.length > 0) {
      chatbotAnalyticsService.logSessionRestore();
      if (setMessages) {
        setMessages(previousSession);
      } else {
        window.location.reload();
      }
    }
  };

  // Fallbacks if CMS configurations are missing
  const welcomeTitle = welcomeScreen.welcomeTitle || "Welcome to CAHCET!";
  const welcomeSubtitle = welcomeScreen.welcomeSubtitle || "I'm your virtual assistant. How can I help you today?";

  // Simplified Quick Options for College Bot
  const quickOptions = [
    { id: '1', icon: 'GraduationCap', title: 'Admissions', query: 'Tell me about admission procedure' },
    { id: '2', icon: 'Briefcase', title: 'Placements', query: 'Show placement details' },
    { id: '3', icon: 'Building2', title: 'Departments', query: 'What departments are available?' },
    { id: '4', icon: 'Brain', title: 'AI Career Counseling', query: 'Start AI Career Counseling' }
  ];

  const suggestedPrompts = welcomeScreen.suggestedPrompts || [
    "What are the fees for CSE?",
    "Show me the hostel facilities",
    "How to apply for scholarships?",
    "Who are the top recruiters?"
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isReduced ? 0 : (isLow ? 0.05 : 0.1),
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isReduced ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "w-full flex flex-col items-center select-none text-slate-800",
        isFullscreen ? "max-w-2xl mx-auto py-10 px-6 space-y-8" : "px-2 py-2 space-y-6"
      )}
    >
      {/* Decorative Glowing Backdrop */}
      {!isReduced && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      )}

      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="text-center w-full space-y-2 mt-4">
        {/* Animated Bot Avatar */}
        <div className="relative inline-flex mb-3">
          <div className={cn(
            "rounded-2xl bg-gradient-to-tr from-primary-900 to-blue-800 flex items-center justify-center shadow-lg border border-white/20",
            isFullscreen ? "w-16 h-16" : "w-14 h-14",
            !isReduced && "animate-pulse"
          )}>
            {chatbotSettings.avatarUrl === 'sparkles' ? (
              <Sparkles className={cn("text-accent-gold", isFullscreen ? "w-8 h-8" : "w-7 h-7")} />
            ) : (
              <Brain className={cn("text-accent-gold", isFullscreen ? "w-8 h-8" : "w-7 h-7")} />
            )}
          </div>
        </div>

        <h1 className={cn(
          "font-extrabold tracking-tight text-slate-800",
          isFullscreen ? "text-3xl" : "text-xl"
        )}>
          {welcomeTitle}
        </h1>

        <p className={cn(
          "text-slate-500 max-w-sm mx-auto font-medium leading-relaxed",
          isFullscreen ? "text-base" : "text-sm"
        )}>
          {welcomeSubtitle}
        </p>
      </motion.div>

      {/* Returning User Experience */}
      {previousSession && (
        <motion.div variants={itemVariants} className="w-full">
          <button
            onClick={handleRestoreSession}
            className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200/50 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors text-left outline-none focus:ring-2 focus:ring-amber-400"
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-slate-800">Continue Previous Chat</p>
                <p className="text-xs text-slate-500">Pick up where you left off</p>
              </div>
            </div>
            <Play className="w-4 h-4 text-amber-600 fill-current" />
          </button>
        </motion.div>
      )}

      {/* Professional Quick Options Grid */}
      <motion.div variants={itemVariants} className="w-full space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">How can I help?</span>
        <div className="grid grid-cols-2 gap-2 w-full">
          {quickOptions.map((option, idx) => {
            const Icon = getIcon(option.icon);
            return (
              <button
                key={option.id || idx}
                onClick={() => handlePromptClick('quick_action', option.id, option.title, option.query)}
                className="flex flex-col items-start gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-primary-400 hover:shadow-md transition-all focus:ring-2 focus:ring-primary-900 outline-none text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700 group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-700 text-sm group-hover:text-primary-800 transition-colors">
                  {option.title}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Sleek Suggested Prompts */}
      <motion.div variants={itemVariants} className="w-full space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Frequently Asked</span>
        <div className="flex flex-col gap-1.5 w-full">
          {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick('suggested_prompt', idx.toString(), prompt, prompt)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-left text-sm font-medium text-slate-600 hover:text-primary-800 transition-all outline-none focus:ring-2 focus:ring-primary-400 group"
            >
              <span className="truncate pr-2">{prompt}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
