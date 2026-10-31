import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Chatbot from './features/ai-assistant/Chatbot';
import AppRoutes from './routes/AppRoutes';
import './index.css';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen bg-[#FAF9F3]">
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
            {/* Kisan AI Assistant Floating on every page */}
            <Chatbot />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
