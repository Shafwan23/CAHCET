// src/services/chatbotAnalyticsService.js

const ANALYTICS_STORAGE_KEY = 'cahcet_chatbot_analytics';

export const chatbotAnalyticsService = {
  getAnalytics: () => {
    try {
      const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure onboarding extensions exist
        if (!parsed.onboardingClicks) {
          parsed.onboardingClicks = {
            featureCards: {},
            quickActions: {},
            suggestedPrompts: {}
          };
        }
        if (parsed.onboardingAbandons === undefined) parsed.onboardingAbandons = 0;
        if (parsed.sessionsRestored === undefined) parsed.sessionsRestored = 0;
        return parsed;
      }
    } catch (e) {}

    return {
      totalInteractions: 0,
      intentCounts: {},
      failedQueries: [],
      onboardingClicks: {
        featureCards: {},
        quickActions: {},
        suggestedPrompts: {}
      },
      onboardingAbandons: 0,
      sessionsRestored: 0
    };
  },

  logInteraction: (intent, query) => {
    try {
      const analytics = chatbotAnalyticsService.getAnalytics();
      analytics.totalInteractions += 1;
      
      if (!analytics.intentCounts) analytics.intentCounts = {};
      if (analytics.intentCounts[intent]) {
        analytics.intentCounts[intent] += 1;
      } else {
        analytics.intentCounts[intent] = 1;
      }

      if (intent === 'UNKNOWN') {
        if (!analytics.failedQueries) analytics.failedQueries = [];
        analytics.failedQueries.unshift({ query, timestamp: new Date().toISOString() });
        // Keep only top 100 failed queries
        if (analytics.failedQueries.length > 100) analytics.failedQueries.pop();
      }

      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (e) {
      console.error('Failed to log analytics', e);
    }
  },

  logOnboardingClick: (type, itemId, label) => {
    try {
      const analytics = chatbotAnalyticsService.getAnalytics();
      if (!analytics.onboardingClicks) {
        analytics.onboardingClicks = { featureCards: {}, quickActions: {}, suggestedPrompts: {} };
      }
      
      const typeKey = type === 'feature_card' ? 'featureCards' : type === 'quick_action' ? 'quickActions' : 'suggestedPrompts';
      const category = analytics.onboardingClicks[typeKey] || {};
      const key = `${itemId} (${label})`;
      category[key] = (category[key] || 0) + 1;
      analytics.onboardingClicks[typeKey] = category;

      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (e) {
      console.error('Failed to log onboarding click', e);
    }
  },

  logOnboardingAbandon: () => {
    try {
      const analytics = chatbotAnalyticsService.getAnalytics();
      analytics.onboardingAbandons = (analytics.onboardingAbandons || 0) + 1;
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (e) {
      console.error('Failed to log onboarding abandon', e);
    }
  },

  logSessionRestore: () => {
    try {
      const analytics = chatbotAnalyticsService.getAnalytics();
      analytics.sessionsRestored = (analytics.sessionsRestored || 0) + 1;
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (e) {
      console.error('Failed to log session restore', e);
    }
  }
};
