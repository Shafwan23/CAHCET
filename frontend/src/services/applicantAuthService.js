import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
let API_URL = import.meta.env.VITE_APPLICANT_API_URL;

if (!API_URL) {
  // Always use relative path in dev to guarantee Vite proxy is used
  API_URL = '/api/v1/applicant';
} else if (!API_URL.endsWith('/api/v1/applicant')) {
  API_URL = `${API_URL.replace(/\/$/, '')}/api/v1/applicant`;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/login') && !originalRequest.url.includes('/refresh')) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('applicant');
        window.location.href = '/admissions/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const register = async (applicantData) => {
  const response = await api.post('/register', applicantData);
  if (response.data.applicant) {
    localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
  }
  return response.data;
};

const login = async (email, password, rememberMe) => {
  const response = await api.post('/login', { email, password, rememberMe });
  if (response.data.applicant) {
    localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
  }
  return response.data;
};

const logout = async () => {
  try {
    await api.post('/logout');
  } catch (err) {}
  localStorage.removeItem('applicant');
};

const getMe = async () => {
  const response = await api.get('/me');
  if (response.data.applicant) {
    localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
  }
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post('/forgot-password', { email });
  return response.data;
};

const verifyOtp = async (email, otp) => {
  const response = await api.post('/verify-otp', { email, otp });
  return response.data;
};

const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post('/reset-password', { email, otp, newPassword });
  return response.data;
};

// Application Management
const getApplications = async () => {
  const response = await api.get('/applications');
  return response.data;
};

const getApplication = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

const createApplication = async () => {
  const response = await api.post('/applications', {});
  return response.data;
};

const savePersonal = async (id, data) => {
  const response = await api.post(`/applications/${id}/save-personal`, data);
  return response.data;
};

const saveAcademic = async (id, data) => {
  const response = await api.post(`/applications/${id}/save-academic`, data);
  return response.data;
};

const saveCourse = async (id, courseChoice) => {
  const response = await api.post(`/applications/${id}/save-course`, { courseChoice });
  return response.data;
};

const savePayment = async (id, paymentData) => {
  const response = await api.post(`/applications/${id}/save-payment`, paymentData);
  return response.data;
};

const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};

export const applicantAuthService = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
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
