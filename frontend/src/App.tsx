import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkersPage } from './pages/WorkersPage';
import { WorkerDetailPage } from './pages/WorkerDetailPage';
import { MachineryPage } from './pages/MachineryPage';
import { MachineryDetailPage } from './pages/MachineryDetailPage';
import { CreateMachineryPage } from './pages/CreateMachineryPage';
import { MachineryBookingDetailPage } from './pages/MachineryBookingDetailPage';
import { CropsPage } from './pages/CropsPage';
import { CropDetailPage } from './pages/CropDetailPage';
import { CreateCropPage } from './pages/CreateCropPage';
import { BuyerInquiryDetailPage } from './pages/BuyerInquiryDetailPage';
import { WeatherPage } from './pages/WeatherPage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { RequestsPage } from './pages/RequestsPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-gray-400">Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F3] text-[#1F2933]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/workers" element={<WorkersPage />} />
          <Route path="/workers/:id" element={<WorkerDetailPage />} />
          <Route path="/machinery" element={<MachineryPage />} />
          <Route path="/machinery/:id" element={<MachineryDetailPage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/crops/:id" element={<CropDetailPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/ai-assistant" element={<VoiceAssistantPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-terms" element={<PrivacyTermsPage />} />

          {/* Authenticated Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Role-Specific Creation & Detail Routes */}
          <Route
            path="/machinery/create"
            element={
              <ProtectedRoute allowedRoles={['machinery_owner']}>
                <CreateMachineryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/machinery/bookings/:id"
            element={
              <ProtectedRoute>
                <MachineryBookingDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crops/create"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <CreateCropPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crops/inquiries/:id"
            element={
              <ProtectedRoute>
                <BuyerInquiryDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Administrator Panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}
