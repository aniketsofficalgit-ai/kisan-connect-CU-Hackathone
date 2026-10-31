import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Wrench, Sprout, CloudSun, Mic, ArrowRight,
  MapPin, CheckCircle, Clock, AlertTriangle, ShieldCheck,
  Bell, Plus, TrendingUp, Calendar, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RoleBadge } from '../components/RoleBadge';
import { StatusBadge } from '../components/StatusBadge';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';
import api from '../services/api';
import { WeatherData } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // For worker availability toggle
  const [isAvailableWorker, setIsAvailableWorker] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, weatherRes, reqsRes] = await Promise.all([
          api.get('/users/dashboard-stats'),
          api.get(`/weather?district=${encodeURIComponent(user?.district || 'Ludhiana')}`),
          api.get('/requests/all-unified?status_filter=pending')
        ]);
        setStats(statsRes.data);
        setWeather(weatherRes.data);
        setRecentRequests(reqsRes.data.slice(0, 4));

        if (statsRes.data.is_available !== undefined) {
          setIsAvailableWorker(statsRes.data.is_available);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleToggleWorkerAvailability = async () => {
    try {
      const nextState = !isAvailableWorker;
      await api.put('/workers/my-profile', { is_available: nextState });
      setIsAvailableWorker(nextState);
    } catch {
      // Ignored
    }
  };

  const farmerQuickActions = [
    { label: t('findWorkers'), desc: 'Hire skilled farm labor', icon: Users, path: '/workers', color: 'bg-emerald-50 text-emerald-800' },
    { label: t('rentMachinery'), desc: 'Book tractors & tools', icon: Wrench, path: '/machinery', color: 'bg-blue-50 text-blue-800' },
    { label: t('sellCrops'), desc: 'List harvest for buyers', icon: Sprout, path: '/crops/create', color: 'bg-amber-50 text-amber-800' },
    { label: t('weather'), desc: 'Live spray advisories', icon: CloudSun, path: '/weather', color: 'bg-purple-50 text-purple-800' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#173D2A] to-[#176B3A] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
              Personalized Dashboard
            </span>
            {user && <RoleBadge role={user.role} size="sm" />}
            {user?.verification_status === 'verified' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 text-emerald-200 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                Verified Account
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              {user?.village ? `${user.village}, ` : ''}{user?.district}, {user?.state}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Prominent Voice Assistant Button */}
          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white text-[#173D2A] font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-md hover:scale-102"
          >
            <Mic className="w-4 h-4 text-[#176B3A] animate-pulse" />
            <span>Ask Agri AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {user?.role === 'farmer' && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Active Labor Requests</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{stats?.active_worker_requests || 0}</p>
              <Link to="/requests?type=worker" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                View status →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Machinery Bookings</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{stats?.active_machinery_bookings || 0}</p>
              <Link to="/requests?type=machinery" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                View rentals →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">My Crop Listings</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{stats?.my_crop_listings || 0}</p>
              <Link to="/crops" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                Manage listings →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Buyer Inquiries</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{stats?.incoming_buyer_inquiries || 0}</p>
              <Link to="/requests?type=crop" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                Review offers →
              </Link>
            </div>
          </>
        )}

        {user?.role === 'worker' && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Pending Job Offers</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{stats?.pending_requests || 0}</p>
              <Link to="/requests" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                Respond to jobs →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Upcoming Confirmed Jobs</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{stats?.upcoming_jobs || 0}</p>
              <Link to="/requests" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                View schedule →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Work Availability</span>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleWorkerAvailability}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    isAvailableWorker
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  {isAvailableWorker ? '● Available for Work' : '○ Currently Busy'}
                </button>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Completed Jobs</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{stats?.completed_jobs || 0}</p>
              <p className="text-xs text-gray-500 mt-1">★ {stats?.rating_average || 0.0} avg rating</p>
            </div>
          </>
        )}

        {user?.role === 'machinery_owner' && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Equipment in Fleet</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{stats?.total_machinery || 0}</p>
              <Link to="/machinery/create" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                + Add Equipment
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Pending Bookings</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{stats?.pending_bookings || 0}</p>
              <Link to="/requests?type=machinery" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                Approve requests →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Active Rentals</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{stats?.active_rentals || 0}</p>
              <Link to="/requests?type=machinery" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                View calendar →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Completed Rentals</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{stats?.completed_rentals || 0}</p>
            </div>
          </>
        )}

        {user?.role === 'buyer' && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Active Inquiries</span>
              <p className="text-2xl font-black text-purple-700 mt-1">{stats?.active_inquiries || 0}</p>
              <Link to="/requests?type=crop" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                Track offers →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Accepted Deals</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{stats?.accepted_deals || 0}</p>
              <Link to="/requests?type=crop" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                Coordinate pickup →
              </Link>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Completed Purchases</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{stats?.completed_purchases || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500">Market Crops</span>
              <p className="text-2xl font-black text-gray-900 mt-1">Explore</p>
              <Link to="/crops" className="text-xs text-[#176B3A] font-bold hover:underline mt-2 inline-block">
                Browse catalogue →
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Main Section: Quick Actions & Live Weather Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {farmerQuickActions.map((qa, i) => {
                const Icon = qa.icon;
                return (
                  <Link
                    key={i}
                    to={qa.path}
                    className="p-5 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xs transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${qa.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#176B3A] transition-colors">
                          {qa.label}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{qa.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#176B3A] transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pending Interactions & Activity */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Recent Requests & Bookings</h3>
                <p className="text-xs text-gray-500">Pending interactions requiring attention</p>
              </div>
              <Link to="/requests" className="text-xs font-bold text-[#176B3A] hover:underline">
                View All →
              </Link>
            </div>

            {recentRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-xs">No pending requests at the moment.</p>
                <Link
                  to="/workers"
                  className="mt-3 inline-block px-4 py-2 bg-emerald-50 text-[#176B3A] font-bold text-xs rounded-xl hover:bg-emerald-100"
                >
                  Explore Agricultural Services
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentRequests.map((req, rIdx) => (
                  <div key={rIdx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{req.title}</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-gray-600">
                        With <span className="font-semibold">{req.other_party}</span> • {req.details}
                      </p>
                      <p className="text-[11px] text-gray-400">{req.date} • ₹{req.amount.toLocaleString()}</p>
                    </div>
                    <Link
                      to="/requests"
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 shrink-0"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Weather & Advisory Widget (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-gray-900">Local Weather & Advisory</h3>
              </div>
              <Link to="/weather" className="text-xs font-bold text-[#176B3A] hover:underline">
                Full Forecast →
              </Link>
            </div>

            {weather ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-gray-900">
                      {weather.current_temperature}°C
                    </span>
                    <p className="text-xs text-gray-500">Feels like {weather.feels_like}°C • {weather.weather_condition}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-800">{weather.district}</span>
                    <p className="text-[11px] text-gray-400">{weather.state}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 text-center text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Humidity</span>
                    <span className="font-bold text-gray-800">{weather.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Rain Chance</span>
                    <span className="font-bold text-gray-800">{weather.rain_probability}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Wind Speed</span>
                    <span className="font-bold text-gray-800">{weather.wind_speed} km/h</span>
                  </div>
                </div>

                {/* Practical Agricultural Advisory */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    <span>Agronomic Field Advisory</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {weather.agricultural_advisory}
                  </p>
                  <div className="pt-1 text-[11px] font-semibold text-emerald-800 flex items-center justify-between">
                    <span>Spraying: {weather.spraying_suitability}</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400 text-center">
                  Live data via {weather.source}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-400">Loading live weather data...</div>
            )}
          </div>

          {/* AI Voice Assistant Prompt Banner */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#176B3A] text-white flex items-center justify-center">
                <Mic className="w-4 h-4 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">Have an Agriculture Question?</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Speak naturally in Hindi, Punjabi, or English to check pest advice, fertilizer timing, or machinery costs.
            </p>
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors shadow-2xs"
            >
              Start Voice Conversation
            </button>
          </div>
        </div>
      </div>

      <VoiceAssistantModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
    </div>
  );
};
