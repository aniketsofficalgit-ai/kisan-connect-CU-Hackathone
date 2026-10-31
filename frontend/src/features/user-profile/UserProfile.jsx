import React, { useState } from 'react';
import {
  User, Phone, Mail, MapPin, ShieldCheck, Lock, Edit3,
  CheckCircle2, AlertCircle, Building2, Sprout, Tractor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../authentication/authService';
import EditProfile from './EditProfile';
import './Profile.css';

export const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters.");
      return;
    }

    setPwdLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      setPwdSuccess("Password updated successfully!");
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPwdError(err.response?.data?.error || "Failed to change password.");
    } finally {
      setPwdLoading(false);
    }
  };

  const fp = user?.farmer_profile;
  const pp = user?.partner_profile;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E2ECE0] shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#E2ECE0]">
          <div className="flex items-center gap-5">
            <div className="profile-avatar shrink-0">
              {user?.full_name?.charAt(0) || 'K'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-black text-[#20392A]">{user?.full_name}</h1>
                <span className="text-[10px] uppercase font-heading font-bold tracking-wider px-3 py-1 rounded-full bg-[#E8F1E5] text-[#347A46]">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-[#56715E] mt-1.5 flex flex-wrap items-center gap-3 font-sans">
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#68A66A]" /> {user?.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-[#68A66A]" /> {user?.phone || 'No phone added'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline text-xs py-2.5 px-5 rounded-full flex items-center gap-2 self-end sm:self-auto font-heading font-bold border-[#E2ECE0] text-[#347A46] hover:bg-[#FAF9F3]"
          >
            <Edit3 size={15} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Content / Edit Form */}
        <div className="pt-6">
          {isEditing ? (
            <EditProfile
              onSaved={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">
              {user?.role === 'farmer' && fp && (
                <>
                  <div className="profile-info-box space-y-1">
                    <span className="text-gray-400 font-heading font-bold uppercase tracking-wider text-[10px] block">Farm / Holding Name</span>
                    <span className="text-sm font-heading font-bold text-[#20392A]">{fp.farm_name || 'My Farm'}</span>
                  </div>
                  <div className="profile-info-box space-y-1">
                    <span className="text-gray-400 font-heading font-bold uppercase tracking-wider text-[10px] block">Land Holding</span>
                    <span className="text-sm font-heading font-bold text-[#20392A]">{fp.farm_size_acres} Acres</span>
                  </div>
                  <div className="profile-info-box space-y-1">
                    <span className="text-gray-400 font-heading font-bold uppercase tracking-wider text-[10px] block">Village & District</span>
                    <span className="text-sm font-heading font-bold text-[#20392A]">{fp.village || 'Local'}, {fp.district || 'Punjab'}</span>
                  </div>
                  <div className="profile-info-box space-y-1">
                    <span className="text-gray-400 font-heading font-bold uppercase tracking-wider text-[10px] block">Primary Harvest Crops</span>
                    <span className="text-sm font-heading font-bold text-[#20392A]">{Array.isArray(fp.primary_crops) ? fp.primary_crops.join(', ') : fp.primary_crops || 'Paddy, Wheat'}</span>
                  </div>
                </>
              )}

              {user?.role === 'partner' && pp && (
                <>
                  <div className="profile-info-box space-y-1">
                    <span className="text-gray-400 font-heading font-bold uppercase tracking-wider text-[10px] block">Business Organization</span>
                    <span className="text-sm font-heading font-bold text-[#20392A]">{pp.business_name}</span>
                  </div>
                  <div className="profile-info-box space-y-1">
                    <span className="text-gray-400 font-heading font-bold uppercase tracking-wider text-[10px] block">Coverage Service Area</span>
                    <span className="text-sm font-heading font-bold text-[#20392A]">{pp.service_area}</span>
                  </div>
                  <div className="profile-info-box space-y-1">
                    <span className="text-gray-400 font-heading font-bold uppercase tracking-wider text-[10px] block">Procurement Rate Policy</span>
                    <span className="text-sm font-heading font-bold text-[#347A46]">{pp.pricing_details}</span>
                  </div>
                  <div className="profile-info-box space-y-1">
                    <span className="text-gray-400 font-heading font-bold uppercase tracking-wider text-[10px] block">Operating Hours</span>
                    <span className="text-sm font-heading font-bold text-[#20392A]">{pp.operating_hours || 'Mon-Sat: 8 AM - 6 PM'}</span>
                  </div>
                </>
              )}

              {user?.role === 'admin' && (
                <div className="p-5 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0] col-span-2 text-[#20392A]">
                  <span className="font-heading font-bold text-sm block mb-1 text-[#347A46]">Administrator Privileges Active</span>
                  <p className="text-xs text-[#56715E] font-sans">
                    You have complete administrative access to approve partners, moderate all waste listings, inspect transactions, and monitor platform analytics.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl border border-[#E2ECE0] shadow-sm p-6 sm:p-8">
        <h3 className="font-heading font-black text-base text-[#20392A] mb-1 flex items-center gap-2">
          <Lock size={18} className="text-[#347A46]" /> Security & Password Update
        </h3>
        <p className="text-xs text-[#56715E] mb-5 font-sans">Ensure your account uses a secure password of at least 6 characters</p>

        {pwdSuccess && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> {pwdSuccess}
          </div>
        )}
        {pwdError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} /> {pwdError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="max-w-md space-y-4 text-xs font-sans">
          <div>
            <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-heading font-bold text-[#20392A] uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input text-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="btn-primary text-xs py-3 px-6 font-heading font-bold shadow-xs rounded-full"
          >
            {pwdLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
