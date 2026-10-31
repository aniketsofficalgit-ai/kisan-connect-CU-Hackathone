import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  RotateCcw,
  Globe,
  Sparkles,
  Sprout,
  Camera,
  Volume2,
  VolumeX,
  User,
  AlertCircle,
  Key,
  CheckCircle2
} from 'lucide-react';
import VoiceInput from './VoiceInput';
import chatbotService from './chatbotService';
import ttsService from './ttsService';
import { useLanguage } from '../../context/LanguageContext';
import './Chatbot.css';

const DEFAULT_SUGGESTIONS_EN = [
  "How can I sell my agricultural waste?",
  "How can I make compost from paddy straw?",
  "What is an FPO?",
  "Which industries buy rice husk?"
];

const DEFAULT_SUGGESTIONS_HI = [
  "मैं अपना कृषि अपशिष्ट कैसे बेच सकता हूँ?",
  "धान की पराली से कंपोस्ट कैसे बनाएं?",
  "एफपीओ (FPO) क्या है?",
  "धान की भूसी कौन से उद्योग खरीदते हैं?"
];

export const ChatWindow = ({ onClose, embedded = false }) => {
  const { language, setLanguage } = useLanguage();
  const isHindi = language === 'hi';

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);
  const [attachedImage, setAttachedImage] = useState(null);
  const [ratings, setRatings] = useState({});
  const [hoveredRatings, setHoveredRatings] = useState({});
  const [voiceError, setVoiceError] = useState(null);
  const [sessionId, setSessionId] = useState(() => `kriti_${Math.random().toString(36).substring(7)}`);
  const [geminiActive, setGeminiActive] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [keySaving, setKeySaving] = useState(false);
  const [keyStatusMsg, setKeyStatusMsg] = useState(null);

  useEffect(() => {
    chatbotService.getStatus().then(status => {
      if (status?.gemini_active) {
        setGeminiActive(true);
      }
    }).catch(() => {});
  }, []);

  const handleSaveApiKey = async (e) => {
    e?.preventDefault();
    if (!apiKeyInput.trim()) return;
    setKeySaving(true);
    setKeyStatusMsg(null);
    try {
      const res = await chatbotService.setApiKey(apiKeyInput.trim());
      if (res.success) {
        setGeminiActive(true);
        setKeyStatusMsg({ type: 'success', text: isHindi ? 'जेमिनी एआई सक्रिय हो गया है!' : 'Google Gemini AI is now active in real time!' });
        setTimeout(() => {
          setShowKeyModal(false);
          setKeyStatusMsg(null);
        }, 1500);
      } else {
        setKeyStatusMsg({ type: 'error', text: res.error || 'Failed to activate key' });
      }
    } catch (err) {
      setKeyStatusMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save key' });
    } finally {
      setKeySaving(false);
    }
  };

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const suggestedQuestions = isHindi ? DEFAULT_SUGGESTIONS_HI : DEFAULT_SUGGESTIONS_EN;

  const welcomeEn = "Namaste! I am KRITI AI, your smart agricultural assistant. I can help you with farming, agricultural waste management, recycling opportunities, composting, biomass, government schemes and much more. How can I help you today?";
  const welcomeHi = "नमस्ते! मैं कृति एआई (KRITI AI) हूँ, आपकी स्मार्ट कृषि सहायक। मैं खेती, कृषि अपशिष्ट प्रबंधन, रीसाइक्लिंग के अवसरों, कंपोस्ट, बायोमास, सरकारी योजनाओं और अन्य कई विषयों में आपकी सहायता कर सकती हूँ। आज मैं आपकी क्या सहायता करूँ?";

  // Initialize Welcome Message only once on mount or when language toggles if no user messages yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length > 1) return prev;
      return [
        {
          id: 'welcome-msg',
          sender: 'assistant',
          content: isHindi ? welcomeHi : welcomeEn,
          created_at: new Date().toISOString()
        }
      ];
    });
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  const handleStopSpeaking = () => {
    ttsService.stop();
    setIsSpeaking(false);
    setCurrentlySpeakingId(null);
  };

  const handleSpeakText = (text, id = null) => {
    if (isSpeaking && currentlySpeakingId === id) {
      handleStopSpeaking();
      return;
    }

    ttsService.stop();
    setIsSpeaking(true);
    setCurrentlySpeakingId(id);

    ttsService.speak(
      text,
      isHindi ? 'hi' : 'en',
      () => {
        setIsSpeaking(true);
        setCurrentlySpeakingId(id);
      },
      () => {
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
      },
      (err) => {
        console.warn("Speech synthesis error:", err);
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
      }
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Star Rating Handler (1 to 5 Stars)
  const handleRatingSubmit = async (messageId, ratingValue) => {
    setRatings(prev => ({ ...prev, [messageId]: ratingValue }));
    try {
      await chatbotService.rateMessage(messageId, ratingValue);
    } catch (e) {
      console.warn("Failed to persist star rating:", e);
    }
  };

  // Start New Chat Handler
  const handleNewChat = async () => {
    handleStopSpeaking();
    const newSession = `kriti_${Math.random().toString(36).substring(7)}`;
    setSessionId(newSession);
    setRatings({});
    setHoveredRatings({});
    setAttachedImage(null);
    setInputText("");
    setVoiceError(null);

    try {
      await chatbotService.clearHistory(sessionId);
    } catch (e) {}

    setMessages([
      {
        id: 'welcome-msg',
        sender: 'assistant',
        content: isHindi ? welcomeHi : welcomeEn,
        created_at: new Date().toISOString()
      }
    ]);
  };

  // Main Send Handler
  const handleSend = async (customText, isVoice = false) => {
    const text = (customText !== undefined ? customText : inputText).trim();
    if ((!text && !attachedImage) || loading) return;

    if (isSpeaking) {
      handleStopSpeaking();
    }
    setVoiceError(null);

    const queryToSend = attachedImage
      ? (text ? `[Attached Photo] ${text}` : (isHindi ? "कृपया इस फोटो से खेत के अपशिष्ट की पहचान करें और रीसाइक्लिंग उपाय बताएं।" : "Please identify this agricultural waste photo and suggest valorization options."))
      : text;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: queryToSend,
      image: attachedImage,
      is_voice: isVoice,
      created_at: new Date().toISOString()
    };

    // Extract previous conversation history
    const historyToSend = messages
      .filter(m => m.id !== 'welcome-msg' && !m.is_error)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

    const currentImage = attachedImage;
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setAttachedImage(null);
    setLoading(true);

    try {
      const data = await chatbotService.sendMessage(queryToSend, sessionId, language, isVoice, historyToSend, currentImage);
      const replyText = data.reply;
      if (!replyText) {
        throw new Error("No response generated by assistant");
      }
      const messageId = data.message_id || `kriti-${Date.now()}`;

      const botMsg = {
        id: messageId,
        sender: 'assistant',
        content: replyText,
        actions: data.actions || [],
        matched_partners: data.matched_partners || [],
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);

      // Speak answer aloud ONLY if asked through microphone
      if (isVoice) {
        handleSpeakText(replyText, botMsg.id);
      }
    } catch (err) {
      console.error("KRITI AI request failed:", err);
      const errorReply = isHindi
        ? "क्षमा करें, कृति एआई सर्वर से संपर्क नहीं हो पाया। कृपया बैकएंड सर्वर स्थिति जांचें और पुनः प्रयास करें।"
        : "KRITI AI was unable to reach the agricultural knowledge server. Please verify your connection or backend status and try again.";

      const botErrorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        is_error: true,
        content: errorReply,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, botErrorMsg]);

      if (isVoice) {
        handleSpeakText(errorReply, botErrorMsg.id);
      }
    } finally {
      setLoading(false);
    }
  };

  // Support Enter to Send and Shift+Enter for new line
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={embedded ? "kc-kriti-window-embedded" : "kc-kriti-window"}>
      {/* Header: KRITI AI (Deep Teal #176B68, Amber #E8B34D, Soft Turquoise #DDF1EC) */}
      <div className="px-4 py-3.5 bg-[#176B68] text-white flex items-center justify-between border-b border-[#DDF1EC]/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#E8B34D] text-[#176B68] flex items-center justify-center font-bold shadow-xs shrink-0">
            <Sprout size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm sm:text-base leading-tight tracking-tight text-white">
                KRITI AI
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 text-[#E8B34D] px-2 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <p className="text-[11px] text-[#DDF1EC] mt-0.5 leading-none">
              {isHindi ? 'आपकी स्मार्ट कृषि सहायक' : 'Your Smart Agricultural Assistant'}
            </p>
          </div>
        </div>

        {/* Controls: Stop Voice, New Chat, Language Switcher, Close */}
        <div className="flex items-center gap-1.5">
          {isSpeaking && (
            <button
              type="button"
              onClick={handleStopSpeaking}
              className="px-2 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 animate-pulse shadow-xs cursor-pointer"
              title="Stop Voice Output"
            >
              <VolumeX size={12} />
              <span>Stop</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNewChat}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Start New Chat / नई बातचीत शुरू करें"
          >
            <RotateCcw size={11} />
            <span className="hidden sm:inline">{isHindi ? 'नई चैट' : 'New Chat'}</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage(isHindi ? 'en' : 'hi')}
            className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Globe size={12} />
            <span>{isHindi ? 'EN' : 'हिन्दी'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className={`px-2 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              geminiActive
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/30 hover:bg-emerald-500/35'
                : 'bg-amber-400/20 text-[#E8B34D] border border-amber-400/30 hover:bg-amber-400/30 animate-pulse'
            }`}
            title={geminiActive ? "Google Gemini Real-Time AI is Active" : "Add Gemini API Key to enable Real-Time AI for any question"}
          >
            <Key size={11} />
            <span className="hidden sm:inline">{geminiActive ? 'Gemini AI' : 'API Key'}</span>
          </button>

          {!embedded && (
            <button
              type="button"
              onClick={() => { handleStopSpeaking(); onClose(); }}
              className="p-1 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer ml-0.5"
              title="Close KRITI AI"
              aria-label="Close KRITI AI"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2E28] rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#DDF1EC] relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowKeyModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer p-1"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#DDF1EC] flex items-center justify-center text-[#176B68]">
                <Key size={16} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#263A32] dark:text-white">
                  {isHindi ? 'गूगल जेमिनी एआई सक्रिय करें' : 'Activate Google Gemini AI'}
                </h4>
                <p className="text-[10px] text-gray-500">
                  {isHindi ? 'रीयल-टाइम एआई जेनरेशन' : 'Real-time generative AI for any question'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
              {isHindi
                ? 'किसी भी अनगिनत सवाल का रीयल-टाइम उत्तर पाने के लिए अपनी गूगल जेमिनी एपीआई की (API Key) दर्ज करें।'
                : 'To ask any question and get real-time generative answers powered by Google Gemini 2.5 Flash, enter your Gemini API key below.'}
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#176B68]"
                />
              </div>

              {keyStatusMsg && (
                <div className={`text-xs p-2 rounded-lg flex items-center gap-1.5 ${
                  keyStatusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  {keyStatusMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{keyStatusMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#176B68] hover:underline font-medium"
                >
                  {isHindi ? 'मुफ्त की (Key) पाएं →' : 'Get Free Key →'}
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={keySaving || !apiKeyInput.trim()}
                    className="px-4 py-1.5 text-xs bg-[#176B68] hover:bg-[#125451] disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {keySaving ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...') : (isHindi ? 'सहेजें व शुरू करें' : 'Save & Activate')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suggested Questions Horizontal Scroller */}
      <div className="kc-kriti-suggestions-bar">
        <Sparkles size={13} className="text-[#176B68] shrink-0" />
        <span className="text-[10px] font-extrabold text-[#176B68] uppercase tracking-wider shrink-0 hidden sm:inline">
          {isHindi ? 'सुझाव:' : 'Suggested:'}
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q, false)}
            className="kc-suggestion-chip"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Voice Error Notification Banner */}
      {voiceError && (
        <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={14} className="shrink-0 text-amber-600" />
            <span>{voiceError}</span>
          </div>
          <button
            type="button"
            onClick={() => setVoiceError(null)}
            className="text-amber-600 hover:text-amber-900 font-bold text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="kc-kriti-messages">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const isWelcomeMsg = msg.id === 'welcome-msg';
          const isErrorMsg = Boolean(msg.is_error);
          const currentRating = ratings[msg.id] || 0;
          const hoveredVal = hoveredRatings[msg.id] || 0;

          return (
            <div key={msg.id || idx} className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Profile Avatar */}
              <div className="shrink-0 mt-0.5">
                {isUser ? (
                  <div className="w-7 h-7 rounded-full bg-[#DDF1EC] text-[#176B68] flex items-center justify-center font-bold border border-[#C8E5DD]">
                    <User size={14} />
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-full ${isErrorMsg ? 'bg-red-600 text-white' : 'bg-[#176B68] text-[#E8B34D]'} flex items-center justify-center font-bold shadow-xs`}>
                    <Sprout size={15} />
                  </div>
                )}
              </div>

              {/* Message Content Container */}
              <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
                <div className={isUser ? 'kc-bubble-user' : (isErrorMsg ? 'kc-bubble-error' : 'kc-bubble-assistant')}>
                  {/* Optional Uploaded Image */}
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden max-w-[220px] border border-[#E2ECE8]">
                      <img src={msg.image} alt="Farm waste input" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Star Rating System (1–5 Stars) for AI answers (excluding welcome & error) */}
                  {!isUser && !isWelcomeMsg && !isErrorMsg && (
                    <div className="kc-star-rating-container">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-[#176B68]">
                          {isHindi ? 'रेट करें:' : 'Rate answer:'}
                        </span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = (hoveredVal || currentRating) >= star;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingSubmit(msg.id, star)}
                                onMouseEnter={() => setHoveredRatings(prev => ({ ...prev, [msg.id]: star }))}
                                onMouseLeave={() => setHoveredRatings(prev => ({ ...prev, [msg.id]: 0 }))}
                                className="kc-star-btn"
                                style={{ color: isFilled ? '#E8B34D' : '#CBD5E1' }}
                                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                              >
                                ★
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {currentRating > 0 && (
                        <span className="kc-star-thanks">
                          {isHindi ? 'प्रतिक्रिया के लिए धन्यवाद!' : 'Thanks for your feedback!'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Assistant Controls Bar: Speaker / Replay Button */}
                  {!isUser && !isErrorMsg && (
                    <div className="mt-2 pt-2 border-t border-[#E2ECE8] flex items-center justify-between text-xs text-[#78877F]">
                      <span className="text-[10px] font-bold text-[#176B68]">KRITI AI Verified Guidance</span>
                      <button
                        type="button"
                        onClick={() => handleSpeakText(msg.content, msg.id)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          currentlySpeakingId === msg.id
                            ? 'bg-[#E8B34D] text-[#263A32] shadow-xs'
                            : 'bg-[#DDF1EC] hover:bg-[#C8E5DD] text-[#176B68]'
                        }`}
                        title="Listen to this answer aloud"
                      >
                        {currentlySpeakingId === msg.id ? (
                          <>
                            <div className="kc-speaking-wave">
                              <span className="kc-speaking-bar"></span>
                              <span className="kc-speaking-bar"></span>
                              <span className="kc-speaking-bar"></span>
                            </div>
                            <span>Speaking...</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={12} />
                            <span>Listen / सुनें</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Matched Partners */}
                  {msg.matched_partners && msg.matched_partners.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#E2ECE8] space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#176B68] block">
                        Verified Partners Near You:
                      </span>
                      {msg.matched_partners.map((p, pIdx) => (
                        <div key={pIdx} className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E2ECE8] text-xs">
                          <div className="flex items-center justify-between font-bold text-[#176B68]">
                            <span>{p.business_name}</span>
                            <span className="text-[9px] text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded font-bold">
                              Verified
                            </span>
                          </div>
                          <p className="text-[#78877F] text-[10px] mt-0.5">Area: {p.service_area}</p>
                          <p className="text-[#263A32] font-semibold mt-0.5 text-[11px]">Rate: {p.pricing_details}</p>
                          <button
                            type="button"
                            onClick={() => { handleStopSpeaking(); onClose(); window.location.href = '/find-partners'; }}
                            className="mt-1 text-[11px] font-bold text-[#176B68] hover:underline block cursor-pointer"
                          >
                            Request Pickup &rarr;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#E2ECE8] flex flex-wrap gap-1.5">
                      {msg.actions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => { handleStopSpeaking(); onClose(); window.location.href = action.link; }}
                          className="bg-[#176B68] hover:bg-[#125754] text-white font-bold text-[11px] py-1 px-3 rounded-full transition-colors cursor-pointer"
                        >
                          {action.label} &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visible Message Timestamp */}
                <span className="text-[10px] text-[#78877F] mt-1 px-1">
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#176B68] text-[#E8B34D] flex items-center justify-center font-bold">
              <Sprout size={15} />
            </div>
            <div className="kc-bubble-assistant flex items-center gap-2 py-2 px-3.5">
              <span className="text-xs text-[#78877F] font-medium">KRITI AI is thinking</span>
              <div className="flex items-center gap-1 ml-1">
                <span className="kc-typing-dot"></span>
                <span className="kc-typing-dot"></span>
                <span className="kc-typing-dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attached Image Preview */}
      {attachedImage && (
        <div className="px-3.5 py-2 bg-[#F0F7F4] border-t border-[#E2ECE8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#E2ECE8]">
              <img src={attachedImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#176B68] block">Photo attached for identification</span>
              <span className="text-[10px] text-[#78877F]">KRITI AI will analyze residue type</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAttachedImage(null)}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Area: Camera, Voice Mic, Clean Textarea, Send */}
      <div className="kc-kriti-input-area shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />

        {/* Camera / Photo Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full text-gray-500 hover:text-[#176B68] hover:bg-[#DDF1EC] transition-colors shrink-0 cursor-pointer"
          title="Upload photo for waste classification"
          aria-label="Upload photo"
        >
          <Camera size={18} />
        </button>

        {/* Microphone Button for 2-Way Voice Assistant */}
        <VoiceInput
          language={language}
          onTranscript={(spokenText, isVoice) => handleSend(spokenText, isVoice)}
          disabled={loading}
          isSpeaking={isSpeaking}
          onStopSpeaking={handleStopSpeaking}
          onError={(msg) => setVoiceError(msg)}
        />

        {/* Multiline Textarea supporting Enter to send & Shift+Enter for new line */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isHindi ? "फसल अवशेष, कंपोस्ट, बिक्री, एफपीओ या सरकारी योजना का प्रश्न पूछें..." : "Ask KRITI AI about crop residue, composting, FPOs, selling waste..."}
          className="kc-kriti-textarea"
          disabled={loading}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSend(undefined, false)}
          disabled={(!inputText.trim() && !attachedImage) || loading}
          className="w-9 h-9 rounded-full bg-[#176B68] hover:bg-[#125754] disabled:bg-gray-200 disabled:text-gray-400 text-white flex items-center justify-center transition-all shrink-0 shadow-xs cursor-pointer"
          title="Send Question to KRITI AI"
          aria-label="Send Question"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
