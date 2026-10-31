import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  ShieldCheck,
  Tractor,
  Sparkles,
  Bot,
  Scale,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export const BenefitsSection = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Coins,
      title: t('benefit1_title'),
      desc: t('benefit1_desc')
    },
    {
      icon: ShieldCheck,
      title: t('benefit2_title'),
      desc: t('benefit2_desc')
    },
    {
      icon: Tractor,
      title: t('benefit3_title'),
      desc: t('benefit3_desc')
    },
    {
      icon: Sparkles,
      title: t('benefit4_title'),
      desc: t('benefit4_desc')
    },
    {
      icon: Scale,
      title: t('benefit5_title'),
      desc: t('benefit5_desc')
    },
    {
      icon: Bot,
      title: t('benefit6_title'),
      desc: t('benefit6_desc')
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E2ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="agri-badge mb-3">{t('benefits_badge')}</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#20392A] tracking-tight leading-tight">
            {t('benefits_title')}
          </h2>
          <p className="text-base sm:text-lg text-[#56715E] mt-3">
            {t('benefits_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#FAF9F3] border border-[#E2ECE0] hover:border-[#68A66A] hover:shadow-xl transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E8F1E5] text-[#347A46] flex items-center justify-center shadow-xs">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-[#20392A]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#56715E] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-8 sm:p-10 rounded-[2rem] bg-[#FAF9F3] border border-[#E2ECE0] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xl font-extrabold text-[#20392A]">
              {t('join_thousands_title')}
            </h4>
            <p className="text-sm text-[#56715E]">
              {t('join_thousands_desc')}
            </p>
          </div>
          <Link
            to="/signup"
            className="btn-primary text-sm py-3.5 px-7 shadow-xs shrink-0"
          >
            {t('create_farmer_acc')} <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
