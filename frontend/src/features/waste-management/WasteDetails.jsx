import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Tag, Calendar, User, Phone, CheckCircle2,
  Truck, ShieldCheck, Share2, AlertCircle, Tractor, Sparkles, Building2, Clock
} from 'lucide-react';
import wasteService from './wasteService';
import partnerService from '../partner-discovery/partnerService';
import collectionService from '../collection-tracking/collectionService';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import './WasteManagement.css';

const CATEGORY_FALLBACK_IMAGES = {
  'crop_residue': 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
  'crop-residue-stubble': 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
  'straw_husk': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  'straw-husk': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  'organic_waste': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
  'organic-farm-waste': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
  'animal_manure': 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
  'animal-manure': 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
  'agricultural_plastic': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  'agricultural-plastic': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  'other_waste': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
  'other-agricultural-waste': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
};

export const WasteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [partners, setPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [notes, setNotes] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await wasteService.getListingDetails(id);
        setListing(data);

        // Fetch verified partners accepting this category
        const parts = await partnerService.discoverPartners({ category: data.category_slug });
        setPartners(parts.partners || []);
        if (parts.partners?.length > 0) {
          setSelectedPartnerId(parts.partners[0].user_id || parts.partners[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleSendCollectionRequest = async (e) => {
    e.preventDefault();
    if (!selectedPartnerId) {
      setErrorMsg("Please select a collection partner.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await collectionService.createRequest({
        listing_id: listing.id,
        partner_id: selectedPartnerId,
        farmer_notes: notes,
        requested_pickup_date: pickupDate
      });
      setSuccessMsg("Collection request sent successfully to the partner!");
      setTimeout(() => {
        navigate('/tracking');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Failed to create collection request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading listing details..." />;
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-heading font-black text-[#20392A]">Waste Listing Not Found</h2>
        <p className="text-xs text-[#56715E] mt-2">This listing might have been removed or fulfilled.</p>
        <Link to="/waste-marketplace" className="btn-primary text-xs mt-4 inline-flex font-heading font-bold">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === listing.farmer_id;
  const fallbackImg = CATEGORY_FALLBACK_IMAGES[listing.category_slug] || CATEGORY_FALLBACK_IMAGES['crop-residue-stubble'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-heading font-bold text-[#56715E] hover:text-[#347A46] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Listings
      </button>

      <div className="bg-white rounded-3xl border border-[#E2ECE0] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Left: Image & Quick Specs */}
        <div className="md:col-span-5 bg-[#FAF9F3] p-6 sm:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E2ECE0]">
          <div>
            <div className="rounded-2xl overflow-hidden shadow-sm mb-6 relative aspect-4/3 bg-[#E8F1E5]">
              <img
                src={listing.image_url || fallbackImg}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = fallbackImg; }}
              />
              <span className="absolute top-3 left-3 bg-[#347A46]/90 backdrop-blur-md text-white text-[11px] font-heading font-bold px-3 py-1 rounded-full shadow-sm">
                {listing.category_name}
              </span>
            </div>

            <div className="space-y-3.5 bg-white p-5 rounded-2xl border border-[#E2ECE0] text-xs font-sans">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#FAF9F3]">
                <span className="text-[#56715E] font-medium">Available Quantity:</span>
                <span className="font-heading font-extrabold text-[#347A46] text-sm">
                  {listing.quantity} {listing.unit}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#FAF9F3]">
                <span className="text-[#56715E] font-medium">Expected Price:</span>
                <span className="font-heading font-bold text-[#20392A] text-sm">
                  {listing.expected_price ? `₹${listing.expected_price}/${listing.unit}` : 'Negotiable'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#FAF9F3]">
                <span className="text-[#56715E] font-medium">Pickup Suitability:</span>
                <span className="font-bold text-[#68A66A]">
                  {listing.pickup_available ? 'Truck Road Access' : 'Farm Gate / Tractor'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#56715E] font-medium">Listing Status:</span>
                <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold bg-[#E8F1E5] text-[#347A46] uppercase tracking-wider">
                  {listing.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 text-[11px] text-[#56715E] flex items-center gap-2 border-t border-[#E2ECE0]">
            <Clock size={14} className="text-[#68A66A]" />
            <span>Listed on {new Date(listing.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Right: Detailed Content & Actions */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#347A46] bg-[#E8F1E5] px-3.5 py-1.5 rounded-full inline-block">
                {listing.category_name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#20392A] mt-3 tracking-tight">
                {listing.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#56715E] flex items-center gap-1.5 mt-2">
                <MapPin size={16} className="text-[#68A66A] shrink-0" />
                <span>
                  {listing.village_district || 'Farm Location'} {listing.location_address ? `• ${listing.location_address}` : ''}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-xs font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2.5">
                Lot Description & Details
              </h3>
              <p className="text-xs sm:text-sm text-[#56715E] leading-relaxed bg-[#FAF9F3] p-5 rounded-2xl border border-[#E2ECE0] font-sans">
                {listing.description || 'Verified agricultural waste ready for authorized collection, baling, and sustainable processing.'}
              </p>
            </div>

            <div className="p-5 bg-[#FAF9F3] rounded-2xl border border-[#E2ECE0]">
              <span className="text-xs font-heading font-bold text-[#347A46] block mb-3 uppercase tracking-wider">
                Farmer Verification & Contact
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#20392A]">
                <span className="flex items-center gap-2 font-heading font-bold text-sm text-[#20392A]">
                  <User size={16} className="text-[#347A46]" /> {listing.farmer_name}
                </span>
                {isAuthenticated ? (
                  <span className="flex items-center gap-2 text-[#347A46] font-heading font-bold text-xs bg-white px-3.5 py-2 rounded-xl border border-[#E2ECE0] shadow-xs">
                    <Phone size={14} className="text-[#68A66A]" /> {listing.farmer_phone || '+91 98765 43210'}
                  </span>
                ) : (
                  <Link to="/login" className="text-xs font-bold text-[#347A46] underline hover:text-[#2A6439]">
                    Sign in to view direct phone number
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-6 mt-6 border-t border-[#E2ECE0] flex items-center gap-3">
            {isOwner ? (
              <button
                onClick={() => setShowRequestModal(true)}
                className="btn-primary flex-1 py-3.5 text-xs sm:text-sm font-heading font-bold shadow-md flex items-center justify-center gap-2"
              >
                <Truck size={17} /> Request Partner Pickup For My Listing
              </button>
            ) : user?.role === 'partner' ? (
              <button
                onClick={() => setShowRequestModal(true)}
                className="btn-primary flex-1 py-3.5 text-xs sm:text-sm font-heading font-bold shadow-md flex items-center justify-center gap-2"
              >
                <Truck size={17} /> Send Collection Offer to Farmer
              </button>
            ) : (
              <button
                onClick={() => setShowRequestModal(true)}
                className="btn-primary flex-1 py-3.5 text-xs sm:text-sm font-heading font-bold shadow-md flex items-center justify-center gap-2"
              >
                <Truck size={17} /> Request Collection Pickup
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collection Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E2ECE0]">
            <h3 className="text-lg font-heading font-black text-[#347A46] mb-1.5 flex items-center gap-2">
              <Truck size={22} className="text-[#68A66A]" /> Schedule Waste Collection
            </h3>
            <p className="text-xs text-[#56715E] mb-5 font-sans">
              Dispatch request for <strong>{listing.quantity} {listing.unit}</strong> of {listing.title}.
            </p>

            {successMsg && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSendCollectionRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
                  Choose Recycling Partner *
                </label>
                {partners.length === 0 ? (
                  <p className="text-xs text-amber-800 bg-amber-50 p-3.5 rounded-xl border border-amber-200 leading-relaxed">
                    No verified partner currently registered for this specific category in your district. You can still submit and our aggregator network will be alerted.
                  </p>
                ) : (
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                    className="form-input text-xs font-medium"
                    required
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.user_id || p.id}>
                        {p.business_name} ({p.service_area}) - {p.pricing_details || 'Verified Collector'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
                  Farm Access & Landmark Instructions
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Farm gate is opposite the canal bridge. Tractor trailer access available."
                  className="form-input text-xs"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#E2ECE0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="btn-outline text-xs px-5 py-2.5 font-heading font-bold rounded-full border-[#E2ECE0] text-[#56715E] hover:bg-[#FAF9F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs px-6 py-2.5 font-heading font-bold shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteDetails;
