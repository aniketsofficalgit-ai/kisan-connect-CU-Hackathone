import React, { useState } from 'react';
import { Sprout, Mic, Sparkles, ShieldCheck, HeartHandshake, BookOpen, ExternalLink } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useLanguage } from '../../context/LanguageContext';

export const AIAssistantPage = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF9F3] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-8 border border-[#E2ECE0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#15803D] text-xs font-heading font-extrabold uppercase tracking-wider">
              <Sprout size={14} className="text-[#16A34A]" />
              <span>{t('ai_page_badge')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#0D3823] tracking-tight">
              {t('ai_page_title')}
            </h1>
            <p className="text-sm sm:text-base text-[#4B6354] max-w-2xl font-sans leading-relaxed">
              {t('ai_page_desc')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-center">
              <span className="text-xs font-heading font-bold text-[#16A34A] block uppercase tracking-wider">{t('languages_label')}</span>
              <span className="text-sm font-heading font-extrabold text-[#15803D]">{t('languages_val')}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-center">
              <span className="text-xs font-heading font-bold text-[#16A34A] block uppercase tracking-wider">{t('voice_mode_label')}</span>
              <span className="text-sm font-heading font-extrabold text-[#15803D]">{t('voice_mode_val')}</span>
            </div>
          </div>
        </div>

        {/* Embedded Full Assistant Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Assistant Column */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E2ECE0] overflow-hidden shadow-sm h-[680px] flex flex-col relative">
            <ChatWindow onClose={() => {}} embedded={true} />
          </div>

          {/* Right Guidance Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Voice Assistant Rules Card */}
            <div className="bg-white p-7 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#347A46]">
                <Mic size={22} className="text-[#E8BD59]" />
                <h3 className="font-heading font-extrabold text-base text-[#20392A]">{t('how_voice_works')}</h3>
              </div>
              <ul className="text-xs text-[#56715E] space-y-3 font-sans">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#E8F1E5] text-[#347A46] font-bold flex items-center justify-center shrink-0">1</span>
                  <span><strong className="text-[#20392A]">{t('voice_step1_strong')}</strong> {t('voice_step1_desc')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#E8F1E5] text-[#347A46] font-bold flex items-center justify-center shrink-0">2</span>
                  <span><strong className="text-[#20392A]">{t('voice_step2_strong')}</strong> {t('voice_step2_desc')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#E8F1E5] text-[#347A46] font-bold flex items-center justify-center shrink-0">3</span>
                  <span><strong className="text-[#20392A]">{t('voice_step3_strong')}</strong> {t('voice_step3_desc')}</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-7 rounded-3xl border border-[#E2ECE0] shadow-sm space-y-3.5">
              <h4 className="font-heading font-extrabold text-sm text-[#20392A] uppercase tracking-wider">
                {t('direct_actions')}
              </h4>
              <div className="space-y-2 text-xs font-sans">
                <a
                  href="/add-waste"
                  className="block p-3.5 rounded-2xl bg-[#FAF9F3] hover:bg-[#E8F1E5] text-[#347A46] font-heading font-bold border border-[#E2ECE0] transition-colors"
                >
                  {t('action_list_waste')}
                </a>
                <a
                  href="/find-partners"
                  className="block p-3.5 rounded-2xl bg-[#FAF9F3] hover:bg-[#E8F1E5] text-[#347A46] font-heading font-bold border border-[#E2ECE0] transition-colors"
                >
                  {t('action_find_partners')}
                </a>
                <a
                  href="/recycling-education"
                  className="block p-3.5 rounded-2xl bg-[#FAF9F3] hover:bg-[#E8F1E5] text-[#347A46] font-heading font-bold border border-[#E2ECE0] transition-colors"
                >
                  {t('action_education')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
