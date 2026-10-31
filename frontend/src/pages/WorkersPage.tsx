import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, MapPin, Calendar, Clock,
  ShieldCheck, Star, ArrowRight, UserPlus, X, AlertCircle, CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { WorkerProfile, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';

export const WorkersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [skillFilter, setSkillFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [maxWageFilter, setMaxWageFilter] = useState<number>(1000);
  const [isGroupFilter, setIsGroupFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Request Modal State
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);
  const [workType, setWorkType] = useState('Harvesting');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationDays, setDurationDays] = useState(2);
  const [workersCount, setWorkersCount] = useState(1);
  const [proposedWage, setProposedWage] = useState(600);
  const [locationStr, setLocationStr] = useState(user?.village ? `${user.village}, ${user.district}` : 'Ludhiana Field Block');
  const [notes, setNotes] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (skillFilter) params.skill = skillFilter;
      if (districtFilter) params.district = districtFilter;
      if (maxWageFilter) params.max_wage = maxWageFilter;
      if (isGroupFilter !== 'all') params.is_group = isGroupFilter === 'group';
      if (availabilityFilter !== 'all') params.is_available = availabilityFilter === 'available';
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/workers', { params });
      setWorkers(res.data);
    } catch (err) {
      console.error('Failed to load workers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [skillFilter, districtFilter, maxWageFilter, isGroupFilter, availabilityFilter]);

  const handleOpenRequestModal = (worker: any) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedWorker(worker);
    setProposedWage(worker.expected_wage || 600);
    setWorkersCount(worker.is_group ? worker.group_size || 4 : 1);
    setRequestSuccess(false);
    setRequestError(null);
  };

  const handleSubmitWorkerRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;

    setSubmittingReq(true);
    setRequestError(null);

    try {
      await api.post('/requests/worker', {
        worker_id: selectedWorker.user_id,
        work_type: workType,
        start_date: startDate,
        duration_days: durationDays,
        workers_count: workersCount,
        location: locationStr,
        proposed_wage: proposedWage,
        wage_unit: selectedWorker.wage_unit || 'per_day',
        notes
      });
      setRequestSuccess(true);
      setTimeout(() => {
        setSelectedWorker(null);
        setRequestSuccess(false);
      }, 2500);
    } catch (err: any) {
      setRequestError(err.response?.data?.detail || 'Failed to submit request.');
    } finally {
      setSubmittingReq(false);
    }
  };

  const estimatedTotal = proposedWage * durationDays * workersCount;

  const popularSkills = [
    'All', 'Harvesting', 'Sowing', 'Tractor Driving', 'Spraying',
    'Paddy Transplantation', 'Drip Irrigation', 'Tilling', 'Weeding'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
            <Users className="w-4 h-4" />
            <span>Farm Manpower Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Find Agricultural Workers & Labor Teams
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Connect directly with skilled farmhands, harvesting teams, and machinery operators in your district.
          </p>
        </div>

        {user?.role === 'worker' && (
          <Link
            to="/workers/my-profile"
            className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors w-fit"
          >
            Edit My Worker Profile & Rates
          </Link>
        )}
      </div>

      {/* Search & Skill Chips */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWorkers()}
              placeholder="Search by worker name, village, or skill..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="button"
            onClick={fetchWorkers}
            className="px-6 py-2.5 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors"
          >
            Search Workers
          </button>
        </div>

        {/* Skill Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {popularSkills.map((sk) => {
            const isSelected = (sk === 'All' && !skillFilter) || skillFilter === sk;
            return (
              <button
                key={sk}
                type="button"
                onClick={() => setSkillFilter(sk === 'All' ? '' : sk)}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#176B3A] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sk}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-5 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </span>
            <button
              onClick={() => {
                setSkillFilter('');
                setDistrictFilter('');
                setMaxWageFilter(1000);
                setIsGroupFilter('all');
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
              placeholder="e.g. Ludhiana, Khanna"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Max Daily Wage:</span>
              <span>₹{maxWageFilter}</span>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={maxWageFilter}
              onChange={(e) => setMaxWageFilter(Number(e.target.value))}
              className="w-full accent-[#176B3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Worker Type</label>
            <select
              value={isGroupFilter}
              onChange={(e) => setIsGroupFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            >
              <option value="all">Individual & Groups</option>
              <option value="individual">Individual Worker Only</option>
              <option value="group">Labor Team / Group</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Availability Status</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            >
              <option value="all">All Workers</option>
              <option value="available">Available Now</option>
            </select>
          </div>
        </div>

        {/* Worker Cards Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-16 text-gray-400 text-xs">
              Loading verified agricultural workers...
            </div>
          ) : workers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
              <Users className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-800">No Workers Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No workers currently match your active filters. Try increasing the max wage slider or clearing the skill filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workers.map((w) => {
                const workerUser = w.user;
                return (
                  <div
                    key={w.id}
                    className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Worker Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#176B3A] flex items-center justify-center font-bold text-base shadow-2xs">
                            {workerUser?.full_name?.charAt(0) || 'W'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-sm text-gray-900">{workerUser?.full_name}</h3>
                              {workerUser?.verification_status === 'verified' && (
                                <span title="Verified Worker ID">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{workerUser?.district}, {workerUser?.state}</span>
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            w.is_available
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {w.is_available ? 'Available' : 'Busy'}
                        </span>
                      </div>

                      {/* Wage & Rating Bar */}
                      <div className="mt-4 p-2.5 rounded-2xl bg-gray-50 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 block">Expected Wage</span>
                          <span className="font-extrabold text-[#176B3A] text-sm">
                            ₹{w.expected_wage} <span className="text-[10px] font-normal text-gray-600">/{w.wage_unit?.replace('_', ' ')}</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-500 block">Experience</span>
                          <span className="font-bold text-gray-800">{w.experience_years} years</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="mt-3.5 space-y-1">
                        <span className="text-[11px] font-bold text-gray-500 block">Agricultural Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {w.skills?.split(',').map((sk: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#176B3A] border border-emerald-200/60"
                            >
                              {sk.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {w.is_group && (
                        <div className="mt-2.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block font-semibold">
                          Labor Team: {w.group_size} Workers Available
                        </div>
                      )}

                      {/* Rating */}
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                        <StarRating rating={w.rating_average || 4.8} reviewCount={w.review_count || 5} />
                        <span className="text-[11px] text-gray-500">{w.completed_jobs_count || 12} jobs done</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <Link
                        to={`/workers/${w.id}`}
                        className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 text-center transition-colors"
                      >
                        View Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenRequestModal(w)}
                        className="flex-1 py-2 rounded-xl bg-[#176B3A] text-white text-xs font-bold hover:bg-[#173D2A] text-center transition-colors shadow-2xs"
                      >
                        Request Worker
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Request Worker Workflow Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#176B3A] flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Request Agricultural Worker</h3>
                  <p className="text-xs text-gray-500">To {selectedWorker.user?.full_name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#176B3A] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-gray-900">Work Request Submitted!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  {selectedWorker.user?.full_name} has received your job notification and proposed wage. You can track updates in your Requests page.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitWorkerRequest} className="mt-5 space-y-4">
                {requestError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                    <span>{requestError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type of Agricultural Work *</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="Wheat Harvesting & Stacking">Wheat Harvesting & Stacking</option>
                    <option value="Paddy Transplantation">Paddy Transplantation</option>
                    <option value="Tractor Cultivation / Ploughing">Tractor Cultivation / Ploughing</option>
                    <option value="Pesticide / Fertilizer Spraying">Pesticide / Fertilizer Spraying</option>
                    <option value="Manual Weeding & Hoeing">Manual Weeding & Hoeing</option>
                    <option value="Orchard Pruning & Harvesting">Orchard Pruning & Harvesting</option>
                    <option value="Drip Irrigation Installation">Drip Irrigation Installation</option>
                  </select>
                </div>

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
                    <label className="block text-xs font-bold text-gray-700 mb-1">Duration (Days) *</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Number of Workers *</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={workersCount}
                      onChange={(e) => setWorkersCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Proposed Wage (₹/day) *</label>
                    <input
                      type="number"
                      step="25"
                      min="100"
                      value={proposedWage}
                      onChange={(e) => setProposedWage(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Work Location / Field Address *</label>
                  <input
                    type="text"
                    required
                    value={locationStr}
                    onChange={(e) => setLocationStr(e.target.value)}
                    placeholder="e.g. Sahnewal Field Block #3, Ludhiana"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Instructions / Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please bring sickles. Lunch and drinking water provided."
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                {/* Calculation Summary Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
                  <div>
                    <span className="font-semibold block">Total Estimated Payout:</span>
                    <span className="text-[11px] text-emerald-700">
                      {durationDays} day(s) × {workersCount} worker(s) @ ₹{proposedWage}/day
                    </span>
                  </div>
                  <span className="text-lg font-black text-[#176B3A]">
                    ₹{estimatedTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedWorker(null)}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReq}
                    className="flex-1 py-3 rounded-xl bg-[#176B3A] text-white text-xs font-bold hover:bg-[#173D2A] disabled:opacity-50"
                  >
                    {submittingReq ? 'Submitting...' : 'Send Work Request'}
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
