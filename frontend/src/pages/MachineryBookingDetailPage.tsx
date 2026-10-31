import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Wrench, Calendar, MapPin, Clock, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const MachineryBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/requests/machinery/my');
        const found = res.data.find((b: any) => String(b.id) === String(id));
        setBooking(found || null);
      } catch (err) {
        console.error('Failed to load booking details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchBooking();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-gray-500">Loading booking telemetry...</div>;
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Booking Record Not Found</h3>
        <Link to="/requests?type=machinery" className="text-xs text-[#176B3A] font-bold underline">
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/requests?type=machinery" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#176B3A]">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Bookings</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">Machinery Booking #{booking.id}</h1>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Equipment: <strong className="text-gray-800">{booking.machinery?.title}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-500 block">Total Rental Amount</span>
            <span className="text-2xl font-black text-[#176B3A]">
              ₹{booking.estimated_amount?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Rental Schedule</h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Period:</span>
              <span className="font-bold">{booking.start_date} to {booking.end_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration Units:</span>
              <span className="font-bold">{booking.rental_units} {booking.unit_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Farm Gate Delivery:</span>
              <span className="font-bold">{booking.delivery_needed ? 'Requested' : 'No'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Parties & Location</h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Renting Farmer:</span>
              <span className="font-bold">{booking.farmer?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Machinery Location:</span>
              <span className="font-bold">{booking.machinery?.location_district}</span>
            </div>
            {booking.delivery_address && (
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Address:</span>
                <span className="font-bold text-right">{booking.delivery_address}</span>
              </div>
            )}
          </div>
        </div>

        {booking.owner_response_note && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold block">Owner Note:</span>
            <p>{booking.owner_response_note}</p>
          </div>
        )}
      </div>
    </div>
  );
};
