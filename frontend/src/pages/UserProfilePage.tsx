import React, { useState, useEffect } from 'react';
import {
  User as UserIcon, MapPin, Phone, Mail, ShieldCheck,
  Globe, AlertCircle, CheckCircle2, Upload, FileText
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/RoleBadge';

export const UserProfilePage: React.FC = () => {
  const { user, updateUserLocally } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [village, setVillage] = useState(user?.village || '');
  const [town, setTown] = useState(user?.town || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [state, setState] = useState(user?.state || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [preferredLang, setPreferredLang] = useState(user?.preferred_language || 'en');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Verification request state
  const [verifModal, setVerifModal] = useState(false);
  const [docType, setDocType] = useState('kisan_credit_card');
  const [docNumber, setDocNumber] = useState('');
  const [submittingVerif, setSubmittingVerif] = useState(false);
  const [verifStatusMsg, setVerifStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setEmail(user.email || '');
      setVillage(user.village || '');
      setTown(user.town || '');
      setDistrict(user.district);
      setState(user.state);
      setBio(user.bio || '');
      setPreferredLang(user.preferred_language || 'en');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await api.put('/users/profile', {
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        village: village.trim() || undefined,
        town: town.trim() || undefined,
        district: district.trim(),
        state: state.trim(),
        bio: bio.trim() || undefined,
        preferred_language: preferredLang
      });
      updateUserLocally(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    setSubmittingVerif(true);
    setVerifStatusMsg(null);

    try {
      await api.post('/users/verification/submit', {
        document_type: docType,
        document_number: docNumber.trim()
      });
      updateUserLocally({ verification_status: 'pending' });
      setVerifStatusMsg('Verification documents submitted successfully for administrative audit.');
      setTimeout(() => setVerifModal(false), 2500);
    } catch (err: any) {
      setVerifStatusMsg(err.response?.data?.detail || 'Verification submission error.');
    } finally {
      setSubmittingVerif(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
          <UserIcon className="w-4 h-4" />
          <span>Account & Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Manage your contact information, location coordinates, and verification badges.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#176B3A] text-white flex items-center justify-center font-extrabold text-2xl shadow-xs">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
              {user && <RoleBadge role={user.role} />}
            </div>
            <p className="text-xs text-gray-500">{user?.mobile_number} • {user?.district}, {user?.state}</p>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs w-full sm:w-auto text-center sm:text-right">
          <span className="text-[10px] text-gray-400 block uppercase font-bold">Verification Status</span>
          {user?.verification_status === 'verified' ? (
            <span className="font-bold text-emerald-700 flex items-center justify-center sm:justify-end gap-1 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Account</span>
            </span>
          ) : user?.verification_status === 'pending' ? (
            <span className="font-bold text-amber-700 mt-0.5 block">Audit Under Review</span>
          ) : (
            <div className="mt-1">
              <span className="font-bold text-gray-600 block mb-1">Not Verified</span>
              <button
                type="button"
                onClick={() => setVerifModal(true)}
                className="px-3 py-1 bg-[#176B3A] text-white text-[11px] font-bold rounded-lg hover:bg-[#173D2A]"
              >
                Submit Verification
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
          Edit Profile Information
        </h3>

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile changes saved successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (Read-Only)</label>
              <input
                type="text"
                disabled
                value={user?.mobile_number || ''}
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Language</label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Town</label>
              <input
                type="text"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Bio / Farming Practice Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other farmers or buyers about your crops, acreage, or equipment."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Verification Modal */}
      {verifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="font-bold text-base text-gray-900 mb-2">Submit Document for Verification</h3>
            <p className="text-xs text-gray-500 mb-4">
              Kisan Connect validates official documents before granting the verified farmer badge.
            </p>

            {verifStatusMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {verifStatusMsg}
              </div>
            )}

            <form onSubmit={handleSubmitVerification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Type *</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="kisan_credit_card">Kisan Credit Card (KCC)</option>
                  <option value="land_record">Land Record 7/12 (Khasra/Khatauni)</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="tractor_registration">Commercial Tractor / RC Registration</option>
                  <option value="fssai_gst">FSSAI / GST Certificate (Buyers)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Number / Reference ID *</label>
                <input
                  type="text"
                  required
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. KCC-9842187 or PB-10-AZ-1029"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifModal(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVerif}
                  className="flex-1 py-2 rounded-xl bg-[#176B3A] text-white text-xs font-bold hover:bg-[#173D2A] disabled:opacity-50"
                >
                  {submittingVerif ? 'Submitting...' : 'Submit Documents'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
