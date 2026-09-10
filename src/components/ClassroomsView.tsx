import React, { useState } from 'react';
import { 
  GraduationCap, Plus, Users, BookOpen, Key, Copy, Check, 
  ExternalLink, Sparkles, Folder, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassGroup } from '../types';

export const ClassroomsView: React.FC = () => {
  const { classes, createClass, setActiveBoardId, direction } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    await createClass({
      name: className.trim(),
      subject: subject.trim() || 'عام',
      grade: grade.trim() || 'المرحلة العامة',
      boardsCount: 0,
      studentsCount: 0,
    });

    setClassName('');
    setSubject('');
    setGrade('');
    setIsModalOpen(false);
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>نظام الفصول والمجموعات التعليمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            فصولي الدراسية والمجموعات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            نظم لوحاتك حسب المواد والفصول وشارك رمز الفصل مع طلابك للانضمام فوراً بدون تعقيد.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء فصل جديد +</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {cls.subject}
                </span>
                <span className="text-xs text-slate-400 font-medium">{cls.grade}</span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {cls.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  المعلم المسؤول: {cls.teacherName}
                </p>
              </div>

              {/* Class Code Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">رمز انضمام الطلاب:</span>
                  <span className="font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {cls.code}
                  </span>
                </div>
                <button
                  onClick={() => copyClassCode(cls.code)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 shadow-xs transition"
                  title="نسخ الرمز"
                >
                  {copiedCode === cls.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-bold">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{cls.studentsCount} طالب مسجل</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>{cls.boardsCount} لوحة دراسية</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              إنشاء فصل دراسي جديد
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم الفصل أو الشعبة:
                </label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="مثال: الصف الأول ثانوي - شعبة (أ)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المادة الدراسية:
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: العلوم / الرياضيات / اللغة العربية"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المرحلة الدراسية:
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="مثال: المرحلة الثانوية"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  إنشاء الفصل 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
