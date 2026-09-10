import React from 'react';
import { 
  LayoutDashboard, FolderKanban, Users, Star, Archive, Trash2, 
  Sparkles, Compass, GraduationCap, ShieldAlert, Settings, HelpCircle, 
  Plus, Layers, BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    activeFilter, 
    setActiveFilter, 
    setIsCreateBoardOpen,
    setActiveBoardId,
    boards,
    user,
    setIsSettingsOpen
  } = useApp();

  const myBoardsCount = boards.filter(b => !b.isTrash && !b.isArchived).length;
  const favCount = boards.filter(b => b.isFavorite && !b.isTrash).length;
  const trashCount = boards.filter(b => b.isTrash).length;

  const handleNavClick = (view: any, filter?: any) => {
    setActiveBoardId(null);
    setCurrentView(view);
    if (filter) {
      setActiveFilter(filter);
    }
  };

  const navItems = [
    {
      id: 'dashboard-all',
      label: 'الرئيسية',
      icon: LayoutDashboard,
      view: 'dashboard',
      filter: 'all',
      count: myBoardsCount,
    },
    {
      id: 'dashboard-my',
      label: 'لوحاتي',
      icon: FolderKanban,
      view: 'dashboard',
      filter: 'my',
      count: myBoardsCount,
    },
    {
      id: 'dashboard-shared',
      label: 'المشاركة معي',
      icon: Users,
      view: 'dashboard',
      filter: 'shared',
      count: 2,
    },
    {
      id: 'dashboard-favorite',
      label: 'المفضلة',
      icon: Star,
      view: 'dashboard',
      filter: 'favorite',
      count: favCount,
      iconColor: 'text-amber-500',
    },
    {
      id: 'dashboard-archived',
      label: 'المؤرشفة',
      icon: Archive,
      view: 'dashboard',
      filter: 'archived',
    },
    {
      id: 'dashboard-trash',
      label: 'سلة المحذوفات',
      icon: Trash2,
      view: 'dashboard',
      filter: 'trash',
      count: trashCount > 0 ? trashCount : undefined,
      iconColor: trashCount > 0 ? 'text-rose-500' : undefined,
    },
  ];

  const exploreItems = [
    {
      id: 'view-templates',
      label: 'مكتبة القوالب',
      icon: Layers,
      view: 'templates',
      badge: 'جديد',
    },
    {
      id: 'view-education',
      label: user.role === 'teacher' ? 'قسم التعليم (المعلم)' : 'فصولي الدراسية',
      icon: GraduationCap,
      view: 'education',
      badge: 'Edu',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      id: 'view-admin',
      label: 'لوحة تحكم الإدارة',
      icon: ShieldAlert,
      view: 'admin',
      badge: 'Admin',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-slate-900 border-l rtl:border-l-0 rtl:border-r border-slate-200/80 dark:border-slate-800/80 p-4 justify-between transition-colors select-none">
      
      {/* Scrollable Nav Area */}
      <div className="space-y-6 overflow-y-auto pr-1 pl-1">
        
        {/* Main Board Filter Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            لوحات التحكم
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view && activeFilter === item.filter;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.view, item.filter)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-extrabold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.iconColor || ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-sky-200/50 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explore & Education & Admin */}
        <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            الأقسام التفاعلية
          </p>
          {exploreItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    item.badgeColor || 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System & Settings */}
        <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Settings className="w-4 h-4" />
            <span>الإعدادات والخصوصية</span>
          </button>
          <button
            onClick={() => setCurrentView('landing')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HelpCircle className="w-4 h-4" />
            <span>المساعدة والدليل</span>
          </button>
        </div>

      </div>

      {/* Bottom Action: Create Board */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setIsCreateBoardOpen(true)}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء لوحة جديدة +</span>
        </button>
      </div>

    </aside>
  );
};
