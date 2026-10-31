import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Volume2, Send, Bot, AlertCircle,
  RefreshCw, ExternalLink, Globe, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export const VoiceAssistantPage: React.FC = () => {
  const { language, setLanguage, t, speechLocale } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/ai/history');
        if (Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data.map((item: any) => [
            { sender: 'user', text: item.query, timestamp: item.created_at?.slice(11, 16) || '' },
            { sender: 'assistant', text: item.response, timestamp: item.created_at?.slice(11, 16) || '' }
          ]).flat();
          setMessages(formatted);
        } else {
          setMessages([
            {
              sender: 'assistant',
              text: 'Welcome to Kisan Connect AI! I am your agricultural companion. You can speak or type in English, Hindi (हिंदी), or Punjabi (ਪੰਜਾਬੀ). Ask me about watering schedules, machinery rental, harvesting labor, or local crop pricing.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } catch {
        // Fallback
      }
    };

    fetchHistory();
  }, []);

  // Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLocale;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
        setInputText(text);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [speechLocale]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (inputText.trim()) {
        handleSubmit(inputText.trim());
      }
    } else {
      setTranscript('');
      try {
        recognitionRef.current.lang = speechLocale;
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    }
  };

  const handleSubmit = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTranscript('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/ask', {
        query: queryText,
        language,
        session_id: 'dedicated-page'
      });

      const assistantMsg = {
        sender: 'assistant',
        text: res.data.response,
        disclaimer: res.data.disclaimer,
        relatedActions: res.data.related_actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(res.data.response);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to process query. Please verify your connection.',
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

  const samplePrompts = [
    'When should I water my crop?',
    'What machinery is available near me?',
    'How can I find workers for harvesting?',
    'What does today\'s forecast mean for my field?',
    'How can I list my crop for sale?'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
            <Bot className="w-4 h-4" />
            <span>Multilingual Farm Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Multilingual AI Voice Assistant
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Ask in English, Hindi (हिंदी), or Punjabi (ਪੰਜਾਬੀ). Voice recognition and text-to-speech audio responses.
          </p>
        </div>

        {/* Language switch */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 shadow-2xs"
          >
            <option value="en">English (en-IN)</option>
            <option value="hi">हिंदी (hi-IN)</option>
            <option value="pa">ਪੰਜਾਬੀ (pa-IN)</option>
          </select>
        </div>
      </div>

      {/* Main Chat & Voice Interface Box */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col h-[70vh] min-h-[500px]">
        {/* Messages history */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-stone-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-5 py-3.5 shadow-2xs text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#176B3A] text-white rounded-br-xs'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {msg.disclaimer && (
                  <div className="mt-2.5 pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span>{msg.disclaimer}</span>
                  </div>
                )}

                {msg.relatedActions && msg.relatedActions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {msg.relatedActions.map((action: any, aIdx: number) => (
                      <a
                        key={aIdx}
                        href={action.url}
                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      >
                        {action.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 px-2">
                <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="text-[11px] text-[#176B3A] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Aloud</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-2xl border border-gray-200 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-[#176B3A]" />
              <span>Analyzing agronomic guidance...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Prompt Chips Bar */}
        <div className="px-5 py-2.5 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {samplePrompts.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSubmit(q)}
              className="text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1 rounded-full whitespace-nowrap border border-emerald-200 font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Big Mic & Input Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-200 space-y-3">
          {isListening && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Recording Speech ({language.toUpperCase()})...</span>
              </div>
              <span className="text-gray-500 truncate max-w-xs">{transcript || 'Speak clearly into your microphone...'}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Big Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-4 rounded-2xl transition-all shadow-md flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-red-600 text-white animate-mic-pulse ring-4 ring-red-200'
                  : 'bg-[#176B3A] text-white hover:bg-[#173D2A]'
              }`}
              title={isListening ? 'Stop Recording' : 'Speak into Microphone'}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Text Input fallback */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(inputText)}
                placeholder="Type or speak any agricultural question..."
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#176B3A] pr-12"
              />
              <button
                type="button"
                onClick={() => handleSubmit(inputText)}
                disabled={!inputText.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#176B3A] disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
