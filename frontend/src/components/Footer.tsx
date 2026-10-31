import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#176B3A] flex items-center justify-center text-white">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.49 9.49 0 0 0 12 21c4.97 0 9-4.03 9-9 0-.34 0-.67-.04-1H17zM12 19a7.51 7.51 0 0 1-3.66-.95C10.15 15.17 12.8 11.75 19 11.13A7 7 0 0 1 12 19z" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-[#173D2A] tracking-tight">
                KISAN <span className="text-[#176B3A]">CONNECT</span>
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Empowering farmers across India with direct access to agricultural labor, machinery rentals, produce buyers, localized weather advisories, and AI voice guidance.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Farmer-First Digital Platform</span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Platform Services</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/workers" className="hover:text-[#176B3A] transition-colors">Find Agricultural Workers</Link></li>
              <li><Link to="/machinery" className="hover:text-[#176B3A] transition-colors">Rent Tractors & Harvesters</Link></li>
              <li><Link to="/crops" className="hover:text-[#176B3A] transition-colors">Sell Produce to Buyers</Link></li>
              <li><Link to="/weather" className="hover:text-[#176B3A] transition-colors">Localized Weather & Spray Advisory</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-[#176B3A] transition-colors">Multilingual AI Voice Assistant</Link></li>
            </ul>
          </div>

          {/* Agricultural Extension & Government Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Extension & Resources</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <a href="https://icar.org.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#176B3A] flex items-center gap-1">
                  <span>ICAR & KVK Advisory</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#176B3A] flex items-center gap-1">
                  <span>PM-Kisan Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://enam.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#176B3A] flex items-center gap-1">
                  <span>e-NAM Mandi Prices</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://soilhealth.dac.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#176B3A] flex items-center gap-1">
                  <span>Soil Health Card Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Contact & Support</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#176B3A]" />
                <span>Kisan Helpline: 1800-180-1551 (Toll-Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#176B3A]" />
                <span>support@kisanconnect.in</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#176B3A]" />
                <span>Agri-Tech Innovation Hub, Ludhiana, Punjab</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Kisan Connect. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#176B3A]">About Us</Link>
            <Link to="/privacy-terms" className="hover:text-[#176B3A]">Privacy Policy</Link>
            <Link to="/privacy-terms" className="hover:text-[#176B3A]">Terms of Service</Link>
            <Link to="/help" className="hover:text-[#176B3A]">Help & FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
