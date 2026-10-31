import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Sprout, TrendingUp, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export const Hero = () => {
  const { language, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F3] via-[#F4F8F3] to-[#FAF9F3] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E2ECE0]">
      {/* Subtle decorative glowing background blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#16A34A]/10 to-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Two-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#15803D] text-xs font-extrabold uppercase tracking-wider shadow-xs">
              <Sparkles size={14} className="text-[#16A34A] animate-pulse" />
              <span>{t('hero_badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0D3823] tracking-tight leading-[1.12]">
              {t('hero_headline_pre')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#15803D]">
                {t('hero_headline_highlight')}
              </span>{' '}
              {t('hero_headline_post')}
            </h1>

            <p className="text-base sm:text-lg text-[#4B6354] leading-relaxed max-w-xl font-normal">
              {t('hero_description')}
            </p>

            {/* Clear CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/waste-marketplace"
                className="btn-primary text-sm sm:text-base py-3.5 px-8 shadow-lg shadow-[#16A34A]/20"
              >
                <Search size={18} /> {t('hero_cta_explore')}
              </Link>

              <Link
                to="/find-partners"
                className="btn-secondary text-sm sm:text-base py-3.5 px-8 hover:border-[#16A34A]"
              >
                {t('hero_cta_partners')} <ArrowRight size={18} />
              </Link>
            </div>

            {/* Live Platform Highlights */}
            <div className="pt-6 border-t border-[#E2ECE0] grid grid-cols-3 gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#15803D] block font-heading">
                  {t('stat_tonnes_val')}
                </span>
                <span className="text-xs text-[#4B6354] font-medium">
                  {t('stat_tonnes_label')}
                </span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#15803D] block font-heading">
                  {t('stat_buyers_val')}
                </span>
                <span className="text-xs text-[#4B6354] font-medium">
                  {t('stat_buyers_label')}
                </span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#15803D] block font-heading">
                  {t('stat_fee_val')}
                </span>
                <span className="text-xs text-[#4B6354] font-medium">
                  {t('stat_fee_label')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual with Smart Telemetry Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[2.25rem] overflow-hidden border border-[#E2ECE0] shadow-2xl bg-white aspect-4/3 sm:aspect-[16/11] group">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1600&q=85"
                alt="Modern sustainable agriculture and crop residue management in Indian fields"
                className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700"
              />

              {/* Dark subtle gradient overlay on the image for telemetry readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071F14]/75 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating Top Telemetry Badge: AI Residue Scanner */}
              <div className="absolute top-5 left-5 p-2.5 px-3.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E2ECE0] shadow-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping"></span>
                <span className="text-xs font-heading font-extrabold text-[#0D3823]">
                  {t('hero_ai_match')}
                </span>
              </div>

              {/* Floating Top-Right Telemetry Badge */}
              <div className="absolute top-5 right-5 p-2.5 px-3.5 rounded-full bg-[#0D3823]/90 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2 text-white">
                <Sprout size={14} className="text-[#4ADE80]" />
                <span className="text-xs font-heading font-bold">
                  {t('hero_zero_burning')}
                </span>
              </div>

              {/* Floating Bottom Overlay Card */}
              <div className="absolute bottom-5 left-5 right-5 sm:left-6 sm:right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2ECE0] shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#16A34A] block">
                    {t('hero_biomass_network')}
                  </span>
                  <span className="font-extrabold text-sm sm:text-base text-[#0D3823]">
                    {t('hero_biomass_rate')}
                  </span>
                  <p className="text-[11px] text-[#4B6354]">
                    {t('hero_biomass_desc')}
                  </p>
                </div>
                <Link
                  to="/find-partners"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-md"
                  title={t('hero_cta_partners')}
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Below-Hero Trust Indicators Bar */}
        <div className="pt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2ECE0] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#15803D] flex items-center justify-center shrink-0 border border-[#A7F3D0]">
                <Sprout size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#0D3823]">
                  {t('trust_sustainable')}
                </h3>
                <p className="text-xs text-[#4B6354] mt-0.5">
                  {t('trust_sustainable_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#15803D] flex items-center justify-center shrink-0 border border-[#A7F3D0]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#0D3823]">
                  {t('trust_verified')}
                </h3>
                <p className="text-xs text-[#4B6354] mt-0.5">
                  {t('trust_verified_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#15803D] flex items-center justify-center shrink-0 border border-[#A7F3D0]">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#0D3823]">
                  {t('trust_value')}
                </h3>
                <p className="text-xs text-[#4B6354] mt-0.5">
                  {t('trust_value_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
