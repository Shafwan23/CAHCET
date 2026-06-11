import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ArrowLeft, RefreshCw, MoreVertical, Layout, MessageSquare, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cmsService } from '../services/cmsService';
import { useChatbotContext } from '../context/ChatbotContext';
import { chatbotService } from '../services/chatbotService';
import { chatbotI18nService } from '../services/chatbotI18nService';
import { cn } from '../utils/cn';
import ChatbotWelcomeScreen from '../components/ui/ChatbotWelcomeScreen';

// Reuse the rich rendering logic here or abstract it.
// For simplicity in this page, we will implement a slightly wider variant of the cards.

const FullscreenRichRenderer = ({ msg, themeClasses }) => {
  if (msg.type === 'counselor_recommendation') {
    return (
      <div className="space-y-4 mt-2 w-full max-w-md">
        <p className="text-base font-semibold">{msg.text}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {msg.data.map((rec, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <h4 className="font-bold text-blue-700 text-base">{rec.dept}</h4>
              <p className="text-sm text-slate-600 mt-2">{rec.reason}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {rec.careers.map((c, j) => (
                  <span key={j} className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === 'comparison_table') {
    return (
      <div className="space-y-4 mt-2 w-full max-w-xl">
        <p className="text-base font-semibold">{msg.text}</p>
        <div className="flex gap-4">
          {msg.data.map((d, i) => (
            <div key={i} className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <h4 className="font-bold text-slate-800 text-lg border-b pb-2 mb-3">{d.label}</h4>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Scope</p>
              <p className="text-sm text-slate-700 mb-3 h-10 flex items-center justify-center font-medium">{d.scope}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Placements</p>
              <p className="text-xl font-black text-amber-600 mb-3">{d.placementRate}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Core Subject</p>
              <p className="text-sm text-slate-600 font-medium">{d.coreSubject}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === 'alumni_cards') {
    return (
      <div className="space-y-4 mt-2 w-full max-w-2xl">
        <p className="text-base font-semibold">{msg.text}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {msg.data.map((alumni, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <img src={alumni.image} alt={alumni.name} className="w-16 h-16 rounded-full mb-3 ring-4 ring-blue-50" />
              <h4 className="font-bold text-slate-800 text-base">{alumni.name}</h4>
              <p className="text-sm text-blue-600 font-semibold mb-2">{alumni.company} • {alumni.package}</p>
              <p className="text-xs text-slate-500 italic leading-relaxed">"{alumni.testimonial}"</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === 'placement_dashboard') {
    return (
      <div className="space-y-4 mt-2 w-full max-w-md">
        <p className="text-base font-semibold">{msg.text}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 text-center">
            <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Highest Package</p>
            <p className="text-3xl font-black text-emerald-700">{msg.data.highest}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Students Placed</p>
            <p className="text-3xl font-black text-blue-700">{msg.data.percentage}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Top Recruiters</p>
          <div className="flex flex-wrap gap-2">
            {msg.data.topRecruiters.map((r, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-semibold">{r}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-sm md:text-base whitespace-pre-wrap">{msg.text}</p>;
};

export default function AICounselorPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { messages, addMessage, clearChat, setMessages, themeClasses, theme, language } = useChatbotContext();

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
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const chatbotSettings = data.system?.chatbot || {};
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const t = (key, params) => chatbotI18nService.getTranslation(language, key, params);

  // Clear conversation if it contains only bot messages to ensure onboarding is shown
  useEffect(() => {
    if (messages.length > 0 && messages.every(m => m.sender !== 'user')) {
      clearChat();
    }
  }, [messages, clearChat]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;

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
    }, 1200 + Math.random() * 800);
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

  const latestBotMessage = [...messages].reverse().find(m => m.sender === 'bot');
  const currentSuggestions = messages.length > 0 ? (latestBotMessage?.suggestedFollowUps || []) : [];

  if (loading) return null;

  return (
    <div className={cn("h-screen w-full flex flex-col md:flex-row overflow-hidden transition-colors duration-300", themeClasses.body)}>
      
      {/* Sidebar (Desktop) */}
      <aside className={cn("hidden md:flex flex-col w-72 border-r z-10 transition-colors duration-300", theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50')}>
        <div className="p-4 border-b border-inherit">
          <button onClick={() => navigate('/')} className={cn("flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity", theme === 'dark' ? 'text-white' : 'text-slate-800')}>
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </button>
        </div>
        
        <div className="p-4 flex-1">
          <button 
            onClick={handleClearChat}
            className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all", theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white border border-slate-200 hover:border-blue-300 text-slate-700')}
          >
            <RefreshCw className="w-4 h-4 text-blue-500" />
            Start New Session
          </button>
          
          <div className="mt-8">
            <h4 className={cn("text-xs font-bold uppercase tracking-wider mb-3 px-2", theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>Features</h4>
            <div className="space-y-1">
              <div className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium", theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-700')}>
                <MessageSquare className="w-4 h-4" /> AI Chat
              </div>
              <div className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium opacity-60", theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
                <Layout className="Placements Dashboard w-4 h-4" /> Dashboards
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* Header */}
        <header className={cn("px-4 py-3 border-b flex items-center justify-between sticky top-0 z-20 transition-colors duration-300", themeClasses.header)}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 rounded-full hover:bg-black/5">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-primary-600 flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-wide flex items-center gap-2">
                {t('botName')}
                <span className="bg-primary-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-200">Beta</span>
              </h2>
              <p className="text-xs opacity-70 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                {t('onlineStatus')}
              </p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <MoreVertical className="w-5 h-5 opacity-70" />
          </button>
        </header>

        {/* Chat Stream */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth pb-32"
        >
          {messages.length === 0 ? (
            <ChatbotWelcomeScreen isFullscreen={true} handleSend={handleSend} />
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const showAvatar = !isUser && (index === 0 || messages[index-1].sender === 'user');
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  key={msg.id} className={cn("flex flex-col max-w-4xl mx-auto", isUser ? "items-end" : "items-start")}
                >
                  <div className="flex gap-4 w-full justify-end">
                    {!isUser && (
                      <div className="w-10 shrink-0 flex flex-col items-center">
                        {showAvatar && (
                          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
                            <Bot className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className={cn(
                      "flex-1 max-w-[85%] md:max-w-[75%]",
                      isUser && "flex justify-end"
                    )}>
                      <div className={cn(
                        "px-5 py-4 leading-relaxed shadow-sm relative rounded-3xl",
                        isUser ? cn(themeClasses.userBubble, "rounded-br-sm") : cn(themeClasses.botBubble, "rounded-bl-sm")
                      )}>
                        <FullscreenRichRenderer msg={msg} themeClasses={themeClasses} />
                      </div>
                      <span className={cn("text-[11px] opacity-40 mt-1.5 block font-medium", isUser ? "text-right mr-2" : "ml-2")}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          
          {isTyping && (
            <div className="flex items-start gap-4 max-w-4xl mx-auto w-full">
                <div className="w-10 shrink-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className={cn("px-6 py-5 rounded-3xl rounded-bl-sm shadow-sm flex gap-2 items-center", themeClasses.botBubble)}>
                <span className="w-2 h-2 bg-current opacity-40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-current opacity-40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-current opacity-40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/5 via-black/5 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            
            {/* Suggested Follow-ups above input */}
            {!isTyping && currentSuggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                {currentSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className={cn(
                      "text-xs md:text-sm px-4 py-2 rounded-xl transition-all shadow-sm font-medium border flex items-center gap-1.5 group",
                      themeClasses.quickAction
                    )}
                  >
                    <Sparkles className="w-3.5 h-3.5 opacity-60" />
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}

            <div className={cn("flex items-end gap-3 rounded-2xl p-2 transition-all border shadow-xl backdrop-blur-md", themeClasses.inputBox, theme === 'glass' ? 'bg-white/70' : 'bg-white')}>
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
                className="flex-1 bg-transparent border-none px-4 py-3.5 text-base outline-none resize-none max-h-32 min-h-[56px] scrollbar-hide"
                rows={1}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className={cn(
                  "p-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shrink-0 mb-1 mr-1",
                  themeClasses.sendBtn
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-3">
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
                {t('poweredBy')}
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
