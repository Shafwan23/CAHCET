/**
 * userManagementService.js — Frontend API service for Enterprise User Management
 * Wraps all /api/v1/users/* endpoints.
 */
import apiClient from '../../services/authService';

export const userManagementService = {
  // ─── Users ───
  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    if (filters.includeDeleted) params.append('includeDeleted', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const res = await apiClient.get(`/users?${params.toString()}`);
    return res.data;
  },

  async getUserStats() {
    const res = await apiClient.get('/users/stats');
    return res.data.stats;
  },

  async getUserById(id) {
    const res = await apiClient.get(`/users/${id}`);
    return res.data.user;
  },

  async getUserActivity(id, limit = 50) {
    const res = await apiClient.get(`/users/${id}/activity?limit=${limit}`);
    return res.data.activity;
  },

  async getUserLogins(id, limit = 50) {
    const res = await apiClient.get(`/users/${id}/logins?limit=${limit}`);
    return res.data.logins;
  },

  async getUserSessions(id) {
    const res = await apiClient.get(`/users/${id}/sessions`);
    return res.data.sessions;
  },

  // ─── Mutations ───
  async createUser(data) {
    const res = await apiClient.post('/users', data);
    return res.data;
  },

  async updateUser(id, data) {
    const res = await apiClient.put(`/users/${id}`, data);
    return res.data;
  },

  async changeRole(id, role) {
    const res = await apiClient.put(`/users/${id}/role`, { role });
    return res.data;
  },

  async changeStatus(id, status, reason) {
    const res = await apiClient.put(`/users/${id}/status`, { status, reason });
    return res.data;
  },

  async resetPassword(id, password) {
    const res = await apiClient.put(`/users/${id}/reset-password`, { password });
    return res.data;
  },

  async transferDepartment(id, departmentId) {
    const res = await apiClient.put(`/users/${id}/transfer-department`, { departmentId });
    return res.data;
  },

  async deleteUser(id) {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },

  async restoreUser(id) {
    const res = await apiClient.put(`/users/${id}/restore`);
    return res.data;
  },

  async terminateSession(userId, sessionId) {
    const res = await apiClient.delete(`/users/${userId}/sessions/${sessionId}`);
    return res.data;
  },

  async updatePermissions(userId, permissions) {
    const res = await apiClient.put(`/users/${userId}/permissions`, { permissions });
    return res.data;
  },

  // ─── Audit ───
  async getAuditLogs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.action) params.append('action', filters.action);
    if (filters.targetType) params.append('targetType', filters.targetType);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.page) params.append('page', filters.page);

    const res = await apiClient.get(`/users/audit-logs?${params.toString()}`);
    return res.data;
  },

  // ─── Utility ───
  generatePassword(length = 16) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const specials = '!@#$%^&*()_+-=';
    const all = upper + lower + nums + specials;
    
    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += nums[Math.floor(Math.random() * nums.length)];
    password += specials[Math.floor(Math.random() * specials.length)];
    
    for (let i = 4; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  },
};
