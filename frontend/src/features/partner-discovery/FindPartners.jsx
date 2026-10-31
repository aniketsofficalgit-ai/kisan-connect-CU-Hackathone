import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Phone, Mail, ShieldCheck, Star,
  Truck, ArrowRight, Map as MapIcon, Grid, Clock, Sparkles,
  RotateCcw, AlertCircle, Building2, Recycle
} from 'lucide-react';
import partnerService from './partnerService';
import PartnerMap from './PartnerMap';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './PartnerDiscovery.css';

export const FindPartners = () => {
  const { user } = useAuth();
  const { language, t, translateCategory } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  const categoryFilters = [
    { slug: '', label: language === 'hi' ? 'सभी श्रेणियां' : 'All Categories' },
    { slug: 'crop_residue', label: language === 'hi' ? 'फसल अवशेष (पराली)' : 'Crop Residue (Stubble)' },
    { slug: 'straw_husk', label: language === 'hi' ? 'भूसा और तूड़ी (चारा)' : 'Straw and Husk (Bhusa)' },
    { slug: 'organic_waste', label: language === 'hi' ? 'जैविक कृषि अपशिष्ट' : 'Organic Farm Waste' },
    { slug: 'animal_manure', label: language === 'hi' ? 'पशु गोबर व खाद' : 'Animal Manure (Gobar)' },
    { slug: 'agricultural_plastic', label: language === 'hi' ? 'कृषि प्लास्टिक' : 'Agricultural Plastics' }
  ];

  const fetchPartners = async (overrideCategory, overrideLocation, overrideSearch) => {
    try {
      setLoading(true);
      setError(null);
      const catToUse = overrideCategory !== undefined ? overrideCategory : category;
      const locToUse = overrideLocation !== undefined ? overrideLocation : location;
      const searchToUse = overrideSearch !== undefined ? overrideSearch : search;

      const data = await partnerService.discoverPartners({
        category: catToUse || undefined,
        location: locToUse || undefined,
        search: searchToUse || undefined
      });
      setPartners(data.partners || []);
    } catch (e) {
      console.error(e);
      setError(language === 'hi' ? 'पार्टनर नेटवर्क से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।' : 'Unable to reach partner network. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPartners(category, location, search);
  };

  const handleClearFilters = () => {
    setCategory('');
    setLocation('');
    setSearch('');
    fetchPartners('', '', '');
  };

  const hasActiveFilters = Boolean(category || location || search);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#E2ECE0]">
        <div>
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#15803D] bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-1.5 rounded-full inline-block mb-3">
            {t('find_partners_badge')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-[#0D3823] tracking-tight">
            {t('find_partners_title')}
          </h1>
          <p className="text-sm sm:text-base text-[#4B6354] mt-2 max-w-2xl leading-relaxed">
            {t('find_partners_desc')}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-[#ECFDF5] p-1.5 rounded-full self-start md:self-auto border border-[#A7F3D0]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-full text-xs font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-[#0D3823] hover:text-[#15803D]'
            }`}
          >
            <Grid size={15} /> {t('card_directory')}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-full text-xs font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-[#0D3823] hover:text-[#15803D]'
            }`}
          >
            <MapIcon size={15} /> {t('interactive_map')}
          </button>
        </div>
      </div>

      {/* Responsive Search and Filter Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search_partner_placeholder')}
              className="w-full pl-11 pr-4 py-3 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] focus:bg-white text-[#0D3823] transition-all"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('district_filter_placeholder')}
              className="w-full pl-11 pr-4 py-3 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] focus:bg-white text-[#0D3823] transition-all"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              className="btn-primary w-full py-3 text-xs sm:text-sm font-heading font-bold rounded-2xl shadow-xs cursor-pointer whitespace-nowrap"
            >
              {t('filter_directory_btn')}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-secondary py-3 px-3.5 text-xs sm:text-sm rounded-2xl font-heading font-bold text-[#4B6354] hover:text-[#0D3823] cursor-pointer shrink-0"
                title={t('clear_filters')}
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Category Pills - Wrapping onto Multiple Rows to Prevent Clipping */}
        <div className="pt-3 border-t border-[#E2ECE0]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-heading font-extrabold text-[#4B6354] uppercase tracking-wider">
              {t('filter_by_material')}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#15803D] hover:underline inline-flex items-center gap-1"
              >
                {t('reset_all')}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap ${
                  category === cat.slug
                    ? 'bg-[#15803D] text-white shadow-xs'
                    : 'bg-[#FAF9F3] text-[#4B6354] border border-[#E2ECE0] hover:bg-[#ECFDF5] hover:text-[#15803D] hover:border-[#A7F3D0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#4B6354] px-1 font-bold">
            <span>{language === 'hi' ? 'उत्तर एवं पश्चिम भारत के सत्यापित केंद्र' : 'Showing verified facilities across North & West India'}</span>
            <span>{language === 'hi' ? 'खरीद विवरण देखने के लिए किसी भी सुविधा मार्कर पर क्लिक करें' : 'Click any facility marker to view procurement details'}</span>
          </div>
          <PartnerMap partners={partners} />
        </div>
      )}

      {/* Partner Directory Grid or Loading / Error / Compact Empty State */}
      {loading ? (
        <Loading message={t('searching_partners')} />
      ) : error ? (
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-red-200 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={26} />
          </div>
          <h3 className="font-heading font-bold text-red-900 text-base">{language === 'hi' ? 'पार्टनर लोड करने में असमर्थ' : 'Failed to Load Partners'}</h3>
          <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchPartners()}
            className="btn-primary text-xs mt-4 py-2.5 px-5 rounded-full cursor-pointer"
          >
            {language === 'hi' ? 'पुनः प्रयास करें' : 'Retry Loading'}
          </button>
        </div>
      ) : partners.length === 0 ? (
        /* Compact, Professionally Designed Empty State */
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-[#E2ECE0] shadow-sm max-w-lg mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#15803D] border border-[#A7F3D0] flex items-center justify-center mx-auto mb-3.5 shadow-xs">
            <Recycle size={28} />
          </div>
          <h3 className="font-heading font-black text-[#0D3823] text-lg">
            {t('no_partners_found')}
          </h3>
          <p className="text-xs sm:text-sm text-[#4B6354] max-w-md mx-auto mt-2 leading-relaxed font-sans">
            {t('no_partners_desc')}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleClearFilters}
              className="btn-primary text-xs py-2.5 px-5 rounded-full font-heading font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> {t('clear_filters')}
            </button>
            <Link
              to="/add-waste"
              className="btn-secondary text-xs py-2.5 px-5 rounded-full font-heading font-bold"
            >
              {t('list_farm_waste')}
            </Link>
          </div>
        </div>
      ) : (
        /* Real Partner Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((p) => (
            <div
              key={p.id}
              className="partner-card group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-[10px] uppercase font-heading font-extrabold tracking-wider text-[#15803D] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full">
                    {p.business_type?.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-black text-[#0D3823] bg-[#FAF9F3] px-2.5 py-1 rounded-xl border border-[#E2ECE0]">
                    <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                    <span>{p.rating || 4.8}</span>
                  </div>
                </div>

                <h3 className="text-lg font-heading font-extrabold text-[#0D3823] leading-snug group-hover:text-[#15803D] transition-colors">
                  {p.business_name}
                </h3>

                <p className="text-xs text-[#4B6354] mt-2.5 line-clamp-3 leading-relaxed font-sans">
                  {p.description || (language === 'hi' ? 'प्रमाणित क्षेत्रीय पार्टनर जो कृषि अवशेषों की खरीद और प्रसंस्करण में विशेषज्ञ है।' : 'Certified regional partner specialized in farm residue procurement and processing.')}
                </p>
              </div>

              {/* Service details */}
              <div className="space-y-2.5 py-4 my-4 border-y border-[#E2ECE0] text-xs font-sans">
                <div className="flex items-start gap-2 text-[#4B6354]">
                  <MapPin size={15} className="text-[#16A34A] shrink-0 mt-0.5" />
                  <span className="font-medium text-[#0D3823]">{t('districts_label')}: {p.service_area}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4B6354]">
                  <Clock size={15} className="text-[#16A34A] shrink-0" />
                  <span>{p.operating_hours || (language === 'hi' ? 'सोम-शनि: सुबह 8 से शाम 6' : 'Mon-Sat: 8 AM - 6 PM')}</span>
                </div>
                <div className="flex items-center gap-2 font-heading font-bold text-[#15803D]">
                  <Truck size={15} className="text-[#16A34A] shrink-0" />
                  <span>{t('procurement_label')}: {p.pricing_details}</span>
                </div>
              </div>

              {/* Accepted categories badges */}
              <div className="mb-4">
                <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-gray-400 block mb-2">
                  {t('accepted_streams')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.accepted_categories?.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-heading font-bold bg-[#ECFDF5] text-[#15803D] border border-[#A7F3D0] px-2.5 py-1 rounded-lg"
                    >
                      {translateCategory(c.replace(/_/g, ' '))}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3 mt-auto">
                <Link
                  to={`/partner-details/${p.id}`}
                  className="btn-outline text-xs py-2.5 px-4 rounded-full flex-1 text-center font-heading font-bold border-[#E2ECE0] text-[#0D3823] hover:bg-[#FAF9F3] hover:border-[#15803D]"
                >
                  {t('view_facility')}
                </Link>
                <Link
                  to="/add-waste"
                  className="btn-primary text-xs py-2.5 px-4 rounded-full flex-1 text-center font-heading font-bold shadow-xs"
                >
                  {t('request_pickup')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindPartners;
