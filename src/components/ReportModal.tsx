import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, reportTarget, reportContent } = useApp();
  const [reason, setReason] = useState('محتوى مسيء أو غير لائق');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isReportModalOpen || !reportTarget) return null;

  const reasons = [
    'محتوى مسيء أو غير لائق',
    'انتهاك حقوق ملكية فكرية',
    'مضايقة أو تنمر إلكتروني',
    'محتوى مضلل أو غير صحيح',
    'مخالف للسياسات التعليمية',
    'أخرى',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportContent(
      reportTarget.type,
      reportTarget.id,
      reportTarget.title,
      `${reason}${notes ? ` - ملاحظات: ${notes}` : ''}`
    );
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsReportModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <Flag className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              الإبلاغ عن محتوى مخالف
            </h3>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-slate-900 dark:text-white">
              تم استلام البلاغ بنجاح
            </p>
            <p className="text-xs text-slate-500">
              شكراً لمساعدتنا في الحفاظ على بيئة تعليمية آمنة ومحترمة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <span className="text-slate-400">العنصر المُبلَّغ عنه:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{reportTarget.title}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                سبب الإبلاغ:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                ملاحظات وتفاصيل إضافية (اختياري):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اشرح ما وجدته مخالفاً..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                إرسال البلاغ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
