import api from '../../services/api';

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get('/notifications/');
    return res.data;
  },

  markAsRead: async (notifId) => {
    const res = await api.put(`/notifications/${notifId}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.put('/notifications/mark-all-read');
    return res.data;
  }
};

export default notificationService;
