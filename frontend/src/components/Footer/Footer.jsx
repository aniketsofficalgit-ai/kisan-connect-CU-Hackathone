import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

export const Footer = () => {
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const wasteStreams = [
    isHi ? 'फसल अवशेष व पराली' : 'Crop Residue & Stubble',
    isHi ? 'गेहूं की तूड़ी व भूसा' : 'Wheat Straw & Husk (Bhusa)',
    isHi ? 'जैविक कृषि अपशिष्ट' : 'Organic Farm Waste',
    isHi ? 'पशु गोबर व स्लरी' : 'Animal Manure (Gobar)',
    isHi ? 'कृषि प्लास्टिक व ड्रिप पाइप' : 'Agricultural Plastics'
  ];

  return (
    <footer className="kc-footer-premium mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8B94F] text-[#19201C] flex items-center justify-center font-bold shadow-sm">
                <Sprout size={24} />
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-white tracking-tight block leading-none">
                  {t('brand_name')}
                </span>
                <span className="text-[11px] font-semibold text-[#E8B94F] tracking-wider uppercase mt-1 block">
                  {t('tagline')}
                </span>
              </div>
            </div>

            <p className="kc-footer-text max-w-sm">
              {t('footer_text')}
            </p>

            <div className="pt-2">
              <div className="kc-footer-badge">
                <span className="text-[#E8B94F] font-heading font-extrabold text-[11px] tracking-wider uppercase block mb-1">
                  {t('engineered_by')}
                </span>
                <span className="text-white text-xs font-semibold">
                  {t('team_members')}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="kc-footer-heading">
              {t('footer_platform_links')}
            </h4>
            <ul className="space-y-1">
              <li><Link to="/" className="kc-footer-link-premium">{t('home')}</Link></li>
              <li><Link to="/waste-marketplace" className="kc-footer-link-premium">{t('explore_waste')}</Link></li>
              <li><Link to="/find-partners" className="kc-footer-link-premium">{t('find_partners')}</Link></li>
              <li><a href="/#how-it-works" className="kc-footer-link-premium">{t('how_it_works')}</a></li>
              <li><Link to="/about" className="kc-footer-link-premium">{t('about_us')}</Link></li>
              <li><Link to="/recycling-education" className="kc-footer-link-premium">{t('education')}</Link></li>
            </ul>
          </div>

          {/* Waste Categories */}
          <div className="lg:col-span-2">
            <h4 className="kc-footer-heading">
              {t('footer_waste_streams')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E2EAE0]">
              {wasteStreams.map((ws, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Leaf size={13} className="text-[#E8B94F] shrink-0" />
                  <span>{ws}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Farmer Support Helpline Contacts */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="kc-footer-heading">
              {t('footer_helpline')}
            </h4>
            <div className="flex items-start gap-3 text-xs text-[#E2EAE0]">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#E8B94F]">
                <Phone size={15} />
              </div>
              <div>
                <span className="font-bold text-white block">{t('toll_free_kisan')}</span>
                <span className="text-[#7AE0A3] font-bold text-sm">1800-180-1551</span>
                <span className="block text-[11px] text-gray-400">{t('available_hours')}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-[#E2EAE0]">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#E8B94F]">
                <Mail size={15} />
              </div>
              <div>
                <span className="font-bold text-white block">{t('official_support')}</span>
                <span className="text-[#E2EAE0]">support@kisanconnect.gov.in</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-[#E2EAE0]">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#E8B94F]">
                <MapPin size={15} />
              </div>
              <div>
                <span className="font-bold text-white block">{t('operational_hubs')}</span>
                <span className="text-[#E2EAE0]">{t('operational_hubs_val')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/12 flex flex-col sm:flex-row items-center justify-between text-xs text-[#CBD8C8] gap-4">
          <p>
            © {new Date().getFullYear()} {t('brand_name')}. {t('designed_for_farmers')}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#E8B94F] font-semibold">
              <ShieldCheck size={14} /> {t('zero_stubble_mission')}
            </span>
            <span>•</span>
            <Link to="/recycling-education" className="text-white hover:text-[#E8B94F] transition-colors underline">
              {t('safety_guidelines')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
