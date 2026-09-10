import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, setUser, direction, language, setCurrentView, refreshBoards } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [role, setRole] = useState<'teacher' | 'student' | 'user'>('teacher');
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = tab === 'login'
        ? { email, password }
        : { name, username, email, password, phone, role };
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'تعذر تنفيذ العملية');
      if (data.user) {
        setUser(prev => ({ ...prev, ...data.user, phone: phone || prev.phone, twoFactorEnabled: twoFactor }));
        await refreshBoards();
      }
      setSuccessMessage(data.requiresEmailConfirmation ? 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني أولاً.' : (tab === 'login' ? 'تم تسجيل الدخول بنجاح!' : 'تم إنشاء الحساب بنجاح!'));
      setTimeout(() => { setSuccessMessage(''); onClose(); if (!data.requiresEmailConfirmation) setCurrentView('dashboard'); }, 900);
    } catch (err: any) {
      setSuccessMessage(`تعذر إتمام العملية: ${err.message}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleOAuthLogin = (_provider: string) => {
    setSuccessMessage('تسجيل الدخول الاجتماعي سيتم تفعيله لاحقًا من إعدادات Supabase. استخدم البريد الإلكتروني الآن.');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {successMessage ? (
            <div className="py-12 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{successMessage}</h3>
              <p className="text-sm text-slate-500">جاري توجيهك إلى لوحة التحكم...</p>
            </div>
          ) : tab === 'forgot' ? (
            /* Forgot Password */
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">استعادة كلمة المرور</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة آمن
                </p>
              </div>

              {verificationSent ? (
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-sm text-center">
                  تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني! يرجى مراجعة صندوق الوارد.
                </div>
              ) : (
                <form onSubmit={async (e) => { e.preventDefault(); try { const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); if (!res.ok) throw new Error((await res.json()).error || 'تعذر إرسال الرابط'); setVerificationSent(true); } catch (err: any) { setSuccessMessage(`تعذر الإرسال: ${err.message}`); setTimeout(() => setSuccessMessage(''), 3000); } }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3.5 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-md transition"
                  >
                    إرسال رابط الاستعادة
                  </button>
                </form>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setTab('login'); setVerificationSent(false); }}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </div>
          ) : (
            /* Login & Register Tabs */
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className={`py-2 text-sm font-bold rounded-xl transition-all ${
                    tab === 'login'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className={`py-2 text-sm font-bold rounded-xl transition-all ${
                    tab === 'register'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  إنشاء حساب جديد
                </button>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">
                  المتابعة السريعة باستخدام
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleOAuthLogin('Google')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.7 0 3 .6 4 1.5l3-3C17.2 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.3 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z" />
                      <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.4 0-.9.2-1.7.4-2.4L1.9 7C.7 9.4 0 12.1 0 15s.7 5.6 1.9 8l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    onClick={() => handleOAuthLogin('Microsoft')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z" />
                      <path fill="#00A4EF" d="M1 13h10v10H1z" />
                      <path fill="#7FBA00" d="M13 1h10v10H13z" />
                      <path fill="#FFB900" d="M13 13h10v10H13z" />
                    </svg>
                    <span>Microsoft</span>
                  </button>

                  <button
                    onClick={() => handleOAuthLogin('Apple')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.94-.92.04-2.02.61-2.67 1.38-.58.67-1.08 1.76-.95 2.81 1.03.08 2.05-.49 2.68-1.25z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium">أو بالبيانات الشخصية</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Toggle Email vs Phone */}
              <div className="flex gap-4 justify-center text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition ${
                    authMethod === 'email'
                      ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>البريد الإلكتروني</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition ${
                    authMethod === 'phone'
                      ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>رقم الجوال</span>
                </button>
              </div>

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'register' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="أحمد علي"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          اسم المستخدم
                        </label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="ahmed_2026"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        نوع الحساب
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'teacher', label: 'معلم / مدرب' },
                          { id: 'student', label: 'طالب' },
                          { id: 'user', label: 'مستخدم عام' },
                        ].map((r) => (
                          <button
                            type="button"
                            key={r.id}
                            onClick={() => setRole(r.id as any)}
                            className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                              role === r.id
                                ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Email or Phone Field */}
                {authMethod === 'email' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      رقم الجوال
                    </label>
                    <div className="relative">
                      <Phone className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+966 50 123 4567"
                        className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      كلمة المرور
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setTab('forgot')}
                        className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Optional 2FA */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">تفعيل التحقق الثنائي (2FA)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-500/20 active:scale-[0.99] transition cursor-pointer"
                >
                  {tab === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب والمتابعة'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
