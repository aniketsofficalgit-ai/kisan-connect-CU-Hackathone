import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Truck, CheckCircle2, Clock, Calendar, User, Phone,
  AlertCircle, XCircle, FileText, DollarSign, Check, ShieldCheck
} from 'lucide-react';
import collectionService from './collectionService';
import TrackingTimeline from './TrackingTimeline';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import './Collection.css';

export const CollectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await collectionService.getRequestDetails(id);
      setRequest(data);
      if (data.offered_price) {
        setOfferedPrice(data.offered_price);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus, customComment = '') => {
    setErrorMsg('');
    setSuccessMsg('');
    setActionLoading(true);

    try {
      const payload = {
        status: newStatus,
        comment: customComment || comment || `Status updated to ${newStatus}`,
        scheduled_pickup_date: scheduledDate || undefined,
        offered_price: offeredPrice ? parseFloat(offeredPrice) : undefined
      };

      const res = await collectionService.updateStatus(request.id, payload);
      setRequest(res.request);
      setSuccessMsg(`Order status successfully updated to '${newStatus}'!`);
      setShowScheduleModal(false);
      setComment('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading collection tracking timeline..." />;
  }

  if (!request) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-heading font-black text-[#20392A]">Collection Request Not Found</h2>
        <Link to="/tracking" className="btn-primary text-xs mt-4 inline-flex font-heading font-bold">
          Back to Tracking List
        </Link>
      </div>
    );
  }

  const isFarmer = user?.id === request.farmer_id;
  const isPartner = user?.id === request.partner_id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-heading font-bold text-[#56715E] hover:text-[#347A46] flex items-center gap-2 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Requests
      </button>

      {/* Overview Top Card */}
      <div className="bg-white rounded-3xl border border-[#E2ECE0] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2ECE0]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-heading font-black text-lg text-[#347A46]">{request.request_number}</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold bg-[#E8F1E5] text-[#347A46] uppercase tracking-wider">
                {request.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#20392A] tracking-tight">
              {request.listing_title}
            </h1>
            <p className="text-xs text-[#56715E] mt-1 font-sans">
              Quantity: <strong className="text-[#20392A]">{request.quantity} {request.unit}</strong> • Category: {request.waste_category}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-gray-400 block font-heading font-bold uppercase tracking-wider">
              Total Order Value / Payout
            </span>
            <span className="text-2xl sm:text-3xl font-heading font-black text-[#347A46]">
              ₹{request.offered_price?.toLocaleString('en-IN') || 0}
            </span>
            <span className={`text-[11px] block font-heading font-bold mt-0.5 ${request.payment_status === 'paid' ? 'text-[#347A46]' : 'text-[#B38018]'}`}>
              Payment: {request.payment_status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Parties Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0] text-xs font-sans space-y-2">
            <span className="font-heading font-bold text-[#56715E] uppercase tracking-wider block text-[11px]">
              Farmer Details
            </span>
            <p className="text-sm font-heading font-extrabold text-[#20392A]">{request.farmer_name}</p>
            <p className="text-[#56715E] flex items-center gap-1.5 font-medium">
              <Phone size={14} className="text-[#68A66A]" /> {request.farmer_phone || '+91 98765 XXXXX'}
            </p>
            {request.farmer_notes && (
              <p className="text-[#56715E] italic mt-2 bg-white p-3 rounded-xl border border-[#E2ECE0]">
                "{request.farmer_notes}"
              </p>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0] text-xs font-sans space-y-2">
            <span className="font-heading font-bold text-[#347A46] uppercase tracking-wider block text-[11px]">
              Recycling Partner Details
            </span>
            <p className="text-sm font-heading font-extrabold text-[#20392A]">{request.partner_business_name}</p>
            <p className="text-[#56715E] flex items-center gap-1.5 font-medium">
              <Phone size={14} className="text-[#68A66A]" /> {request.partner_phone || '+91 98765 XXXXX'}
            </p>
            {request.scheduled_pickup_date && (
              <p className="text-[#347A46] font-heading font-bold flex items-center gap-1.5 bg-[#E8F1E5] px-3 py-1 rounded-lg w-fit mt-1">
                <Clock size={13} className="text-[#68A66A]" /> Scheduled: {request.scheduled_pickup_date}
              </p>
            )}
          </div>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {/* Workflow Actions */}
        <div className="pt-6 border-t border-[#E2ECE0]">
          <h4 className="text-xs font-heading font-bold text-[#20392A] uppercase tracking-wider mb-3">
            Workflow Actions
          </h4>

          {/* Partner Controls */}
          {isPartner && (
            <div className="flex flex-wrap items-center gap-3">
              {request.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus('Accepted', 'Partner accepted collection request.')}
                    disabled={actionLoading}
                    className="btn-primary text-xs py-2.5 px-5 font-heading font-bold rounded-full"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Rejected', 'Partner cannot fulfill due to distance/capacity.')}
                    disabled={actionLoading}
                    className="btn-outline text-red-600 border-red-300 hover:bg-red-50 text-xs py-2.5 px-4.5 font-heading font-bold rounded-full"
                  >
                    Decline Request
                  </button>
                </>
              )}

              {request.status === 'Accepted' && (
                <button
                  onClick={() => setShowScheduleModal(true)}
                  disabled={actionLoading}
                  className="btn-primary text-xs py-2.5 px-5 font-heading font-bold flex items-center gap-2 rounded-full"
                >
                  <Calendar size={15} /> Schedule Pickup Date & Dispatch
                </button>
              )}

              {request.status === 'Scheduled' && (
                <button
                  onClick={() => handleUpdateStatus('Picked Up', 'Biomass loaded and baled onto collection vehicle.')}
                  disabled={actionLoading}
                  className="btn-primary text-xs py-2.5 px-5 font-heading font-bold flex items-center gap-2 rounded-full"
                >
                  <Truck size={15} /> Confirm Waste Picked Up
                </button>
              )}

              {request.status === 'Picked Up' && (
                <button
                  onClick={() => handleUpdateStatus('Completed', 'Delivered to recycling facility and payment cleared.')}
                  disabled={actionLoading}
                  className="btn-primary text-xs py-2.5 px-5 font-heading font-bold flex items-center gap-2 rounded-full"
                >
                  <CheckCircle2 size={15} /> Confirm Final Delivery & Payment Cleared
                </button>
              )}
            </div>
          )}

          {/* Farmer Controls */}
          {isFarmer && (
            <div className="flex flex-wrap items-center gap-3">
              {request.status === 'Picked Up' && (
                <button
                  onClick={() => handleUpdateStatus('Completed', 'Farmer confirmed pickup completion and received payment.')}
                  disabled={actionLoading}
                  className="btn-primary text-xs py-2.5 px-6 font-heading font-bold shadow-md flex items-center gap-2 rounded-full"
                >
                  <CheckCircle2 size={16} /> Confirm Collection Complete & Payment Received
                </button>
              )}

              {request.status === 'Pending' && (
                <button
                  onClick={() => handleUpdateStatus('Cancelled', 'Farmer cancelled the request.')}
                  disabled={actionLoading}
                  className="btn-outline text-red-600 border-red-300 hover:bg-red-50 text-xs py-2 px-4.5 font-heading font-bold rounded-full"
                >
                  Cancel Request
                </button>
              )}

              {request.status === 'Completed' && (
                <div className="p-4 bg-[#FAF9F3] rounded-2xl border border-[#E2ECE0] text-xs text-[#347A46] font-semibold flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#68A66A]" />
                  <span>Collection completed successfully! Stubble burning prevented and resources recycled.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Visual Tracking Timeline */}
      <TrackingTimeline currentStatus={request.status} history={request.history} />

      {/* Schedule Modal for Partner */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E2ECE0] text-xs space-y-4 font-sans">
            <h3 className="font-heading font-black text-base text-[#347A46] flex items-center gap-2">
              <Calendar size={18} className="text-[#68A66A]" /> Schedule Collection Pickup
            </h3>
            <p className="text-[#56715E]">
              Provide scheduled pickup date and dispatch details for the farmer:
            </p>

            <div>
              <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
                Pickup Date & Time *
              </label>
              <input
                type="text"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                placeholder="e.g. Saturday, Nov 3 at 9:30 AM"
                className="form-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
                Total Offered Payout (₹)
              </label>
              <input
                type="number"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                placeholder="e.g. 33600"
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
                Driver & Vehicle Details
              </label>
              <textarea
                rows="2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Truck PB-10-8841 with baler attachment. Driver: Gurpreet (9876543210)"
                className="form-input text-xs"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-[#E2ECE0] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="btn-outline text-xs px-4.5 py-2 font-heading font-bold rounded-full border-[#E2ECE0] text-[#56715E] hover:bg-[#FAF9F3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('Scheduled', comment || `Pickup scheduled for ${scheduledDate}`)}
                disabled={!scheduledDate || actionLoading}
                className="btn-primary text-xs px-5 py-2 font-heading font-bold shadow-sm rounded-full"
              >
                {actionLoading ? 'Saving...' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDetails;
