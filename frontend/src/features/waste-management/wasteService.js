import api from '../../services/api';

export const wasteService = {
  getCategories: async () => {
    const res = await api.get('/waste/categories');
    return res.data.categories;
  },

  getListings: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      const val = params[key];
      if (val !== undefined && val !== null && val !== '' && val !== 'undefined') {
        cleanParams[key] = val;
      }
    });
    const query = new URLSearchParams(cleanParams).toString();
    const res = await api.get(`/waste/listings${query ? `?${query}` : ''}`);
    return res.data.listings;
  },

  getListingDetails: async (listingId) => {
    const res = await api.get(`/waste/listings/${listingId}`);
    return res.data.listing;
  },

  createListing: async (listingData) => {
    const res = await api.post('/waste/listings', listingData);
    return res.data;
  },

  updateListing: async (listingId, updateData) => {
    const res = await api.put(`/waste/listings/${listingId}`, updateData);
    return res.data;
  },

  deleteListing: async (listingId) => {
    const res = await api.delete(`/waste/listings/${listingId}`);
    return res.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/waste/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
};

export default wasteService;
