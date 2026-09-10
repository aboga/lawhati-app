import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Layout, FileText, HardDrive, 
  Activity, AlertTriangle, CheckCircle, Ban, Search, 
  Trash2, Filter, Settings, Key, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminView: React.FC = () => {
  const { reports, boards, deleteBoard } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'reports' | 'system'>('stats');
  const [stats, setStats] = useState({
    totalUsers: 342,
    totalBoards: 128,
    totalPosts: 1450,
    storageUsed: '4.8 GB',
    activeToday: 89,
  });

  const [usersList, setUsersList] = useState([
    { id: 'usr_1', name: 'أحمد التميمي', email: 'ahmed@school.edu.sa', role: 'teacher', plan: 'pro', status: 'active', boards: 14 },
    { id: 'usr_2', name: 'سارة خالد', email: 'sara@school.edu.sa', role: 'student', plan: 'free', status: 'active', boards: 3 },
    { id: 'usr_3', name: 'محمد العمري', email: 'm.omari@gmail.com', role: 'creator', plan: 'pro', status: 'active', boards: 21 },
    { id: 'usr_4', name: 'خالد باوزير', email: 'khaled@edu.sa', role: 'teacher', plan: 'school', status: 'active', boards: 32 },
    { id: 'usr_5', name: 'نورة السالم', email: 'noura@test.com', role: 'student', plan: 'free', status: 'suspended', boards: 1 },
  ]);

  const [searchUser, setSearchUser] = useState('');

  // System settings
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(true);
  const [aiApiKeyConfigured, setAiApiKeyConfigured] = useState(true);

  const toggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const changeUserPlan = (userId: string, newPlan: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, plan: newPlan };
      }
      return u;
    }));
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة تحكم المسؤول والإشراف (Admin)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            إدارة المنصة والمحتوى والأمان
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            مراقبة مقاييس المنصة الحية، مراجعة البلاغات، إدارة حسابات المستخدمين وصلاحياتهم.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-bold">
        {[
          { id: 'stats', label: 'المؤشرات العامة' },
          { id: 'users', label: `إدارة المستخدمين (${usersList.length})` },
          { id: 'reports', label: `البلاغات والمحتوى (${reports.length})` },
          { id: 'system', label: 'إعدادات المنصة والأمان' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-3 transition border-b-2 cursor-pointer ${
              activeTab === t.id
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">المستخدمون</span>
                <Users className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.totalUsers}</p>
              <span className="text-[10px] text-emerald-600 font-bold">+12% هذا الأسبوع</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">اللوحات المنشأة</span>
                <Layout className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.totalBoards}</p>
              <span className="text-[10px] text-emerald-600 font-bold">+18% نمو</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">المنشورات</span>
                <FileText className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.totalPosts}</p>
              <span className="text-[10px] text-emerald-600 font-bold">+340 بطاقة جديدة</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">التخزين المستهلك</span>
                <HardDrive className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.storageUsed}</p>
              <span className="text-[10px] text-slate-400 font-bold">من أصل 100 GB</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">المتصلون اليوم</span>
                <Activity className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.activeToday}</p>
              <span className="text-[10px] text-emerald-600 font-bold">نشاط ممتاز</span>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="البحث بالاسم أو البريد..."
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 text-start">المستخدم</th>
                    <th className="p-3.5 text-start">الدور</th>
                    <th className="p-3.5 text-start">الخطة</th>
                    <th className="p-3.5 text-start">اللوحات</th>
                    <th className="p-3.5 text-start">الحالة</th>
                    <th className="p-3.5 text-end">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="p-3.5 font-medium">
                        {u.role === 'teacher' ? 'معلم / مدرب' : u.role === 'student' ? 'طالب' : 'صانع محتوى'}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={u.plan}
                          onChange={(e) => changeUserPlan(u.id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold"
                        >
                          <option value="free">مجانية</option>
                          <option value="pro">Pro احترافية</option>
                          <option value="school">مؤسسات</option>
                        </select>
                      </td>
                      <td className="p-3.5 font-mono">{u.boards}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {u.status === 'active' ? 'نشط' : 'محظور'}
                        </span>
                      </td>
                      <td className="p-3.5 text-end">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                            u.status === 'active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'active' ? 'حظر الحساب' : 'إلغاء الحظر'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports & Moderation Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            مراجعة التقارير والبلاغات الواردة من المستخدمين حول المحتوى غير اللائق أو المخالف لسياسة الاستخدام.
          </p>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">
                        بلاغ على {rep.targetType === 'board' ? 'لوحة' : 'منشور'}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {rep.targetTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      السبب: <span className="font-semibold text-rose-600">{rep.reason}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      بواسطة: {rep.reportedBy} • {new Date(rep.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      تجاهل
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                    >
                      حذف المحتوى المخالف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 max-w-2xl">
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">ضوابط المنصة العامة</h3>
            
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
              <div>
                <p>السماح بتسجيل مستخدمين جدد</p>
                <p className="text-[10px] text-slate-400 font-normal">تمكين الزوار من فتح حسابات جديدة ذاتياً</p>
              </div>
              <input
                type="checkbox"
                checked={allowRegistration}
                onChange={(e) => setAllowRegistration(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
              <div>
                <p>فلترة المحتوى والألفاظ تلقائياً</p>
                <p className="text-[10px] text-slate-400 font-normal">فحص المنشورات والتعليقات بالذكاء الاصطناعي لحظر الكلمات النابية</p>
              </div>
              <input
                type="checkbox"
                checked={profanityFilter}
                onChange={(e) => setProfanityFilter(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600"
              />
            </label>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <div className="flex items-center justify-between">
                <span>تكامل Google Gemini AI API</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">مفعل وجاهز</span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal">يدعم نموذج Gemini 2.5 Flash للتلخيص واقتراح الأفكار الذكية في اللوحات</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
