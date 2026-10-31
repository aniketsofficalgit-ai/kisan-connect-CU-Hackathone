import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench, Search, Filter, MapPin, Fuel, UserCheck,
  Calendar, Clock, ShieldCheck, Plus, X, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { MachineryListing } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const MachineryPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [machinery, setMachinery] = useState<MachineryListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3000);
  const [pricingUnitFilter, setPricingUnitFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal
  const [selectedMachine, setSelectedMachine] = useState<MachineryListing | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [rentalUnits, setRentalUnits] = useState(4);
  const [unitType, setUnitType] = useState('hours');
  const [deliveryNeeded, setDeliveryNeeded] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.village ? `${user.village}, ${user.district}` : '');
  const [bookingNotes, setBookingNotes] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const categories = [
    'All', 'Tractors', 'Harvesters', 'Seeders and planters',
    'Cultivators', 'Sprayers', 'Irrigation Equipment', 'Threshers', 'Other'
  ];

  const fetchMachinery = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (categoryFilter && categoryFilter !== 'All') params.category = categoryFilter;
      if (districtFilter) params.district = districtFilter;
      if (maxPriceFilter) params.max_price = maxPriceFilter;
      if (pricingUnitFilter !== 'all') params.pricing_unit = pricingUnitFilter;
      if (availabilityFilter !== 'all') params.is_available = availabilityFilter === 'available';
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/machinery', { params });
      setMachinery(res.data);
    } catch (err) {
      console.error('Failed to load machinery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, [categoryFilter, districtFilter, maxPriceFilter, pricingUnitFilter, availabilityFilter]);

  const handleOpenBookingModal = (machine: MachineryListing) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedMachine(machine);
    setUnitType(machine.pricing_unit?.includes('day') ? 'days' : 'hours');
    setRentalUnits(machine.pricing_unit?.includes('day') ? 1 : 4);
    setBookingSuccess(false);
    setBookingError(null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;

    setSubmittingBooking(true);
    setBookingError(null);

    try {
      await api.post('/requests/machinery', {
        machinery_id: selectedMachine.id,
        start_date: startDate,
        end_date: endDate,
        rental_units: rentalUnits,
        unit_type: unitType,
        delivery_needed: deliveryNeeded,
        delivery_address: deliveryAddress,
        notes: bookingNotes
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedMachine(null);
        setBookingSuccess(false);
      }, 2500);
    } catch (err: any) {
      setBookingError(err.response?.data?.detail || 'Failed to submit machinery booking.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const estimatedAmount = selectedMachine ? selectedMachine.rental_price * rentalUnits : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
            <Wrench className="w-4 h-4" />
            <span>Farm Machinery Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Agricultural Machinery & Equipment Rental
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Rent tractors, combine harvesters, laser levelers, and sprayers with verified operators.
          </p>
        </div>

        {user?.role === 'machinery_owner' && (
          <Link
            to="/machinery/create"
            className="px-4 py-2.5 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors flex items-center gap-1.5 shadow-2xs w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>List My Machinery</span>
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
              onKeyDown={(e) => e.key === 'Enter' && fetchMachinery()}
              placeholder="Search by machinery title, make/model, or location..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="button"
            onClick={fetchMachinery}
            className="px-6 py-2.5 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors"
          >
            Search Machinery
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

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-5 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Rental Filters</span>
            </span>
            <button
              onClick={() => {
                setCategoryFilter('');
                setDistrictFilter('');
                setMaxPriceFilter(3000);
                setPricingUnitFilter('all');
                setAvailabilityFilter('all');
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
              placeholder="e.g. Ludhiana, Dehlon"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Max Rental Rate:</span>
              <span>₹{maxPriceFilter}</span>
            </div>
            <input
              type="range"
              min="300"
              max="5000"
              step="100"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-[#176B3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Rate Type</label>
            <select
              value={pricingUnitFilter}
              onChange={(e) => setPricingUnitFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            >
              <option value="all">Hourly & Daily</option>
              <option value="per_hour">Hourly Rates Only</option>
              <option value="per_day">Daily Rates Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Equipment Availability</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            >
              <option value="all">All Machinery</option>
              <option value="available">Available Immediately</option>
            </select>
          </div>
        </div>

        {/* Machinery Cards Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-16 text-gray-400 text-xs">
              Loading agricultural machinery listings...
            </div>
          ) : machinery.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
              <Wrench className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-800">No Machinery Listings Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No equipment currently matches your filters. Try selecting a broader category or increasing the maximum price.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {machinery.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Machinery Image / Placeholder */}
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      {m.image_url ? (
                        <img
                          src={m.image_url}
                          alt={m.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Wrench className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-gray-800 shadow-xs">
                          {m.category}
                        </span>
                        {m.horse_power && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#173D2A] text-white shadow-xs">
                            {m.horse_power}
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={m.is_available ? 'available' : 'under_maintenance'} />
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 line-clamp-1">{m.title}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{m.location_district}, {m.location_state}</span>
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-2xl font-black text-[#176B3A]">
                            ₹{m.rental_price}
                          </span>
                          <span className="text-xs text-gray-500 font-normal"> /{m.pricing_unit?.replace('_', ' ')}</span>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          Owner: <span className="font-semibold text-gray-700">{m.owner?.full_name || 'Fleet Owner'}</span>
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {m.description || 'Reliable machinery available for seasonal agricultural operations.'}
                      </p>

                      {/* Inclusions */}
                      <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 pt-1">
                        <span className={`px-2 py-0.5 rounded-md ${m.includes_operator ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'bg-gray-100 text-gray-500'}`}>
                          {m.includes_operator ? '✓ Operator Included' : 'No Operator'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md ${m.includes_fuel ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'bg-gray-100 text-gray-500'}`}>
                          {m.includes_fuel ? '✓ Fuel Included' : 'Fuel by Renter'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center gap-2">
                    <Link
                      to={`/machinery/${m.id}`}
                      className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 text-center transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      disabled={!m.is_available}
                      onClick={() => handleOpenBookingModal(m)}
                      className="flex-1 py-2 rounded-xl bg-[#176B3A] text-white text-xs font-bold hover:bg-[#173D2A] text-center transition-colors shadow-2xs disabled:opacity-40"
                    >
                      Book Rental
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Workflow Modal with Conflict Prevention */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Book Agricultural Equipment</h3>
                  <p className="text-xs text-gray-500">{selectedMachine.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMachine(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#176B3A] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-gray-900">Booking Request Sent!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Owner {selectedMachine.owner?.full_name} has received your booking request for ₹{estimatedAmount.toLocaleString()}. You will be notified as soon as it is approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="mt-5 space-y-4">
                {bookingError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Rental Start Date *</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Rental End Date *</label>
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
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Estimated Duration ({unitType}) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="100"
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
                      <option value="acres">Acres</option>
                    </select>
                  </div>
                </div>

                {/* Delivery check */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={deliveryNeeded}
                      onChange={(e) => setDeliveryNeeded(e.target.checked)}
                      className="rounded text-[#176B3A] focus:ring-[#176B3A]"
                    />
                    <span>Require Machinery Transport / Delivery to Farm Gate</span>
                  </label>
                  {deliveryNeeded && (
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Specify your village field gate or delivery landmark"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rental Notes for Owner</label>
                  <textarea
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. Field is dry and ready for ploughing. Need driver by 8 AM."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                {/* Estimated Rate Box */}
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Calculated Rental Estimate:</span>
                    <span className="text-lg font-black text-blue-900">
                      ₹{estimatedAmount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-700">
                    *Estimated base rental amount at ₹{selectedMachine.rental_price}/{selectedMachine.pricing_unit}. Does not include fuel or transport unless specified above.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMachine(null)}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="flex-1 py-3 rounded-xl bg-[#176B3A] text-white text-xs font-bold hover:bg-[#173D2A] disabled:opacity-50"
                  >
                    {submittingBooking ? 'Submitting...' : 'Submit Booking'}
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
