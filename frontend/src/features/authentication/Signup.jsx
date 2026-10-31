import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sprout,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Tractor,
  Factory,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './Auth.css';

export const Signup = () => {
  const { register } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'partner' ? 'partner' : 'farmer';
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    // Farmer fields
    farm_name: '',
    farm_size_acres: '5',
    village: '',
    district: '',
    state: 'Punjab',
    primary_crops: 'Rice, Wheat',
    // Partner fields
    business_name: '',
    business_type: 'compost_manufacturer',
    service_area: '',
    minimum_quantity: '50',
    pricing_details: 'Competitive market rates'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError(language === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        role,
        farm_size_acres: parseFloat(formData.farm_size_acres || 5),
        minimum_quantity: parseFloat(formData.minimum_quantity || 50)
      };

      await register(payload);
      if (role === 'partner') {
        navigate('/partner-dashboard');
      } else {
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || (language === 'hi' ? 'पंजीकरण विफल रहा। कृपया अपनी जानकारी जांचें।' : 'Registration failed. Please check your details.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split-wrapper">
        {/* =========================================================================
            1. Left Green Panel: High Contrast, Bright White Text & Aligned Brand
            ========================================================================= */}
        <div className="auth-visual-column hidden lg:flex">
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1000&q=85"
            alt="Agricultural harvest and residue collection"
            className="auth-visual-bg"
          />
          <div className="auth-visual-gradient"></div>

          <div className="auth-visual-content">
            {/* Logo and Team Brand */}
            <Link to="/" className="inline-flex items-center gap-3.5 group text-decoration-none">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#347A46] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
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

            {/* Badge, Bright White Heading, Description */}
            <div className="pt-10 space-y-4">
              <span className="auth-visual-badge">
                {t('visual_badge')}
              </span>
              <h2 className="auth-visual-heading">
                {t('visual_heading')}
              </h2>
              <p className="auth-visual-desc">
                {language === 'hi'
                  ? 'अपनी फसल के अवशेषों को सीधे औद्योगिक मांग से जोड़ें। निःशुल्क स्वचालित बेलिंग, प्रमाणित धर्मकांटा वजन और गारंटीकृत बैंक भुगतान।'
                  : 'Connect your farm residues directly to industrial demand. Free automated baling, certified weighbridge checks, and guaranteed direct payments.'}
              </p>
            </div>
          </div>

          {/* Feature Bullet Points */}
          <div className="auth-visual-content pt-8 border-t border-white/20 space-y-3.5">
            <div className="auth-visual-feature">
              <CheckCircle2 size={18} className="text-[#E8BD59] shrink-0" />
              <span>{language === 'hi' ? 'किसानों के लिए 100% निःशुल्क पंजीकरण' : '100% Free registration for farmers'}</span>
            </div>
            <div className="auth-visual-feature">
              <CheckCircle2 size={18} className="text-[#E8BD59] shrink-0" />
              <span>{language === 'hi' ? 'नए खरीदारों और क्षेत्रीय उठाव तिथियों पर तुरंत अलर्ट' : 'Instant alerts on new buyers & regional pickup dates'}</span>
            </div>
            <div className="auth-visual-feature">
              <CheckCircle2 size={18} className="text-[#E8BD59] shrink-0" />
              <span>{language === 'hi' ? '24/7 कृति एआई (KRITI AI) वॉयस असिस्टेंट' : 'Dedicated 24/7 KRITI AI voice assistant in Hindi & English'}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. Right Form Column: Clean White Card & Perfectly Positioned Icons
            ========================================================================= */}
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
              {t('create_account')}
            </h1>
            <p className="text-xs sm:text-sm text-[#56715E] mt-1 font-normal">
              {t('select_role_desc')}
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="role-tabs-clean">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`role-tab-btn-clean ${role === 'farmer' ? 'active' : 'inactive'}`}
            >
              <Tractor size={18} /> {t('i_am_farmer_btn')}
            </button>
            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`role-tab-btn-clean ${role === 'partner' ? 'active' : 'inactive'}`}
            >
              <Factory size={18} /> {t('partner_btn')}
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="auth-label-clean">{t('fullname_label')}</label>
                <div className="auth-field-wrapper">
                  <span className="auth-field-icon-left">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder={role === 'farmer' ? (language === 'hi' ? 'सरदार गुरप्रीत सिंह' : 'Sardar Gurpreet Singh') : (language === 'hi' ? 'अनिल अग्रवाल' : 'Anil Aggarwal')}
                    className="auth-field-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="auth-label-clean">{t('phone_label')}</label>
                <div className="auth-field-wrapper">
                  <span className="auth-field-icon-left">
                    <Phone size={18} />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="auth-field-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="auth-label-clean">{t('email_label')}</label>
              <div className="auth-field-wrapper">
                <span className="auth-field-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="auth-field-input"
                  required
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="auth-label-clean">{t('password_label')}</label>
                <div className="auth-field-wrapper">
                  <span className="auth-field-icon-left">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div>
                <label className="auth-label-clean">{t('confirm_password_label')}</label>
                <div className="auth-field-wrapper">
                  <span className="auth-field-icon-left">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="auth-field-input-dual"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-field-btn-right"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Farmer Specific Fields */}
            {role === 'farmer' && (
              <div className="signup-subpanel-clean space-y-3 pt-3">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#347A46] block">
                  {language === 'hi' ? 'खेत का विवरण' : 'Farm Profile Details'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="auth-label-clean">{t('farm_size_acres')}</label>
                    <input
                      type="number"
                      name="farm_size_acres"
                      value={formData.farm_size_acres}
                      onChange={handleChange}
                      placeholder="e.g. 10"
                      className="auth-field-input-standard"
                    />
                  </div>

                  <div>
                    <label className="auth-label-clean">{t('primary_crops')}</label>
                    <input
                      type="text"
                      name="primary_crops"
                      value={formData.primary_crops}
                      onChange={handleChange}
                      placeholder={language === 'hi' ? 'धान, गेहूं, सरसों' : 'Rice, Wheat, Mustard'}
                      className="auth-field-input-standard"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="auth-label-clean">{t('village_tehsil')}</label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="e.g. Raikot"
                      className="auth-field-input-standard"
                      required
                    />
                  </div>

                  <div>
                    <label className="auth-label-clean">{t('district')}</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="e.g. Ludhiana"
                      className="auth-field-input-standard"
                      required
                    />
                  </div>

                  <div>
                    <label className="auth-label-clean">{t('state')}</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="auth-field-input-standard"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Partner Specific Fields */}
            {role === 'partner' && (
              <div className="signup-subpanel-clean space-y-3 pt-3">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#347A46] block">
                  {language === 'hi' ? 'व्यावसायिक एवं औद्योगिक जानकारी' : 'Business & Facility Information'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="auth-label-clean">{t('business_name')}</label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="e.g. GreenBio Fuel Briquettes Ltd"
                      className="auth-field-input-standard"
                      required
                    />
                  </div>

                  <div>
                    <label className="auth-label-clean">{t('business_type')}</label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      className="auth-field-input-standard"
                    >
                      <option value="biomass_power">{language === 'hi' ? 'बायोमास ऊर्जा / पेलेटिंग प्लांट' : 'Biomass Power / Pelleting Plant'}</option>
                      <option value="compost_manufacturer">{language === 'hi' ? 'कम्पोस्ट एवं वर्मीकल्चर निर्माता' : 'Compost & Vermiculture Manufacturer'}</option>
                      <option value="plastic_recycler">{language === 'hi' ? 'अधिकृत प्लास्टिक रीसाइक्लर' : 'Authorized Plastic Recycler'}</option>
                      <option value="waste_aggregator">{language === 'hi' ? 'कृषि अपशिष्ट एग्रीगेटर / बेलर' : 'Agricultural Waste Aggregator / Baler'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="auth-label-clean">{t('service_districts')}</label>
                    <input
                      type="text"
                      name="service_area"
                      value={formData.service_area}
                      onChange={handleChange}
                      placeholder="e.g. Ludhiana, Khanna, Moga (50km)"
                      className="auth-field-input-standard"
                      required
                    />
                  </div>

                  <div>
                    <label className="auth-label-clean">{t('min_pickup_batch')}</label>
                    <input
                      type="number"
                      name="minimum_quantity"
                      value={formData.minimum_quantity}
                      onChange={handleChange}
                      placeholder="e.g. 50"
                      className="auth-field-input-standard"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-auth-primary mt-6"
            >
              {loading ? (language === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating Your Account...') : `${t('register_as')} ${role === 'farmer' ? t('role_farmer') : t('role_partner')}`}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#56715E]">
            {t('already_account')}{' '}
            <Link to="/login" className="font-extrabold text-[#347A46] hover:text-[#2A6439] underline ml-1">
              {t('already_registered_link')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
