import axios from 'axios';

const API_URL = import.meta.env.VITE_APPLICANT_API_URL || 'http://localhost:5000/api/v1/applicant';

const register = async (applicantData) => {
  const response = await axios.post(`${API_URL}/register`, applicantData);
  if (response.data.token) {
    localStorage.setItem('applicantToken', response.data.token);
    localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
  }
  return response.data;
};

const login = async (email, password, rememberMe) => {
  const response = await axios.post(`${API_URL}/login`, { email, password, rememberMe });
  if (response.data.token) {
    localStorage.setItem('applicantToken', response.data.token);
    localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('applicantToken');
  localStorage.removeItem('applicant');
};

const getMe = async () => {
  const token = localStorage.getItem('applicantToken');
  if (!token) throw new Error('No token found');
  
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.data.applicant) {
    localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
  }
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

const resetPassword = async (email, otp, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password`, { email, otp, newPassword });
  return response.data;
};

// Application Management
const getApplications = async () => {
  const token = localStorage.getItem('applicantToken');
  const response = await axios.get(`${API_URL}/applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getApplication = async (id) => {
  const token = localStorage.getItem('applicantToken');
  const response = await axios.get(`${API_URL}/applications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const createApplication = async () => {
  const token = localStorage.getItem('applicantToken');
  const response = await axios.post(`${API_URL}/applications`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const savePersonal = async (id, data) => {
  const token = localStorage.getItem('applicantToken');
  const response = await axios.post(`${API_URL}/applications/${id}/save-personal`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const saveAcademic = async (id, data) => {
  const token = localStorage.getItem('applicantToken');
  const response = await axios.post(`${API_URL}/applications/${id}/save-academic`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const saveCourse = async (id, courseChoice) => {
  const token = localStorage.getItem('applicantToken');
  const response = await axios.post(`${API_URL}/applications/${id}/save-course`, { courseChoice }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const savePayment = async (id, paymentData) => {
  const token = localStorage.getItem('applicantToken');
  const response = await axios.post(`${API_URL}/applications/${id}/save-payment`, paymentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const deleteApplication = async (id) => {
  const token = localStorage.getItem('applicantToken');
  const response = await axios.delete(`${API_URL}/applications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const applicantAuthService = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  getApplications,
  getApplication,
  createApplication,
  savePersonal,
  saveAcademic,
  saveCourse,
  savePayment,
  deleteApplication
};
