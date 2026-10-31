import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Clock, CheckCircle2, XCircle, Users, Wrench, Sprout,
  Filter, AlertCircle, MessageSquare, ChevronRight, Check, X
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeParam = searchParams.get('type') || 'all';
  const statusParam = searchParams.get('status') || 'all';

  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchUnifiedRequests = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/requests/all-unified', {
        params: {
          request_type: typeParam,
          status_filter: statusParam
        }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load unified requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnifiedRequests();
  }, [typeParam, statusParam]);

  const handleUpdateStatus = async (type: string, id: number, nextStatus: string) => {
    setActionLoading(id);
    setActionError(null);
    try {
      if (type === 'worker_request') {
        await api.patch(`/requests/worker/${id}/status`, {
          status: nextStatus,
          response_note: `Updated to ${nextStatus} by user`
        });
      } else if (type === 'machinery_booking') {
        await api.patch(`/requests/machinery/${id}/status`, {
          status: nextStatus,
          owner_response_note: `Status updated to ${nextStatus}`
        });
      } else if (type === 'crop_inquiry') {
        await api.patch(`/requests/crop-inquiry/${id}/status`, {
          status: nextStatus,
          farmer_response_note: `Offer ${nextStatus}`
        });
      }
      fetchUnifiedRequests();
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Failed to update request status.');
    } finally {
      setActionLoading(null);
    }
  };

  const getIcon = (type: string) => {
    if (type === 'worker_request') return Users;
    if (type === 'machinery_booking') return Wrench;
    return Sprout;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
          <Clock className="w-4 h-4" />
          <span>Unified Management Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Requests, Bookings & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Track and respond to agricultural labor requests, machinery rentals, and crop procurement offers.
        </p>
      </div>

      {actionError && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Type & Status Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Type selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'worker', label: 'Labor Requests' },
            { id: 'machinery', label: 'Machinery Bookings' },
            { id: 'crop', label: 'Crop Inquiries' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                searchParams.set('type', t.id);
                setSearchParams(searchParams);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                typeParam === t.id
                  ? 'bg-[#176B3A] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-gray-500">Status:</span>
          <select
            value={statusParam}
            onChange={(e) => {
              searchParams.set('status', e.target.value);
              setSearchParams(searchParams);
            }}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted / Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20 text-xs text-gray-400">Loading interactions...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
            <Clock className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">No Requests Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You currently have no interactions matching the selected type and status.
            </p>
          </div>
        ) : (
          requests.map((item) => {
            const Icon = getIcon(item.type);
            const isPending = item.status === 'pending';
            const isRecipient = !item.is_sender;

            return (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#176B3A] flex items-center justify-center shrink-0 border border-emerald-200">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-gray-900">{item.title}</h3>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="text-xs text-gray-600">
                      Party: <strong className="text-gray-800">{item.other_party}</strong> • {item.details}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-0.5">
                      <span>Date/Period: {item.date}</span>
                      <span>Location: {item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-gray-400 block uppercase">Total Amount</span>
                    <span className="text-lg font-black text-[#176B3A]">
                      ₹{item.amount?.toLocaleString()}
                    </span>
                  </div>

                  {/* Accept / Reject actions if recipient and pending */}
                  {isPending && isRecipient ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionLoading === item.id}
                        onClick={() => handleUpdateStatus(item.type, item.id, item.type === 'machinery_booking' ? 'approved' : 'accepted')}
                        className="px-3.5 py-2 rounded-xl bg-[#176B3A] text-white text-xs font-bold hover:bg-[#173D2A] transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === item.id}
                        onClick={() => handleUpdateStatus(item.type, item.id, 'rejected')}
                        className="px-3.5 py-2 rounded-xl border border-red-300 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : item.status === 'accepted' || item.status === 'approved' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionLoading === item.id}
                        onClick={() => handleUpdateStatus(item.type, item.id, 'completed')}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Mark Completed
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
