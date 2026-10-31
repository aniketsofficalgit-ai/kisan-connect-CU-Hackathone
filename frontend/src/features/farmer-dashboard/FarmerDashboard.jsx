import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout, PlusCircle, Search, Truck, Bot, Coins, CheckCircle2,
  Clock, Trash2, Eye, MapPin, ArrowRight, LayoutDashboard, User, Sparkles, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import dashboardService from './dashboardService';
import wasteService from '../waste-management/wasteService';
import Loading from '../../components/Loading/Loading';
import './Dashboard.css';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const { language, setLanguage, toggleLanguage, t, translateCategory, translateStatus } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchFarmerData = async () => {
    try {
      setLoading(true);
      const [statsData, myListings, myRequests] = await Promise.all([
        dashboardService.getFarmerDashboardStats(),
        dashboardService.getMyListings(),
        dashboardService.getMyRequests()
      ]);
      setStats(statsData);
      setListings(myListings || []);
      setRequests(myRequests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm(t('delete_confirm', "Are you sure you want to remove this waste listing?"))) return;
    try {
      setDeletingId(listingId);
      await wasteService.deleteListing(listingId);
      setListings(prev => prev.filter(l => l.id !== listingId));
      fetchFarmerData();
    } catch (err) {
      alert(t('delete_fail', "Failed to delete listing."));
    } finally {
      setDeletingId(null);
    }
  };

  const openAIChat = () => {
    const chatBtn = document.querySelector('.kc-kriti-fab') || document.querySelector('.kc-chat-fab');
    if (chatBtn) chatBtn.click();
  };

  if (loading) {
    return <Loading message={language === 'hi' ? "किसान डैशबोर्ड लोड हो रहा है..." : "Loading farmer dashboard..."} />;
  }

  const fp = user?.farmer_profile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24 md:pb-12">
      {/* Top Welcome Greeting Banner */}
      <div className="p-7 sm:p-9 rounded-3xl bg-white border border-[#E2ECE0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#347A46] bg-[#E8F1E5] px-3.5 py-1 rounded-full">
              {t('farmer_console')} &bull; {fp?.farm_name || (language === 'hi' ? 'मेरा खेत' : 'My Farm')}
            </span>

            {/* Direct In-Dashboard Language Switcher Group */}
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

          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#20392A] tracking-tight">
            {language === 'hi' ? `नमस्ते, ${user?.full_name || 'किसान साथी'}!` : `Namaste, ${user?.full_name || 'Farmer'}!`}
          </h1>
          <p className="text-xs sm:text-sm text-[#56715E] mt-2 flex items-center gap-2 font-sans">
            <MapPin size={15} className="text-[#68A66A]" />
            <span>
              {t('village')} {fp?.village || (language === 'hi' ? 'स्थानीय' : 'Local')}, {fp?.district || 'Punjab'} &bull; {fp?.farm_size_acres || 5} {t('acres_under_cultivation')}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/add-waste"
            className="btn-primary text-xs sm:text-sm py-3 px-6 shadow-xs font-heading font-bold"
          >
            <PlusCircle size={17} /> {t('list_sell_waste')}
          </Link>
          <Link
            to="/find-partners"
            className="btn-secondary text-xs sm:text-sm py-3 px-6 font-heading font-bold"
          >
            <Search size={17} /> {t('find_collectors')}
          </Link>
        </div>
      </div>

      {/* 4 Main Action Cards */}
      <div>
        <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#56715E] mb-3.5">
          {t('quick_actions_title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/add-waste" className="farmer-action-btn group">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center shrink-0 group-hover:bg-[#347A46] group-hover:text-white transition-all">
              <PlusCircle size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#20392A] group-hover:text-[#347A46] transition-colors">
                {t('list_new_waste')}
              </h3>
              <p className="text-xs text-[#56715E] mt-0.5 font-sans">
                {t('list_new_waste_desc')}
              </p>
            </div>
          </Link>

          <Link to="/find-partners" className="farmer-action-btn group">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0D4] text-[#B38018] flex items-center justify-center shrink-0 group-hover:bg-[#E8BD59] group-hover:text-white transition-all">
              <Search size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#20392A] group-hover:text-[#347A46] transition-colors">
                {t('find_a_collector')}
              </h3>
              <p className="text-xs text-[#56715E] mt-0.5 font-sans">
                {t('find_a_collector_desc')}
              </p>
            </div>
          </Link>

          <Link to="/tracking" className="farmer-action-btn group">
            <div className="w-12 h-12 rounded-2xl bg-[#E8EFF8] text-[#2C6298] flex items-center justify-center shrink-0 group-hover:bg-[#2C6298] group-hover:text-white transition-all">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#20392A] group-hover:text-[#347A46] transition-colors">
                {t('track_collection')}
              </h3>
              <p className="text-xs text-[#56715E] mt-0.5 font-sans">
                {t('track_collection_desc')}
              </p>
            </div>
          </Link>

          <button onClick={openAIChat} className="farmer-action-btn group text-left cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF1EC] text-[#176B68] flex items-center justify-center shrink-0 group-hover:bg-[#176B68] group-hover:text-white transition-all">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#20392A] group-hover:text-[#176B68] transition-colors">
                {t('ask_kriti_ai')}
              </h3>
              <p className="text-xs text-[#56715E] mt-0.5 font-sans">
                {t('ask_kriti_ai_desc')}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Practical Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-[#E2ECE0] shadow-xs">
          <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider block">
            {t('my_active_listings')}
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#347A46] mt-1.5">
            {stats?.total_listings_count || 0}
          </p>
          <span className="text-[11px] text-[#56715E] mt-1 block truncate font-sans">
            {stats?.waste_by_unit ? Object.entries(stats.waste_by_unit).map(([u, q]) => `${q} ${u}`).join(', ') : (language === 'hi' ? '0 क्विंटल' : '0 quintals')}
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2ECE0] shadow-xs">
          <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider block">
            {t('waste_collected')}
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#68A66A] mt-1.5 truncate">
            {stats?.waste_collected_summary || (language === 'hi' ? '0 क्विंटल' : '0 quintals')}
          </p>
          <span className="text-[11px] text-[#56715E] mt-1 block font-sans">
            {stats?.completed_collections_count || 0} {t('completed_pickups')}
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2ECE0] shadow-xs">
          <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider block">
            {t('active_pickups')}
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#B38018] mt-1.5">
            {stats?.active_requests_count || 0}
          </p>
          <Link to="/tracking" className="text-[11px] font-heading font-bold text-[#347A46] hover:underline mt-1 inline-block">
            {t('view_timeline')}
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E2ECE0] shadow-xs">
          <span className="text-[11px] font-heading font-bold text-[#56715E] uppercase tracking-wider block">
            {t('total_earnings')}
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#347A46] mt-1.5">
            ₹{stats?.total_earnings?.toLocaleString('en-IN') || 0}
          </p>
          <span className="text-[11px] text-[#56715E] mt-1 block font-sans">
            ₹{stats?.pending_earnings?.toLocaleString('en-IN') || 0} {t('in_progress')}
          </span>
        </div>
      </div>

      {/* My Waste Listings Table */}
      <div className="bg-white rounded-3xl border border-[#E2ECE0] overflow-hidden shadow-sm">
        <div className="p-6 sm:p-7 border-b border-[#E2ECE0] flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-[#20392A]">
              {t('my_farm_waste_listings')}
            </h3>
            <p className="text-xs text-[#56715E] mt-0.5 font-sans">
              {t('my_farm_waste_desc')}
            </p>
          </div>
          <Link to="/add-waste" className="btn-primary text-xs py-2.5 px-5 font-heading font-bold rounded-full">
            {t('add_new_waste')}
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="p-12 text-center text-[#56715E]">
            <Sprout size={36} className="mx-auto text-[#68A66A] mb-2" />
            <h4 className="font-heading font-bold text-sm text-[#20392A]">{t('no_waste_listed_yet')}</h4>
            <p className="text-xs mt-1 font-sans">{t('no_waste_listed_desc')}</p>
            <Link to="/add-waste" className="btn-secondary text-xs mt-4 inline-flex font-heading font-bold">
              {t('list_first_batch')}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF9F3] text-[#56715E] font-heading font-bold uppercase tracking-wider border-b border-[#E2ECE0]">
                <tr>
                  <th className="py-3.5 px-5">{t('waste_item')}</th>
                  <th className="py-3.5 px-4">{t('category')}</th>
                  <th className="py-3.5 px-4">{t('available_quantity')}</th>
                  <th className="py-3.5 px-4">{t('expected_rate')}</th>
                  <th className="py-3.5 px-4">{t('status')}</th>
                  <th className="py-3.5 px-5 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECE0]">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F3]/70 transition-colors">
                    <td className="py-3.5 px-5 font-heading font-bold text-[#20392A]">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=150&q=80"}
                          alt={item.title}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E2ECE0]"
                        />
                        <div>
                          <span className="block text-sm text-[#20392A]">{item.title}</span>
                          <span className="text-[11px] font-normal text-[#56715E]">{item.village_district || 'Farm Gate'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#56715E] font-medium">
                      {translateCategory(item.category_name)}
                    </td>
                    <td className="py-3.5 px-4 font-heading font-bold text-[#347A46] text-sm">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 font-heading font-semibold text-[#68A66A]">
                      {item.expected_price ? `₹${item.expected_price}/${item.unit}` : t('negotiable')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`status-pill status-pill-${item.status}`}>
                        {translateStatus(item.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/waste-details/${item.id}`}
                          className="p-1.5 text-[#56715E] hover:text-[#347A46] rounded-lg hover:bg-[#FAF9F3]"
                          title={t('view_details')}
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 cursor-pointer"
                          title={t('delete_listing')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collection Requests & Pickup Status */}
      <div className="bg-white rounded-3xl border border-[#E2ECE0] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-[#20392A]">
              {t('active_collection_requests')}
            </h3>
            <p className="text-xs text-[#56715E] mt-0.5 font-sans">
              {t('active_collection_desc')}
            </p>
          </div>
          <Link to="/tracking" className="text-xs font-heading font-bold text-[#347A46] hover:underline">
            {t('all_orders')} ({requests.length}) &rarr;
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#56715E] font-sans">
            {t('no_requests_active')}
          </div>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="p-4 sm:p-5 rounded-2xl border border-[#E2ECE0] bg-[#FAF9F3] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#347A46]">{req.request_number}</span>
                    <span className={`status-pill status-pill-${req.status.toLowerCase().replace(' ', '-')}`}>
                      {translateStatus(req.status)}
                    </span>
                  </div>
                  <h4 className="font-heading font-extrabold text-sm text-[#20392A]">
                    {req.listing_title} ({req.quantity} {req.unit}) &bull; {t('partner_label')}: {req.partner_business_name}
                  </h4>
                  <p className="text-xs text-[#56715E] mt-0.5 font-sans">
                    {req.scheduled_pickup_date
                      ? `${t('scheduled_date')}: ${req.scheduled_pickup_date}`
                      : `${t('requested_on')}: ${new Date(req.created_at).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  {req.offered_price > 0 && (
                    <span className="font-heading font-extrabold text-sm sm:text-base text-[#347A46]">
                      ₹{req.offered_price.toLocaleString('en-IN')}
                    </span>
                  )}
                  <Link
                    to={`/collection-details/${req.id}`}
                    className="btn-outline text-xs py-2 px-4 rounded-full font-heading font-bold border-[#E2ECE0] text-[#347A46] hover:bg-white"
                  >
                    {t('track_timeline')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden mobile-bottom-nav">
        <Link to="/farmer-dashboard" className="mobile-nav-item active">
          <LayoutDashboard size={20} />
          <span>{t('dashboard')}</span>
        </Link>
        <Link to="/add-waste" className="mobile-nav-item">
          <PlusCircle size={20} />
          <span>{t('sell_waste')}</span>
        </Link>
        <Link to="/find-partners" className="mobile-nav-item">
          <Search size={20} />
          <span>{t('collectors')}</span>
        </Link>
        <Link to="/tracking" className="mobile-nav-item">
          <Truck size={20} />
          <span>{t('tracking')}</span>
        </Link>
        <button onClick={openAIChat} className="mobile-nav-item text-[#347A46] cursor-pointer">
          <Bot size={20} />
          <span>KRITI AI</span>
        </button>
      </div>
    </div>
  );
};

export default FarmerDashboard;
