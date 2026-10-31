import React, { useState, useEffect } from 'react';
import {
  BookOpen, Leaf, ShieldAlert, ArrowRight, Wheat, Sprout,
  Recycle, PawPrint, Flame, Sparkles
} from 'lucide-react';
import api from '../../services/api';
import WasteCategories from './WasteCategories';
import RecyclingDetails from './RecyclingDetails';
import Loading from '../../components/Loading/Loading';
import { useLanguage } from '../../context/LanguageContext';
import './Recycling.css';

export const RecyclingGuide = () => {
  const { language, t } = useLanguage();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [activeTab, setActiveTab] = useState('guides'); // 'guides' or 'categories'

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recycling/guides');
        setGuides(res.data.guides || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-heading font-extrabold text-[#15803D] bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
          {t('guide_badge')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-[#0D3823] mt-3 tracking-tight">
          {t('guide_title')}
        </h1>
        <p className="text-sm sm:text-base text-[#4B6354] mt-2 font-sans leading-relaxed">
          {t('guide_desc')}
        </p>

        {/* Tab switch */}
        <div className="inline-flex bg-[#E8F1E5] p-1.5 rounded-full mt-6 border border-[#E2ECE0]">
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-5 py-2.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'guides' ? 'bg-[#347A46] text-white shadow-xs' : 'text-[#20392A] hover:text-[#347A46]'
            }`}
          >
            {t('tab_practical_guides')}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-2.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-[#347A46] text-white shadow-xs' : 'text-[#20392A] hover:text-[#347A46]'
            }`}
          >
            {t('tab_waste_directory')}
          </button>
        </div>
      </div>

      {activeTab === 'categories' ? (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#20392A]">{t('six_core_streams')}</h2>
          <WasteCategories onSelectCategory={(catName) => {
            const match = guides.find(g => g.waste_category?.toLowerCase().includes(catName.toLowerCase()));
            if (match) setSelectedGuide(match);
          }} />
        </div>
      ) : loading ? (
        <Loading message={t('loading_guides')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <div key={guide.id} className="edu-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-heading font-bold text-[#347A46] uppercase tracking-wider bg-[#E8F1E5] px-3 py-1 rounded-full">
                  {guide.waste_category}
                </span>
                <span className="text-xs font-heading font-bold text-[#347A46]">
                  {guide.estimated_value_potential}
                </span>
              </div>

              <h3 className="font-heading font-black text-lg sm:text-xl text-[#20392A] mb-1.5">
                {guide.title}
              </h3>
              <p className="text-xs font-heading font-bold text-[#68A66A] mb-3">
                Method: {guide.reuse_method}
              </p>

              <p className="text-xs sm:text-sm text-[#56715E] leading-relaxed line-clamp-3 mb-6 flex-1 font-sans">
                {guide.summary}
              </p>

              <div className="pt-4 border-t border-[#E2ECE0] flex items-center justify-between mt-auto">
                <button
                  onClick={() => setSelectedGuide(guide)}
                  className="btn-primary text-xs py-2.5 px-5 rounded-full flex items-center gap-2 font-heading font-bold cursor-pointer"
                >
                  Read Full Instructions <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Guide Details Modal */}
      {selectedGuide && (
        <RecyclingDetails
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
        />
      )}
    </div>
  );
};

export default RecyclingGuide;
