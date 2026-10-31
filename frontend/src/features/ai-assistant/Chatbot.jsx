import React, { useState } from 'react';
import { Sprout, Sparkles, Mic } from 'lucide-react';
import ChatWindow from './ChatWindow';
import './Chatbot.css';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <ChatWindow onClose={() => setIsOpen(false)} />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="kc-kriti-fab group"
          title="KRITI AI – Your Smart Agricultural Assistant"
          aria-label="Open KRITI AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#E8B34D] text-[#176B68] flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <Sprout size={18} />
            </div>
            <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-200 animate-spin [animation-duration:6s]" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white tracking-tight leading-none">
                KRITI AI
              </span>
              <Mic size={12} className="text-[#E8B34D]" />
            </div>
            <span className="text-[10px] text-[#DDF1EC] font-semibold mt-0.5 leading-none">
              Voice Assistant
            </span>
          </div>
        </button>
      )}
    </>
  );
};

export default Chatbot;
