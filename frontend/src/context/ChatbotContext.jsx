import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatbotThemeService, CHATBOT_THEMES } from '../services/chatbotThemeService';

const ChatbotContext = createContext(null);

export const useChatbotContext = () => useContext(ChatbotContext);

const STORAGE_KEY = 'cahcet_chatbot_global_state';

export const ChatbotProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      messages: [],
      theme: chatbotThemeService.getTheme(),
      language: 'en',
      isOpen: false,
      hasOpened: false
    };
  });

  // Save state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Sync theme to service so subsequent loads catch it early
      chatbotThemeService.setTheme(state.theme);
    } catch {}
  }, [state]);

  const addMessage = (message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  };

  const setMessages = (newMessages) => {
    setState(prev => ({ ...prev, messages: typeof newMessages === 'function' ? newMessages(prev.messages) : newMessages }));
  };

  const setTheme = (theme) => {
    setState(prev => ({ ...prev, theme }));
  };

  const setLanguage = (language) => {
    setState(prev => ({ ...prev, language }));
  };

  const toggleOpen = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen, hasOpened: true }));
  };
  
  const setOpen = (isOpen) => {
    setState(prev => ({ ...prev, isOpen, hasOpened: true }));
  };

  const clearChat = () => {
    setState(prev => ({ ...prev, messages: [] }));
  };

  return (
    <ChatbotContext.Provider value={{
      messages: state.messages,
      addMessage,
      setMessages,
      theme: state.theme,
      setTheme,
      language: state.language,
      setLanguage,
      isOpen: state.isOpen,
      toggleOpen,
      setOpen,
      hasOpened: state.hasOpened,
      clearChat,
      themeClasses: chatbotThemeService.getThemeClasses(state.theme)
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};
