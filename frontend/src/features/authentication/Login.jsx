import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Tractor,
  Building2,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './Auth.css';

export const Login = () => {
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.user.role === 'partner') {
        navigate('/partner-dashboard');
      } else {
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || (language === 'hi' ? 'अमान्य ईमेल या पासवर्ड। कृपया अपनी साख सत्यापित करें।' : 'Invalid email or password. Please verify your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-split-wrapper">
        {/* Left Column: High-Contrast Green Panel with Bright White Typography */}
        <div className="auth-visual-column hidden lg:flex">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=85"
            alt="Indian farmer in agricultural field"
            className="auth-visual-bg"
          />
          <div className="auth-visual-gradient"></div>

          <div className="auth-visual-content">
            <Link to="/" className="inline-flex items-center gap-3.5 group text-decoration-none">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#15803D] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Sprout size={28} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white block leading-none">
                  {t('brand_name')}
                </span>
                <span className="text-[11px] tracking-wider uppercase font-bold text-[#E8BD59] mt-1.5 block">
                  {t('team_name')}
                </span>
              </div>
            </Link>

            <div className="pt-10 space-y-4">
              <span className="auth-visual-badge">
                {t('visual_badge')}
              </span>
              <h2 className="auth-visual-heading">
                {t('visual_heading')}
              </h2>
              <p className="auth-visual-desc">
                {t('visual_desc_login')}
              </p>
            </div>
          </div>

          <div className="auth-visual-content pt-8 border-t border-white/20 space-y-3.5">
            <div className="auth-visual-feature">
              <CheckCircle2 size={18} className="text-[#E8BD59] shrink-0" />
              <span>{t('visual_feature_1')}</span>
            </div>
            <div className="auth-visual-feature">
              <CheckCircle2 size={18} className="text-[#E8BD59] shrink-0" />
              <span>{t('visual_feature_2')}</span>
            </div>
            <div className="auth-visual-feature">
              <CheckCircle2 size={18} className="text-[#E8BD59] shrink-0" />
              <span>{t('visual_feature_3')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean White Card */}
        <div className="auth-form-column">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6 pb-4 border-b border-[#E2ECE0]">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-2 text-decoration-none">
              <div className="w-10 h-10 rounded-xl bg-[#347A46] text-[#E8BD59] flex items-center justify-center shadow-xs">
                <Sprout size={22} />
              </div>
              <span className="font-extrabold text-xl text-[#347A46]">{t('brand_name')}</span>
            </Link>
            <p className="text-xs text-[#56715E]">{t('tagline')}</p>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20392A] tracking-tight">
              {t('signin_heading')}
            </h1>
            <p className="text-xs sm:text-sm text-[#56715E] mt-1 font-normal">
              {t('signin_desc')}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="auth-label-clean">{t('email_label')}</label>
              <div className="auth-field-wrapper">
                <span className="auth-field-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@kisanconnect.com"
                  className="auth-field-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="auth-label-clean">{t('password_label')}</label>
              <div className="auth-field-wrapper">
                <span className="auth-field-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-field-input-dual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-field-btn-right"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-auth-primary mt-6"
            >
              {loading ? t('authenticating') : t('signin_to_platform')}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-[#E2ECE0]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold text-[#347A46] uppercase tracking-wider">
                {t('instant_demo_login')}
              </span>
              <span className="text-[10px] font-bold text-[#56715E] bg-[#E8F1E5] px-2.5 py-0.5 rounded-full">
                {t('auto_fill')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('ramesh@kisanconnect.com', 'Farmer@123')}
                className="demo-card-clean"
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#20392A]">
                  <Tractor size={15} className="text-[#347A46]" /> Ramesh
                </div>
                <span className="text-[10px] text-[#56715E] mt-0.5">{t('role_farmer')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('greenbio@kisanconnect.com', 'Partner@123')}
                className="demo-card-clean"
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#20392A]">
                  <Building2 size={15} className="text-[#347A46]" /> GreenBio
                </div>
                <span className="text-[10px] text-[#56715E] mt-0.5">{t('role_partner')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@kisanconnect.com', 'Admin@123')}
                className="demo-card-clean"
              >
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#20392A]">
                  <Shield size={15} className="text-[#347A46]" /> Gov Admin
                </div>
                <span className="text-[10px] text-[#56715E] mt-0.5">{t('role_admin_sub')}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#56715E]">
            {t('dont_have_account')}{' '}
            <Link to="/signup" className="font-extrabold text-[#347A46] hover:text-[#2A6439] underline ml-1">
              {t('join_kisan_connect')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
