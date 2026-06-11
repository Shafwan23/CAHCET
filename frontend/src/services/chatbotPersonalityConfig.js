// src/services/chatbotPersonalityConfig.js

export const CHATBOT_PERSONALITIES = {
  ADVISOR: 'advisor',
  FRIENDLY: 'friendly',
  PROFESSIONAL: 'professional'
};

export const PERSONALITY_PROFILES = {
  [CHATBOT_PERSONALITIES.ADVISOR]: {
    name: 'Academic Advisor',
    tone: 'Academic & Informative',
    greetingStyle: 'Greetings! I am your Academic Advisor. How can I assist you with your education or career search today?',
    formalCasualRatio: 1.0,
    responseStyle: 'Structured with sections and bullet points'
  },
  [CHATBOT_PERSONALITIES.FRIENDLY]: {
    name: 'Friendly Assistant',
    tone: 'Welcoming & Friendly',
    greetingStyle: 'Hi! 👋 I am your assistant. Ask me anything about CAHCET admissions, placements, or campus life!',
    formalCasualRatio: 0.3,
    responseStyle: 'Conversational, encouraging, uses emojis'
  },
  [CHATBOT_PERSONALITIES.PROFESSIONAL]: {
    name: 'Professional Counselor',
    tone: 'Professional & Direct',
    greetingStyle: 'Hello. I am the CAHCET Admissions Counselor. Please let me know what admissions or department details you require.',
    formalCasualRatio: 0.8,
    responseStyle: 'Clear, concise, direct and factual'
  }
};

export const chatbotPersonalityConfig = {
  getProfile: (personality) => {
    return PERSONALITY_PROFILES[personality] || PERSONALITY_PROFILES[CHATBOT_PERSONALITIES.FRIENDLY];
  },
  
  adjustResponse: (text, personality) => {
    if (!text) return '';
    const profile = chatbotPersonalityConfig.getProfile(personality);
    
    if (personality === CHATBOT_PERSONALITIES.PROFESSIONAL) {
      // Clean up emoji characters for a highly professional look
      return text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '').trim();
    }
    
    if (personality === CHATBOT_PERSONALITIES.ADVISOR) {
      // Academic tone reinforcement (ensure it sounds scholarly and direct)
      return text;
    }
    
    return text;
  }
};
