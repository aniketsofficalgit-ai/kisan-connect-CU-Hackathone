import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, Search, Truck, BookOpen,
  Users, CheckCircle2, Shield, Settings, UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export const Sidebar = ({ role = 'farmer' }) => {
  const { user } = useAuth();
  const activeRole = role || user?.role || 'farmer';

  return (
    <aside className="kc-sidebar hidden md:flex">
      <div className="px-3 pb-4 mb-2 border-b border-gray-100">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">
          {activeRole === 'farmer' ? 'Farmer Console' : activeRole === 'partner' ? 'Partner Portal' : 'Admin Operations'}
        </span>
        <p className="text-sm font-semibold text-gray-800 truncate">{user?.full_name}</p>
      </div>

      <nav className="space-y-1">
        {activeRole === 'farmer' && (
          <>
            <NavLink to="/farmer-dashboard" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Overview
            </NavLink>
            <NavLink to="/add-waste" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <PlusCircle size={18} /> Add Waste Listing
            </NavLink>
            <NavLink to="/find-partners" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <Search size={18} /> Find Recyclers
            </NavLink>
            <NavLink to="/tracking" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <Truck size={18} /> Collection Tracking
            </NavLink>
            <NavLink to="/recycling-education" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} /> Recycling Guides
            </NavLink>
          </>
        )}

        {activeRole === 'partner' && (
          <>
            <NavLink to="/partner-dashboard" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard Overview
            </NavLink>
            <NavLink to="/tracking" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <Truck size={18} /> Manage Requests
            </NavLink>
            <NavLink to="/find-partners" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <Search size={18} /> Partner Network
            </NavLink>
            <NavLink to="/recycling-education" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} /> Recycling Standards
            </NavLink>
          </>
        )}

        {activeRole === 'admin' && (
          <>
            <NavLink to="/admin-dashboard" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <Shield size={18} /> Platform Analytics
            </NavLink>
            <NavLink to="/tracking" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <Truck size={18} /> Monitor Collections
            </NavLink>
            <NavLink to="/recycling-education" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} /> Resource Content
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <NavLink to="/profile" className={({ isActive }) => `kc-sidebar-item ${isActive ? 'active' : ''}`}>
          <Settings size={18} /> Account Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
