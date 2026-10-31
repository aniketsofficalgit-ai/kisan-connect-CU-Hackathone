import api from '../../services/api';

export const dashboardService = {
  getFarmerDashboardStats: async () => {
    const res = await api.get('/farmers/dashboard');
    return res.data.stats;
  },

  getMyListings: async () => {
    const res = await api.get('/farmers/my-listings');
    return res.data.listings;
  },

  getMyRequests: async () => {
    const res = await api.get('/farmers/my-requests');
    return res.data.requests;
  }
};

export default dashboardService;
