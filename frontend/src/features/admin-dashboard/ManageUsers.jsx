import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle2, XCircle, Shield } from 'lucide-react';
import api from '../../services/api';
import Loading from '../../components/Loading/Loading';

export const ManageUsers = ({ onUserUpdated }) => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users${roleFilter ? `?role=${roleFilter}` : ''}`);
      setUsers(res.data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      alert("Failed to toggle status.");
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-[#EAF3E8] shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAF3E8]">
        <div>
          <h3 className="font-heading font-black text-lg text-[#26372C] flex items-center gap-2">
            <Users size={20} className="text-[#2F7D4A]" /> User Accounts Management
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 font-sans">
            Oversee farmer, aggregator, and partner credentials and access status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAFBF9] border border-[#DCE4D9] rounded-xl text-xs font-heading font-bold"
          >
            <option value="">All Roles</option>
            <option value="farmer">Farmers</option>
            <option value="partner">Recycling Partners</option>
            <option value="admin">Administrators</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="px-3 py-2 bg-[#FAFBF9] border border-[#DCE4D9] rounded-xl text-xs font-sans"
          />
        </div>
      </div>

      {loading ? (
        <Loading message="Loading user directory..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left admin-table">
            <thead>
              <tr>
                <th>User / Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right">Access Control</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAFBF9]">
                  <td className="font-heading font-bold text-[#26372C]">
                    <div>
                      <span>{u.full_name}</span>
                      <span className="block text-[11px] text-gray-400 font-sans font-normal">{u.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF3E8] text-[#2F7D4A]">
                      {u.role}
                    </span>
                  </td>
                  <td className="text-gray-600 text-xs font-sans">{u.phone || 'N/A'}</td>
                  <td>
                    <span className={`text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full ${u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {u.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="text-gray-400 text-xs font-sans">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'N/A'}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`text-[11px] font-heading font-bold px-3 py-1 rounded-lg border transition-colors ${
                        u.is_active
                          ? 'text-red-700 border-red-200 hover:bg-red-50'
                          : 'text-[#2F7D4A] border-[#EAF3E8] hover:bg-[#EAF3E8]'
                      }`}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
