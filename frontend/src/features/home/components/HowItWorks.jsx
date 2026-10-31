import React from 'react';
import { PlusCircle, Search, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';

export const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('step1_title'),
      desc: t('step1_desc'),
      tag: t('step1_tag'),
      icon: PlusCircle
    },
    {
      num: '02',
      title: t('step2_title'),
      desc: t('step2_desc'),
      tag: t('step2_tag'),
      icon: Search
    },
    {
      num: '03',
      title: t('step3_title'),
      desc: t('step3_desc'),
      tag: t('step3_tag'),
      icon: CalendarCheck
    },
    {
      num: '04',
      title: t('step4_title'),
      desc: t('step4_desc'),
      tag: t('step4_tag'),
      icon: CheckCircle2
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-[#E2ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="agri-badge mb-3">{t('how_works_badge')}</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0D3823] tracking-tight leading-tight">
            {t('how_works_title')}
          </h2>
          <p className="text-base sm:text-lg text-[#4B6354] mt-3">
            {t('how_works_desc')}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative rounded-3xl p-8 bg-[#FAF9F3] border border-[#E2ECE0] hover:border-[#16A34A] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-[#15803D] font-heading opacity-90 group-hover:scale-110 transition-transform">
                      {s.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2ECE0] text-[#15803D] flex items-center justify-center shadow-xs group-hover:bg-[#ECFDF5] transition-colors">
                      <Icon size={24} />
                    </div>
                  </div>

                  <span className="text-[11px] uppercase font-extrabold tracking-wider text-[#16A34A] block mb-2">
                    {s.tag}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0D3823] mb-2.5">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B6354] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modern Callout Strip */}
        <div className="p-8 sm:p-10 rounded-[2rem] bg-[#FAF9F3] border border-[#E2ECE0] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-xl font-extrabold text-[#20392A]">
              {t('callout_ready_title')}
            </h4>
            <p className="text-sm text-[#56715E]">
              {t('callout_ready_desc')}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/signup"
              className="btn-primary text-sm py-3.5 px-7 shadow-xs"
            >
              {t('start_free_listing')} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
