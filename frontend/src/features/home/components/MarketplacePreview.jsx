import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import wasteService from '../../waste-management/wasteService';
import { useLanguage } from '../../../context/LanguageContext';

export const MarketplacePreview = () => {
  const { language, t, translateCategory } = useLanguage();
  const isHi = language === 'hi';

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, lists] = await Promise.all([
          wasteService.getCategories(),
          wasteService.getListings({ limit: 4 })
        ]);
        setCategories(cats || []);
        setListings(lists || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredListings = listings.filter((item) => {
    const matchesCat = !selectedCat || item.category_slug === selectedCat;
    const matchesLoc = !locationSearch || (item.village_district && item.village_district.toLowerCase().includes(locationSearch.toLowerCase()));
    return matchesCat && matchesLoc;
  });

  return (
    <section className="py-20 bg-[#FAF9F3] border-b border-[#E2ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="agri-badge mb-3">
              {isHi ? 'लाइव क्षेत्रीय व्यापार' : 'Live Regional Trading'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0D3823] tracking-tight leading-tight">
              {isHi ? 'उपलब्ध रीसाइक्लिंग अवसर खोजें' : 'Discover Recycling Opportunities'}
            </h2>
            <p className="text-base sm:text-lg text-[#4B6354] mt-3">
              {isHi
                ? 'बायो-ऊर्जा, कंपोस्ट और प्लास्टिक खरीदारों द्वारा उठाव के लिए वर्तमान में उपलब्ध वास्तविक कृषि अपशिष्ट लॉट।'
                : 'Real farm waste batches currently available for collection by bio-energy, compost, and plastic aggregators.'}
            </p>
          </div>

          <Link
            to="/waste-marketplace"
            className="btn-secondary text-xs sm:text-sm py-3 px-6 rounded-full self-start md:self-auto font-bold hover:border-[#16A34A]"
          >
            {isHi ? 'संपूर्ण मार्केटप्लेस देखें →' : 'Explore Complete Marketplace →'}
          </Link>
        </div>

        {/* Filter controls */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E2ECE0] shadow-xs flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 text-[#56715E]" size={17} />
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder={isHi ? "जिले या गाँव से खोजें (उदा. लुधियाना, करनाल, आनंद)..." : "Search by district or village (e.g. Ludhiana, Anand, Karnal)..."}
              className="w-full pl-11 pr-4 py-2.5 bg-[#FAF9F3] border border-[#E2ECE0] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#347A46] text-[#20392A]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCat('')}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCat === ''
                  ? 'bg-[#347A46] text-white shadow-xs'
                  : 'bg-[#E8F1E5] text-[#347A46] hover:bg-[#DEEAD9]'
              }`}
            >
              {isHi ? 'सभी श्रेणियां' : 'All Streams'}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCat === c.slug
                    ? 'bg-[#347A46] text-white shadow-xs'
                    : 'bg-[#E8F1E5] text-[#347A46] hover:bg-[#DEEAD9]'
                }`}
              >
                {translateCategory(c.name)}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-3xl border border-[#E2ECE0] p-8">
            <p className="text-sm font-semibold text-[#56715E]">
              {isHi ? 'इस फ़िल्टर से मेल खाती कोई अपशिष्ट लिस्टिंग नहीं मिली।' : 'No waste listings found matching this criteria.'}
            </p>
            <Link to="/waste-marketplace" className="text-xs font-bold text-[#347A46] underline mt-2 block">
              {isHi ? 'सभी लिस्टिंग देखें →' : 'View all listings →'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="editorial-card overflow-hidden flex flex-col justify-between"
              >
                <div className="h-44 bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#347A46] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {translateCategory(item.category_name)}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-white/95 text-[#347A46] text-xs font-black px-2.5 py-1 rounded-lg shadow-xs">
                    {item.quantity} {item.unit}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#20392A] line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-[#56715E] flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-[#68A66A]" /> {item.village_district || (isHi ? 'खेत का पता' : 'Farm Gate')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E2ECE0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">
                        {isHi ? 'दर' : 'Rate'}
                      </span>
                      <span className="text-xs font-black text-[#347A46]">
                        {item.expected_price ? `₹${item.expected_price}/${item.unit}` : t('negotiable')}
                      </span>
                    </div>

                    <Link
                      to={`/waste-details/${item.id}`}
                      className="text-xs font-bold text-[#68A66A] hover:text-[#347A46] inline-flex items-center gap-1"
                    >
                      {isHi ? 'विवरण →' : 'Details →'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketplacePreview;
