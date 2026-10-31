import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Wrench, MapPin, Fuel, ShieldCheck, Calendar, ArrowLeft,
  CheckCircle2, AlertCircle, Phone, User, X
} from 'lucide-react';
import api from '../services/api';
import { MachineryListing } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const MachineryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [machine, setMachine] = useState<MachineryListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Booking Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [rentalUnits, setRentalUnits] = useState(6);
  const [unitType, setUnitType] = useState('hours');
  const [deliveryNeeded, setDeliveryNeeded] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachine = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/machinery/${id}`);
        setMachine(res.data);
        setUnitType(res.data.pricing_unit?.includes('day') ? 'days' : 'hours');
        setRentalUnits(res.data.pricing_unit?.includes('day') ? 1 : 4);
      } catch (err) {
        console.error('Failed to load machinery details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchMachine();
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machine) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      await api.post('/requests/machinery', {
        machinery_id: machine.id,
        start_date: startDate,
        end_date: endDate,
        rental_units: rentalUnits,
        unit_type: unitType,
        delivery_needed: deliveryNeeded,
        delivery_address: deliveryAddress,
        notes
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setBookingSuccess(false);
      }, 2500);
    } catch (err: any) {
      setBookingError(err.response?.data?.detail || 'Failed to submit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-gray-500">Loading equipment details...</div>;
  }

  if (!machine) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Equipment Listing Not Found</h3>
        <Link to="/machinery" className="text-xs text-[#176B3A] font-bold underline">
          Back to Machinery Marketplace
        </Link>
      </div>
    );
  }

  const estimatedAmount = machine.rental_price * rentalUnits;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/machinery" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#176B3A]">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Machinery Directory</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        {/* Photo header */}
        <div className="h-64 sm:h-80 bg-gray-100 relative">
          {machine.image_url ? (
            <img src={machine.image_url} alt={machine.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Wrench className="w-16 h-16" />
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-800 shadow-sm">
              {machine.category}
            </span>
            {machine.horse_power && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#173D2A] text-white shadow-sm">
                {machine.horse_power}
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <StatusBadge status={machine.is_available ? 'available' : 'under_maintenance'} />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{machine.title}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {machine.location_village ? `${machine.location_village}, ` : ''}{machine.location_district}, {machine.location_state}
                </span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-500 block">Rental Rate</span>
              <span className="text-3xl font-black text-[#176B3A]">
                ₹{machine.rental_price}
              </span>
              <span className="text-xs text-gray-500 font-normal"> /{machine.pricing_unit?.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {machine.description || 'Reliable and well-maintained agricultural implement available for field work.'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Technical Specifications</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {machine.specifications || 'Standard manufacturer specifications with routine mechanical servicing.'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Inclusions & Rental Terms</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${machine.includes_operator ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    <span>Operator: {machine.includes_operator ? 'Included' : 'Self/Renter Provided'}</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${machine.includes_fuel ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    <span>Fuel: {machine.includes_fuel ? 'Included in Rate' : 'Fuel by Renter'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner & Booking Sidebar */}
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-5 h-fit">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-[#176B3A] text-white flex items-center justify-center font-bold text-sm">
                  {machine.owner?.full_name?.charAt(0) || 'O'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{machine.owner?.full_name || 'Fleet Owner'}</h4>
                  <p className="text-[11px] text-gray-500">Verified Equipment Lister</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-bold text-gray-800">{machine.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="font-bold text-gray-800">{machine.make_model || 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance:</span>
                  <span className="font-bold text-emerald-700">{machine.maintenance_status}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!machine.is_available}
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#176B3A] hover:bg-[#173D2A] text-white font-bold text-xs shadow-md transition-all disabled:opacity-40"
              >
                Book This Equipment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Rental Reservation</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#176B3A] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-gray-900">Booking Submitted!</h4>
                <p className="text-xs text-gray-600">The owner will review your dates shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-4">
                {bookingError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Duration ({unitType})</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={rentalUnits}
                      onChange={(e) => setRentalUnits(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Unit Type</label>
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={deliveryNeeded}
                      onChange={(e) => setDeliveryNeeded(e.target.checked)}
                      className="rounded text-[#176B3A]"
                    />
                    <span>Request Farm Gate Delivery</span>
                  </label>
                  {deliveryNeeded && (
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter field gate delivery landmark"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific implements or field conditions"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center text-xs text-blue-950">
                  <span className="font-semibold">Estimated Total:</span>
                  <span className="text-base font-black text-blue-900">₹{estimatedAmount.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
