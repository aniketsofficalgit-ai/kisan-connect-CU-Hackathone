import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Truck } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export const FeaturedPartners = () => {
  const { language, t, translateCategory } = useLanguage();
  const isHi = language === 'hi';

  const partners = [
    {
      id: 1,
      name: 'Punjab Bio-Energy Corp',
      type: isHi ? 'बायोमास विद्युत एवं पैलेट निर्माण' : 'Biomass Power & Pelleting',
      location: isHi ? 'लुधियाना, पंजाब' : 'Ludhiana, Punjab',
      rating: 4.9,
      reviews: 142,
      accepted: isHi ? ['धान की पराली', 'गेहूं की तूड़ी', 'मक्के के अवशेष'] : ['Paddy Straw', 'Wheat Husk', 'Corn Residue'],
      capacity: isHi ? '1,500 टन / माह' : '1,500 Tonnes / Month',
      verified: true,
      balingSupport: isHi ? 'निःशुल्क उच्च-घनत्व बेलर उपलब्ध' : 'Provides Free High-Density Balers'
    },
    {
      id: 2,
      name: 'Verka Green Bio-Compost',
      type: isHi ? 'व्यावसायिक केंचुआ खाद इकाई' : 'Commercial Vermicompost',
      location: isHi ? 'अमृतसर, पंजाब' : 'Amritsar, Punjab',
      rating: 4.8,
      reviews: 98,
      accepted: isHi ? ['जैविक कचरा', 'पशु गोबर', 'फसल अवशेष'] : ['Organic Waste', 'Animal Dung', 'Crop Remains'],
      capacity: isHi ? '800 टन / माह' : '800 Tonnes / Month',
      verified: true,
      balingSupport: isHi ? 'खेत पर ट्रैक्टर टैंकर उठाव' : 'On-Farm Tractor Tanker Collection'
    },
    {
      id: 3,
      name: 'Shivalik Eco-Polymers Ltd',
      type: isHi ? 'सीपीसीबी अधिकृत प्लास्टिक रीसाइक्लर' : 'CPCB Authorized Plastic Recycler',
      location: isHi ? 'करनाल, हरियाणा' : 'Karnal, Haryana',
      rating: 4.9,
      reviews: 76,
      accepted: isHi ? ['ड्रिप पाइप', 'मल्च फिल्म', 'खाद की बोरियां'] : ['Drip Laterals', 'Mulch Films', 'Fertilizer Sacks'],
      capacity: isHi ? '350 टन / माह' : '350 Tonnes / Month',
      verified: true,
      balingSupport: isHi ? 'गांठ बंधे प्लास्टिक का डोरस्टेप उठाव' : 'Doorstep Pickup for Baled Plastic'
    },
    {
      id: 4,
      name: 'Haryana Clean Biomass Briquettes',
      type: isHi ? 'औद्योगिक बायोमास ईंधन निर्माता' : 'Industrial Fuel Manufacturer',
      location: isHi ? 'रोहतक, हरियाणा' : 'Rohtak, Haryana',
      rating: 4.7,
      reviews: 110,
      accepted: isHi ? ['सरसों का डंठल', 'धान की पराली', 'गन्ने की खोई'] : ['Mustard Stalk', 'Paddy Straw', 'Sugarcane Bagasse'],
      capacity: isHi ? '1,200 टन / माह' : '1,200 Tonnes / Month',
      verified: true,
      balingSupport: isHi ? 'डिजिटल वे-ब्रिज व तत्काल भुगतान' : 'Direct Weighbridge & Spot Payout'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E2ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="agri-badge mb-3">{t('partners_badge')}</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0D3823] tracking-tight leading-tight">
              {t('partners_title')}
            </h2>
            <p className="text-base sm:text-lg text-[#4B6354] mt-3">
              {t('partners_desc')}
            </p>
          </div>

          <Link
            to="/find-partners"
            className="btn-secondary text-xs sm:text-sm py-3 px-6 shrink-0 self-start md:self-auto font-bold hover:border-[#16A34A]"
          >
            {t('explore_all_partners_link')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="p-7 rounded-3xl bg-[#FAF9F3] border border-[#E2ECE0] hover:border-[#16A34A] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#16A34A] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                      {partner.type}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#E8BD59]">
                      <Star size={13} fill="#E8BD59" />
                      <span>{partner.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-base text-[#0D3823] group-hover:text-[#16A34A] transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-[#56715E] mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-[#16A34A]" /> {partner.location}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E2ECE0] space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-[#20392A] block mb-1">
                      {t('accepted_label')}:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {partner.accepted.map((acc, aIdx) => (
                        <span key={aIdx} className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E2ECE0] text-[#56715E]">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-[#20392A] block">
                      {t('capacity_label')}:
                    </span>
                    <span className="text-xs font-bold text-[#16A34A]">
                      {partner.capacity}
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-[#56715E] flex items-center gap-1 font-medium">
                      <Truck size={12} className="text-[#16A34A]" /> {partner.balingSupport}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#E2ECE0]">
                <Link
                  to="/find-partners"
                  className="btn-outline w-full text-xs py-2 text-center justify-center font-bold"
                >
                  {t('request_collection_btn')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPartners;
