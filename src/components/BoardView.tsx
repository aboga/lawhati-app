import React, { useState } from 'react';
import { 
  ArrowRight, ArrowLeft, Star, Share2, Sparkles, Plus, 
  Presentation, BarChart3, Settings, Users, Eye, MoreHorizontal, 
  Layers, Columns, LayoutGrid, Clock, MapPin, Download, 
  HelpCircle, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  Lock, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import { PostEditorModal } from './PostEditorModal';
import { Post } from '../types';

export const BoardView: React.FC = () => {
  const { 
    activeBoard, 
    activeBoardPosts, 
    setActiveBoardId, 
    setCurrentView,
    toggleFavorite, 
    setIsShareModalOpen, 
    setIsAiModalOpen,
    setIsAnalyticsOpen,
    direction,
    activeTypingUser,
    onlineUsersCount,
    searchQuery
  } = useApp();

  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | undefined>(undefined);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!activeBoard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">لم يتم تحديد لوحة</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  // Filter posts based on search query
  const filteredPosts = activeBoardPosts.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q)
    );
  });

  const handleOpenAddPost = (colId?: string) => {
    setEditingPost(null);
    setTargetColumnId(colId);
    setIsPostEditorOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setTargetColumnId(post.columnId);
    setIsPostEditorOpen(true);
  };

  // Presentation Mode View
  if (isPresentationMode) {
    const currentPost = filteredPosts[currentSlideIndex] || filteredPosts[0];
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 select-none">
        {/* Presentation Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/30">
              وضع العرض التقديمي (Presentation)
            </span>
            <h2 className="text-base font-bold text-slate-200">{activeBoard.title}</h2>
          </div>
          <button
            onClick={() => setIsPresentationMode(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="إنهاء وضع العرض"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Current Slide Display */}
        <div className="max-w-4xl mx-auto w-full my-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {currentPost ? (
            <div className="space-y-6">
              <span className="text-5xl">{currentPost.emoji || '💡'}</span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {currentPost.title || 'بدون عنوان'}
              </h1>
              {currentPost.mediaUrl && currentPost.type === 'image' && (
                <img
                  src={currentPost.mediaUrl}
                  alt={currentPost.title}
                  className="max-h-80 mx-auto rounded-2xl object-contain shadow-2xl border border-white/10"
                />
              )}
              <p className="text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                {currentPost.content}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-4">
                <span>بواسطة: {currentPost.authorName}</span>
                <span>•</span>
                <span>{new Date(currentPost.createdAt).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">لا توجد شرائح للعرض في هذه اللوحة بعد.</p>
          )}
        </div>

        {/* Presentation Controls */}
        <div className="flex items-center justify-between max-w-md mx-auto w-full pt-4">
          <button
            onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition cursor-pointer"
          >
            {direction === 'rtl' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>

          <span className="text-sm font-mono text-slate-400">
            {filteredPosts.length > 0 ? `${currentSlideIndex + 1} / ${filteredPosts.length}` : '0 / 0'}
          </span>

          <button
            onClick={() => setCurrentSlideIndex(prev => Math.min(filteredPosts.length - 1, prev + 1))}
            disabled={currentSlideIndex >= filteredPosts.length - 1}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition cursor-pointer"
          >
            {direction === 'rtl' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] relative transition-all"
      style={{
        background: activeBoard.background?.type === 'image'
          ? `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.55)), url(${activeBoard.background.value}) center/cover fixed`
          : activeBoard.background?.value || 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      }}
    >
      {/* Board Top Navigation Bar */}
      <div className="sticky top-16 z-30 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70 px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Back & Board Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setActiveBoardId(null); setCurrentView('dashboard'); }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="الرجوع للرئيسية"
            >
              {direction === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeBoard.title}
                </h1>
                <button
                  onClick={() => toggleFavorite(activeBoard.id)}
                  className="text-slate-400 hover:text-amber-500 transition cursor-pointer"
                >
                  <Star className={`w-4 h-4 ${activeBoard.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                </button>
              </div>
              {activeBoard.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md">
                  {activeBoard.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Live Presence Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{onlineUsersCount} متصل الآن</span>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-teal-500/15 text-sky-700 dark:text-sky-300 hover:from-sky-500/25 hover:to-teal-500/25 border border-sky-300/40 text-xs font-bold transition shadow-xs cursor-pointer"
              title="لوحتي AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden md:inline">لوحتي AI</span>
            </button>

            {/* Presentation Mode */}
            <button
              onClick={() => {
                setCurrentSlideIndex(0);
                setIsPresentationMode(true);
              }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="عرض شرائح سينمائي"
            >
              <Presentation className="w-4 h-4" />
            </button>

            {/* Analytics */}
            <button
              onClick={() => setIsAnalyticsOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="إحصائيات اللوحة"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            {/* Share Board */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة</span>
            </button>
          </div>

        </div>
      </div>

      {/* Live Collaboration Status Banner (Typing simulation) */}
      {activeTypingUser && (
        <div className="fixed bottom-20 right-6 z-30 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span>{activeTypingUser} يكتب الآن على اللوحة...</span>
        </div>
      )}

      {/* Main Board Surface */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        
        {/* Layout Renderer based on Board Type */}
        {activeBoard.type === 'columns' ? (
          /* Kanban / Columnar Stream View */
          <div className="flex gap-4 overflow-x-auto pb-8 items-start">
            {(activeBoard.columns || [
              { id: 'col_1', title: 'الأفكار والملاحظات', color: '#fef08a' },
              { id: 'col_2', title: 'قيد المناقشة', color: '#bae6fd' },
              { id: 'col_3', title: 'المشاريع والأنشطة', color: '#bbf7d0' },
            ]).map((col) => {
              const colPosts = filteredPosts.filter(p => p.columnId === col.id || (!p.columnId && col.id === 'col_1'));
              return (
                <div
                  key={col.id}
                  className="w-80 flex-shrink-0 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-white/20 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]"
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-black/5 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color || '#38bdf8' }} />
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {col.title}
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-slate-800 text-slate-500">
                        {colPosts.length}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenAddPost(col.id)}
                      className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                      title="إضافة منشور لهذا العمود"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Column Posts Scroll Area */}
                  <div className="p-3 overflow-y-auto space-y-3 flex-1">
                    {colPosts.map((post) => (
                      <PostCard key={post.id} post={post} onEdit={handleEditPost} />
                    ))}

                    <button
                      onClick={() => handleOpenAddPost(col.id)}
                      className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-sky-500 hover:text-sky-600 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة بطاقة</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeBoard.type === 'timeline' ? (
          /* Chronological Timeline View */
          <div className="relative max-w-3xl mx-auto py-8">
            <div className="absolute top-0 bottom-0 right-1/2 w-0.5 bg-white/40 dark:bg-slate-700" />
            <div className="space-y-8 relative z-10">
              {filteredPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className={`flex items-center gap-4 ${idx % 2 === 0 ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-1/2">
                    <PostCard post={post} onEdit={handleEditPost} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-md flex-shrink-0 z-20">
                    {idx + 1}
                  </div>
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Masonry Wall & Grid & Gallery View */
          <div className={`grid gap-4 sm:gap-6 ${
            activeBoard.type === 'gallery'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onEdit={handleEditPost} />
            ))}
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto text-2xl">
              📝
            </div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
              {searchQuery ? 'لا توجد نتائج تطابق بحثك' : 'اللوحة فارغة حالياً'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {searchQuery ? 'جرب البحث بكلمات أخرى' : 'ابدأ بإضافة أول منشور أو استطلع آراء المشاركين أو استخدم لوحتي AI!'}
            </p>
            <button
              onClick={() => handleOpenAddPost()}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md"
            >
              إضافة منشور الآن +
            </button>
          </div>
        )}

      </main>

      {/* Floating Action Add Button */}
      <button
        onClick={() => handleOpenAddPost()}
        className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-2xl shadow-sky-500/40 hover:scale-105 active:scale-95 transition flex items-center gap-2 cursor-pointer font-bold text-sm"
        title="إضافة منشور سريع"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
        <span className="hidden sm:inline">إضافة منشور</span>
      </button>

      {/* Post Editor Modal */}
      <PostEditorModal
        isOpen={isPostEditorOpen}
        onClose={() => {
          setIsPostEditorOpen(false);
          setEditingPost(null);
        }}
        editingPost={editingPost}
        columnId={targetColumnId}
      />
    </div>
  );
};
