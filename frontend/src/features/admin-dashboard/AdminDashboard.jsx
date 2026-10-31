import React, { useState, useEffect } from 'react';
import {
  Shield, Users, CheckCircle2, XCircle, AlertTriangle, Sprout,
  Truck, Coins, Wind, TreePine, Eye, Trash2, ArrowRight, Globe
} from 'lucide-react';
import api from '../../services/api';
import Loading from '../../components/Loading/Loading';
import ManageUsers from './ManageUsers';
import ManageListings from './ManageListings';
import Analytics from './Analytics';
import { useLanguage } from '../../context/LanguageContext';
import './Admin.css';

export const AdminDashboard = () => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [metrics, setMetrics] = useState(null);
  const [pendingPartners, setPendingPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'listings', 'analytics'
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, partnersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/pending-partners')
      ]);
      setMetrics(statsRes.data.metrics);
      setPendingPartners(partnersRes.data.partners || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyPartner = async (partnerId, status) => {
    setActionLoading(true);
    setMsg('');
    try {
      await api.put(`/admin/partners/${partnerId}/verify`, { status });
      setMsg(`Partner has been marked as ${status}!`);
      setPendingPartners(prev => prev.filter(p => p.id !== partnerId && p.user_id !== partnerId));
      fetchAdminData();
    } catch (err) {
      alert("Failed to update partner verification.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading Kisan Connect Admin Control..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner - Clean White on Warm Cream with Forest Green Accents */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#E2ECE0]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-heading font-bold text-[#347A46] uppercase tracking-wider block">
              {t('admin_governance')}
            </span>
            <div className="kc-lang-switch-group ml-auto sm:ml-0" role="group" aria-label="Language selector">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`kc-lang-toggle-btn ${language === 'en' ? 'active' : ''}`}
                aria-pressed={language === 'en'}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`kc-lang-toggle-btn ${language === 'hi' ? 'active' : ''}`}
                aria-pressed={language === 'hi'}
              >
                हिन्दी
              </button>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#20392A] tracking-tight flex items-center gap-2.5">
            <Shield size={28} className="text-[#347A46]" /> {t('platform_ops_console')}
          </h1>
          <p className="text-xs sm:text-sm text-[#56715E] mt-1.5 font-sans">
            {t('admin_ops_desc')}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#E8F1E5] p-1.5 rounded-full border border-[#E2ECE0] self-start md:self-auto text-xs font-heading font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#347A46] text-white shadow-xs' : 'text-[#20392A] hover:text-[#347A46]'
            }`}
          >
            {t('tab_approvals')} ({metrics?.pending_partners_count || 0})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-[#347A46] text-white shadow-xs' : 'text-[#20392A] hover:text-[#347A46]'
            }`}
          >
            {t('tab_manage_users')}
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'listings' ? 'bg-[#347A46] text-white shadow-xs' : 'text-[#20392A] hover:text-[#347A46]'
            }`}
          >
            {t('tab_moderate_listings')}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-[#347A46] text-white shadow-xs' : 'text-[#20392A] hover:text-[#347A46]'
            }`}
          >
            {t('tab_impact_reports')}
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-heading font-bold flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-[#347A46]" /> {msg}
        </div>
      )}

      {/* Overview Metrics Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="admin-stat-card">
              <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider block">
                {t('reg_farmers')}
              </span>
              <p className="text-3xl font-heading font-black text-[#20392A] mt-2">{metrics?.total_farmers || 0}</p>
              <span className="text-xs text-[#68A66A] font-semibold mt-1 block font-sans">
                {t('reg_farmers_desc')}
              </span>
            </div>

            <div className="admin-stat-card">
              <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider block">
                {t('reg_partners')}
              </span>
              <p className="text-3xl font-heading font-black text-[#347A46] mt-2">{metrics?.total_partners || 0}</p>
              <span className="text-xs text-[#B38018] font-semibold mt-1 block font-sans">
                {metrics?.pending_partners_count || 0} {t('pending_verification')}
              </span>
            </div>

            <div className="admin-stat-card">
              <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider block">
                {t('waste_collected')}
              </span>
              <p className="text-3xl font-heading font-black text-[#347A46] mt-2">
                {metrics?.total_waste_collected_tonnes || 0} <span className="text-base font-normal">{language === 'hi' ? 'टन' : 'tonnes'}</span>
              </p>
              <span className="text-xs text-[#56715E] mt-1 block font-sans">
                {language === 'hi' ? 'पूर्ण ऑर्डरों के माध्यम से' : 'Across completed orders'}
              </span>
            </div>

            <div className="admin-stat-card">
              <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider block">
                {t('verified_co2_offset')}
              </span>
              <p className="text-3xl font-heading font-black text-[#347A46] mt-2">
                {metrics?.co2_saved_tonnes || 0} <span className="text-base font-normal">{language === 'hi' ? 'टन' : 'tonnes'}</span>
              </p>
              <span className="text-xs text-[#68A66A] font-semibold mt-1 block font-sans">
                {language === 'hi' ? `~${metrics?.stubble_acres_saved || 0} एकड़ पराली जलने से बची` : `~${metrics?.stubble_acres_saved || 0} acres saved from burning`}
              </span>
            </div>
          </div>

          {/* Pending Partner Approvals Section */}
          <div className="bg-white rounded-3xl border border-[#E2ECE0] shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2ECE0]">
              <div>
                <h3 className="font-heading font-black text-lg text-[#20392A] flex items-center gap-2">
                  <Shield size={20} className="text-[#347A46]" /> Pending Partner Registrations
                </h3>
                <p className="text-xs text-[#56715E] mt-0.5 font-sans">
                  Review applicant business credentials before granting verified partner visibility in the farmer directory
                </p>
              </div>
              <span className="px-3.5 py-1 bg-[#FAF0D4] text-[#B38018] rounded-full font-heading font-bold text-xs border border-[#F0DC9C]">
                {pendingPartners.length} Pending
              </span>
            </div>

            {pendingPartners.length === 0 ? (
              <div className="py-12 text-center text-[#56715E] text-xs font-sans">
                <CheckCircle2 size={36} className="mx-auto text-[#68A66A] mb-2" />
                <p className="font-heading font-bold text-[#20392A] text-sm">All partner applications have been reviewed!</p>
                <p className="mt-1">New aggregator registrations will appear here for verification.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-5 rounded-2xl border border-[#E2ECE0] bg-[#FAF9F3] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 font-sans">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-sm text-[#20392A]">{partner.business_name}</h4>
                        <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-[#347A46] bg-[#E8F1E5] px-2.5 py-0.5 rounded-full">
                          {partner.business_type}
                        </span>
                      </div>
                      <p className="text-xs text-[#56715E]">
                        Reg: {partner.registration_number || 'N/A'} • Coverage: <strong>{partner.service_area}</strong>
                      </p>
                      <p className="text-xs text-[#56715E] italic">
                        "{partner.description || 'Applicant awaiting verification'}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-end md:self-auto font-heading font-bold">
                      <button
                        onClick={() => handleVerifyPartner(partner.id, 'approved')}
                        disabled={actionLoading}
                        className="btn-primary text-xs py-2 px-4 rounded-full shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 size={14} /> Approve Partner
                      </button>
                      <button
                        onClick={() => handleVerifyPartner(partner.id, 'rejected')}
                        disabled={actionLoading}
                        className="btn-outline text-red-600 border-red-300 hover:bg-red-50 text-xs py-2 px-3.5 rounded-full cursor-pointer"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && <ManageUsers onUserUpdated={fetchAdminData} />}

      {/* Listing Management Tab */}
      {activeTab === 'listings' && <ManageListings onListingUpdated={fetchAdminData} />}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && <Analytics metrics={metrics} />}
    </div>
  );
};

export default AdminDashboard;
