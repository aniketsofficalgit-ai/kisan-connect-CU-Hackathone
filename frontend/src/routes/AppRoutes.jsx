import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Guard
import AuthGuard from '../services/authGuard';

// Feature Pages
import Home from '../features/home/Home';
import About from '../features/about/About';
import Login from '../features/authentication/Login';
import Signup from '../features/authentication/Signup';
import AIAssistantPage from '../features/ai-assistant/AIAssistantPage';

import FarmerDashboard from '../features/farmer-dashboard/FarmerDashboard';

import AddWaste from '../features/waste-management/AddWaste';
import WasteList from '../features/waste-management/WasteList';
import WasteDetails from '../features/waste-management/WasteDetails';

import FindPartners from '../features/partner-discovery/FindPartners';
import PartnerDetails from '../features/partner-discovery/PartnerDetails';

import CollectionRequests from '../features/collection-tracking/CollectionRequests';
import CollectionDetails from '../features/collection-tracking/CollectionDetails';

import RecyclingGuide from '../features/recycling-education/RecyclingGuide';

import PartnerDashboard from '../features/partner-dashboard/PartnerDashboard';
import AdminDashboard from '../features/admin-dashboard/AdminDashboard';

import NotificationList from '../features/notifications/NotificationList';
import UserProfile from '../features/user-profile/UserProfile';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/ai-assistant" element={<AIAssistantPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/waste-marketplace" element={<WasteList />} />
      <Route path="/waste-details/:id" element={<WasteDetails />} />
      <Route path="/find-partners" element={<FindPartners />} />
      <Route path="/partner-details/:id" element={<PartnerDetails />} />
      <Route path="/recycling-education" element={<RecyclingGuide />} />

      {/* Farmer Protected Routes */}
      <Route
        path="/farmer-dashboard"
        element={
          <AuthGuard allowedRoles={['farmer', 'admin']}>
            <FarmerDashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/add-waste"
        element={
          <AuthGuard allowedRoles={['farmer', 'admin']}>
            <AddWaste />
          </AuthGuard>
        }
      />

      {/* Partner Protected Routes */}
      <Route
        path="/partner-dashboard"
        element={
          <AuthGuard allowedRoles={['partner', 'admin']}>
            <PartnerDashboard />
          </AuthGuard>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <AuthGuard allowedRoles={['admin']}>
            <AdminDashboard />
          </AuthGuard>
        }
      />

      {/* Shared Authenticated Routes */}
      <Route
        path="/tracking"
        element={
          <AuthGuard>
            <CollectionRequests />
          </AuthGuard>
        }
      />
      <Route
        path="/collection-details/:id"
        element={
          <AuthGuard>
            <CollectionDetails />
          </AuthGuard>
        }
      />
      <Route
        path="/notifications"
        element={
          <AuthGuard>
            <NotificationList />
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <UserProfile />
          </AuthGuard>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
