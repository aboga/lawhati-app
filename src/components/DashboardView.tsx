import React, { useState } from 'react';
import { 
  Plus, Star, Users, Eye, MoreVertical, Copy, Archive, 
  Trash2, RotateCcw, Sparkles, Folder, Grid, Clock, Filter,
  Share2, ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Board } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    boards, 
    activeFilter, 
    setActiveFilter, 
    searchQuery, 
    setActiveBoardId, 
    setIsCreateBoardOpen,
    toggleFavorite,
    deleteBoard,
    restoreBoard,
    duplicateBoard,
    setIsShareModalOpen,
    user,
    setIsAiModalOpen
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [boardMenuId, setBoardMenuId] = useState<string | null>(null);

  const categories = ['all', 'التعليم', 'العلوم والتقنية', 'العصف الذهني', 'المشاريع', 'الرياضيات', 'الإدارة'];

  // Filter boards
  const filteredBoards = boards.filter(b => {
    // Status filter
    if (activeFilter === 'favorite' && !b.isFavorite) return false;
    if (activeFilter === 'archived' && !b.isArchived) return false;
    if (activeFilter === 'trash' && !b.isTrash) return false;
    if (activeFilter !== 'trash' && b.isTrash) return false;
    if (activeFilter !== 'archived' && b.isArchived && activeFilter !== 'trash') return false;

    // Category filter
    if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchDesc = b.description.toLowerCase().includes(q);
      const matchTag = b.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome & Quick Action Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 text-white shadow-xl shadow-sky-600/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-sky-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>مرحباً بك، {user.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              لوحاتك التفاعلية ومساحات التعاون
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              أنشئ لوحة جديدة للدروس، أو شارك الأفكار مع فريقك، أو استعن بالذكاء الاصطناعي "لوحتي AI" لإنشاء لوحة متكاملة فوراً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateBoardOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 font-bold text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-sky-600" />
              <span>لوحة جديدة +</span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>لوحتي AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Pill Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat === 'all' ? 'جميع الفئات' : cat}
          </button>
        ))}
      </div>

      {/* Boards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {activeFilter === 'favorite'
              ? 'اللوحات المفضلة'
              : activeFilter === 'archived'
              ? 'اللوحات المؤرشفة'
              : activeFilter === 'trash'
              ? 'سلة المحذوفات'
              : 'جميع اللوحات'} ({filteredBoards.length})
          </h2>
        </div>

        {filteredBoards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBoards.map((board) => (
              <div
                key={board.id}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Board Wallpaper Preview Banner */}
                <div
                  onClick={() => setActiveBoardId(board.id)}
                  className="h-32 w-full relative cursor-pointer overflow-hidden"
                  style={{
                    background: board.background?.type === 'image'
                      ? `url(${board.background.value}) center/cover`
                      : board.background?.value || 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Category Tag */}
                  {board.category && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-xs">
                      {board.category}
                    </span>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(board.id);
                    }}
                    className="absolute top-3 left-3 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-amber-500 backdrop-blur-sm shadow-xs transition"
                  >
                    <Star className={`w-3.5 h-3.5 ${board.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div 
                    onClick={() => setActiveBoardId(board.id)}
                    className="cursor-pointer space-y-1"
                  >
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors line-clamp-1">
                      {board.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {board.description || 'لا يوجد وصف للوحة...'}
                    </p>
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{board.viewsCount || 1}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{board.members?.length || 1}</span>
                      </span>
                    </div>

                    {/* Board Context Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setBoardMenuId(boardMenuId === board.id ? null : board.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {boardMenuId === board.id && (
                        <div className="absolute left-0 rtl:left-0 rtl:right-auto bottom-8 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 text-xs font-semibold text-slate-700 dark:text-slate-200 animate-in fade-in duration-150">
                          {board.isTrash ? (
                            <>
                              <button
                                onClick={() => { restoreBoard(board.id); setBoardMenuId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-start text-emerald-600"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>استعادة اللوحة</span>
                              </button>
                              <button
                                onClick={() => { deleteBoard(board.id, true); setBoardMenuId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-start text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف نهائي</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => { duplicateBoard(board.id); setBoardMenuId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-start"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>إنشاء نسخة</span>
                              </button>
                              <button
                                onClick={() => { deleteBoard(board.id); setBoardMenuId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-start text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>نقل إلى سلة المحذوفات</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-slate-100/50 dark:bg-slate-900/40 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center mx-auto text-2xl">
              📂
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">لا توجد لوحات هنا</h3>
            <p className="text-xs text-slate-500">لم يتم العثور على لوحات تطابق هذا التبويب أو البحث.</p>
            <button
              onClick={() => setIsCreateBoardOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md"
            >
              إنشاء أول لوحة تفاعلية 🚀
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
