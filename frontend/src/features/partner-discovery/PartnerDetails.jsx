import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ShieldCheck, MapPin, Phone, Mail, Clock, Star,
  Truck, CheckCircle2, AlertCircle, Building2, Tag, Tractor, Sparkles
} from 'lucide-react';
import partnerService from './partnerService';
import wasteService from '../waste-management/wasteService';
import collectionService from '../collection-tracking/collectionService';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import './PartnerDiscovery.css';

export const PartnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmerListings, setFarmerListings] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState('');
  const [notes, setNotes] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        const data = await partnerService.getPartnerDetails(id);
        setPartner(data);

        // If logged-in farmer, fetch their listings to select from
        if (isAuthenticated && user?.role === 'farmer') {
          const lists = await wasteService.getListings({ status: 'available' });
          const myLists = lists.filter(l => l.farmer_id === user.id);
          setFarmerListings(myLists);
          if (myLists.length > 0) {
            setSelectedListingId(myLists[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [id, isAuthenticated, user]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedListingId) {
      setErrorMsg("Please select one of your waste listings to request collection.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await collectionService.createRequest({
        listing_id: selectedListingId,
        partner_id: partner.user_id || partner.id,
        farmer_notes: notes,
        requested_pickup_date: pickupDate
      });
      setSuccessMsg("Collection request sent successfully to this partner!");
      setTimeout(() => {
        navigate('/tracking');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading partner profile..." />;
  }

  if (!partner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-heading font-black text-[#20392A]">Partner Not Found</h2>
        <p className="text-xs text-[#56715E] mt-2">The partner profile could not be retrieved.</p>
        <Link to="/find-partners" className="btn-primary text-xs mt-4 inline-flex font-heading font-bold">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-heading font-bold text-[#56715E] hover:text-[#347A46] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div className="bg-white rounded-3xl border border-[#E2ECE0] shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2ECE0]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-heading font-bold text-[#347A46] bg-[#E8F1E5] px-3.5 py-1 rounded-full uppercase tracking-wider">
                {partner.business_type?.replace(/_/g, ' ')}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#347A46] bg-[#FAF9F3] border border-[#E2ECE0] px-3 py-1 rounded-full font-heading font-bold">
                <ShieldCheck size={14} className="text-[#68A66A]" /> Verified Partner
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#20392A] tracking-tight">
              {partner.business_name}
            </h1>
            <p className="text-xs text-[#56715E] mt-1 font-sans">
              Govt. Registration: {partner.registration_number || 'REG-AGRI-2026-VERIFIED'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-base font-heading font-black text-[#20392A] justify-end">
                <Star size={18} className="text-[#E8BD59] fill-[#E8BD59]" />
                <span>{partner.rating || 4.8} / 5.0</span>
              </div>
              <span className="text-[11px] text-[#56715E]">Verified by 50+ Local Farmers</span>
            </div>
          </div>
        </div>

        {/* Bio & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-6">
            <div>
              <h3 className="text-xs font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2.5">
                About & Procurement Capabilities
              </h3>
              <p className="text-xs sm:text-sm text-[#56715E] leading-relaxed bg-[#FAF9F3] p-5 rounded-2xl border border-[#E2ECE0] font-sans">
                {partner.description || 'Dedicated to sustainable agricultural residue procurement, automated baling, transport, and circular processing into clean value.'}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2.5">
                Accepted Waste Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {partner.accepted_categories?.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F3] border border-[#E2ECE0] text-[#347A46] font-heading font-bold text-xs"
                  >
                    {cat.replace(/_/g, ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
                <span className="text-[#56715E] font-bold block mb-1 text-[11px] uppercase tracking-wider">
                  Pricing Policy
                </span>
                <span className="text-sm font-heading font-extrabold text-[#347A46]">
                  {partner.pricing_details || 'Market Competitive Rates'}
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
                <span className="text-[#56715E] font-bold block mb-1 text-[11px] uppercase tracking-wider">
                  Minimum Pickup Lot
                </span>
                <span className="text-sm font-heading font-extrabold text-[#20392A]">
                  {partner.minimum_quantity} Quintals
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0] space-y-4 text-xs font-sans">
              <h4 className="font-heading font-bold text-[#347A46] uppercase tracking-wider text-xs border-b border-[#E2ECE0] pb-2.5">
                Contact & Dispatch Details
              </h4>
              <div className="flex items-start gap-2.5 text-[#20392A]">
                <MapPin size={16} className="text-[#68A66A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#20392A]">Service Coverage</span>
                  <span className="text-[#56715E]">{partner.service_area}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-[#20392A]">
                <Clock size={16} className="text-[#68A66A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#20392A]">Operating Hours</span>
                  <span className="text-[#56715E]">{partner.operating_hours || 'Mon-Sat: 8 AM - 6 PM'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-[#20392A]">
                <Phone size={16} className="text-[#68A66A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#20392A]">Direct Dispatch</span>
                  <span className="font-heading font-extrabold text-sm text-[#347A46]">
                    {partner.contact_phone || '+91 98765 44444'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-[#20392A]">
                <Mail size={16} className="text-[#68A66A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#20392A]">Official Email</span>
                  <span className="text-[#56715E]">{partner.contact_email || 'operations@kisanconnect.com'}</span>
                </div>
              </div>
            </div>

            {/* Request Pickup Button */}
            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full btn-primary py-3.5 rounded-full text-xs sm:text-sm font-heading font-bold shadow-md flex items-center justify-center gap-2"
            >
              <Truck size={17} /> Request Collection Pickup
            </button>
          </div>
        </div>
      </div>

      {/* Collection Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E2ECE0]">
            <h3 className="text-lg font-heading font-black text-[#347A46] mb-1.5 flex items-center gap-2">
              <Truck size={22} className="text-[#68A66A]" /> Send Collection Request
            </h3>
            <p className="text-xs text-[#56715E] mb-5 font-sans">
              To: <strong>{partner.business_name}</strong> ({partner.service_area})
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

            <form onSubmit={handleSendRequest} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
                  Select Your Waste Listing *
                </label>
                {farmerListings.length === 0 ? (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                    You don't have any active waste listings posted yet. Please <Link to="/add-waste" className="font-bold underline text-[#347A46]">Add a Listing</Link> first.
                  </div>
                ) : (
                  <select
                    value={selectedListingId}
                    onChange={(e) => setSelectedListingId(e.target.value)}
                    className="form-input text-xs font-medium"
                    required
                  >
                    {farmerListings.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title} ({l.quantity} {l.unit}) - {l.village_district}
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
                  Farm Gate & Navigation Instructions
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide landmark or access road details for driver..."
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
                  disabled={submitting || farmerListings.length === 0}
                  className="btn-primary text-xs px-6 py-2.5 font-heading font-bold shadow-sm rounded-full"
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

export default PartnerDetails;
