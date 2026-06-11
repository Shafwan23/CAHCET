// src/services/chatbotI18nService.js
import en from './chatbotTranslations/en';

// In a real app, these would be lazy loaded or imported.
// For now, we will fallback to English if Tamil/Hindi aren't fully populated.
const translations = {
  en,
  ta: { ...en, botName: "CAHCET உதவியாளர்", onlineStatus: "AI உதவியாளர் ஆன்லைனில் உள்ளார்", teaserText: "உதவி தேவையா? எங்களுடன் பேசுங்கள்!" },
  hi: { ...en, botName: "CAHCET सहायक", onlineStatus: "AI सहायक ऑनलाइन है", teaserText: "क्या मदद चाहिए? हमसे बात करें!" }
};

export const chatbotI18nService = {
  getTranslation: (lang, key, params = {}) => {
    const dict = translations[lang] || translations.en;
    
    // Support nested keys like 'counselor.start'
    const keys = key.split('.');
    let value = dict;
    for (const k of keys) {
      if (value[k] === undefined) {
        value = null;
        break;
      }
      value = value[k];
    }

    if (!value) {
      // Fallback to EN
      value = translations.en;
      for (const k of keys) {
        if (value[k] === undefined) return key;
        value = value[k];
      }
    }

    if (typeof value === 'string') {
      // Replace params like {name}
      return value.replace(/{(\w+)}/g, (match, p1) => params[p1] || match);
    }

    return value;
  }
};
