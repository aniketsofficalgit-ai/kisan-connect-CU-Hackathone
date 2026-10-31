import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Bell, MessageSquare, Mic, Globe, LogOut,
  User, LayoutDashboard, ShieldCheck, ChevronDown, Sparkles,
  Users, Wrench, Sprout, CloudSun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { RoleBadge } from './RoleBadge';
import { DemoModal } from './DemoModal';
import { VoiceAssistantModal } from './VoiceAssistantModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount, unreadMessagesCount } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: t('findWorkers'), path: '/workers', icon: Users },
    { name: t('rentMachinery'), path: '/machinery', icon: Wrench },
    { name: t('sellCrops'), path: '/crops', icon: Sprout },
    { name: t('weather'), path: '/weather', icon: CloudSun },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#176B3A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#173D2A] transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.49 9.49 0 0 0 12 21c4.97 0 9-4.03 9-9 0-.34 0-.67-.04-1H17zM12 19a7.51 7.51 0 0 1-3.66-.95C10.15 15.17 12.8 11.75 19 11.13A7 7 0 0 1 12 19z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#173D2A]">
                  KISAN <span className="text-[#176B3A]">CONNECT</span>
                </span>
                <span className="text-[9px] tracking-wider text-gray-500 font-semibold uppercase -mt-1">
                  Agri-Tech Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'text-[#176B3A] bg-emerald-50 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-70" />
                    {link.name}
                  </Link>
                );
              })}

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive('/dashboard')
                        ? 'text-[#176B3A] bg-emerald-50 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 opacity-70" />
                    {t('dashboard')}
                  </Link>
                  <Link
                    to="/requests"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive('/requests')
                        ? 'text-[#176B3A] bg-emerald-50 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {t('requests')}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive('/admin')
                          ? 'text-rose-700 bg-rose-50 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      {t('admin')}
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Voice Assistant Shortcut */}
              <button
                type="button"
                onClick={() => setVoiceModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Multilingual AI Voice Assistant"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                <span>AI Voice</span>
              </button>

              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium px-2 py-1.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="pa">ਪੰਜਾਬੀ</option>
                </select>
              </div>

              {/* Demo Mode Button */}
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="hidden md:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 font-semibold hover:bg-amber-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Roles</span>
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Messages Icon */}
                  <Link
                    to="/messages"
                    className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 relative transition-colors"
                    title={t('messages')}
                  >
                    <MessageSquare className="w-5 h-5" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </span>
                    )}
                  </Link>

                  {/* Notifications Bell */}
                  <Link
                    to="/notifications"
                    className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 relative transition-colors"
                    title={t('notifications')}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#176B3A] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        {user?.full_name?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden md:block text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                        {user?.full_name}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-900 truncate">{user?.full_name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user?.mobile_number}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            {user && <RoleBadge role={user.role} size="sm" />}
                          </div>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{t('profile')}</span>
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          <span>Account Settings</span>
                        </Link>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#176B3A] hover:bg-[#173D2A] rounded-xl shadow-xs transition-colors"
                  >
                    {t('register')}
                  </Link>
                </div>
              )}

              {/* Mobile menu hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in">
            <button
              onClick={() => {
                setVoiceModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 text-[#176B3A] font-bold text-sm border border-emerald-200"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Multilingual AI Voice Assistant</span>
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t('dashboard')}
                </Link>
                <Link
                  to="/requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t('requests')}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t('profile')}
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-rose-700 bg-rose-50"
                  >
                    {t('admin')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold border border-gray-200 rounded-xl"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold bg-[#176B3A] text-white rounded-xl"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            <button
              onClick={() => {
                setDemoModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Switch Demo Role Accounts</span>
            </button>
          </div>
        )}
      </header>

      {/* Floating Global Microphone Pill for Instant Voice Guidance */}
      <button
        type="button"
        onClick={() => setVoiceModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#176B3A] hover:bg-[#173D2A] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-transform hover:scale-105 border-2 border-white/30"
        title="Tap to speak with AI Assistant"
      >
        <Mic className="w-5 h-5 text-emerald-200 animate-pulse" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">Ask Agri AI</span>
      </button>

      {/* Modals */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <VoiceAssistantModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
    </>
  );
};
