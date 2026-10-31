import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Send, X, Bot, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  disclaimer?: string;
  relatedActions?: Array<{ label: string; url: string }>;
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t, speechLocale } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLocale;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setInputText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [speechLocale]);

  // Welcome greeting on modal open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'assistant',
          text: t('askVoicePrompt') + '. ' + t('speakNow'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (inputText.trim()) {
        handleSubmitQuery(inputText.trim());
      }
    } else {
      setTranscript('');
      try {
        recognitionRef.current.lang = speechLocale;
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Failed to start speech recognition:', e);
      }
    }
  };

  const handleSubmitQuery = async (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTranscript('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/ask', {
        query,
        language,
        session_id: 'browser-session'
      });

      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: res.data.response,
        disclaimer: res.data.disclaimer,
        relatedActions: res.data.related_actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically speak the response
      speakText(res.data.response);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to reach the assistant right now. Please check your network connection and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLocale;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const samplePrompts = [
    { label: '💧 ' + (language === 'hi' ? 'सिंचाई कब करें?' : language === 'pa' ? 'ਪਾਣੀ ਕਦੋਂ ਲਗਾਈਏ?' : 'When to water crops?'), query: 'When should I water my crop?' },
    { label: '🚜 ' + (language === 'hi' ? 'मशीनरी कैसे खोजें?' : language === 'pa' ? 'ਮਸ਼ੀਨਰੀ ਕਿਰਾਏ \'ਤੇ?' : 'Machinery near me?'), query: 'What machinery is available near me?' },
    { label: '🌾 ' + (language === 'hi' ? 'फसल बिक्री कैसे करें?' : language === 'pa' ? 'ਫਸਲ ਕਿਵੇਂ ਵੇਚੀਏ?' : 'How to list crops?'), query: 'How can I list my crop for sale?' },
    { label: '👥 ' + (language === 'hi' ? 'मजदूर कैसे बुलाएं?' : language === 'pa' ? 'ਮਜ਼ਦੂਰ ਕਿਵੇਂ ਲੱਭੀਏ?' : 'Find workers?'), query: 'How can I find workers for harvesting?' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl border border-gray-100 h-[85vh] max-h-[700px] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#173D2A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Kisan Connect AI Assistant</h3>
              <p className="text-xs text-emerald-200">Multilingual Agricultural Voice Guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-white/10 text-white border border-white/20 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="en" className="text-gray-900">English</option>
              <option value="hi" className="text-gray-900">हिंदी (Hindi)</option>
              <option value="pa" className="text-gray-900">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>

            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xs text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#176B3A] text-white rounded-br-xs'
                    : 'bg-white text-gray-800 border border-gray-200/70 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {msg.disclaimer && (
                  <div className="mt-2.5 pt-2 border-t border-gray-200 text-[11px] text-gray-500 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span>{msg.disclaimer}</span>
                  </div>
                )}

                {msg.relatedActions && msg.relatedActions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {msg.relatedActions.map((action, aIdx) => (
                      <a
                        key={aIdx}
                        href={action.url}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        {action.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 px-1">
                <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.text))}
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    {isSpeaking ? 'Stop Audio' : 'Listen'}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-2xl border border-gray-200 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Analyzing agronomic guidance...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Prompt Chips */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSubmitQuery(p.query)}
              className="text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1 rounded-full whitespace-nowrap border border-emerald-200 transition-colors font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input & Microphone Bar */}
        <div className="p-4 bg-white border-t border-gray-200">
          {isListening && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-semibold">{t('listening')}</span>
              </div>
              <span className="text-[11px] text-gray-500">{transcript || 'Speak into your device microphone...'}</span>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            {/* Big Microphone button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? t('micStop') : t('speakNow')}
              className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-red-600 text-white animate-mic-pulse ring-4 ring-red-200'
                  : 'bg-[#176B3A] text-white hover:bg-[#173D2A]'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuery(inputText)}
                placeholder={isListening ? 'Listening...' : 'Type or speak your agricultural question...'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#176B3A] focus:bg-white transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => handleSubmitQuery(inputText)}
                disabled={!inputText.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#176B3A] disabled:opacity-30 disabled:hover:text-gray-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 text-center text-[11px] text-gray-400">
            Supports voice & speech synthesis in English, Hindi, and Punjabi
          </div>
        </div>
      </div>
    </div>
  );
};
