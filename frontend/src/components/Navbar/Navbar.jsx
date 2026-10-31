import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout, Menu, X, PlusCircle, Search, Truck, BookOpen,
  LayoutDashboard, User as UserIcon, LogOut, Globe, Shield, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import NotificationBell from '../../features/notifications/NotificationBell';
import './Navbar.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="kc-navbar-premium">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-8 2xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 xl:gap-3 2xl:gap-6">
          {/* Brand Logo - Fixed/Max-Content Dedicated Space with Zero Overlap */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group text-decoration-none shrink-0" style={{ minWidth: 'max-content' }}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#0D3823] text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-sm shrink-0">
              <Sprout size={20} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col shrink-0">
              <span className="font-extrabold text-base sm:text-lg xl:text-xl tracking-tight text-[#0D3823] leading-none whitespace-nowrap">
                {t('brand_name')}
              </span>
              <span className="text-[10px] font-semibold text-[#16A34A] tracking-wide mt-1 hidden 2xl:block truncate max-w-[200px]">
                {t('tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (xl+: 1280px+) */}
          <nav className="hidden xl:flex items-center gap-0.5 xl:gap-1 2xl:gap-2 flex-1 justify-center min-w-0 px-1">
            <Link to="/" className={`kc-nav-link-premium ${isActive('/') ? 'active' : ''}`}>
              {t('home')}
            </Link>
            <Link to="/waste-marketplace" className={`kc-nav-link-premium ${isActive('/waste-marketplace') ? 'active' : ''}`}>
              {t('explore_waste')}
            </Link>
            <Link to="/find-partners" className={`kc-nav-link-premium ${isActive('/find-partners') ? 'active' : ''}`}>
              {t('find_partners')}
            </Link>
            <a href="/#how-it-works" className="kc-nav-link-premium">
              {t('how_it_works')}
            </a>
            <Link to="/about" className={`kc-nav-link-premium ${isActive('/about') ? 'active' : ''}`}>
              {t('about_us')}
            </Link>
            <Link to="/recycling-education" className={`kc-nav-link-premium ${isActive('/recycling-education') ? 'active' : ''}`}>
              {t('education')}
            </Link>

            {/* Role Specific Shortcuts */}
            {isAuthenticated && user?.role === 'farmer' && (
              <Link to="/farmer-dashboard" className={`kc-dashboard-nav-pill ${isActive('/farmer-dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={14} className="shrink-0" />
                <span>{t('farmer_dashboard')}</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'partner' && (
              <Link to="/partner-dashboard" className={`kc-dashboard-nav-pill ${isActive('/partner-dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={14} className="shrink-0" />
                <span>{t('partner_dashboard')}</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin-dashboard" className={`kc-dashboard-nav-pill text-amber-900 bg-amber-50 border-amber-200 ${isActive('/admin-dashboard') ? 'active' : ''}`}>
                <Shield size={14} className="shrink-0" />
                <span>{t('admin_dashboard')}</span>
              </Link>
            )}
          </nav>

          {/* Desktop Header Right Actions (xl+: 1280px+) */}
          <div className="hidden xl:flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Segmented Language Switcher */}
            <div className="kc-lang-switch-group shrink-0" role="group" aria-label="Language selector">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`kc-lang-toggle-btn ${language === 'en' ? 'active' : ''}`}
                aria-pressed={language === 'en'}
                title="View website in English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`kc-lang-toggle-btn ${language === 'hi' ? 'active' : ''}`}
                aria-pressed={language === 'hi'}
                title="वेबसाइट हिन्दी में देखें"
              >
                हिन्दी
              </button>
            </div>

            {/* Notifications Bell */}
            <NotificationBell />

            {/* Authenticated User or Login/Join buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#E2ECE0] shrink-0">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F1E5] hover:bg-[#DEEAD9] text-xs font-bold text-[#347A46] transition-colors shrink-0"
                >
                  <UserIcon size={14} className="text-[#68A66A] shrink-0" />
                  <span className="max-w-[110px] truncate">{user.full_name}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#347A46] text-white shrink-0">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors cursor-pointer shrink-0"
                  title={t('logout')}
                  aria-label={t('logout')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
                <Link
                  to="/login"
                  className="kc-navbar-login-btn shrink-0"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="kc-navbar-join-btn shrink-0"
                >
                  {language === 'hi' ? 'मंच से जुड़ें' : 'Join Platform'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Header Right (Screen < 1280px: 1024px, 768px, 390px) */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
            {/* Quick dashboard pill for tablet/medium screens */}
            {isAuthenticated && user?.role === 'farmer' && (
              <Link
                to="/farmer-dashboard"
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F1E5] text-[#15803D] text-xs font-bold shrink-0 hover:bg-[#DEEAD9]"
              >
                <LayoutDashboard size={13} />
                <span className="truncate max-w-[120px]">{t('farmer_dashboard')}</span>
              </Link>
            )}
            {isAuthenticated && user?.role === 'partner' && (
              <Link
                to="/partner-dashboard"
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F1E5] text-[#15803D] text-xs font-bold shrink-0 hover:bg-[#DEEAD9]"
              >
                <LayoutDashboard size={13} />
                <span className="truncate max-w-[120px]">{t('partner_dashboard')}</span>
              </Link>
            )}

            {/* Segmented language switcher on mobile / tablet */}
            <div className="kc-lang-switch-group shrink-0" role="group" aria-label="Language selector">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`kc-lang-toggle-btn text-[11px] px-2 py-1 min-w-[34px] sm:min-w-[42px] ${language === 'en' ? 'active' : ''}`}
                aria-pressed={language === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`kc-lang-toggle-btn text-[11px] px-2 py-1 min-w-[34px] sm:min-w-[42px] ${language === 'hi' ? 'active' : ''}`}
                aria-pressed={language === 'hi'}
              >
                हिन्दी
              </button>
            </div>

            <NotificationBell />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#0D3823] hover:bg-[#ECFDF5] transition-colors cursor-pointer border border-[#E2ECE0] shrink-0"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer (< 1280px) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/98 backdrop-blur-xl border-t border-[#E2ECE0] px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`kc-drawer-link ${isActive('/') ? 'active' : ''}`}
            >
              {t('home')}
            </Link>
            <Link
              to="/waste-marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className={`kc-drawer-link ${isActive('/waste-marketplace') ? 'active' : ''}`}
            >
              {t('explore_farm_waste')}
            </Link>
            <Link
              to="/find-partners"
              onClick={() => setMobileMenuOpen(false)}
              className={`kc-drawer-link ${isActive('/find-partners') ? 'active' : ''}`}
            >
              {t('find_partners')}
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="kc-drawer-link"
            >
              {t('how_it_works')}
            </a>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`kc-drawer-link ${isActive('/about') ? 'active' : ''}`}
            >
              {t('about_us')}
            </Link>
            <Link
              to="/recycling-education"
              onClick={() => setMobileMenuOpen(false)}
              className={`kc-drawer-link ${isActive('/recycling-education') ? 'active' : ''}`}
            >
              {t('education')}
            </Link>
          </nav>

          {/* Role specific mobile shortcuts */}
          {isAuthenticated && user?.role === 'farmer' && (
            <div className="p-3 bg-[#E8F1E5] rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#347A46] tracking-wider block">
                {t('farmer_console')}
              </span>
              <Link
                to="/farmer-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-[#347A46]"
              >
                {t('farmer_dashboard')} &rarr;
              </Link>
              <Link
                to="/add-waste"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#68A66A]"
              >
                + {t('list_sell_waste')}
              </Link>
              <Link
                to="/tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#20392A]"
              >
                {t('track_collection')}
              </Link>
            </div>
          )}

          {isAuthenticated && user?.role === 'partner' && (
            <div className="p-3 bg-[#E8F1E5] rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#347A46] tracking-wider block">
                {t('partner_console')}
              </span>
              <Link
                to="/partner-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-[#347A46]"
              >
                {t('partner_dashboard')} &rarr;
              </Link>
              <Link
                to="/tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#20392A]"
              >
                {t('review_requests')}
              </Link>
            </div>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-bold text-amber-800 bg-amber-50"
            >
              {t('admin_dashboard')}
            </Link>
          )}

          {/* Auth section in mobile drawer */}
          <div className="pt-3 border-t border-[#E2ECE0]">
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-[#347A46]"
                >
                  <UserIcon size={16} /> {user.full_name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 flex items-center gap-1 p-2 cursor-pointer"
                >
                  <LogOut size={14} /> {t('logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="kc-navbar-login-btn text-center"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="kc-navbar-join-btn text-center"
                >
                  {language === 'hi' ? 'मंच से जुड़ें' : 'Join Platform'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
