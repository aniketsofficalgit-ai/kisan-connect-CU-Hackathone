import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowLeft, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CreateCropPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState('Grains');
  const [variety, setVariety] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState<number>(100);
  const [quantityUnit, setQuantityUnit] = useState('quintal');
  const [askingPrice, setAskingPrice] = useState<number>(2400);
  const [priceUnit, setPriceUnit] = useState('per_quintal');
  const [harvestDate, setHarvestDate] = useState('April 2026');
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [village, setVillage] = useState(user?.village || '');
  const [district, setDistrict] = useState(user?.district || 'Ludhiana');
  const [state, setState] = useState(user?.state || 'Punjab');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [preferredContact, setPreferredContact] = useState('either');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Grains', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Spices', 'Cash Crops', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim() || !availableQuantity || !askingPrice || !district) {
      setError('Please provide all required fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/crops', {
        crop_name: cropName.trim(),
        category,
        variety: variety.trim() || undefined,
        available_quantity: Number(availableQuantity),
        quantity_unit: quantityUnit,
        asking_price: Number(askingPrice),
        price_unit: priceUnit,
        harvest_date: harvestDate.trim() || undefined,
        quality_grade: qualityGrade,
        village: village.trim() || undefined,
        district: district.trim(),
        state: state.trim(),
        description: description.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        preferred_contact_method: preferredContact,
        status: 'available'
      });
      navigate('/crops');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to list crop.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/crops" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#176B3A]">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Crops Marketplace</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Sell Your Crop — Create Listing
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Connect directly with produce buyers without middleman commissions.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Crop Name *</label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Sharbati Wheat or Basmati Rice"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#176B3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Crop Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Variety (Optional)</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. HD 3086 or Pusa 1121"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Quality Grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="Grade A">Grade A (Premium)</option>
                <option value="Grade B">Grade B (Standard Commercial)</option>
                <option value="Organic">Certified Organic</option>
                <option value="Standard">Standard Farm Harvest</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Available Qty *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min="1"
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Unit</label>
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="quintal">Quintals</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ton">Metric Tons</option>
                  <option value="crate">Crates</option>
                  <option value="bag">Standard Bags</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Asking Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Price Unit</label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="per_quintal">Per Quintal</option>
                  <option value="per_kg">Per Kg</option>
                  <option value="per_ton">Per Ton</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Sahnewal"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Ludhiana"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Punjab"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Harvest / Availability Date</label>
              <input
                type="text"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                placeholder="e.g. April 2026 or Ready Now"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Contact Method</label>
              <select
                value={preferredContact}
                onChange={(e) => setPreferredContact(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="either">Both Phone & In-App Chat</option>
                <option value="chat">In-App Chat Only</option>
                <option value="phone">Phone Call Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Photo Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description & Quality Details</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail moisture level, grain boldness, drying methods, and storage conditions."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#176B3A] hover:bg-[#173D2A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Publishing...' : 'List Crop for Buyers'}
          </button>
        </form>
      </div>
    </div>
  );
};
