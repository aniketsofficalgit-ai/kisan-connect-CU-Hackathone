import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export const JoinNetwork = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#FAF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-2xl mx-auto">
          <span className="agri-badge mb-3">{t('join_badge')}</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0D3823] tracking-tight leading-tight">
            {t('join_title')}
          </h2>
          <p className="text-base text-[#4B6354] mt-3">
            {t('join_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: I am a Farmer */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E2ECE0] shadow-xs hover:shadow-2xl hover:border-[#16A34A] transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#15803D] flex items-center justify-center border border-[#A7F3D0]">
                <Sprout size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0D3823]">
                {t('i_am_farmer')}
              </h3>
              <p className="text-sm text-[#4B6354] leading-relaxed">
                {t('i_am_farmer_desc')}
              </p>

              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#0D3823] font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
                  <span>{t('farmer_point1')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
                  <span>{t('farmer_point2')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
                  <span>{t('farmer_point3')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E2ECE0]">
              <Link
                to="/signup?role=farmer"
                className="btn-primary w-full py-3.5 text-sm sm:text-base font-bold shadow-md shadow-[#16A34A]/20 text-center justify-center"
              >
                {t('register_farmer_btn')} <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* Card 2: I am a Recycling Partner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E2ECE0] shadow-xs hover:shadow-2xl hover:border-[#16A34A] transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF9F3] text-[#15803D] border border-[#E2ECE0] flex items-center justify-center">
                <Building2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0D3823]">
                {t('i_am_partner')}
              </h3>
              <p className="text-sm text-[#4B6354] leading-relaxed">
                {t('i_am_partner_desc')}
              </p>

              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#0D3823] font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
                  <span>{t('partner_point1')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
                  <span>{t('partner_point2')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
                  <span>{t('partner_point3')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E2ECE0]">
              <Link
                to="/signup?role=partner"
                className="btn-secondary w-full py-3.5 text-sm sm:text-base font-bold text-center justify-center hover:border-[#16A34A]"
              >
                {t('register_partner_btn')} <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinNetwork;
