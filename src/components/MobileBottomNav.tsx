import React from 'react';
import { LayoutDashboard, Plus, Layers, GraduationCap, ShieldAlert, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, setIsCreateBoardOpen, setActiveBoardId, setIsProfileOpen } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2">
      <button
        onClick={() => { setActiveBoardId(null); setCurrentView('dashboard'); }}
        className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
          currentView === 'dashboard' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>اللوحات</span>
      </button>

      <button
        onClick={() => { setActiveBoardId(null); setCurrentView('templates'); }}
        className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
          currentView === 'templates' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span>القوالب</span>
      </button>

      {/* Floating Center Add Button */}
      <button
        onClick={() => setIsCreateBoardOpen(true)}
        className="w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 active:scale-90 transition"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => { setActiveBoardId(null); setCurrentView('education'); }}
        className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
          currentView === 'education' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500'
        }`}
      >
        <GraduationCap className="w-5 h-5" />
        <span>التعليم</span>
      </button>

      <button
        onClick={() => setIsProfileOpen(true)}
        className="flex flex-col items-center gap-1 text-[11px] font-bold text-slate-500"
      >
        <User className="w-5 h-5" />
        <span>حسابي</span>
      </button>
    </div>
  );
};
