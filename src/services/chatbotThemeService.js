// src/services/chatbotThemeService.js

export const CHATBOT_THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BRAND: 'brand',
  GLASS: 'glass'
};

const THEME_STORAGE_KEY = 'cahcet_chatbot_theme';

export const chatbotThemeService = {
  getTheme: () => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || CHATBOT_THEMES.BRAND;
    } catch {
      return CHATBOT_THEMES.BRAND;
    }
  },

  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  },

  getThemeClasses: (theme) => {
    switch (theme) {
      case CHATBOT_THEMES.DARK:
        return {
          window: 'bg-slate-900 border-slate-700 text-slate-100',
          header: 'bg-slate-800 text-white shadow-md border-b border-slate-700',
          body: 'bg-slate-900',
          userBubble: 'bg-blue-600 text-white rounded-br-sm',
          botBubble: 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm',
          inputArea: 'bg-slate-900 border-t border-slate-700',
          inputBox: 'bg-slate-800 text-slate-200 placeholder:text-slate-500 border-slate-700 focus-within:ring-blue-500/20 focus-within:border-blue-500',
          sendBtn: 'bg-blue-600 text-white hover:bg-blue-500',
          quickAction: 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500 hover:bg-blue-900/30 hover:text-blue-400'
        };
      case CHATBOT_THEMES.LIGHT:
        return {
          window: 'bg-white border-slate-200 text-slate-800',
          header: 'bg-white text-slate-800 shadow-sm border-b border-slate-200',
          body: 'bg-slate-50',
          userBubble: 'bg-slate-800 text-white rounded-br-sm',
          botBubble: 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm',
          inputArea: 'bg-white border-t border-slate-200',
          inputBox: 'bg-slate-50 text-slate-800 placeholder:text-slate-400 border-slate-200 focus-within:ring-slate-900/10 focus-within:border-slate-900',
          sendBtn: 'bg-slate-800 text-white hover:bg-slate-700',
          quickAction: 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800'
        };
      case CHATBOT_THEMES.GLASS:
        return {
          window: 'bg-white/70 backdrop-blur-xl border-white/40 text-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
          header: 'bg-white/40 text-slate-800 border-b border-white/40',
          body: 'bg-transparent',
          userBubble: 'bg-primary-900/90 backdrop-blur-md text-white rounded-br-sm shadow-md',
          botBubble: 'bg-white/60 backdrop-blur-md text-slate-800 border border-white/50 rounded-bl-sm shadow-sm',
          inputArea: 'bg-white/40 backdrop-blur-xl border-t border-white/40',
          inputBox: 'bg-white/50 text-slate-800 placeholder:text-slate-500 border-white/50 focus-within:ring-primary-900/20',
          sendBtn: 'bg-primary-900 text-white hover:bg-primary-800',
          quickAction: 'bg-white/50 backdrop-blur-md border-white/50 text-slate-700 hover:border-primary-300 hover:bg-primary-50/50'
        };
      case CHATBOT_THEMES.BRAND:
      default:
        return {
          window: 'bg-slate-50 border-slate-200 text-slate-800',
          header: 'bg-primary-900 text-white shadow-md border-b border-primary-950',
          body: 'bg-slate-50',
          userBubble: 'bg-primary-900 text-white rounded-br-sm',
          botBubble: 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm',
          inputArea: 'bg-white border-t border-slate-200',
          inputBox: 'bg-slate-50 text-slate-800 placeholder:text-slate-400 border-slate-200 focus-within:ring-primary-900/20 focus-within:border-primary-900',
          sendBtn: 'bg-primary-900 text-white hover:bg-accent-gold hover:text-primary-900',
          quickAction: 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
        };
    }
  }
};
