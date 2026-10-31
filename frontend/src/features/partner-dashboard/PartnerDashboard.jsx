import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Truck, Clock, CheckCircle2, DollarSign, MapPin,
  Calendar, Eye, ArrowRight, ShieldCheck, Sprout, Filter, Factory, Tractor, Globe
} from 'lucide-react';
import partnerService from '../partner-discovery/partnerService';
import collectionService from '../collection-tracking/collectionService';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './PartnerDashboard.css';

export const PartnerDashboard = () => {
  const { user } = useAuth();
  const { language, setLanguage, toggleLanguage, t, translateCategory, translateStatus } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await partnerService.getPartnerDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <Loading message={language === 'hi' ? "पार्टनर डैशबोर्ड लोड हो रहा है..." : "Loading partner operations dashboard..."} />;
  }

  const profile = stats?.partner_profile || user?.partner_profile;
  const requests = stats?.requests || [];
  const matchingListings = stats?.matching_listings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner - Clean White on Warm Cream with Forest Accents */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#E2ECE0]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-heading font-bold text-[#347A46] bg-[#E8F1E5] px-3.5 py-1 rounded-full uppercase tracking-wider">
              {t('partner_console')}
            </span>
            <span className="text-[10px] font-heading font-bold bg-[#FAF9F3] text-[#347A46] border border-[#E2ECE0] px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#68A66A]" /> {t('verified')}
            </span>

            {/* In-Dashboard Language Switcher Group */}
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

          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#20392A] tracking-tight">
            {profile?.business_name || user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-[#56715E] mt-1.5 flex items-center gap-1.5 font-sans">
            <MapPin size={15} className="text-[#68A66A]" />
            <span>
              {t('operational_service_area')}: {profile?.service_area || 'Punjab & Haryana Agro-belt'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/tracking"
            className="btn-primary text-xs sm:text-sm font-heading font-bold px-6 py-3 rounded-full shadow-xs"
          >
            {t('review_requests')} ({stats?.pending_requests_count || 0})
          </Link>
          <Link
            to="/waste-marketplace"
            className="btn-secondary text-xs sm:text-sm font-heading font-bold px-6 py-3 rounded-full"
          >
            {t('browse_waste_lots')}
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="partner-stat-box">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider">
              {t('incoming_requests')}
            </span>
            <div className="w-11 h-11 rounded-2xl bg-[#FAF0D4] text-[#B38018] flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-black text-[#20392A] mt-3">
            {stats?.pending_requests_count || 0}
          </p>
          <span className="text-[11px] text-[#56715E] mt-1 block font-sans">
            {t('awaiting_dispatch')}
          </span>
        </div>

        <div className="partner-stat-box">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider">
              {t('scheduled_pickups')}
            </span>
            <div className="w-11 h-11 rounded-2xl bg-[#E8EFF8] text-[#2C6298] flex items-center justify-center">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-black text-[#20392A] mt-3">
            {stats?.scheduled_pickups_count || 0}
          </p>
          <span className="text-[11px] text-[#56715E] mt-1 block font-sans">
            {t('assigned_fleet')}
          </span>
        </div>

        <div className="partner-stat-box">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider">
              {t('completed_collections')}
            </span>
            <div className="w-11 h-11 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-black text-[#347A46] mt-3">
            {stats?.completed_collections_count || 0}
          </p>
          <span className="text-[11px] text-[#56715E] mt-1 block font-sans">
            {t('processed_delivered')}
          </span>
        </div>

        <div className="partner-stat-box">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider">
              {t('total_farmer_payouts')}
            </span>
            <div className="w-11 h-11 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-black text-[#347A46] mt-3">
            ₹{stats?.total_spent?.toLocaleString('en-IN') || 0}
          </p>
          <span className="text-[11px] text-[#56715E] mt-1 block font-sans">
            {t('direct_payments_settled')}
          </span>
        </div>
      </div>

      {/* Live Waste Feed Matching Partner Categories */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E2ECE0] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E2ECE0]">
          <div>
            <h3 className="font-heading font-black text-lg text-[#20392A]">
              {t('open_farm_residues')}
            </h3>
            <p className="text-xs text-[#56715E] mt-0.5 font-sans">
              {t('open_farm_residues_desc')}
            </p>
          </div>
          <Link to="/waste-marketplace" className="text-xs font-heading font-bold text-[#347A46] hover:text-[#68A66A] inline-flex items-center gap-1.5">
            {t('browse_all_listings')} <ArrowRight size={14} />
          </Link>
        </div>

        {matchingListings.length === 0 ? (
          <div className="py-8 text-center text-[#56715E] text-xs font-sans">
            {t('no_matching_listings')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {matchingListings.slice(0, 6).map((item) => (
              <div key={item.id} className="partner-feed-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2.5">
                    <span className="font-heading font-bold text-[#347A46] bg-[#E8F1E5] px-3 py-1 rounded-full">
                      {translateCategory(item.category_name)}
                    </span>
                    <span className="font-heading font-black text-[#20392A]">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#20392A] line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-[#56715E] flex items-center gap-1.5 mt-1.5 font-sans">
                    <MapPin size={13} className="text-[#68A66A]" /> {item.village_district || 'Local Farm Gate'}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-[#E2ECE0] flex items-center justify-between font-sans">
                  <span className="font-heading font-bold text-xs text-[#347A46]">
                    {item.expected_price ? `₹${item.expected_price}/${item.unit}` : t('open_quote')}
                  </span>
                  <Link
                    to={`/waste-details/${item.id}`}
                    className="text-xs font-heading font-bold text-[#347A46] hover:text-[#2A6439] inline-flex items-center gap-1"
                  >
                    {t('view_lot')} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incoming Requests Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E2ECE0] overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-[#E2ECE0] flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-lg text-[#20392A]">
              {t('incoming_farmer_requests')}
            </h3>
            <p className="text-xs text-[#56715E] mt-0.5 font-sans">
              {t('incoming_farmer_requests_desc')}
            </p>
          </div>
          <Link to="/tracking" className="text-xs font-heading font-bold text-[#347A46] hover:underline">
            {t('view_all_tracking')}
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center text-[#56715E] text-xs font-sans">
            {t('no_requests_received')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF9F3] text-[#56715E] font-heading font-bold uppercase tracking-wider border-b border-[#E2ECE0]">
                <tr>
                  <th className="py-3.5 px-5">{t('request_number')}</th>
                  <th className="py-3.5 px-5">{t('waste_lot')}</th>
                  <th className="py-3.5 px-5">{t('farmer')}</th>
                  <th className="py-3.5 px-5">{t('status')}</th>
                  <th className="py-3.5 px-5">{t('offered_payout')}</th>
                  <th className="py-3.5 px-5 text-right">{t('action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECE0]">
                {requests.slice(0, 6).map((req) => (
                  <tr key={req.id} className="hover:bg-[#FAF9F3]/70 transition-colors">
                    <td className="py-3.5 px-5 font-heading font-bold text-[#347A46]">{req.request_number}</td>
                    <td className="py-3.5 px-5 font-semibold text-[#20392A]">
                      {req.listing_title} ({req.quantity} {req.unit})
                    </td>
                    <td className="py-3.5 px-5 text-[#56715E]">{req.farmer_name}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold bg-[#E8F1E5] text-[#347A46] uppercase tracking-wider">
                        {translateStatus(req.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-heading font-bold text-[#20392A]">
                      ₹{req.offered_price?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/collection-details/${req.id}`}
                        className="btn-outline text-[11px] py-1.5 px-3.5 rounded-full inline-flex font-heading font-bold border-[#E2ECE0] text-[#347A46] hover:bg-white"
                      >
                        {t('manage_order')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;
