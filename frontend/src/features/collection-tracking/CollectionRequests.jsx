import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, Search, Filter, Calendar, MapPin, ArrowRight,
  Clock, CheckCircle2, AlertCircle, XCircle, Tractor, Building2
} from 'lucide-react';
import collectionService from './collectionService';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import './Collection.css';

export const CollectionRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await collectionService.getRequests();
      setRequests(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status.toUpperCase() === filterStatus;
    const matchesSearch =
      r.request_number?.toLowerCase().includes(search.toLowerCase()) ||
      r.listing_title?.toLowerCase().includes(search.toLowerCase()) ||
      (r.partner_business_name && r.partner_business_name.toLowerCase().includes(search.toLowerCase())) ||
      (r.farmer_name && r.farmer_name.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECE0]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-heading font-bold text-[#347A46] bg-[#E8F1E5] px-3.5 py-1 rounded-full uppercase tracking-wider">
              Logistics & Fulfilment
            </span>
            <span className="text-xs font-semibold text-[#56715E]">
              {filteredRequests.length} Total Orders
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-[#20392A] tracking-tight flex items-center gap-2.5">
            <Truck size={30} className="text-[#347A46]" /> Collection Requests & Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-[#56715E] mt-1.5 font-sans">
            Monitor farm waste pickup dispatches, scheduled dates, and completion status
          </p>
        </div>

        {user?.role === 'farmer' && (
          <Link
            to="/find-partners"
            className="btn-primary text-xs sm:text-sm px-6 py-3 rounded-full shadow-xs self-start sm:self-auto font-heading font-bold"
          >
            + New Collection Request
          </Link>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#E2ECE0] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0 text-xs font-heading font-bold">
          {['ALL', 'PENDING', 'ACCEPTED', 'SCHEDULED', 'PICKED UP', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#347A46] text-white shadow-xs'
                  : 'bg-[#FAF9F3] text-[#56715E] hover:bg-[#E8F1E5] hover:text-[#347A46]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search request #, crop, partner..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#347A46] focus:bg-white text-[#20392A]"
          />
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <Loading message="Loading collection requests and dispatch schedule..." />
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2ECE0] p-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center mx-auto mb-4">
            <Truck size={30} />
          </div>
          <h3 className="font-heading font-extrabold text-[#20392A] text-lg">No Collection Requests Found</h3>
          <p className="text-xs sm:text-sm text-[#56715E] max-w-md mx-auto mt-2 font-sans leading-relaxed">
            {filterStatus === 'ALL'
              ? 'You have not initiated or received any agricultural waste collection requests yet.'
              : `No orders currently matching the '${filterStatus}' filter status.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="collection-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-black text-sm text-[#347A46]">
                    {req.request_number}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold bg-[#E8F1E5] text-[#347A46] uppercase tracking-wider">
                    {req.status}
                  </span>
                  <span className="text-[11px] text-[#56715E] font-sans">
                    • {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-[#20392A]">
                  {req.listing_title} ({req.quantity} {req.unit})
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#56715E] font-sans">
                  <span>
                    <strong className="text-[#20392A] font-semibold">{user?.role === 'partner' ? 'Farmer:' : 'Partner:'}</strong>{' '}
                    {user?.role === 'partner' ? req.farmer_name : req.partner_business_name}
                  </span>
                  {req.scheduled_pickup_date && (
                    <span className="flex items-center gap-1.5 text-[#347A46] font-semibold bg-[#E8F1E5] px-3 py-1 rounded-lg">
                      <Clock size={13} className="text-[#68A66A]" /> Scheduled: {req.scheduled_pickup_date}
                    </span>
                  )}
                  {req.offered_price > 0 && (
                    <span className="font-heading font-extrabold text-[#347A46]">
                      Amount: ₹{req.offered_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <Link
                  to={`/collection-details/${req.id}`}
                  className="btn-primary text-xs py-2.5 px-5 rounded-full flex items-center gap-2 shadow-xs font-heading font-bold"
                >
                  Track Order Timeline <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionRequests;
