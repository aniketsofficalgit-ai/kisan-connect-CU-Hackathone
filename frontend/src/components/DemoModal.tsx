import React from 'react';
import { X, UserCheck, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { RoleBadge } from './RoleBadge';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const { demoAccounts, switchDemoAccount, user } = useAuth();

  if (!isOpen) return null;

  const handleSelect = async (role: UserRole) => {
    await switchDemoAccount(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Demo Mode Quick Switcher</h3>
              <p className="text-xs text-gray-500">Instantly switch between roles to test workflows</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {demoAccounts.map((account) => {
            const isCurrent = user?.role === account.role;
            return (
              <div
                key={account.role}
                onClick={() => handleSelect(account.role)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{account.title}</span>
                    <RoleBadge role={account.role} size="sm" />
                    {isCurrent && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded-full">
                        Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{account.description}</p>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Login: {account.identifier} • pass: password123
                  </p>
                </div>
                <button
                  type="button"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap self-start sm:self-center transition-all ${
                    isCurrent
                      ? 'bg-emerald-700 text-white cursor-default'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                  }`}
                >
                  {isCurrent ? 'Current Role' : 'Switch Role'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
          <Shield className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
          <p>
            Demo mode provides pre-populated, verified agricultural profiles without weakening production security or password hashing.
          </p>
        </div>
      </div>
    </div>
  );
};
