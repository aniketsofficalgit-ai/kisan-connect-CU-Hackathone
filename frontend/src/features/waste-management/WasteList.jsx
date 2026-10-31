import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout, Search, Filter, MapPin, Tag, ArrowRight, PlusCircle, CheckCircle2,
  Tractor, Sparkles, Building2, RotateCcw, AlertCircle, PackageOpen
} from 'lucide-react';
import wasteService from './wasteService';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './WasteManagement.css';

const CATEGORY_FALLBACK_IMAGES = {
  'crop_residue': 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=700&q=80',
  'crop-residue-stubble': 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=700&q=80',
  'straw_husk': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
  'straw-husk': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
  'organic_waste': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80',
  'organic-farm-waste': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80',
  'animal_manure': 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=700&q=80',
  'animal-manure': 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=700&q=80',
  'agricultural_plastic': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=700&q=80',
  'agricultural-plastic': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=700&q=80',
  'other_waste': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=700&q=80',
  'other-agricultural-waste': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=700&q=80'
};

export const WasteList = () => {
  const { user } = useAuth();
  const { language, t, translateCategory } = useLanguage();
  const isHi = language === 'hi';
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (overrideCategory, overrideSearch) => {
    try {
      setLoading(true);
      setError(null);
      const catToUse = overrideCategory !== undefined ? overrideCategory : selectedCategory;
      const searchToUse = overrideSearch !== undefined ? overrideSearch : searchQuery;

      const [cats, lists] = await Promise.all([
        wasteService.getCategories(),
        wasteService.getListings({
          category: catToUse || undefined,
          search: searchToUse || undefined
        })
      ]);
      setCategories(cats || []);
      setListings(lists || []);
    } catch (e) {
      console.error(e);
      setError('Unable to load waste listings. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData(selectedCategory, searchQuery);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    fetchData('', '');
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2ECE0]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-heading font-bold text-[#15803D] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full uppercase tracking-wider">
              {isHi ? 'लाइव कृषि मार्केटप्लेस' : 'Live Agricultural Marketplace'}
            </span>
            <span className="text-xs font-semibold text-[#4B6354]">
              {listings.length} {isHi ? 'सक्रिय लॉट उपलब्ध' : (listings.length === 1 ? 'Active Lot Available' : 'Active Lots Available')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-[#0D3823] tracking-tight">
            {isHi ? 'कृषि अपशिष्ट एवं बायोमास निर्देशिका' : 'Farm Waste & Biomass Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-[#4B6354] mt-2 font-sans max-w-2xl leading-relaxed">
            {isHi
              ? 'सत्यापित किसानों से उठाव के लिए उपलब्ध वास्तविक फसल अवशेष, धान की पराली, जैविक बायोमास एवं रीसाइक्लिंग कच्चा माल खोजें।'
              : 'Browse genuine farm residues, paddy straw, organic biomass, and recycling feedstock ready for collection from verified farmers.'}
          </p>
        </div>

        {user?.role === 'farmer' && (
          <Link
            to="/add-waste"
            className="btn-primary text-xs sm:text-sm px-5 py-3 rounded-full shadow-md shadow-[#16A34A]/20 self-start md:self-auto font-heading font-bold inline-flex items-center gap-2"
          >
            <PlusCircle size={17} /> {t('list_sell_waste')}
          </Link>
        )}
      </div>

      {/* Responsive Filter Section */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-[#E2ECE0] space-y-5">
        {/* Search Input Row with Dedicated Filter & Clear Buttons */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? "फसल अवशेष, पराली, बेलर, गाँव या जिले के नाम से खोजें..." : "Search by crop residue, straw, baler, village, or district..."}
              className="w-full pl-11 pr-4 py-3 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] focus:bg-white text-[#0D3823] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              className="btn-primary flex-1 sm:flex-none text-xs sm:text-sm py-3 px-6 rounded-2xl font-heading font-bold shadow-xs whitespace-nowrap cursor-pointer"
            >
              {isHi ? 'फ़िल्टर लागू करें' : 'Filter Listings'}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-secondary text-xs sm:text-sm py-3 px-4 rounded-2xl font-heading font-bold text-[#4B6354] hover:text-[#0D3823] whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5"
                title="Reset all search and category filters"
              >
                <RotateCcw size={14} /> {isHi ? 'हटाएं' : 'Clear'}
              </button>
            )}
          </div>
        </form>

        {/* Category Pills - Wrapping onto Multiple Rows to Prevent Clipping */}
        <div className="pt-3 border-t border-[#E2ECE0]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-heading font-extrabold text-[#4B6354] uppercase tracking-wider">
              {isHi ? 'अवशेष श्रेणी के अनुसार फ़िल्टर करें:' : 'Filter by Residue Category:'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#15803D] hover:underline inline-flex items-center gap-1"
              >
                {isHi ? 'सभी रीसेट करें' : 'Reset All'}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`filter-pill ${selectedCategory === '' ? 'active' : 'inactive'}`}
            >
              {isHi ? 'सभी श्रेणियां' : 'All Categories'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`filter-pill ${selectedCategory === cat.slug ? 'active' : 'inactive'}`}
              >
                {translateCategory(cat.name)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Listings or Loading / Error / Compact Empty State */}
      {loading ? (
        <Loading message="Fetching live agricultural waste listings..." />
      ) : error ? (
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-red-200 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={26} />
          </div>
          <h3 className="font-heading font-bold text-red-900 text-base">Failed to Load Listings</h3>
          <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchData()}
            className="btn-primary text-xs mt-4 py-2.5 px-5 rounded-full"
          >
            Retry Loading
          </button>
        </div>
      ) : listings.length === 0 ? (
        /* Compact, Professionally Designed Empty State */
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-[#E2ECE0] shadow-sm max-w-lg mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#15803D] border border-[#A7F3D0] flex items-center justify-center mx-auto mb-3.5 shadow-xs">
            <PackageOpen size={28} />
          </div>
          <h3 className="font-heading font-black text-[#0D3823] text-lg">
            {isHi ? 'कोई कृषि अपशिष्ट लिस्टिंग नहीं मिली' : 'No Waste Listings Found'}
          </h3>
          <p className="text-xs sm:text-sm text-[#4B6354] max-w-md mx-auto mt-2 leading-relaxed font-sans">
            {isHi
              ? 'उपलब्ध कृषि अपशिष्ट खोजने के लिए अपनी खोज बदलें या कोई अन्य श्रेणी चुनें।'
              : 'Try changing your search or selecting another category to discover available agricultural waste.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleClearFilters}
              className="btn-primary text-xs py-2.5 px-5 rounded-full font-heading font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> {isHi ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
            </button>
            {user?.role === 'farmer' && (
              <Link
                to="/add-waste"
                className="btn-secondary text-xs py-2.5 px-5 rounded-full font-heading font-bold"
              >
                + {t('list_sell_waste')}
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Real Listings Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            const fallbackImg = CATEGORY_FALLBACK_IMAGES[item.category_slug] || CATEGORY_FALLBACK_IMAGES['crop-residue-stubble'];
            return (
              <div key={item.id} className="waste-card group">
                <div className="waste-card-image-box">
                  <img
                    src={item.image_url || fallbackImg}
                    alt={item.title}
                    className="waste-card-image"
                    onError={(e) => { e.target.src = fallbackImg; }}
                  />
                  <span className="absolute top-3 left-3 bg-[#15803D]/95 backdrop-blur-md text-white text-[11px] font-heading font-bold px-3 py-1 rounded-full shadow-sm">
                    {translateCategory(item.category_name)}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-white/95 text-[#0D3823] text-xs font-heading font-black px-3 py-1 rounded-xl shadow-sm border border-[#E2ECE0]">
                    {item.quantity} {item.unit}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0D3823] line-clamp-1 mb-1.5 group-hover:text-[#15803D] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#4B6354] flex items-center gap-1.5 mb-3">
                      <MapPin size={14} className="text-[#16A34A] shrink-0" />
                      <span>{item.village_district || (isHi ? 'खेत का पता' : 'Farm Gate')}</span>
                    </p>
                    <p className="text-xs text-[#4B6354] line-clamp-2 leading-relaxed font-sans">
                      {item.description || (isHi ? 'सत्यापित कृषि बायोमास तत्काल उठाव और रीसाइक्लिंग के लिए उपलब्ध है।' : 'Verified agricultural biomass available for immediate collection and recycling.')}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-[#E2ECE0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">
                        {isHi ? 'अपेक्षित दर' : 'Expected Rate'}
                      </span>
                      <span className="font-heading font-extrabold text-sm text-[#15803D]">
                        {item.expected_price ? `₹${item.expected_price}/${item.unit}` : (isHi ? 'कोटेशन आमंत्रित' : 'Open to Quote')}
                      </span>
                    </div>

                    <Link
                      to={`/waste-details/${item.id}`}
                      className="btn-outline text-xs py-2 px-4 rounded-full flex items-center gap-1.5 font-heading font-bold text-[#15803D] border-[#15803D] hover:bg-[#15803D] hover:text-white transition-all shadow-xs"
                    >
                      {isHi ? 'विवरण देखें' : 'View Details'} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WasteList;
