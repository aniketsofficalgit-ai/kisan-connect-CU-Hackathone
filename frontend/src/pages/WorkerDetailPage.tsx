import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users, MapPin, ShieldCheck, Star, Calendar, Clock,
  ArrowLeft, MessageSquare, CheckCircle2, UserPlus, Phone
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';

export const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorker = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/workers/${id}`);
        setWorker(res.data);

        // Fetch reviews
        if (res.data.user_id) {
          const revRes = await api.get(`/reviews/user/${res.data.user_id}`);
          setReviews(revRes.data);
        }
      } catch (err) {
        console.error('Failed to load worker profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchWorker();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-gray-500">Loading worker profile...</div>;
  }

  if (!worker) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Worker Profile Not Found</h3>
        <Link to="/workers" className="text-xs text-[#176B3A] font-bold underline">
          Back to Workers List
        </Link>
      </div>
    );
  }

  const workerUser = worker.user;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/workers" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#176B3A]">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Workers Directory</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#176B3A] flex items-center justify-center font-bold text-2xl shadow-xs">
              {workerUser?.full_name?.charAt(0) || 'W'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">{workerUser?.full_name}</h1>
                {workerUser?.verification_status === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified ID
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {workerUser?.village ? `${workerUser.village}, ` : ''}{workerUser?.district}, {workerUser?.state}
                </span>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-500 block">Expected Daily Wage</span>
            <span className="text-2xl font-black text-[#176B3A]">
              ₹{worker.expected_wage} <span className="text-xs font-normal text-gray-600">/{worker.wage_unit?.replace('_', ' ')}</span>
            </span>
          </div>
        </div>

        {/* Bio & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">About This Agricultural Worker</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {workerUser?.bio || 'Experienced agricultural farm worker available for seasonal sowing, field management, and harvesting activities.'}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Specialized Agricultural Skills</h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills?.split(',').map((sk: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-emerald-50 text-[#176B3A] border border-emerald-200 text-xs font-semibold"
                  >
                    ✓ {sk.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                Farmer Reviews ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-400">No public reviews yet for this worker.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{rev.reviewer?.full_name || 'Verified Farmer'}</span>
                        <StarRating rating={rev.rating} showCount={false} size="sm" />
                      </div>
                      <p className="text-gray-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info Card */}
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 h-fit">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">Work Specs</h4>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Experience:</span>
                <span className="font-bold">{worker.experience_years} Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Availability:</span>
                <span className={`font-bold ${worker.is_available ? 'text-emerald-700' : 'text-gray-500'}`}>
                  {worker.is_available ? '● Available' : '○ Busy'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Group/Team:</span>
                <span className="font-bold">{worker.is_group ? `Yes (${worker.group_size} members)` : 'Individual'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Preferred Area:</span>
                <span className="font-bold text-right">{worker.preferred_work_area || workerUser?.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jobs Completed:</span>
                <span className="font-bold">{worker.completed_jobs_count}</span>
              </div>
            </div>

            <Link
              to="/workers"
              className="w-full py-3 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] text-center block transition-colors shadow-2xs"
            >
              Request Work on Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
