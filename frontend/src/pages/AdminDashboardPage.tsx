import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Wrench, Sprout, AlertTriangle,
  Check, X, Search, Filter, ShieldAlert, FileText, CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/RoleBadge';
import { StatusBadge } from '../components/StatusBadge';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'verifications' | 'reports'>('verifications');
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [verifsList, setVerifsList] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & filter
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch {
      // Ignored
    }
  };

  const fetchVerifications = async () => {
    try {
      const res = await api.get('/admin/verifications?status_filter=all');
      setVerifsList(res.data);
    } catch {
      // Ignored
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', {
        params: {
          role: roleFilter,
          search: userSearch
        }
      });
      setUsersList(res.data);
    } catch {
      // Ignored
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports?status_filter=all');
      setReportsList(res.data);
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchStats(), fetchVerifications(), fetchUsers(), fetchReports()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [roleFilter, userSearch]);

  const handleReviewVerification = async (reqId: number, status: 'approved' | 'rejected') => {
    try {
      await api.post(`/admin/verifications/${reqId}/review`, {
        status,
        reviewer_notes: status === 'approved' ? 'Verified by Admin Team' : 'Incomplete documentation'
      });
      fetchVerifications();
      fetchStats();
    } catch (err) {
      console.error('Failed to review verification:', err);
    }
  };

  const handleToggleUserActive = async (userId: number) => {
    try {
      await api.patch(`/admin/users/${userId}/status`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Governance & Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Administrator Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Moderate user verifications, audit listing integrity, and manage active platform participants.
          </p>
        </div>
      </div>

      {/* Admin Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Total Users</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.total_users || 0}</p>
          <span className="text-[11px] text-gray-400">Farmers: {stats?.farmers_count || 0} • Workers: {stats?.workers_count || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Pending Verifications</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats?.pending_verifications || 0}</p>
          <span className="text-[11px] text-amber-700 font-semibold">Requires document audit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Machinery Fleet</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.machinery_listings_count || 0}</p>
          <span className="text-[11px] text-gray-400">{stats?.machinery_bookings_count || 0} total bookings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Crop Listings</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.crop_listings_count || 0}</p>
          <span className="text-[11px] text-gray-400">{stats?.buyer_inquiries_count || 0} purchase offers</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'verifications'
              ? 'bg-[#176B3A] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Document Verifications ({verifsList.filter(v => v.status === 'pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-[#176B3A] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          User Accounts
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-[#176B3A] text-white shadow-2xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Reports & Moderation
        </button>
      </div>

      {/* Tab 1: Verification Requests */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">User Identity Verification Requests</h3>
            <p className="text-xs text-gray-500">Inspect submitted official IDs and approve verified status.</p>
          </div>

          <div className="divide-y divide-gray-100">
            {verifsList.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">No verification requests found.</div>
            ) : (
              verifsList.map((req) => (
                <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{req.user?.full_name}</span>
                      <RoleBadge role={req.user?.role} />
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-xs text-gray-600">
                      Doc: <strong className="uppercase">{req.document_type?.replace(/_/g, ' ')}</strong> • Ref ID: <span className="font-mono font-bold text-gray-800">{req.document_number}</span>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Mobile: {req.user?.mobile_number} • District: {req.user?.district}, {req.user?.state}
                    </p>
                  </div>

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReviewVerification(req.id, 'approved')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve ID</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewVerification(req.id, 'rejected')}
                        className="px-3.5 py-1.5 rounded-xl border border-red-300 text-red-700 bg-red-50 text-xs font-bold hover:bg-red-100 flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 italic">
                      Reviewed: {req.reviewer_notes || req.status}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by user name, phone, or district..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
            >
              <option value="all">All Roles</option>
              <option value="farmer">Farmers</option>
              <option value="worker">Agricultural Workers</option>
              <option value="machinery_owner">Machinery Owners</option>
              <option value="buyer">Produce Buyers</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{u.full_name}</td>
                    <td className="p-3"><RoleBadge role={u.role} size="sm" /></td>
                    <td className="p-3 text-gray-600">{u.mobile_number}</td>
                    <td className="p-3 text-gray-600">{u.district}, {u.state}</td>
                    <td className="p-3"><StatusBadge status={u.verification_status} /></td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleUserActive(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          u.is_active
                            ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {u.is_active ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-900">Platform Complaints & Moderation Reports</h3>
          {reportsList.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No open user or listing reports filed.</p>
          ) : (
            <div className="space-y-3">
              {reportsList.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Reason: {rep.reason}</span>
                    <StatusBadge status={rep.status} />
                  </div>
                  <p className="text-gray-600">{rep.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
