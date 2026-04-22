import React, { useState } from 'react';
import { LayoutDashboard, Send, FolderSearch, MessageSquare, Menu, X, ShieldAlert, Key } from 'lucide-react';
import { TabType } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, isAdmin, setIsAdmin }) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submissions' as TabType, label: 'Submissions', icon: Send },
    { id: 'details' as TabType, label: 'Project Hub', icon: FolderSearch },
    { id: 'chatbot' as TabType, label: 'AI Assistant', icon: MessageSquare },
  ];

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setShowPasswordInput(false);
    } else {
      setShowPasswordInput(true);
    }
    setPassword('');
    setError(false);
  };

  const handleVerify = () => {
    const secret = import.meta.env.VITE_ADMIN_PASSWORD;
    if (password === secret) {
      setIsAdmin(true);
      setShowPasswordInput(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 bg-white border-r border-slate-200 w-60 z-50 transform transition-transform duration-300 lg:translate-x-0 force-gpu",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-indigo-600 text-xl tracking-tight">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rotate-45"></div>
              </div>
              <span>HACK HUB</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 hover:bg-slate-100 rounded"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  activeTab === item.id
                    ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="p-6 border-t border-slate-100 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={12} className={cn(isAdmin ? "text-indigo-600" : "text-slate-400")} />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin Mode</span>
                </div>
                <button 
                  onClick={handleAdminToggle}
                  className={cn(
                    "w-8 h-4 rounded-full transition-all relative",
                    isAdmin ? "bg-indigo-600" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                    isAdmin ? "right-0.5" : "left-0.5"
                  )} />
                </button>
              </div>

              <AnimatePresence>
                {showPasswordInput && !isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="relative">
                        <Key size={10} className="absolute left-2 top-1.5 text-slate-400" />
                        <input 
                          type="password"
                          placeholder="Secret Pass"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                          className={cn(
                            "w-full bg-white border rounded-lg pl-6 pr-2 py-1 text-[10px] outline-none transition-all",
                            error ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-200 focus:border-indigo-500"
                          )}
                        />
                      </div>
                      <button 
                        onClick={handleVerify}
                        className="w-full bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest py-1.5 rounded-lg hover:bg-indigo-700 transition-all active:scale-95"
                      >
                        Unlock System
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">v1.0.0 • Local</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Live Session</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
