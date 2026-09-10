import React, { useState } from 'react';
import { 
  Settings, User, Bell, Palette, Shield, Globe, 
  Moon, Sun, Check, Camera, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    setUser, 
    theme, 
    setTheme, 
    direction, 
    setDirection, 
    fontFamily, 
    setFontFamily,
    setIsAuthModalOpen
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [savedMsg, setSavedMsg] = useState(false);

  // Notifications toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const fonts = [
    { id: 'cairo', name: 'خط كايرو (Cairo) - الحديث والمتوازن' },
    { id: 'tajawal', name: 'خط تجوال (Tajawal) - الأنيق للقراءة' },
    { id: 'ibm', name: 'خط IBM Plex Arabic - الهندسي المتقن' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      email,
      avatar,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          الإعدادات والتفضيلات
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          خصص حسابك، واللغة، والمظهر وتنبيهات الإشعارات لتجربة استخدام مريحة.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-sky-600" />
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              الملف الشخصي
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/20"
                />
              </div>
              <div className="space-y-1 flex-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رابط الصورة الرمزية:
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedMsg && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>تم حفظ التعديلات بنجاح!</span>
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition ml-auto"
              >
                حفظ بيانات الحساب
              </button>
            </div>
          </form>
        </div>

        {/* Appearance & Typography */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Palette className="w-5 h-5 text-indigo-600" />
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              المظهر والخطوط والاتجاه
            </h2>
          </div>

          <div className="space-y-4">
            {/* Theme Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                وضع الألوان:
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                    theme === 'light'
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>الوضع الفاتح (Light)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                    theme === 'dark'
                      ? 'border-sky-500 bg-slate-800 text-sky-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>الوضع الليلي (Dark)</span>
                </button>
              </div>
            </div>

            {/* Arabic Font Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                نوع الخط العربي:
              </label>
              <div className="space-y-2 max-w-lg">
                {fonts.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontFamily(f.id as any)}
                    className={`w-full p-3 rounded-xl border text-start text-xs font-bold flex items-center justify-between transition ${
                      fontFamily === f.id
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{f.name}</span>
                    {fontFamily === f.id && <Check className="w-4 h-4 text-sky-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Direction */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اتجاه الواجهة (RTL / LTR):
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('rtl')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    direction === 'rtl'
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  العربية (RTL - اليمين إلى اليسار)
                </button>

                <button
                  type="button"
                  onClick={() => setDirection('ltr')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    direction === 'ltr'
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  English (LTR)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Sound */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              الإشعارات والتنبيهات
            </h2>
          </div>

          <div className="space-y-3 text-xs font-bold text-slate-800 dark:text-slate-200">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span>إشعارات البريد الإلكتروني عند إضافة مشاركات جديدة</span>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span>تنبيهات فورية داخل التطبيق (In-app notifications)</span>
              <input
                type="checkbox"
                checked={inAppNotifs}
                onChange={(e) => setInAppNotifs(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span>المؤثرات الصوتية عند النشر والتفاعل</span>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};
