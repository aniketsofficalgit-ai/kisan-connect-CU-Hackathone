import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, ArrowRight, ShieldCheck, MapPin, Phone } from 'lucide-react';

export const ChatMessages = ({ messages, loading, onActionClick }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => {
        const isUser = msg.sender === 'user';
        return (
          <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div className="flex items-end gap-2 max-w-full">
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-[#1E4D2B] text-white flex items-center justify-center shrink-0 text-xs">
                  <Bot size={16} />
                </div>
              )}

              <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                <div className="whitespace-pre-line text-sm">
                  {msg.content}
                </div>

                {/* Optional Matched Partners Cards */}
                {msg.matched_partners && msg.matched_partners.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-green-200/60 space-y-2">
                    <p className="text-xs font-bold text-[#1E4D2B] uppercase tracking-wider">
                      Verified Matching Partners:
                    </p>
                    {msg.matched_partners.map((partner, pIdx) => (
                      <div key={pIdx} className="bg-white p-2.5 rounded-lg border border-gray-200 text-xs shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{partner.business_name}</span>
                          <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-semibold">
                            <ShieldCheck size={12} /> Verified
                          </span>
                        </div>
                        <p className="text-gray-500 mt-0.5 flex items-center gap-1">
                          <MapPin size={11} /> {partner.service_area}
                        </p>
                        <p className="text-gray-600 mt-1 font-medium">Rate: {partner.pricing_details}</p>
                        <Link
                          to="/find-partners"
                          onClick={onActionClick}
                          className="mt-2 text-[11px] font-bold text-[#1E4D2B] hover:underline flex items-center gap-1"
                        >
                          Request Collection &rarr;
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex flex-wrap gap-2">
                    {msg.actions.map((act, aIdx) => (
                      <Link
                        key={aIdx}
                        to={act.link}
                        onClick={onActionClick}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-[#1E4D2B] text-white hover:bg-[#2D6A4F] px-2.5 py-1.5 rounded-md transition-colors"
                      >
                        {act.label} <ArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs">
                  <User size={15} />
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-9">
              {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
        );
      })}

      {loading && (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1E4D2B] text-white flex items-center justify-center text-xs">
            <Bot size={16} />
          </div>
          <div className="chat-bubble-bot flex items-center gap-1.5 py-3">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
