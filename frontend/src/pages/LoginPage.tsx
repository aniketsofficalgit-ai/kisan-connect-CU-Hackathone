import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Phone, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { login, demoAccounts, switchDemoAccount } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide your mobile number/email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(identifier.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Login failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = async (role: any) => {
    setError(null);
    try {
      await switchDemoAccount(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Could not switch to demo role.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F4F7F3]">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#176B3A] flex items-center justify-center text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.49 9.49 0 0 0 12 21c4.97 0 9-4.03 9-9 0-.34 0-.67-.04-1H17zM12 19a7.51 7.51 0 0 1-3.66-.95C10.15 15.17 12.8 11.75 19 11.13A7 7 0 0 1 12 19z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-[#173D2A] tracking-tight">
              KISAN <span className="text-[#176B3A]">CONNECT</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sign In to Your Account</h2>
          <p className="mt-1 text-xs text-gray-600">
            Access your personalized role dashboard, requests, and notifications
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl shadow-md border border-gray-200">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or farmer@kisanconnect.in"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#176B3A] focus:bg-white"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#176B3A] focus:bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#176B3A] focus:ring-[#176B3A]"
                />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#176B3A] font-bold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#176B3A] hover:bg-[#173D2A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Buttons */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                1-Click Demo Evaluation Login:
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('farmer')}
                className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100 border border-emerald-200 transition-colors text-left"
              >
                🌾 Farmer (Gurpreet)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('worker')}
                className="p-2 rounded-lg bg-amber-50 text-amber-800 font-semibold hover:bg-amber-100 border border-amber-200 transition-colors text-left"
              >
                👥 Worker (Ramesh)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('machinery_owner')}
                className="p-2 rounded-lg bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100 border border-blue-200 transition-colors text-left"
              >
                🚜 Owner (Balwinder)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('buyer')}
                className="p-2 rounded-lg bg-purple-50 text-purple-800 font-semibold hover:bg-purple-100 border border-purple-200 transition-colors text-left"
              >
                🏢 Buyer (Priya)
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#176B3A] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
