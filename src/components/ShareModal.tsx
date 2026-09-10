import React, { useState } from 'react';
import { 
  X, Copy, Check, QrCode, Download, Share2, Globe, Lock, 
  Key, Users, Code, FileDown, MessageSquare, Send, Mail,
  CheckCircle2, UserPlus, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BoardMemberRole } from '../types';

export const ShareModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeBoard, updateBoard } = useApp();
  
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'permissions' | 'export' | 'embed'>('link');
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<BoardMemberRole>('contributor');
  const [invitedSuccess, setInvitedSuccess] = useState('');

  if (!isOpen || !activeBoard) return null;

  const boardUrl = `${window.location.origin}/board/${activeBoard.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(boardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      userId: 'usr_' + Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'offline' as const,
    };

    const currentMembers = activeBoard.members || [];
    updateBoard(activeBoard.id, {
      members: [...currentMembers, newMember],
    });

    setInvitedSuccess(`تم إرسال دعوة بنجاح إلى ${inviteEmail}`);
    setInviteEmail('');
    setTimeout(() => setInvitedSuccess(''), 3000);
  };

  const handleExport = (format: string) => {
    const filename = `${activeBoard.title}_lawhati.${format.toLowerCase()}`;
    const blob = new Blob([JSON.stringify(activeBoard, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              مشاركة اللوحة: {activeBoard.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 p-1.5 bg-slate-100/60 dark:bg-slate-800/50 gap-1 text-xs font-bold">
          {[
            { id: 'link', label: 'الرابط السريع' },
            { id: 'qr', label: 'رمز QR' },
            { id: 'permissions', label: 'الأعضاء والصلاحيات' },
            { id: 'export', label: 'تصدير وحفظ' },
            { id: 'embed', label: 'تضمين Embed' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-1.5 rounded-xl transition ${
                activeTab === t.id
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رابط الوصول المباشر
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={boardUrl}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              {/* Social Share Shortcuts */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">مشاركة سريعة عبر التطبيقات:</p>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`تفضل بزيارة لوحتي التفاعلية: ${activeBoard.title} عبر الرابط: ${boardUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(boardUrl)}&text=${encodeURIComponent(activeBoard.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center justify-center gap-1.5 hover:bg-sky-100 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(activeBoard.title)}&body=${encodeURIComponent(boardUrl)}`}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-200 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>البريد</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-3">
              <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-md">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-48 h-48">
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Outer Frame Corners */}
                  <rect x="10" y="10" width="26" height="26" fill="#0284c7" rx="4" />
                  <rect x="14" y="14" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="18" y="18" width="10" height="10" fill="#0284c7" rx="2" />

                  <rect x="64" y="10" width="26" height="26" fill="#0284c7" rx="4" />
                  <rect x="68" y="14" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="72" y="18" width="10" height="10" fill="#0284c7" rx="2" />

                  <rect x="10" y="64" width="26" height="26" fill="#0284c7" rx="4" />
                  <rect x="14" y="68" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="18" y="72" width="10" height="10" fill="#0284c7" rx="2" />

                  {/* Data matrix dots */}
                  <circle cx="45" cy="20" r="3" fill="#0369a1" />
                  <circle cx="53" cy="25" r="2.5" fill="#0f172a" />
                  <circle cx="48" cy="45" r="4" fill="#0284c7" />
                  <circle cx="25" cy="48" r="3" fill="#0f172a" />
                  <circle cx="65" cy="48" r="3" fill="#0f172a" />
                  <circle cx="78" cy="55" r="2" fill="#0369a1" />
                  <circle cx="52" cy="68" r="3.5" fill="#0284c7" />
                  <circle cx="68" cy="72" r="3" fill="#0f172a" />
                  <circle cx="82" cy="80" r="2.5" fill="#0369a1" />
                </svg>
              </div>

              <div className="text-center space-y-1">
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">امسح الرمز بكاميرا الجوال للوصول المباشر</p>
                <p className="text-[11px] text-slate-400">مناسب للعرض على شاشة الفصل أو جهاز العرض التفاعلي</p>
              </div>

              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل صورة الرمز (PNG)</span>
              </button>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4">
              {/* Invite User by Email */}
              <form onSubmit={handleInviteUser} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  دعوة متعاونين جدد عبر البريد:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="student@school.edu.sa"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="contributor">مساهم (نشر)</option>
                    <option value="editor">محرر (تعديل كامل)</option>
                    <option value="commenter">معلق فقط</option>
                    <option value="viewer">مشاهد فقط</option>
                    <option value="admin">مشرف</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>دعوة</span>
                  </button>
                </div>
                {invitedSuccess && (
                  <p className="text-xs text-emerald-600 font-bold">{invitedSuccess}</p>
                )}
              </form>

              {/* Members List */}
              <div className="space-y-1.5 pt-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">الأعضاء الحاليون في اللوحة:</p>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                  {activeBoard.members?.map((m) => (
                    <div key={m.userId} className="p-3 bg-white dark:bg-slate-800/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={m.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                          <p className="text-[10px] text-slate-400">{m.email}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        {m.role === 'owner' ? 'المالك' : m.role === 'admin' ? 'مشرف' : m.role === 'editor' ? 'محرر' : m.role === 'contributor' ? 'مساهم' : 'مشاهد'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                يمكنك تصدير هذه اللوحة ومحتوياتها إلى صيغ متعددة للأرشفة أو الطباعة:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  onClick={() => handleExport('PDF')}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center gap-2 text-slate-800 dark:text-white transition"
                >
                  <FileDown className="w-6 h-6 text-rose-500" />
                  <span>تصدير كملف PDF عالي الجودة</span>
                </button>

                <button
                  onClick={() => handleExport('PNG')}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center gap-2 text-slate-800 dark:text-white transition"
                >
                  <Download className="w-6 h-6 text-sky-500" />
                  <span>تصدير كصورة كاملة (PNG)</span>
                </button>

                <button
                  onClick={() => handleExport('XLSX')}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center gap-2 text-slate-800 dark:text-white transition"
                >
                  <Code className="w-6 h-6 text-emerald-500" />
                  <span>تصدير المنشورات كجدول Excel</span>
                </button>

                <button
                  onClick={() => handleExport('JSON')}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center gap-2 text-slate-800 dark:text-white transition"
                >
                  <Download className="w-6 h-6 text-amber-500" />
                  <span>نسخة احتياطية (JSON)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                كود التضمين في المواقع وبوابات التعليم:
              </label>
              <textarea
                readOnly
                rows={3}
                value={`<iframe src="${boardUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`<iframe src="${boardUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500"
              >
                {copied ? 'تم نسخ كود التضمين!' : 'نسخ كود التضمين'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
