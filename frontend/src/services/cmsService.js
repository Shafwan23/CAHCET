import apiClient from './authService';

export const cmsService = {
  getAdminDashboardStats: async () => {
    const response = await apiClient.get(`/cms/admin-dashboard-stats?t=${new Date().getTime()}`);
    return response.data;
  },

  getPages: async () => {
    const response = await apiClient.get(`/cms/pages?t=${new Date().getTime()}`);
    return response.data;
  },
  
  getPage: async (slug) => {
    const response = await apiClient.get(`/cms/pages/${slug}?t=${new Date().getTime()}`);
    return response.data;
  },
  
  createPage: async (pageData) => {
    if (!pageData._isSilentDraft && !window.confirm("Are you sure you want to save these changes?")) throw new Error("Cancelled by user");
    const payload = { ...pageData };
    delete payload._isSilentDraft;
    const response = await apiClient.post('/cms/pages', payload);
    return response.data;
  },
  
  updatePage: async (id, pageData) => {
    if (!window.confirm("Are you sure you want to save these changes?")) throw new Error("Cancelled by user");
    const response = await apiClient.put(`/cms/pages/${id}`, pageData);
    return response.data;
  },
  
  deletePage: async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) throw new Error("Cancelled by user");
    const response = await apiClient.delete(`/cms/pages/${id}`);
    return response.data;
  },
  
  publishPage: async (id) => {
    if (!window.confirm("Are you sure you want to publish this page?")) throw new Error("Cancelled by user");
    const response = await apiClient.patch(`/cms/pages/${id}/publish`);
    return response.data;
  },
  
  getSections: async (pageId) => {
    const response = await apiClient.get(`/cms/sections/${pageId}?t=${new Date().getTime()}`);
    return response.data;
  },
  
  createSection: async (sectionData) => {
    if (!sectionData._isSilentDraft && !window.confirm("Are you sure you want to save these changes?")) throw new Error("Cancelled by user");
    
    const payload = { ...sectionData };
    delete payload._isSilentDraft;

    const response = await apiClient.post('/cms/sections', payload);
    return response.data;
  },
  
  updateSection: async (id, sectionData) => {
    // Only prompts if we're not running the new silent draft save workflow
    if (!sectionData._isSilentDraft && !window.confirm("Are you sure you want to save these changes?")) throw new Error("Cancelled by user");
    
    // Clean up internal flags before sending
    const payload = { ...sectionData };
    delete payload._isSilentDraft;

    const response = await apiClient.put(`/cms/sections/${id}`, payload);
    return response.data;
  },
  
  publishSection: async (id) => {
    const response = await apiClient.patch(`/cms/sections/${id}/publish`);
    return response.data;
  },

  getSectionVersions: async (id) => {
    const response = await apiClient.get(`/cms/sections/${id}/versions`);
    return response.data;
  },

  restoreSectionVersion: async (sectionId, versionId) => {
    const response = await apiClient.post(`/cms/sections/${sectionId}/versions/${versionId}/restore`);
    return response.data;
  },
  
  deleteSection: async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) throw new Error("Cancelled by user");
    const response = await apiClient.delete(`/cms/sections/${id}`);
    return response.data;
  }
};
