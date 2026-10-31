import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Users, Wrench, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#176B3A] text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Agricultural Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          About Kisan Connect
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Bridging the digital divide for Indian agriculture with fair local connections, transparent rates, and accessible voice technology.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 leading-relaxed text-xs sm:text-sm text-gray-700">
        <h2 className="text-lg font-bold text-gray-900">Why Kisan Connect Was Founded</h2>
        <p>
          Indian agriculture faces severe seasonal bottlenecks: during harvest, finding skilled manual labor or combine harvesters on short notice causes crop damage and delays. Meanwhile, smallholder farmers often struggle to obtain fair prices for their harvested grains without steep intermediary commissions.
        </p>
        <p>
          <strong>Kisan Connect</strong> addresses these core challenges by bringing all key ecosystem participants into a unified platform:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#176B3A]" />
              <span>For Farmers</span>
            </h4>
            <p className="text-xs text-gray-600">
              Instant labor discovery, equipment rentals at honest hourly rates, direct crop sales to buyers, and live weather telemetry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#176B3A]" />
              <span>For Machinery Owners</span>
            </h4>
            <p className="text-xs text-gray-600">
              Turn idle tractors, rotavators, and laser levelers into continuous rental income with calendar tracking and booking conflict safeguards.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#176B3A]" />
              <span>For Agricultural Laborers</span>
            </h4>
            <p className="text-xs text-gray-600">
              Fair visibility, steady seasonal job offers, clear daily wages, and direct communication with farm owners.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#176B3A]" />
              <span>For Produce Buyers</span>
            </h4>
            <p className="text-xs text-gray-600">
              Source verified wheat, paddy, mustard, and vegetables with certified lot information directly from farm gates.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-bold text-base text-gray-900 mb-2">Farmer-First Accessibility</h3>
          <p>
            Digital platforms must not exclude farmers who prefer speaking over typing. Our built-in speech engine supports Punjabi, Hindi, and English with instant voice recognition and speech synthesis so any farmer can check irrigation advice or rental options naturally.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] transition-colors shadow-md"
        >
          <span>Join the Kisan Connect Community</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
