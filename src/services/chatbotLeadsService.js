// src/services/chatbotLeadsService.js

// Mock local storage database for leads
const LEADS_STORAGE_KEY = 'cahcet_chatbot_leads';

export const chatbotLeadsService = {
  getLeads: () => {
    try {
      const data = localStorage.getItem(LEADS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addLead: (lead) => {
    try {
      const leads = chatbotLeadsService.getLeads();
      const newLead = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'New',
        ...lead
      };
      leads.unshift(newLead);
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
      return newLead;
    } catch (e) {
      console.error('Failed to save lead', e);
      return null;
    }
  },

  updateLeadStatus: (id, status) => {
    try {
      const leads = chatbotLeadsService.getLeads();
      const index = leads.findIndex(l => l.id === id);
      if (index !== -1) {
        leads[index].status = status;
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
      }
    } catch (e) {
      console.error('Failed to update lead', e);
    }
  }
};
