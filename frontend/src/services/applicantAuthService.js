import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
let API_URL = import.meta.env.VITE_APPLICANT_API_URL || import.meta.env.VITE_API_URL;

if (!API_URL) {
  if (isDev) {
    API_URL = '/api/v1/applicant';
  } else {
    API_URL = `${window.location.origin}/api/v1/applicant`;
  }
} else {
  // Ensure we append /applicant to the base API URL
  const base = API_URL.replace(/\/$/, '');
  if (base.endsWith('/api/v1')) {
    API_URL = `${base}/applicant`;
  } else if (!base.endsWith('/applicant')) {
    API_URL = `${base}/api/v1/applicant`;
  } else {
    API_URL = base;
  }
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

console.log('[DEBUG] Applicant API URL resolved to:', API_URL);

// Request Interceptor: Attach bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('applicantToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle auth failures
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('applicant');
      localStorage.removeItem('applicantToken');
      window.location.href = '/admissions/login';
    }
    return Promise.reject(error);
  }
);

const register = async (applicantData) => {
  try {
    const response = await api.post('/register', applicantData);
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Server returned invalid data format');
    }
    if (response.data.success !== true) {
      throw new Error(response.data.message || 'Registration failed');
    }
    if (response.data.token) {
      localStorage.setItem('applicantToken', response.data.token);
    }
    if (response.data.applicant) {
      localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
    }
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Registration failed');
  }
};

const login = async (email, password, rememberMe) => {
  try {
    const response = await api.post('/login', { email, password, rememberMe });
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Server returned HTML instead of API response');
    }
    if (response.data.success !== true) {
      throw new Error(response.data.message || 'Login failed');
    }
    if (response.data.token) {
      localStorage.setItem('applicantToken', response.data.token);
    }
    if (response.data.applicant) {
      localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
    }
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Invalid server response');
  }
};

const logout = async () => {
  try {
    await api.post('/logout');
  } catch (err) {}
  localStorage.removeItem('applicant');
  localStorage.removeItem('applicantToken');
};

const getMe = async () => {
  try {
    const response = await api.get('/me');
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Server returned invalid session structure');
    }
    if (response.data.success !== true) {
      throw new Error(response.data.message || 'Authentication session lost');
    }
    if (response.data.applicant) {
      localStorage.setItem('applicant', JSON.stringify(response.data.applicant));
    }
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Authentication session lost');
  }
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
