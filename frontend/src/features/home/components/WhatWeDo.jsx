import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Coins, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export const WhatWeDo = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white border-b border-[#E2ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#15803D] text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-[#16A34A]" />
            <span>{t('what_we_do_badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0D3823] tracking-tight leading-tight">
            {t('what_we_do_title')}
          </h2>
          <p className="text-base sm:text-lg text-[#4B6354] mt-4 leading-relaxed font-normal">
            {t('what_we_do_desc')}
          </p>
        </div>

        {/* 3-Pillar Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: Large Feature with Authentic Photo */}
          <div className="lg:col-span-7 bg-[#FAF9F3] rounded-3xl border border-[#E2ECE0] overflow-hidden flex flex-col justify-between group hover:border-[#16A34A] transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className="p-8 sm:p-10 space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#15803D] block">
                {t('farm_gate_tag')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D3823]">
                {t('farm_gate_title')}
              </h3>
              <p className="text-sm sm:text-base text-[#4B6354] leading-relaxed">
                {t('farm_gate_desc')}
              </p>
            </div>

            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100 mt-2">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=85"
                alt="Farmer and agritech specialist working together in Indian field"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Cards 2 & 3: Stacked Value Cards */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-[#FAF9F3] p-8 rounded-3xl border border-[#E2ECE0] flex-1 flex flex-col justify-between space-y-4 hover:border-[#16A34A] transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#15803D] flex items-center justify-center border border-[#A7F3D0] group-hover:scale-105 transition-transform">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-[#0D3823]">
                  {t('baler_title')}
                </h4>
                <p className="text-sm text-[#4B6354] mt-2 leading-relaxed">
                  {t('baler_desc')}
                </p>
              </div>
              <div className="pt-2">
                <Link to="/find-partners" className="text-xs font-bold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1">
                  {t('baler_link')} <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="bg-[#FAF9F3] p-8 rounded-3xl border border-[#E2ECE0] flex-1 flex flex-col justify-between space-y-4 hover:border-[#16A34A] transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#15803D] flex items-center justify-center border border-[#A7F3D0] group-hover:scale-105 transition-transform">
                <Coins size={24} />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-[#0D3823]">
                  {t('payment_title')}
                </h4>
                <p className="text-sm text-[#4B6354] mt-2 leading-relaxed">
                  {t('payment_desc')}
                </p>
              </div>
              <div className="pt-2">
                <Link to="/waste-marketplace" className="text-xs font-bold text-[#15803D] hover:text-[#166534] inline-flex items-center gap-1">
                  {t('payment_link')} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
