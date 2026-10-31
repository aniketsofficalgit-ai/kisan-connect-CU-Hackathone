import api from '../../services/api';

export const chatbotService = {
  sendMessage: async (message, sessionId = 'guest', language = 'en', isVoice = false, history = [], image = null) => {
    const res = await api.post('/ai/chat', {
      message,
      session_id: sessionId,
      language,
      is_voice: isVoice,
      history,
      image
    });
    return res.data;
  },

  getHistory: async (sessionId = 'guest') => {
    const res = await api.get(`/ai/history?session_id=${sessionId}`);
    return res.data;
  },

  getSuggestedPrompts: async () => {
    try {
      const res = await api.get('/ai/suggested-prompts');
      return res.data;
    } catch (e) {
      return {
        prompts_en: [
          "How can I sell my agricultural waste?",
          "How can crop residue be recycled?",
          "How can I find nearby recycling partners?",
          "How is compost made?",
          "What government schemes are available for farmers?",
          "How does Kisan Connect work?"
        ],
        prompts_hi: [
          "मैं अपना कृषि अपशिष्ट कैसे बेच सकता हूँ?",
          "फसल अवशेष (पराली) का रीसाइक्लिंग कैसे करें?",
          "पास के रीसाइक्लिंग पार्टनर कैसे खोजें?",
          "केंचुआ खाद (कंपोस्ट) कैसे बनाई जाती है?",
          "किसानों के लिए कौन-सी सरकारी योजनाएं हैं?",
          "किसान कनेक्ट प्लेटफॉर्म कैसे काम करता है?"
        ]
      };
    }
  },

  rateMessage: async (messageId, rating, feedback = '') => {
    try {
      const res = await api.post('/ai/rate', {
        message_id: messageId,
        rating,
        feedback
      });
      return res.data;
    } catch (e) {
      console.warn("Failed to submit rating:", e);
      return { success: false };
    }
  },

  clearHistory: async (sessionId = 'guest') => {
    const res = await api.post(`/ai/clear?session_id=${sessionId}`);
    return res.data;
  },

  getStatus: async () => {
    try {
      const res = await api.get('/ai/status');
      return res.data;
    } catch (e) {
      return { gemini_active: false };
    }
  },

  setApiKey: async (apiKey) => {
    const res = await api.post('/ai/set-key', { api_key: apiKey });
    return res.data;
  }
};

export default chatbotService;
