import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Flame, Recycle, Sprout } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export const WasteTypes = () => {
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const categories = [
    {
      id: 'crop-residue',
      name: isHi ? 'फसल अवशेष (Crop Residue)' : 'Crop Residue',
      tagline: isHi ? 'मक्के के डंठल, गन्ने की खोई और बाजरे के अवशेष' : 'Corn stalks, sugarcane trash & millet stubble',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=85',
      outcome: isHi ? 'बायोमास ब्रिकेट्स व पेलेट्स' : 'Biomass Briquettes & Pellets',
      rate: isHi ? '₹200 - ₹260 / क्विंटल' : '₹200 - ₹260 / qtl',
      description: isHi
        ? 'औद्योगिक बॉयलरों और ईंट-भट्ठों के लिए घनीकृत ईंधन पेलेट्स, जो कोयले का पूर्ण विकल्प बनते हैं।'
        : 'Densified fuel pellets for industrial boilers and brick kilns, completely displacing fossil coal.'
    },
    {
      id: 'paddy-straw',
      name: isHi ? 'धान की पराली (Paddy Straw)' : 'Paddy Straw (Parali)',
      tagline: isHi ? 'बासमती व गैर-बासमती धान कटाई के बाद बचे डंठल' : 'Harvest residue from basmati & non-basmati rice',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=85',
      outcome: isHi ? 'बायो-सीएनजी और थर्मल ऊर्जा' : 'Bio-CNG & Thermal Energy',
      rate: isHi ? '₹220 - ₹280 / क्विंटल' : '₹220 - ₹280 / qtl',
      description: isHi
        ? 'स्वचालित बेलरों द्वारा खेत से सीधे उठाकर कंप्रेस्ड बायो-गैस (CBG) और 2G एथेनॉल संयंत्रों में आपूर्ति।'
        : 'Gathered by automated balers and fed directly into commercial Compressed Bio-Gas (CBG) and 2G ethanol plants.'
    },
    {
      id: 'wheat-husk',
      name: isHi ? 'गेहूं की तूड़ी / भूसा (Wheat Husk)' : 'Wheat Husk & Chaff (Turi)',
      tagline: isHi ? 'थ्रेशिंग के बाद की उच्च-कैलोरी सूखी तूड़ी' : 'High-calorific post-threshing dry husks',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=85',
      outcome: isHi ? 'मशरूम उत्पादन व सूखा चारा' : 'Mushroom Bedding & Dry Fodder',
      rate: isHi ? '₹400 - ₹650 / क्विंटल' : '₹400 - ₹650 / qtl',
      description: isHi
        ? 'पशुओं के लिए पौष्टिक सूखा चारा और मशरूम की खेती के लिए आवश्यक उच्च-गुणवत्ता वाला माध्यम।'
        : 'Nutritious livestock fodder and substrate for gourmet mushroom cultivation with high thermal energy recovery.'
    },
    {
      id: 'organic-waste',
      name: isHi ? 'जैविक कृषि अपशिष्ट (Organic Farm Waste)' : 'Organic Farm Waste',
      tagline: isHi ? 'सब्जियों के अवशेष, पत्तियां और बागवानी कचरा' : 'Horticulture trimmings, rejected vegetables & foliage',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=85',
      outcome: isHi ? 'प्रीमियम केंचुआ खाद (वर्मीकंपोस्ट)' : 'Premium Vermicompost',
      rate: isHi ? '₹140 - ₹190 / क्विंटल' : '₹140 - ₹190 / qtl',
      description: isHi
        ? 'केंचुआ खाद क्यारियों में जैविक अपघटन कराकर प्राकृतिक खाद तैयार की जाती है, जिससे रासायनिक खाद का खर्च घटता है।'
        : 'Decomposed through vermiculture earthworm beds to generate organic fertilizer that cuts synthetic urea bills.'
    },
    {
      id: 'animal-manure',
      name: isHi ? 'पशु खाद व गोबर (Animal Manure)' : 'Animal Manure & Dung',
      tagline: isHi ? 'डेयरी मवेशी गोबर और पोल्ट्री खाद' : 'Dairy cattle dung and poultry litter',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=85',
      outcome: isHi ? 'बायो-गैस और जैविक स्लरी' : 'Bio-Gas & Soil Conditioner',
      rate: isHi ? '₹90 - ₹140 / क्विंटल' : '₹90 - ₹140 / qtl',
      description: isHi
        ? 'बायोरिएक्टर में अवायवीय पाचन द्वारा घरेलू रसोई गैस और उत्कृष्ट तरल उर्वरक स्लरी का निर्माण।'
        : 'Digested in anaerobic bioreactors to generate domestic cooking gas and organic fermented manure slurry.'
    },
    {
      id: 'agricultural-plastics',
      name: isHi ? 'कृषि प्लास्टिक अपशिष्ट (Plastics)' : 'Agricultural Plastics',
      tagline: isHi ? 'ड्रिप सिंचाई पाइप, मल्चिंग फिल्म व खाद की बोरियां' : 'Drip irrigation pipes, mulching film & silage covers',
      image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=85',
      outcome: isHi ? 'पॉलिमर रीसाइक्लिंग व ड्रेनेज पाइप' : 'Polymer Re-extrusion & Piping',
      rate: isHi ? '₹18 - ₹26 / किलो' : '₹18 - ₹26 / kg',
      description: isHi
        ? 'साफ करके दाना (पेलेट) बनाया जाता है, जिससे सेकेंडरी कृषि पाइप बनते हैं और खेतों में माइक्रोप्लास्टिक रुकता है।'
        : 'Cleaned and re-pelletized into secondary drainage pipes and industrial geomembranes, stopping soil microplastics.'
    }
  ];

  return (
    <section className="py-20 bg-[#FAF9F3] border-b border-[#E2ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="agri-badge mb-3">{t('waste_types_badge')}</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0D3823] tracking-tight leading-tight">
              {t('waste_types_title')}
            </h2>
            <p className="text-base sm:text-lg text-[#4B6354] mt-3 leading-relaxed">
              {t('waste_types_desc')}
            </p>
          </div>

          <Link
            to="/waste-marketplace"
            className="btn-secondary text-xs sm:text-sm py-3 px-6 shrink-0 self-start md:self-auto font-bold hover:border-[#16A34A]"
          >
            {t('browse_marketplace_link')}
          </Link>
        </div>

        {/* 6 Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl overflow-hidden border border-[#E2ECE0] bg-white shadow-xs hover:shadow-xl hover:border-[#16A34A] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image with proper aspect ratio and zoom */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071F14]/75 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#15803D] font-extrabold text-[11px] uppercase tracking-wider shadow-xs">
                    {item.rate}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white text-[11px] font-bold uppercase tracking-wider block opacity-90">
                    {isHi ? 'पुनर्चक्रण परिणाम:' : 'Recycling Outcome:'}
                  </span>
                  <span className="text-white text-sm font-extrabold block">
                    {item.outcome}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0D3823] group-hover:text-[#16A34A] transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-xs text-[#16A34A] font-semibold block mt-1">
                    {item.tagline}
                  </span>
                  <p className="text-xs sm:text-sm text-[#4B6354] mt-2.5 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2ECE0]">
                  <Link
                    to="/waste-marketplace"
                    className="text-xs font-bold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1.5"
                  >
                    <span>{isHi ? 'मार्केटप्लेस में लिस्टिंग खोजें' : 'Search Active Lots'}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WasteTypes;
