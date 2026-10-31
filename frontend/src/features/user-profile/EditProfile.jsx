import React, { useState } from 'react';
import { User, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import authService from '../authentication/authService';
import { useAuth } from '../../context/AuthContext';

export const EditProfile = ({ onSaved, onCancel }) => {
  const { user, refreshUser } = useAuth();
  const fp = user?.farmer_profile || {};
  const pp = user?.partner_profile || {};

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    // Farmer fields
    farm_name: fp.farm_name || '',
    farm_size_acres: fp.farm_size_acres || 5,
    village: fp.village || '',
    district: fp.district || '',
    state: fp.state || 'Punjab',
    // Partner fields
    business_name: pp.business_name || '',
    service_area: pp.service_area || '',
    pricing_details: pp.pricing_details || '',
    operating_hours: pp.operating_hours || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.updateProfile(formData);
      await refreshUser();
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="form-input text-xs"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
            Phone Number *
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input text-xs"
            required
          />
        </div>
      </div>

      {user?.role === 'farmer' && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Farm Name
              </label>
              <input
                type="text"
                name="farm_name"
                value={formData.farm_name}
                onChange={handleChange}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Farm Size (Acres)
              </label>
              <input
                type="number"
                name="farm_size_acres"
                value={formData.farm_size_acres}
                onChange={handleChange}
                step="0.5"
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Village / Town
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="form-input text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {user?.role === 'partner' && (
        <div className="space-y-4 pt-2">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Business / Recycling Center Name
            </label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="form-input text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Service Area / Coverage Districts
            </label>
            <input
              type="text"
              name="service_area"
              value={formData.service_area}
              onChange={handleChange}
              className="form-input text-xs"
            />
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline text-xs px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary text-xs px-5 py-2 font-bold shadow"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
