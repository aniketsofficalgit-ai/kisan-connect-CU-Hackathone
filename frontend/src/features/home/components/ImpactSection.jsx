import React, { useState, useEffect } from 'react';
import { Wind, ShieldAlert, Coins, Sprout } from 'lucide-react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';

export const ImpactSection = () => {
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const [metrics, setMetrics] = useState({
    co2_saved_tonnes: 9.75,
    stubble_acres_saved: 3.2,
    total_waste_collected_tonnes: 6.5,
    total_farmer_payout: 10400
  });

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data?.metrics) {
          setMetrics(res.data.metrics);
        }
      } catch (e) {
        // baseline metrics
      }
    };
    fetchImpact();
  }, []);

  return (
    <section className="py-20 bg-[#FAF9F3] border-b border-[#E2ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header on Warm Cream */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="agri-badge mb-3">{t('impact_badge')}</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0D3823] tracking-tight leading-tight">
            {t('impact_title')}
          </h2>
          <p className="text-base sm:text-lg text-[#4B6354] mt-3 leading-relaxed">
            {t('impact_desc')}
          </p>
        </div>

        {/* Central Transformation Graphic & Metric Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Transformation Infographic Box (Pristine White Card) */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-[2rem] bg-white border border-[#E2ECE0] shadow-sm space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#347A46] block">
              {t('conversion_cycle_title')}
            </span>
            <div className="space-y-4 text-xs text-[#56715E]">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
                <span className="w-7 h-7 rounded-full bg-[#E8BD59] text-[#20392A] font-extrabold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-[#20392A] block text-sm font-extrabold">
                    {t('cycle1_title')}
                  </strong>
                  <span className="mt-0.5 block">
                    {t('cycle1_desc')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
                <span className="w-7 h-7 rounded-full bg-[#347A46] text-white font-extrabold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-[#20392A] block text-sm font-extrabold">
                    {t('cycle2_title')}
                  </strong>
                  <span className="mt-0.5 block">
                    {t('cycle2_desc')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF9F3] border border-[#E2ECE0]">
                <span className="w-7 h-7 rounded-full bg-[#68A66A] text-white font-extrabold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-[#20392A] block text-sm font-extrabold">
                    {t('cycle3_title')}
                  </strong>
                  <span className="mt-0.5 block">
                    {t('cycle3_desc')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Metrics Grid (Clean White Cards with Soft Green Highlights) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2rem] bg-white border border-[#E2ECE0] shadow-sm hover:border-[#68A66A] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center mb-4">
                <Wind size={24} />
              </div>
              <span className="text-3xl sm:text-4xl font-black text-[#347A46] block font-heading">
                {metrics.co2_saved_tonnes} {isHi ? 'टन' : 't'}
              </span>
              <span className="text-sm font-extrabold text-[#20392A] block mt-1">
                {t('metric_co2_label')}
              </span>
              <p className="text-xs text-[#56715E] mt-1.5 leading-relaxed">
                {t('metric_co2_desc')}
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white border border-[#E2ECE0] shadow-sm hover:border-[#68A66A] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center mb-4">
                <ShieldAlert size={24} />
              </div>
              <span className="text-3xl sm:text-4xl font-black text-[#347A46] block font-heading">
                {metrics.stubble_acres_saved} {isHi ? 'एकड़' : 'Acres'}
              </span>
              <span className="text-sm font-extrabold text-[#20392A] block mt-1">
                {t('metric_stubble_label')}
              </span>
              <p className="text-xs text-[#56715E] mt-1.5 leading-relaxed">
                {t('metric_stubble_desc')}
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white border border-[#E2ECE0] shadow-sm hover:border-[#68A66A] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center mb-4">
                <Sprout size={24} />
              </div>
              <span className="text-3xl sm:text-4xl font-black text-[#347A46] block font-heading">
                {metrics.total_waste_collected_tonnes} {isHi ? 'टन' : 't'}
              </span>
              <span className="text-sm font-extrabold text-[#20392A] block mt-1">
                {t('metric_waste_label')}
              </span>
              <p className="text-xs text-[#56715E] mt-1.5 leading-relaxed">
                {t('metric_waste_desc')}
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white border border-[#E2ECE0] shadow-sm hover:border-[#68A66A] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center mb-4">
                <Coins size={24} />
              </div>
              <span className="text-3xl sm:text-4xl font-black text-[#347A46] block font-heading">
                ₹{metrics.total_farmer_payout.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-extrabold text-[#20392A] block mt-1">
                {t('metric_payout_label')}
              </span>
              <p className="text-xs text-[#56715E] mt-1.5 leading-relaxed">
                {t('metric_payout_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
