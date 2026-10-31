import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, MessageCircle, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import api from '../services/api';

export const HelpSupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [reportReason, setReportReason] = useState('General Platform Question');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    {
      q: 'How does worker hiring work on Kisan Connect?',
      a: 'Farmers can browse verified workers and labor groups filtered by skill, district, and daily wage. When you submit a request with the start date and duration, the worker receives a notification to accept or reject. You only coordinate directly once accepted.'
    },
    {
      q: 'Are the machinery rental amounts guaranteed?',
      a: 'Rental estimates calculate base machine time (hourly or daily). Fuel and delivery to the field gate depend on the listing specifications. Always confirm with the owner if fuel or trailer transport is included before work begins.'
    },
    {
      q: 'How do crop buyers contact farmers?',
      a: 'Buyers browse verified listings, review lot details (grain variety, quality grade, quantity), and submit an in-app purchase offer with proposed rates. Both parties can chat in-app or connect by phone to finalize payment and weighing.'
    },
    {
      q: 'How accurate is the localized weather and spray advisory?',
      a: 'Weather telemetry is retrieved in real-time from meteorological services (Open-Meteo) based on your district coordinates. The agronomic spray feasibility indicator evaluates wind velocity and rain probability to help avoid chemical wash-off.'
    },
    {
      q: 'How do I use the multilingual AI voice assistant?',
      a: 'Click the green microphone button on any page or navigate to the AI Assistant tab. Grant microphone permission and speak naturally in Hindi, Punjabi, or English. The assistant provides practical advice and reads answers aloud.'
    }
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/reports', {
        reason: reportReason,
        details: details.trim()
      });
      setSubmitted(true);
      setDetails('');
    } catch {
      // Ignored
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Assistance & Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Help & Farmer Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Find answers to frequently asked questions or connect with our agricultural helpline.
        </p>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
          <Phone className="w-5 h-5 text-[#176B3A] mb-2" />
          <h4 className="font-bold text-sm text-gray-900">Kisan Call Centre</h4>
          <p className="text-xs text-gray-600">1800-180-1551 (Toll-Free)</p>
          <span className="text-[10px] text-gray-400 block">Available 6:00 AM - 10:00 PM</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
          <Mail className="w-5 h-5 text-[#176B3A] mb-2" />
          <h4 className="font-bold text-sm text-gray-900">Email Desk</h4>
          <p className="text-xs text-gray-600">support@kisanconnect.in</p>
          <span className="text-[10px] text-gray-400 block">Typical response within 24 hours</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
          <MessageCircle className="w-5 h-5 text-[#176B3A] mb-2" />
          <h4 className="font-bold text-sm text-gray-900">Voice Assistant</h4>
          <p className="text-xs text-gray-600">Built-in AI Companion</p>
          <span className="text-[10px] text-gray-400 block">Available 24/7 in 3 languages</span>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-gray-900 mb-2">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 text-xs text-gray-600 leading-relaxed bg-white border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact / Report Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-gray-900">Submit a Query or Report an Issue</h3>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Thank you. Your message has been logged for our support coordinators.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Issue Category</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              >
                <option value="General Platform Question">General Platform Question</option>
                <option value="Worker or Labor Issue">Worker or Labor Issue</option>
                <option value="Machinery Rental Conflict">Machinery Rental Conflict</option>
                <option value="Buyer Payment or Mandi Query">Buyer Payment or Mandi Query</option>
                <option value="Verification Request Help">Verification Request Help</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Details *</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#176B3A] text-white font-bold text-xs hover:bg-[#173D2A] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
