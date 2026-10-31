import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wrench, Plus, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CreateMachineryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tractors');
  const [makeModel, setMakeModel] = useState('');
  const [horsePower, setHorsePower] = useState('45 HP');
  const [rentalPrice, setRentalPrice] = useState<number>(750);
  const [pricingUnit, setPricingUnit] = useState('per_hour');
  const [locationVillage, setLocationVillage] = useState(user?.village || '');
  const [locationDistrict, setLocationDistrict] = useState(user?.district || 'Ludhiana');
  const [locationState, setLocationState] = useState(user?.state || 'Punjab');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [includesOperator, setIncludesOperator] = useState(true);
  const [includesFuel, setIncludesFuel] = useState(false);
  const [maintenanceStatus, setMaintenanceStatus] = useState('operational');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Tractors', 'Harvesters', 'Seeders and planters', 'Cultivators',
    'Sprayers', 'Irrigation Equipment', 'Threshers', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !rentalPrice || !locationDistrict) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/machinery', {
        title: title.trim(),
        category,
        make_model: makeModel.trim() || undefined,
        horse_power: horsePower.trim() || undefined,
        rental_price: Number(rentalPrice),
        pricing_unit: pricingUnit,
        location_village: locationVillage.trim() || undefined,
        location_district: locationDistrict.trim(),
        location_state: locationState.trim(),
        description: description.trim() || undefined,
        specifications: specifications.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        includes_operator: includesOperator,
        includes_fuel: includesFuel,
        maintenance_status: maintenanceStatus
      });
      navigate('/machinery');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create listing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/machinery" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#176B3A]">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Machinery</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            List Machinery for Rental
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Provide accurate specifications so neighboring farmers can discover and book your equipment.
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
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Equipment Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mahindra 575 DI Tractor (47 HP)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#176B3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Equipment Category *</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Make / Model</label>
              <input
                type="text"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                placeholder="e.g. John Deere 5310"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Horsepower / Capacity</label>
              <input
                type="text"
                value={horsePower}
                onChange={(e) => setHorsePower(e.target.value)}
                placeholder="e.g. 50 HP or 600 Liters"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rental Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="50"
                  value={rentalPrice}
                  onChange={(e) => setRentalPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pricing Unit *</label>
                <select
                  value={pricingUnit}
                  onChange={(e) => setPricingUnit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="per_hour">Per Hour</option>
                  <option value="per_day">Per Day</option>
                  <option value="per_acre">Per Acre</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Village</label>
              <input
                type="text"
                value={locationVillage}
                onChange={(e) => setLocationVillage(e.target.value)}
                placeholder="e.g. Dehlon"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={locationDistrict}
                onChange={(e) => setLocationDistrict(e.target.value)}
                placeholder="e.g. Ludhiana"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={locationState}
                onChange={(e) => setLocationState(e.target.value)}
                placeholder="e.g. Punjab"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includesOperator}
                onChange={(e) => setIncludesOperator(e.target.checked)}
                className="rounded text-[#176B3A]"
              />
              <span>Operator Included with Machinery</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includesFuel}
                onChange={(e) => setIncludesFuel(e.target.checked)}
                className="rounded text-[#176B3A]"
              />
              <span>Fuel Included in Rental Rate</span>
            </label>
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
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain tractor condition, suitable soil types, and operational terms."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#176B3A] hover:bg-[#173D2A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating Listing...' : 'Publish Machinery Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};
