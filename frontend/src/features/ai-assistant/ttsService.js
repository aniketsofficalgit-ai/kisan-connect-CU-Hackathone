/**
 * KRITI AI – Natural Voice Text-To-Speech (TTS) Engine
 * Manages clean natural speech synthesis, Indian language voice selection, and playback controls.
 */

export const cleanTextForSpeech = (rawText) => {
  if (!rawText) return '';
  return rawText
    // Remove markdown links [label](url) -> label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold and italic markers **text** or *text*
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove headers #, ##, ###
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bullets •, -, *
    .replace(/^[•\-\*]\s+/gm, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Normalize newlines and extra spaces
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const ttsService = {
  getVoices: () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices() || [];
  },

  selectBestVoice: (language = 'en') => {
    const voices = ttsService.getVoices();
    if (!voices || voices.length === 0) return null;

    const isHindi = language === 'hi';

    if (isHindi) {
      // Look for Hindi voices
      const hindiVoice = voices.find(v =>
        v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
      );
      if (hindiVoice) return hindiVoice;
    }

    // Look for Indian English first
    const indianEnVoice = voices.find(v =>
      v.lang === 'en-IN' || v.name.toLowerCase().includes('india')
    );
    if (indianEnVoice) return indianEnVoice;

    // Fallback to any English voice
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    return enVoice || voices[0] || null;
  },

  speak: (text, language = 'en', onStart, onEnd, onError) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEnd) onEnd();
      return false;
    }

    // Stop any existing utterance
    window.speechSynthesis.cancel();

    const spokenText = cleanTextForSpeech(text);
    if (!spokenText) {
      if (onEnd) onEnd();
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    const isHindi = language === 'hi' || /[अ-ह]/.test(text);

    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower, respectful and clear for farmers
    utterance.pitch = 1.05;

    const voice = ttsService.selectBestVoice(isHindi ? 'hi' : 'en');
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('TTS speech error:', e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    try {
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.error('Failed to trigger speech synthesis:', e);
      if (onEnd) onEnd();
      return false;
    }
  },

  stop: () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking: () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false;
    return window.speechSynthesis.speaking;
  }
};

export default ttsService;
