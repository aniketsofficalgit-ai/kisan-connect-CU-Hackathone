import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout, Search, Filter, MapPin, DollarSign, Plus,
  ShieldCheck, X, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { CropListing } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const CropsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [crops, setCrops] = useState<CropListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(6000);
  const [searchQuery, setSearchQuery] = useState('');

  // Buyer Inquiry Modal
  const [selectedCrop, setSelectedCrop] = useState<CropListing | null>(null);
  const [requestedQty, setRequestedQty] = useState<number>(50);
  const [proposedPrice, setProposedPrice] = useState<number>(2400);
  const [deliveryPref, setDeliveryPref] = useState('buyer_pickup');
  const [message, setMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const categories = [
    'All', 'Grains', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Spices', 'Other'
  ];

  const fetchCrops = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (categoryFilter && categoryFilter !== 'All') params.category = categoryFilter;
      if (districtFilter) params.district = districtFilter;
      if (maxPriceFilter) params.max_price = maxPriceFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/crops', { params });
      setCrops(res.data);
    } catch (err) {
      console.error('Failed to load crop listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [categoryFilter, districtFilter, maxPriceFilter]);

  const handleOpenInquiry = (crop: CropListing) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedCrop(crop);
    setRequestedQty(Math.min(crop.available_quantity, 50));
    setProposedPrice(crop.asking_price);
    setInquirySuccess(false);
    setInquiryError(null);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop) return;

    setSubmittingInquiry(true);
    setInquiryError(null);

    try {
      await api.post('/requests/crop-inquiry', {
        crop_id: selectedCrop.id,
        requested_quantity: requestedQty,
        quantity_unit: selectedCrop.quantity_unit,
        proposed_price: proposedPrice,
        price_unit: selectedCrop.price_unit,
        message,
        delivery_preference: deliveryPref
      });
      setInquirySuccess(true);
      setTimeout(() => {
        setSelectedCrop(null);
        setInquirySuccess(false);
      }, 2500);
    } catch (err: any) {
      setInquiryError(err.response?.data?.detail || 'Failed to submit purchase offer.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const totalOffer = requestedQty * proposedPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
            <Sprout className="w-4 h-4" />
            <span>Farm Gate Produce Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Crop Marketplace — Buy & Sell Produce
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Connect directly with verified farmers. Transparent quality grades, harvest dates, and zero middleman fee.
          </p>
        </div>

        {user?.role === 'farmer' && (
          <Link
            to="/crops/create"
            className="px-4 py-2.5 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors flex items-center gap-1.5 shadow-2xs w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Sell Your Crop</span>
          </Link>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCrops()}
              placeholder="Search by crop name (Wheat, Rice, Mustard), variety, or location..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="button"
            onClick={fetchCrops}
            className="px-6 py-2.5 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors"
          >
            Search Crops
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => {
            const isSelected = (cat === 'All' && !categoryFilter) || categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat === 'All' ? '' : cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#176B3A] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-5 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </span>
            <button
              onClick={() => {
                setCategoryFilter('');
                setDistrictFilter('');
                setMaxPriceFilter(6000);
                setSearchQuery('');
              }}
              className="text-[11px] text-[#176B3A] hover:underline font-bold"
            >
              Reset
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">District / Region</label>
            <input
              type="text"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              placeholder="e.g. Ludhiana, Karnal"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Max Asking Price:</span>
              <span>₹{maxPriceFilter}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-[#176B3A]"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
            <span className="font-bold block">Market Notice:</span>
            <p>
              Prices shown are seller asking prices. Final purchase prices are settled directly via buyer offers and mutual agreement.
            </p>
          </div>
        </div>

        {/* Crop Cards Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-16 text-gray-400 text-xs">
              Loading crop listings...
            </div>
          ) : crops.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
              <Sprout className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-800">No Crop Listings Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No crops currently match your filter criteria. Try expanding your search or selecting 'All' categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {crops.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Crop Image */}
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      {c.image_url ? (
                        <img
                          src={c.image_url}
                          alt={c.crop_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Sprout className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-gray-800 shadow-xs">
                          {c.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#173D2A] text-white shadow-xs">
                          {c.quality_grade}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={c.status} />
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 line-clamp-1">{c.crop_name}</h3>
                        {c.variety && (
                          <span className="text-[11px] text-gray-500 font-medium">Variety: {c.variety}</span>
                        )}
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{c.district}, {c.state}</span>
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-2xl font-black text-[#176B3A]">
                            ₹{c.asking_price}
                          </span>
                          <span className="text-xs text-gray-500 font-normal"> /{c.price_unit?.replace('_', ' ')}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-gray-500 block">Available</span>
                          <span className="font-bold text-sm text-gray-800">
                            {c.available_quantity} {c.quantity_unit}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {c.description || 'Clean, farm-fresh harvest ready for procurement.'}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                        <span>Harvest: {c.harvest_date || 'Current Season'}</span>
                        <span>Farmer: <strong className="text-gray-700">{c.farmer?.full_name || 'Verified Farmer'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center gap-2">
                    <Link
                      to={`/crops/${c.id}`}
                      className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 text-center transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      disabled={c.status !== 'available'}
                      onClick={() => handleOpenInquiry(c)}
                      className="flex-1 py-2 rounded-xl bg-[#176B3A] text-white text-xs font-bold hover:bg-[#173D2A] text-center transition-colors shadow-2xs disabled:opacity-40"
                    >
                      Submit Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buyer Purchase Inquiry Workflow Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Submit Purchase Offer</h3>
                  <p className="text-xs text-gray-500">{selectedCrop.crop_name} ({selectedCrop.district})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#176B3A] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-gray-900">Purchase Offer Submitted!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Farmer {selectedCrop.farmer?.full_name} has received your purchase inquiry for ₹{totalOffer.toLocaleString()}. You can coordinate directly in the Requests and Messages tabs.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="mt-5 space-y-4">
                {inquiryError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Quantity ({selectedCrop.quantity_unit}) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max={selectedCrop.available_quantity}
                      required
                      value={requestedQty}
                      onChange={(e) => setRequestedQty(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                    <span className="text-[10px] text-gray-400">Available: {selectedCrop.available_quantity}</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Proposed Price (₹/{selectedCrop.price_unit?.replace('per_', '')}) *
                    </label>
                    <input
                      type="number"
                      step="25"
                      min="50"
                      required
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                    <span className="text-[10px] text-gray-400">Asking: ₹{selectedCrop.asking_price}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Delivery / Logistics Preference</label>
                  <select
                    value={deliveryPref}
                    onChange={(e) => setDeliveryPref(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="buyer_pickup">Buyer Arranges Pickup at Farm Gate</option>
                    <option value="farmer_delivery">Farmer Delivers to Buyer Mandi / Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Message to Farmer</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Can you supply in 50kg standard jute bags? We can pay immediately upon inspection."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                {/* Offer Calculation Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-950">
                  <div>
                    <span className="font-semibold block">Total Proposed Amount:</span>
                    <span className="text-[11px] text-amber-700">
                      {requestedQty} {selectedCrop.quantity_unit} @ ₹{proposedPrice}/{selectedCrop.price_unit?.replace('per_', '')}
                    </span>
                  </div>
                  <span className="text-lg font-black text-amber-900">
                    ₹{totalOffer.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCrop(null)}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="flex-1 py-3 rounded-xl bg-[#176B3A] text-white text-xs font-bold hover:bg-[#173D2A] disabled:opacity-50"
                  >
                    {submittingInquiry ? 'Sending...' : 'Send Offer to Farmer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
