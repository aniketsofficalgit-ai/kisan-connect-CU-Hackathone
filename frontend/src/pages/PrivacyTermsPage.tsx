import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const PrivacyTermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal & Data Protection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Last updated: October 2026. Standard terms governing interactions on Kisan Connect.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#176B3A]" />
            <span>1. Agricultural Privacy & Data Protection</span>
          </h2>
          <p>
            Kisan Connect respects the privacy of farmers, agricultural workers, and machinery owners. We do not sell or monetize personal agricultural data, mobile numbers, or landholding details to third-party advertisers.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Location Data:</strong> Used strictly for matching nearby workers, equipment, and localized meteorological weather telemetry.</li>
            <li><strong>Identity Verification Documents:</strong> Aadhaar numbers, Kisan Credit Card copies, or commercial registration records submitted for verification are reviewed exclusively by authorized administrators and are not accessible publicly.</li>
            <li><strong>Audio Telemetry:</strong> Audio recorded during voice assistant interactions is processed strictly for speech recognition and is not retained or shared.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#176B3A]" />
            <span>2. Machinery Rental & Booking Terms</span>
          </h2>
          <p>
            When booking agricultural equipment:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Calculated rental amounts reflect base machine time based on owner rates. Unless explicitly listed, fuel, operator lodging, and road trailer transport charges are separate and must be agreed upon between parties.</li>
            <li>Booking requests must be approved by the machinery owner before becoming binding. Double-booking conflicts are automatically blocked by the system.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#176B3A]" />
            <span>3. Crop Marketplace Fair Practice</span>
          </h2>
          <p>
            Crop listings are farmer-declared. Asking prices on the platform are indicative asking values, and final agreements are established directly between farmers and registered buyers.
          </p>
          <p>
            Kisan Connect prohibits fraudulent misrepresentation of grain varieties, adulterated produce, or artificial bidding.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900">4. Agricultural Advisory Disclaimer</h2>
          <p className="text-gray-600">
            Weather advisories and AI agronomy guidance provide general recommendations based on standard agricultural extension literature. Because soil types, pest strains, and microclimates vary, critical chemical dosages or emergency pest treatments should always be confirmed with your nearest Krishi Vigyan Kendra (KVK) or local Agricultural Extension Officer.
          </p>
        </section>
      </div>
    </div>
  );
};
