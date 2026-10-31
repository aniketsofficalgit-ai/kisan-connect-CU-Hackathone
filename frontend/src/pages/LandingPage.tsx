import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Wrench, Sprout, CloudSun, Mic, ArrowRight,
  ShieldCheck, CheckCircle2, MapPin, Sparkles, MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const services = [
    {
      title: 'Find Agricultural Workers',
      description: 'Discover skilled laborers for harvesting, sowing, tilling, spraying, and manual farm operations. Filter by wage, availability, and experience.',
      icon: Users,
      link: '/workers',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      title: 'Rent Machinery & Implements',
      description: 'Rent nearby tractors, combine harvesters, rotavators, sprayers, and solar irrigation pumps with or without operators on hourly or daily rates.',
      icon: Wrench,
      link: '/machinery',
      color: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      title: 'Sell Your Crops Directly',
      description: 'List your harvested grains, pulses, oilseeds, and vegetables directly to verified wholesale buyers. Negotiate prices fairly with zero middlemen.',
      icon: Sprout,
      link: '/crops',
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      title: 'Weather & AI Voice Guidance',
      description: 'Get real-time localized weather data, 7-day spray suitability advisories, and an instant agricultural voice assistant in Hindi, Punjabi, and English.',
      icon: CloudSun,
      link: '/weather',
      color: 'bg-purple-50 text-purple-800 border-purple-200'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Tell Us What You Need',
      desc: 'Whether you require labor for seasonal wheat harvesting, a 50HP tractor for field preparation, or a buyer for your basmati crop, specify your requirements in seconds.'
    },
    {
      num: '02',
      title: 'Discover Verified Local Partners',
      desc: 'Browse nearby verified workers, equipment owners, and registered buyers within your district with transparent daily/hourly rates and specifications.'
    },
    {
      num: '03',
      title: 'Connect and Coordinate',
      desc: 'Send direct booking requests, negotiate produce prices through in-app messaging, track confirmation statuses, and receive instant updates.'
    }
  ];

  const benefits = [
    {
      title: 'Direct Accessibility',
      desc: 'Designed with large touch controls, voice recognition, and simple sans-serif typography for farmers with varying digital literacy.'
    },
    {
      title: 'Hyperlocal Proximity',
      desc: 'Filter agricultural resources and equipment within your village and district to avoid unnecessary transport costs or delays.'
    },
    {
      title: 'Transparent Pricing',
      desc: 'Clear rental rates per hour or per day, explicit details on operator/fuel inclusions, and fair grain procurement terms.'
    },
    {
      title: 'Verified Profiles',
      desc: 'Identity verification through official documentation (Aadhaar, Kisan Credit Cards, Commercial Registrations) builds trust across the community.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF5EC] via-[#F4F7F3] to-[#F4F7F3] py-16 sm:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-300 text-xs font-semibold text-[#176B3A] shadow-xs mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Digital Agriculture Ecosystem for Indian Farmers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#173D2A] tracking-tight max-w-4xl mx-auto leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#176B3A] text-white font-bold text-sm hover:bg-[#173D2A] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/workers"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white border border-gray-300 text-gray-800 font-bold text-sm hover:bg-gray-50 shadow-xs transition-all flex items-center justify-center"
            >
              {t('exploreServices')}
            </Link>
          </div>

          {/* Quick highlights bar */}
          <div className="mt-14 pt-8 border-t border-emerald-200/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="bg-white/80 p-3.5 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-900">🌾 Direct Farm Gate</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Zero middlemen commission</p>
            </div>
            <div className="bg-white/80 p-3.5 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-900">🚜 Modern Fleet</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Tractors, reapers, drills</p>
            </div>
            <div className="bg-white/80 p-3.5 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-900">👥 Verified Labor</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Daily & task-based work</p>
            </div>
            <div className="bg-white/80 p-3.5 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-900">🎙️ AI Voice Help</p>
              <p className="text-[11px] text-gray-500 mt-0.5">English, Hindi & Punjabi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Core Services Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#176B3A]">Core Modules</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              One Unified Solution for Every Stage of the Farm Cycle
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${srv.color} mb-5`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#176B3A] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link
                      to={srv.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B3A] group-hover:underline"
                    >
                      <span>Explore Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-[#F4F7F3] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#176B3A]">Simple Process</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              How Kisan Connect Works for You
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Clear, reliable steps without confusing registration hurdles.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 border border-gray-200/80 shadow-xs relative">
                <span className="text-4xl font-black text-emerald-100 absolute top-5 right-6 select-none">
                  {st.num}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2">{st.title}</h3>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual Voice Assistant Feature Spotlight */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#173D2A] to-[#176B3A] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold border border-white/20">
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>Multilingual Speech & Audio</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Speak in Your Language. Get Practical Agricultural Guidance.
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Farmers who prefer speaking over typing can ask questions in English, Hindi (हिंदी), or Punjabi (ਪੰਜਾਬੀ). Ask about water scheduling, tractor availability, harvesting labor, or current weather advisories.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs bg-white/15 px-3 py-1 rounded-full border border-white/20">“When should I water my crop?”</span>
                <span className="text-xs bg-white/15 px-3 py-1 rounded-full border border-white/20">“फसल में खाद कब डालें?”</span>
                <span className="text-xs bg-white/15 px-3 py-1 rounded-full border border-white/20">“ਕਣਕ ਦੀ ਵਾਢੀ ਲਈ ਮਜ਼ਦੂਰ”</span>
              </div>
            </div>

            <div className="bg-white text-gray-900 p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Mic className="w-6 h-6 text-[#176B3A]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Interactive Voice Assistant</h4>
                  <p className="text-xs text-gray-500">Live speech recognition</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                “Recommended: Soil moisture is critical during tillering. Postpone spraying as wind speed is 19 km/h today.”
              </p>
              <Link
                to="/ai-assistant"
                className="w-full py-3 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors flex items-center justify-center gap-2"
              >
                <span>Try Voice Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-[#F4F7F3] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#176B3A]">Platform Principles</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Built on Transparency, Trust, and Rural Convenience
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
                <CheckCircle2 className="w-6 h-6 text-[#176B3A] mb-3" />
                <h3 className="font-bold text-sm text-gray-900">{b.title}</h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Join Kisan Connect Today
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            Whether you are a farmer looking for seasonal support or a machinery owner wanting to earn from idle equipment, sign up in just 2 minutes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-8 py-3 rounded-2xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-2xl bg-white border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
