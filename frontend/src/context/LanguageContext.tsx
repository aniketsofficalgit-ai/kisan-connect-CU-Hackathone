import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speechLocale: string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    findWorkers: 'Find Workers',
    rentMachinery: 'Rent Machinery',
    sellCrops: 'Sell Crops',
    weather: 'Weather',
    aiAssistant: 'AI Voice Assistant',
    requests: 'Requests',
    messages: 'Messages',
    notifications: 'Notifications',
    profile: 'Profile',
    admin: 'Admin Panel',
    login: 'Log In',
    register: 'Sign Up',
    logout: 'Log Out',
    demoAccounts: 'Demo Mode',

    // Hero & Tagline
    heroTitle: 'Everything Agriculture Needs, Connected in One Place.',
    heroSubtitle: 'A farmer-first digital platform connecting farmers with skilled agricultural workers, machinery owners, produce buyers, localized weather advisories, and an AI voice assistant.',
    getStarted: 'Get Started',
    exploreServices: 'Explore Services',

    // Roles
    farmer: 'Farmer',
    worker: 'Agricultural Worker',
    machinery_owner: 'Machinery Owner',
    buyer: 'Produce Buyer',
    administrator: 'Administrator',

    // Statuses
    pending: 'Pending',
    accepted: 'Accepted',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    completed: 'Completed',
    verified: 'Verified',
    not_verified: 'Not Verified',

    // Voice
    listening: 'Listening... Please speak now',
    speakNow: 'Tap microphone to speak',
    micStop: 'Stop Recording',
    askVoicePrompt: 'Ask any farming question in English, Hindi, or Punjabi',
    readAloud: 'Read Aloud',

    // Actions
    search: 'Search',
    filter: 'Filter',
    bookNow: 'Book Equipment',
    requestWorker: 'Request Worker',
    sendInquiry: 'Send Purchase Offer',
    saveChanges: 'Save Changes',
    submit: 'Submit',
    cancel: 'Cancel',
    viewDetails: 'View Details',
  },
  hi: {
    // Navigation
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    findWorkers: 'मजदूर खोजें',
    rentMachinery: 'मशीनरी किराए पर लें',
    sellCrops: 'फसल बेचें',
    weather: 'मौसम',
    aiAssistant: 'AI आवाज सहायक',
    requests: 'अनुरोध व बुकिंग',
    messages: 'संदेश',
    notifications: 'सूचनाएं',
    profile: 'प्रोफ़ाइल',
    admin: 'व्यवस्थापक',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    demoAccounts: 'डेमो मोड',

    // Hero & Tagline
    heroTitle: 'कृषि की हर जरूरत, एक ही मंच पर जुड़ी हुई।',
    heroSubtitle: 'किसानों के लिए समर्पित डिजिटल मंच जो किसानों को कृषि श्रमिकों, मशीनरी मालिकों, फसल खरीदारों, मौसम पूर्वानुमान और एआई वॉइस सहायक से जोड़ता है।',
    getStarted: 'शुरू करें',
    exploreServices: 'सेवाएं देखें',

    // Roles
    farmer: 'किसान',
    worker: 'कृषि मजदूर',
    machinery_owner: 'मशीनरी मालिक',
    buyer: 'फसल खरीदार',
    administrator: 'प्रशासक',

    // Statuses
    pending: 'लंबित',
    accepted: 'स्वीकृत',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    cancelled: 'रद्द',
    completed: 'पूर्ण',
    verified: 'सत्यापित',
    not_verified: 'असत्यापित',

    // Voice
    listening: 'सुन रहे हैं... कृपया बोलें',
    speakNow: 'बोलने के लिए माइक दबाएं',
    micStop: 'रिकॉर्डिंग रोकें',
    askVoicePrompt: 'हिंदी, पंजाबी या अंग्रेजी में कोई भी कृषि प्रश्न पूछें',
    readAloud: 'सुनें (बोलकर बताएं)',

    // Actions
    search: 'खोजें',
    filter: 'फ़िल्टर करें',
    bookNow: 'मशीन बुक करें',
    requestWorker: 'मजदूर बुलाएं',
    sendInquiry: 'खरीद प्रस्ताव भेजें',
    saveChanges: 'बदलाव सहेजें',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    viewDetails: 'विवरण देखें',
  },
  pa: {
    // Navigation
    home: 'ਮੁੱਖ ਪੰਨਾ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    findWorkers: 'ਮਜ਼ਦੂਰ ਲੱਭੋ',
    rentMachinery: 'ਮਸ਼ੀਨਰੀ ਕਿਰਾਏ \'ਤੇ ਲਵੋ',
    sellCrops: 'ਫਸਲ ਵੇਚੋ',
    weather: 'ਮੌਸਮ',
    aiAssistant: 'AI ਆਵਾਜ਼ ਸਹਾਇਕ',
    requests: 'ਬੇਨਤੀਆਂ ਤੇ ਬੁਕਿੰਗਾਂ',
    messages: 'ਸੁਨੇਹੇ',
    notifications: 'ਸੂਚਨਾਵਾਂ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    admin: 'ਐਡਮਿਨ ਪੈਨਲ',
    login: 'ਲਾਗ ਇਨ',
    register: 'ਰਜਿਸਟਰ ਕਰੋ',
    logout: 'ਲਾਗ ਆਊਟ',
    demoAccounts: 'ਡੈਮੋ ਮੋਡ',

    // Hero & Tagline
    heroTitle: 'ਖੇਤੀਬਾੜੀ ਦੀ ਹਰ ਲੋੜ, ਇੱਕੋ ਥਾਂ ਜੁੜੀ ਹੋਈ।',
    heroSubtitle: 'ਕਿਸਾਨ-ਪੱਖੀ ਡਿਜੀਟਲ ਪਲੇਟਫਾਰਮ ਜੋ ਕਿਸਾਨਾਂ ਨੂੰ ਖੇਤ ਮਜ਼ਦੂਰਾਂ, ਮਸ਼ੀਨਰੀ ਮਾਲਕਾਂ, ਫਸਲ ਖਰੀਦਦਾਰਾਂ, ਮੌਸਮ ਜਾਣਕਾਰੀ ਅਤੇ ਏ.ਆਈ. ਆਵਾਜ਼ ਸਹਾਇਕ ਨਾਲ ਜੋੜਦਾ ਹੈ।',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
    exploreServices: 'ਸੇਵਾਵਾਂ ਵੇਖੋ',

    // Roles
    farmer: 'ਕਿਸਾਨ',
    worker: 'ਖੇਤੀਬਾੜੀ ਮਜ਼ਦੂਰ',
    machinery_owner: 'ਮਸ਼ੀਨਰੀ ਮਾਲਕ',
    buyer: 'ਫਸਲ ਖਰੀਦਦਾਰ',
    administrator: 'ਐਡਮਿਨਿਸਟ੍ਰੇਟਰ',

    // Statuses
    pending: 'ਬਕਾਇਆ',
    accepted: 'ਮਨਜ਼ੂਰ',
    approved: 'ਮਨਜ਼ੂਰ',
    rejected: 'ਰੱਦ',
    cancelled: 'ਰੱਦ ਕੀਤਾ',
    completed: 'ਮੁਕੰਮਲ',
    verified: 'ਤਸਦੀਕ ਸ਼ੁਦਾ',
    not_verified: 'ਗ਼ੈਰ-ਤਸਦੀਕ',

    // Voice
    listening: 'ਸੁਣ ਰਿਹਾ ਹੈ... ਕਿਰਪਾ ਕਰਕੇ ਬੋਲੋ',
    speakNow: 'ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ',
    micStop: 'ਰਿਕਾਰਡਿੰਗ ਰੋਕੋ',
    askVoicePrompt: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ',
    readAloud: 'ਬੋਲ ਕੇ ਸੁਣਾਓ',

    // Actions
    search: 'ਖੋਜ ਕਰੋ',
    filter: 'ਫਿਲਟਰ',
    bookNow: 'ਮਸ਼ੀਨਰੀ ਬੁੱਕ ਕਰੋ',
    requestWorker: 'ਮਜ਼ਦੂਰ ਬੇਨਤੀ ਭੇਜੋ',
    sendInquiry: 'ਖਰੀਦ ਪੇਸ਼ਕਸ਼ ਭੇਜੋ',
    saveChanges: 'ਸੰਭਾਲੋ',
    submit: 'ਜਮ੍ਹਾ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    viewDetails: 'ਵੇਰਵੇ ਵੇਖੋ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('preferred_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const speechLocales: Record<Language, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    pa: 'pa-IN'
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speechLocale: speechLocales[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
