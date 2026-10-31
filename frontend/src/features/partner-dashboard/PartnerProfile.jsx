import React, { useState } from 'react';
import { Building2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import authService from '../authentication/authService';
import { useAuth } from '../../context/AuthContext';

export const PartnerProfile = () => {
  const { user, refreshUser } = useAuth();
  const profile = user?.partner_profile || {};

  const [formData, setFormData] = useState({
    business_name: profile.business_name || '',
    business_type: profile.business_type || 'compost_manufacturer',
    description: profile.description || '',
    service_area: profile.service_area || '',
    minimum_quantity: profile.minimum_quantity || 50,
    pricing_details: profile.pricing_details || '',
    operating_hours: profile.operating_hours || 'Mon-Sat: 8 AM - 6 PM',
    address: profile.address || ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authService.updateProfile(formData);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update partner profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1E4D2B] tracking-tight flex items-center gap-2">
          <Building2 size={26} /> Business Profile & Coverage
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Keep your procurement rates, coverage area, and operating hours updated for farmers
        </p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} /> Partner details updated successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="kc-card p-6 sm:p-8 space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Business / Facility Name
            </label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="form-input text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Business Category
            </label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              className="form-input text-xs"
            >
              <option value="biomass_plant">Biomass Power & Fuel Plant</option>
              <option value="compost_manufacturer">Compost & Organic Fertilizer</option>
              <option value="plastic_recycler">Authorized Plastic Recycler</option>
              <option value="waste_collector">Agricultural Waste Collector</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Service Districts / Coverage Area
          </label>
          <input
            type="text"
            name="service_area"
            value={formData.service_area}
            onChange={handleChange}
            placeholder="e.g. Ludhiana, Patiala, Jalandhar"
            className="form-input text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Procurement Rates / Pricing Policy
            </label>
            <input
              type="text"
              name="pricing_details"
              value={formData.pricing_details}
              onChange={handleChange}
              placeholder="e.g. ₹220 - ₹280 per quintal"
              className="form-input text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Operating Hours
            </label>
            <input
              type="text"
              name="operating_hours"
              value={formData.operating_hours}
              onChange={handleChange}
              className="form-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Business Bio & Capabilities Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="form-input text-xs"
          ></textarea>
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-xs px-6 py-2.5 font-bold shadow-md"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerProfile;
