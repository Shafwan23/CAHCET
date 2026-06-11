import apiClient from './authService';

export const cmsService = {
  getPages: async () => {
    const response = await apiClient.get(`/cms/pages?t=${new Date().getTime()}`);
    return response.data;
  },
  
  getPage: async (slug) => {
    const response = await apiClient.get(`/cms/pages/${slug}?t=${new Date().getTime()}`);
    return response.data;
  },
  
  createPage: async (pageData) => {
    if (!window.confirm("Are you sure you want to save these changes?")) throw new Error("Cancelled by user");
    const response = await apiClient.post('/cms/pages', pageData);
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
    if (!window.confirm("Are you sure you want to save these changes?")) throw new Error("Cancelled by user");
    const response = await apiClient.post('/cms/sections', sectionData);
    return response.data;
  },
  
  updateSection: async (id, sectionData) => {
    if (!window.confirm("Are you sure you want to save these changes?")) throw new Error("Cancelled by user");
    const response = await apiClient.put(`/cms/sections/${id}`, sectionData);
    return response.data;
  },
  
  deleteSection: async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) throw new Error("Cancelled by user");
    const response = await apiClient.delete(`/cms/sections/${id}`);
    return response.data;
  }
};
