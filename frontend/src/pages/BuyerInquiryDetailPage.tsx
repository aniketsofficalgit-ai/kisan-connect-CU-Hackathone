import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sprout, Calendar, MapPin, ArrowLeft, CheckCircle2, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const BuyerInquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiry = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/requests/crop-inquiry/my');
        const found = res.data.find((item: any) => String(item.id) === String(id));
        setInquiry(found || null);
      } catch (err) {
        console.error('Failed to load inquiry:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchInquiry();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-gray-500">Loading purchase offer...</div>;
  }

  if (!inquiry) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Purchase Offer Not Found</h3>
        <Link to="/requests?type=crop" className="text-xs text-[#176B3A] font-bold underline">
          Back to Offers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/requests?type=crop" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#176B3A]">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Crop Inquiries</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">Purchase Offer #{inquiry.id}</h1>
              <StatusBadge status={inquiry.status} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Produce: <strong className="text-gray-800">{inquiry.crop?.crop_name}</strong> ({inquiry.crop?.quality_grade})
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-500 block">Total Offer Valuation</span>
            <span className="text-2xl font-black text-[#176B3A]">
              ₹{inquiry.total_proposed_amount?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Offer Specifics</h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Requested Volume:</span>
              <span className="font-bold">{inquiry.requested_quantity} {inquiry.quantity_unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Proposed Rate:</span>
              <span className="font-bold">₹{inquiry.proposed_price}/{inquiry.price_unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Logistics Preference:</span>
              <span className="font-bold capitalize">{inquiry.delivery_preference?.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Buyer Details</h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Buyer Name:</span>
              <span className="font-bold">{inquiry.buyer?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Buyer District:</span>
              <span className="font-bold">{inquiry.buyer?.district}, {inquiry.buyer?.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Farm Location:</span>
              <span className="font-bold">{inquiry.crop?.district}</span>
            </div>
          </div>
        </div>

        {inquiry.message && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <span className="font-bold block">Buyer Message:</span>
            <p>{inquiry.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
