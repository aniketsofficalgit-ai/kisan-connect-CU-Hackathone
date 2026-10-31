import api from '../../services/api';

export const collectionService = {
  createRequest: async (requestData) => {
    const res = await api.post('/collections/request', requestData);
    return res.data;
  },

  getRequests: async () => {
    const res = await api.get('/collections/requests');
    return res.data.requests;
  },

  getRequestDetails: async (requestId) => {
    const res = await api.get(`/collections/requests/${requestId}`);
    return res.data.request;
  },

  updateStatus: async (requestId, payload) => {
    const res = await api.put(`/collections/requests/${requestId}/status`, payload);
    return res.data;
  }
};

export default collectionService;
