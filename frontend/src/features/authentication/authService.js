import api from '../../services/api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.access_token) {
      localStorage.setItem('kc_token', res.data.access_token);
      localStorage.setItem('kc_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.access_token) {
      localStorage.setItem('kc_token', res.data.access_token);
      localStorage.setItem('kc_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    if (res.data.user) {
      localStorage.setItem('kc_user', JSON.stringify(res.data.user));
    }
    return res.data.user;
  },

  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.user) {
      localStorage.setItem('kc_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  changePassword: async (old_password, new_password) => {
    const res = await api.post('/auth/change-password', { old_password, new_password });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('kc_token');
    localStorage.removeItem('kc_user');
  },

  getCurrentUser: () => {
    try {
      const u = localStorage.getItem('kc_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('kc_token');
  }
};

export default authService;
