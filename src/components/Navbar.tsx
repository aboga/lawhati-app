import React, { useState } from 'react';
import { 
  Search, Bell, Plus, Moon, Sun, Globe, User, LogOut, Settings, 
  Sparkles, ShieldCheck, GraduationCap, UserCheck, Check, X,
  SlidersHorizontal, Bookmark, HelpCircle, LayoutDashboard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { 
    user, 
    switchRole, 
    isDarkMode, 
    setIsDarkMode, 
    language, 
    setLanguage, 
    currentView, 
    setCurrentView,
    searchQuery,
    setSearchQuery,
    setIsCreateBoardOpen,
    setIsAiModalOpen,
    setIsProfileOpen,
    setIsSettingsOpen,
    setIsAuthModalOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationsAsRead,
    setActiveBoardId,
    logout
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 transition-colors">
      <div className="h-full flex items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Left Side: Logo & Navigation shortcut */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setActiveBoardId(null); setCurrentView('dashboard'); }}
            className="flex items-center text-start hover:opacity-90 transition cursor-pointer"
          >
            <Logo size="md" />
          </button>

          {/* Quick Role Switcher Chip */}
          <div className="hidden lg:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => switchRole('teacher')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                user.role === 'teacher'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>معلم</span>
            </button>
            <button
              onClick={() => switchRole('student')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                user.role === 'student'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>طالب</span>
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                user.role === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مدير</span>
            </button>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث في اللوحات، المنشورات، الملفات...' : 'Search boards, posts, files...'}
              className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-transparent focus:border-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action + Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Quick Assistant Trigger */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-teal-500/10 hover:from-sky-500/20 hover:to-teal-500/20 text-sky-700 dark:text-sky-300 border border-sky-300/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="مساعد لوحتي الذكي"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="hidden md:inline">لوحتي AI</span>
          </button>

          {/* Action Button: Enter Platform if on landing, or Create Board otherwise */}
          {currentView === 'landing' ? (
            <button
              id="nav-enter-platform-btn"
              onClick={() => {
                setActiveBoardId(null);
                setCurrentView('dashboard');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 active:scale-95 transition cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{language === 'ar' ? 'دخول المنصة' : 'Enter Platform'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCreateBoardOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'ar' ? 'إنشاء لوحة' : 'Create Board'}</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifMenuOpen(!isNotifMenuOpen);
                setIsUserMenuOpen(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotifMenuOpen && (
              <div className="absolute left-0 sm:right-auto sm:left-0 rtl:left-0 rtl:right-auto mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">الإشعارات والتنبيهات</h4>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 rounded-full">
                        {unreadNotificationsCount} جديد
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    تحديد الكل كمقروء
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">لا توجد إشعارات جديدة</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-start gap-3 text-xs ${
                          !n.isRead ? 'bg-sky-50/40 dark:bg-sky-950/20' : ''
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 bg-sky-500 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-slate-400">{n.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer hidden sm:flex"
            title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold font-sans transition cursor-pointer hidden sm:flex items-center gap-1"
            title="تغيير اللغة"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsNotifMenuOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-sky-500/30"
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute left-0 rtl:left-0 rtl:right-auto mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Info Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                      باقة {user.plan === 'school' ? 'المؤسسات' : user.plan === 'education' ? 'التعليم' : user.plan === 'pro' ? 'المحترف' : 'المجانية'}
                    </span>
                  </div>
                </div>

                {/* Switch Role Options */}
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="px-2 py-1 text-[11px] font-bold text-slate-400">تبديل المنظور الحالي:</p>
                  <div className="grid grid-cols-3 gap-1 px-1">
                    {[
                      { id: 'teacher', label: 'معلم' },
                      { id: 'student', label: 'طالب' },
                      { id: 'admin', label: 'مدير' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => { switchRole(r.id as any); setIsUserMenuOpen(false); }}
                        className={`py-1.5 text-xs font-bold rounded-lg transition ${
                          user.role === r.id
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu List */}
                <div className="p-2 space-y-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    onClick={() => { setIsProfileOpen(true); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-start"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>الملف الشخصي</span>
                  </button>

                  <button
                    onClick={() => { setIsSettingsOpen(true); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-start"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>إعدادات الحساب</span>
                  </button>

                  <button
                    onClick={() => { setCurrentView('landing'); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-start"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>الصفحة التعريفية للمنصة</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <button
                    onClick={async () => { setIsUserMenuOpen(false); await logout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-start"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
