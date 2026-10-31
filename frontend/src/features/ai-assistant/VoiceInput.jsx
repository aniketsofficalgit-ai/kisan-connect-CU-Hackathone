import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const VoiceInput = ({
  onTranscript,
  language = 'en',
  disabled = false,
  isSpeaking = false,
  onStopSpeaking,
  onError
}) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSupported(true);
    }
  }, []);

  const toggleListening = () => {
    // If KRITI AI is currently speaking and user clicks mic, stop TTS first
    if (isSpeaking && onStopSpeaking) {
      onStopSpeaking();
    }

    if (!supported) {
      const msg = "Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.";
      if (onError) onError(msg);
      else alert(msg);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript && onTranscript) {
        // Pass isVoice = true so KRITI AI will read the answer aloud
        onTranscript(transcript, true);
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      let errorMsg = "";
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        errorMsg = language === 'hi'
          ? "माइक्रोफ़ोन अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।"
          : "Microphone permission denied. Please allow microphone access in your browser settings.";
      } else if (event.error === 'no-speech') {
        errorMsg = language === 'hi'
          ? "कोई आवाज़ नहीं सुनी गई। कृपया दोबारा बोलें।"
          : "No speech detected. Please click the microphone and try again.";
      } else if (event.error !== 'aborted') {
        errorMsg = language === 'hi'
          ? `वॉइस इनपुट त्रुटि: ${event.error}`
          : `Voice input error: ${event.error}`;
      }
      if (errorMsg && onError) {
        onError(errorMsg);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Speech recognition start failed:", e);
      setIsListening(false);
      if (onError) onError("Failed to start voice recognition. Please try again.");
    }
  };

  if (!supported) return null;

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
          isListening
            ? 'bg-red-500 text-white shadow-md animate-pulse ring-4 ring-red-200'
            : 'text-[#176B68] hover:bg-[#DDF1EC] bg-[#FAF9F5] border border-[#E2ECE8]'
        }`}
        title={isListening ? "Listening to your voice... Click to stop" : "Speak to KRITI AI (Voice Input)"}
        aria-label="Voice Assistant Microphone"
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>

      {isListening && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md animate-bounce z-10">
          Listening... बोलिए
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
