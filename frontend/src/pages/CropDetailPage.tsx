import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sprout, MapPin, ShieldCheck, ArrowLeft,
  Calendar, CheckCircle2, AlertCircle, Phone, X, MessageSquare
} from 'lucide-react';
import api from '../services/api';
import { CropListing } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const CropDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [crop, setCrop] = useState<CropListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inquiry Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [requestedQty, setRequestedQty] = useState(50);
  const [proposedPrice, setProposedPrice] = useState(2400);
  const [deliveryPref, setDeliveryPref] = useState('buyer_pickup');
  const [message, setMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrop = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/crops/${id}`);
        setCrop(res.data);
        setRequestedQty(Math.min(res.data.available_quantity, 50));
        setProposedPrice(res.data.asking_price);
      } catch (err) {
        console.error('Failed to load crop details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCrop();
  }, [id]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingInquiry(true);
    setInquiryError(null);

    try {
      await api.post('/requests/crop-inquiry', {
        crop_id: crop.id,
        requested_quantity: requestedQty,
        quantity_unit: crop.quantity_unit,
        proposed_price: proposedPrice,
        price_unit: crop.price_unit,
        message,
        delivery_preference: deliveryPref
      });
      setInquirySuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setInquirySuccess(false);
      }, 2500);
    } catch (err: any) {
      setInquiryError(err.response?.data?.detail || 'Failed to submit offer.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-gray-500">Loading crop details...</div>;
  }

  if (!crop) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Crop Listing Not Found</h3>
        <Link to="/crops" className="text-xs text-[#176B3A] font-bold underline">
          Back to Crops Marketplace
        </Link>
      </div>
    );
  }

  const totalOffer = requestedQty * proposedPrice;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/crops" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#176B3A]">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Crop Listings</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        {/* Photo Header */}
        <div className="h-64 sm:h-80 bg-gray-100 relative">
          {crop.image_url ? (
            <img src={crop.image_url} alt={crop.crop_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Sprout className="w-16 h-16" />
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-800 shadow-sm">
              {crop.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#173D2A] text-white shadow-sm">
              {crop.quality_grade}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <StatusBadge status={crop.status} />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{crop.crop_name}</h1>
              {crop.variety && (
                <p className="text-xs font-semibold text-gray-600 mt-0.5">Variety: {crop.variety}</p>
              )}
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {crop.village ? `${crop.village}, ` : ''}{crop.district}, {crop.state}
                </span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-500 block">Asking Price</span>
              <span className="text-3xl font-black text-[#176B3A]">
                ₹{crop.asking_price}
              </span>
              <span className="text-xs text-gray-500 font-normal"> /{crop.price_unit?.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {crop.description || 'Farm-fresh harvest grown under optimal agronomic practices, sorted and ready for dispatch.'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Lot Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">Available Quantity</span>
                    <span className="font-bold text-gray-800">{crop.available_quantity} {crop.quantity_unit}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">Harvest Period</span>
                    <span className="font-bold text-gray-800">{crop.harvest_date || 'Current Season'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">Quality Grade</span>
                    <span className="font-bold text-gray-800">{crop.quality_grade}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Farmer Card */}
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-5 h-fit">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-[#176B3A] text-white flex items-center justify-center font-bold text-sm">
                  {crop.farmer?.full_name?.charAt(0) || 'F'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{crop.farmer?.full_name || 'Farmer'}</h4>
                  <p className="text-[11px] text-gray-500">{crop.district}, {crop.state}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Contact Preference:</span>
                  <span className="font-bold text-gray-800 capitalize">{crop.preferred_contact_method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <span className="font-bold text-emerald-700">Verified Producer</span>
                </div>
              </div>

              <button
                type="button"
                disabled={crop.status !== 'available'}
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#176B3A] hover:bg-[#173D2A] text-white font-bold text-xs shadow-md transition-all disabled:opacity-40"
              >
                Send Purchase Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Make an Offer</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#176B3A] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-gray-900">Offer Submitted!</h4>
                <p className="text-xs text-gray-600">Farmer will review your proposal shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="mt-4 space-y-4">
                {inquiryError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Quantity ({crop.quantity_unit}) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max={crop.available_quantity}
                      required
                      value={requestedQty}
                      onChange={(e) => setRequestedQty(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Proposed Rate (₹/{crop.price_unit?.replace('per_', '')}) *
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
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Logistics / Delivery Preference</label>
                  <select
                    value={deliveryPref}
                    onChange={(e) => setDeliveryPref(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="buyer_pickup">Buyer Pickup at Farm Gate</option>
                    <option value="farmer_delivery">Farmer Delivers to Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Note to Farmer</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify bagging requirements or payment schedule"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs text-amber-950">
                  <span className="font-semibold">Total Proposed Amount:</span>
                  <span className="text-base font-black text-amber-900">₹{totalOffer.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full py-3 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] disabled:opacity-50"
                >
                  {submittingInquiry ? 'Submitting...' : 'Send Purchase Offer'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
