import api from '../../services/api';

export const partnerService = {
  discoverPartners: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      const val = params[key];
      if (val !== undefined && val !== null && val !== '' && val !== 'undefined') {
        cleanParams[key] = val;
      }
    });
    const query = new URLSearchParams(cleanParams).toString();
    const res = await api.get(`/partners/discovery${query ? `?${query}` : ''}`);
    return res.data;
  },

  getPartnerDetails: async (partnerId) => {
    const res = await api.get(`/partners/details/${partnerId}`);
    return res.data.partner;
  },

  getPartnerDashboardStats: async () => {
    const res = await api.get('/partners/dashboard');
    return res.data.stats;
  },

  getAvailableListings: async () => {
    const res = await api.get('/partners/available-listings');
    return res.data.listings;
  }
};

export default partnerService;
