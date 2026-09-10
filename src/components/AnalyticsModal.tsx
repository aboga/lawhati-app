import React from 'react';
import { 
  X, BarChart3, Users, Eye, MessageSquare, ThumbsUp, 
  TrendingUp, Award, Calendar, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeBoard, activeBoardPosts } = useApp();

  if (!isOpen || !activeBoard) return null;

  const totalPosts = activeBoardPosts.length;
  const totalComments = activeBoardPosts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
  const totalReactions = activeBoardPosts.reduce((acc, p) => {
    if (!p.reactions) return acc;
    return acc + Object.values(p.reactions).reduce((a: number, b: number) => a + Number(b), 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              إحصائيات وتفاعل اللوحة: {activeBoard.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900">
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold block">المشاهدات</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{activeBoard.viewsCount || 142}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">إجمالي المنشورات</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{totalPosts}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">التفاعلات والإعجابات</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{totalReactions}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">التعليقات والمشاركات</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{totalComments}</span>
            </div>
          </div>

          {/* Activity Over Time (Weekly distribution) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>معدل النشاط خلال الأسبوع الحالي</span>
            </h4>
            
            <div className="h-36 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-end justify-between gap-2 pt-6">
              {[
                { day: 'الأحد', val: 45 },
                { day: 'الإثنين', val: 78 },
                { day: 'الثلاثاء', val: 92 },
                { day: 'الأربعاء', val: 64 },
                { day: 'الخميس', val: 85 },
                { day: 'الجمعة', val: 20 },
                { day: 'السبت', val: 35 },
              ].map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full max-w-[28px] rounded-lg bg-sky-500 hover:bg-sky-400 transition-all duration-300"
                    style={{ height: `${item.val}%` }}
                    title={`${item.day}: ${item.val} تفاعل`}
                  />
                  <span className="text-[9px] text-slate-500 font-bold">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Active Contributors */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>أبرز المساهمين في هذه اللوحة</span>
            </h4>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
              {[
                { name: 'أحمد التميمي', role: 'محرر متميز', posts: 8, reactions: 24 },
                { name: 'سارة خالد', role: 'مساهمة نشطة', posts: 5, reactions: 19 },
                { name: 'عمر باوزير', role: 'مساهم', posts: 3, reactions: 12 },
              ].map((contributor, i) => (
                <div key={i} className="p-3 bg-white dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{contributor.name}</p>
                      <p className="text-[10px] text-slate-400">{contributor.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                    <span>{contributor.posts} منشورات</span>
                    <span>•</span>
                    <span className="text-amber-600">{contributor.reactions} إعجاب</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
