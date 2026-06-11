import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Minus, RefreshCw, Hand, ChevronRight, GraduationCap, MapPin, Award, Building2, Briefcase, PlayCircle, Layers } from 'lucide-react';
import { cn } from '../../utils/cn';
import { chatbotService } from '../../services/chatbotService';
import { cmsService } from '../../services/cmsService';
import { useChatbotContext } from '../../context/ChatbotContext';
import { chatbotI18nService } from '../../services/chatbotI18nService';
import { chatbotThemeService } from '../../services/chatbotThemeService';
import ChatbotWelcomeScreen from './ChatbotWelcomeScreen';

// Custom Rich Cards Renderer
const RichMessageRenderer = ({ msg, themeClasses }) => {
  if (msg.type === 'counselor_recommendation') {
    return (
      <div className="space-y-3 mt-2 w-full max-w-[280px]">
        <p className="text-sm font-semibold">{msg.text}</p>
        {msg.data.map((rec, i) => (
          <div key={i} className="bg-white/80 p-3 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 text-sm">{rec.dept}</h4>
            <p className="text-xs text-slate-600 mt-1">{rec.reason}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {rec.careers.map((c, j) => (
                <span key={j} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (msg.type === 'comparison_table') {
    return (
      <div className="space-y-3 mt-2 w-full max-w-[300px]">
        <p className="text-sm font-semibold">{msg.text}</p>
        <div className="flex gap-2">
          {msg.data.map((d, i) => (
            <div key={i} className="flex-1 bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-1 mb-2">{d.label}</h4>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Scope</p>
              <p className="text-xs text-slate-700 mb-2 h-8 flex items-center justify-center leading-tight">{d.scope}</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Placements</p>
              <p className="text-sm font-bold text-emerald-600 mb-2">{d.placementRate}</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Core</p>
              <p className="text-[10px] text-slate-600">{d.coreSubject}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === 'alumni_cards') {
    return (
      <div className="space-y-3 mt-2 w-full max-w-[280px]">
        <p className="text-sm font-semibold">{msg.text}</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {msg.data.map((alumni, i) => (
            <div key={i} className="min-w-[200px] snap-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <img src={alumni.image} alt={alumni.name} className="w-12 h-12 rounded-full mb-2 ring-2 ring-blue-100" />
              <h4 className="font-bold text-slate-800 text-sm">{alumni.name}</h4>
              <p className="text-xs text-blue-600 font-medium mb-1">{alumni.company} • {alumni.package}</p>
              <p className="text-[10px] text-slate-500 italic leading-snug line-clamp-2">"{alumni.testimonial}"</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === 'placement_dashboard') {
    return (
      <div className="space-y-3 mt-2 w-full max-w-[280px]">
        <p className="text-sm font-semibold">{msg.text}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
            <p className="text-[10px] text-emerald-600 font-bold uppercase mb-0.5">Highest</p>
            <p className="text-lg font-black text-emerald-700">{msg.data.highest}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
            <p className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">Placed</p>
            <p className="text-lg font-black text-blue-700">{msg.data.percentage}</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Top Recruiters</p>
          <div className="flex flex-wrap gap-1.5">
            {msg.data.topRecruiters.map((r, i) => (
              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{r}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <p>{msg.text}</p>;
};

const ChatBotWidget = () => {
  const [data, setData] = useState({});
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const pages = await cmsService.getPages();
        const allData = {};
        for (const page of pages.data) {
          const res = await cmsService.getPage(page.slug);
          if (res.data && res.data.sections) {
            allData[page.slug] = {};
            res.data.sections.forEach(sec => {
              const key = sec.sectionKey.replace(`${page.slug}.`, '');
              try {
                allData[page.slug][key] = JSON.parse(sec.content);
              } catch {
                allData[page.slug][key] = sec.content;
              }
            });
          }
        }
        setData(allData);
      } catch (err) {
        console.error("Failed to load CMS data for chatbot", err);
      }
    };
    fetchAllData();
  }, []);

  const chatbotSettings = data?.system?.chatbot || {};
  
  const ctx = useChatbotContext();
  
  // Safe fallback if context is missing during fast reloads
  const messages = ctx?.messages || [];
  const addMessage = ctx?.addMessage || (() => {});
  const setMessages = ctx?.setMessages || (() => {});
  const theme = ctx?.theme || 'brand';
  const language = ctx?.language || 'en';
  const themeClasses = ctx?.themeClasses || chatbotThemeService.getThemeClasses('brand');
  const isOpen = ctx?.isOpen || false;
  const toggleOpen = ctx?.toggleOpen || (() => {});
  const setOpen = ctx?.setOpen || (() => {});
  const hasOpened = ctx?.hasOpened || false;
  const clearChat = ctx?.clearChat || (() => {});
  
  const [isTeaserVisible, setIsTeaserVisible] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const t = (key, params) => chatbotI18nService.getTranslation(language, key, params);

  // Check Session Expiration & Auto-save
  useEffect(() => {
    if (messages.length > 0) {
      // Self-healing: if conversation contains only bot messages, clear it to force rendering the onboarding welcome screen
      if (messages.every(m => m.sender !== 'user')) {
        clearChat();
        return;
      }
      
      const lastMsg = messages[messages.length - 1];
      const lastTime = lastMsg.id;
      const thirtyMinutes = 30 * 60 * 1000;
      if (Date.now() - lastTime > thirtyMinutes) {
        try {
          localStorage.setItem('cahcet_chatbot_previous_session', JSON.stringify(messages));
        } catch (e) {}
        chatbotService.clearContext();
        clearChat();
      }
    }
  }, [messages, clearChat]);

  // Handle auto-open or teaser
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) {
        if (chatbotSettings.welcomeMode === 'auto') {
          setOpen(true);
        } else if (chatbotSettings.welcomeMode === 'popup') {
          setIsTeaserVisible(true);
        }
      }
    }, chatbotSettings.welcomeDelay || 3000);
    return () => clearTimeout(timer);
  }, [chatbotSettings.welcomeMode, chatbotSettings.welcomeDelay, hasOpened, setOpen]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    setIsTeaserVisible(false);
    if (!isOpen) setOpen(true);

    const userMessage = {
      id: Date.now(),
      type: 'text',
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addMessage(userMessage);
    setInput('');
    setIsTyping(true);

    // Call NLP Engine
    setTimeout(() => {
      const response = chatbotService.processQuery(text, data, t('botName'));
      
      const botMessage = {
        id: Date.now() + 1,
        ...response,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      addMessage(botMessage);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // Human-like delay
  };

  const handleClearChat = () => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('cahcet_chatbot_previous_session', JSON.stringify(messages));
      } catch (e) {}
    }
    chatbotService.clearContext();
    clearChat();
  };

  const quickActions = chatbotSettings.quickActions || [];
  const latestBotMessage = [...messages].reverse().find(m => m.sender === 'bot');
  const currentSuggestions = latestBotMessage?.suggestedFollowUps || [];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end pointer-events-none">
      {/* Teaser Popup */}
      <AnimatePresence>
        {!isOpen && isTeaserVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 cursor-pointer pointer-events-auto hover:border-blue-400 transition-colors group"
            onClick={() => { setOpen(true); setIsTeaserVisible(false); }}
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-accent-gold group-hover:animate-bounce" />
            </div>
            <span className="text-sm font-medium text-slate-700">{t('teaserText')}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsTeaserVisible(false); }}
              className="ml-2 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "mb-4 w-[calc(100vw-2rem)] sm:w-[400px] h-[70vh] sm:h-[580px] max-h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto transition-colors duration-300 origin-bottom-right",
              themeClasses.window
            )}
          >
            {/* Enterprise Header */}
            <div className={cn("px-6 py-4 flex items-center justify-between z-10 relative overflow-hidden transition-colors duration-300", themeClasses.header)}>
              {theme === 'brand' && <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-950 opacity-90" />}
              <div className="relative z-10 flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-amber-500 flex items-center justify-center shadow-lg border-2 border-white/20">
                    <Bot className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">{t('botName')}</h3>
                  <p className="text-[10px] opacity-80 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    {t('repliesInstantly')}
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-1">
                <button onClick={handleClearChat} title={t('clearChatTip')} className="hover:bg-black/10 p-2 rounded-full transition-colors group">
                  <RefreshCw className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                </button>
                <button onClick={() => setOpen(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors">
                  <Minus className="w-5 h-5 opacity-70" />
                </button>
              </div>
            </div>

            {/* Smart Quick Actions (Horizontal Scroll) */}
            {messages.length > 0 && messages.length <= 2 && quickActions.length > 0 && (
              <div className={cn("px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide shadow-sm z-0", themeClasses.body)}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleSend(action.query)}
                    className={cn(
                      "whitespace-nowrap flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all font-medium border",
                      themeClasses.quickAction
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Body */}
            <div 
              ref={scrollRef}
              className={cn("flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth", themeClasses.body)}
            >
              {messages.length === 0 ? (
                <ChatbotWelcomeScreen isFullscreen={false} handleSend={handleSend} />
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isUser = msg.sender === 'user';
                    const showAvatar = !isUser && (index === 0 || messages[index-1].sender === 'user');
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        key={msg.id} className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
                      >
                        <div className="flex gap-2 max-w-[85%]">
                          {!isUser && (
                            <div className="w-6 shrink-0 flex flex-col justify-end">
                              {showAvatar && (
                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                                  <Bot className="w-3.5 h-3.5 text-accent-gold" />
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className={cn(
                            "px-4 py-3 text-[13px] leading-relaxed shadow-sm relative rounded-2xl",
                            isUser ? themeClasses.userBubble : themeClasses.botBubble
                          )}>
                            <RichMessageRenderer msg={msg} themeClasses={themeClasses} />
                          </div>
                        </div>
                        <span className={cn("text-[9px] opacity-50 mt-1", isUser ? "mr-1" : "ml-9")}>
                          {msg.time}
                        </span>
                      </motion.div>
                    );
                  })}
                  
                  {isTyping && (
                    <div className="flex items-start gap-2">
                       <div className="w-6 shrink-0 flex flex-col justify-end">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                          <Bot className="w-3.5 h-3.5 text-accent-gold" />
                        </div>
                      </div>
                      <div className={cn("px-4 py-3.5 rounded-2xl shadow-sm flex gap-1.5 items-center", themeClasses.botBubble)}>
                        <span className="w-1.5 h-1.5 bg-current opacity-40 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-current opacity-40 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-current opacity-40 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-ups */}
                  {!isTyping && currentSuggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col gap-2 pt-2 ml-8 max-w-[80%]">
                      {currentSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(suggestion)}
                          className={cn(
                            "text-left text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-between group border",
                            themeClasses.quickAction
                          )}
                        >
                          {suggestion}
                          <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className={cn("p-4 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]", themeClasses.inputArea)}>
              <div className={cn("flex items-end gap-2 rounded-[1.25rem] p-1.5 transition-all border", themeClasses.inputBox)}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={t('placeholder')}
                  className="flex-1 bg-transparent border-none px-3 py-2 text-sm outline-none resize-none max-h-24 min-h-[40px] scrollbar-hide"
                  rows={1}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={cn(
                    "p-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 shrink-0 mb-0.5 mr-0.5",
                    themeClasses.sendBtn
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mt-2 flex justify-center items-center gap-2">
                <span className="text-[9px] opacity-40 font-medium uppercase tracking-wider">{t('poweredBy')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button (Highly Animated) */}
      <div className="relative pointer-events-auto group">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 overflow-hidden",
            isOpen ? "bg-slate-800 rotate-90" : "bg-gradient-to-tr from-accent-gold to-amber-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
          )}
        >
          {!isOpen && (
            <div className="absolute inset-0 bg-white/20 animate-pulse group-hover:scale-150 transition-transform duration-700" />
          )}
          
          {isOpen ? (
            <X className="text-white w-6 h-6 relative z-10" />
          ) : (
            <div className="relative flex items-center justify-center z-10">
              <MessageSquare className="text-white w-7 h-7" />
              <div className="absolute top-[40%] left-1/2 -translate-x-1/2 flex gap-[2px]">
                <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </motion.button>
        
        {/* Clean Active Online Status Dot (Outside overflow-hidden) */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white shadow-sm" />
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBotWidget;
