import React from 'react';
import { UserRole } from '../types';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

const roleLabels: Record<UserRole, string> = {
  farmer: 'Farmer',
  worker: 'Agricultural Worker',
  machinery_owner: 'Machinery Owner',
  buyer: 'Produce Buyer',
  admin: 'Administrator'
};

const roleColors: Record<UserRole, string> = {
  farmer: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  worker: 'bg-amber-100 text-amber-800 border-amber-300',
  machinery_owner: 'bg-blue-100 text-blue-800 border-blue-300',
  buyer: 'bg-purple-100 text-purple-800 border-purple-300',
  admin: 'bg-rose-100 text-rose-800 border-rose-300'
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${roleColors[role] || 'bg-gray-100 text-gray-800'} ${sizeClasses}`}>
      {roleLabels[role] || role}
    </span>
  );
};
