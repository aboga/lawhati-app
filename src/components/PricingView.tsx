import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, School, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PricingView: React.FC = () => {
  const { user, setUser, direction } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'المجانية',
      badge: 'للبداية والاستكشاف',
      priceMonthly: '0',
      priceYearly: '0',
      currency: 'ر.س',
      description: 'مثالية للأفراد والطلاب لتجربة اللوحات الرقمية التفاعلية الأساسية.',
      features: [
        'حتى 3 لوحات رقمية نشطة',
        'مساحة تخزين حتى 10 ميجابايت للملف',
        'أنواع اللوحات الأساسية (حائط، شبكة)',
        'تفاعل وتعليقات غير محدودة',
        'مشاركة عبر الرابط ورمز QR',
      ],
      isPopular: false,
      buttonText: 'خطتك الحالية',
      buttonDisabled: user.plan === 'free',
    },
    {
      id: 'pro',
      name: 'الاحترافية (Pro)',
      badge: 'الأكثر شعبية للمعلمين والمدربين',
      priceMonthly: '29',
      priceYearly: '290',
      currency: 'ر.س',
      description: 'للمعلمين المحترفين وصناع المحتوى والفرق الصغيرة الراغبين في إنتاجية بلا قيود.',
      features: [
        'عدد لوحات رقمية غير محدود',
        'رفع ملفات بحجم حتى 500 ميجابايت',
        'جميع أنواع اللوحات الـ 10 (كانبان، زمني، كانفاس...)',
        'دعم كامل لمساعد الذكاء الاصطناعي (لوحتي AI)',
        'تصدير عالي الدقة (PDF, Excel, صور)',
        'خلفيات وثيمات مخصصة بدون علامة مائية',
        'تسجيل صوتي ورسم يدوي متقدم',
      ],
      isPopular: true,
      buttonText: user.plan === 'pro' ? 'خطتك الحالية' : 'ترقية إلى Pro الآن',
      buttonDisabled: user.plan === 'pro',
    },
    {
      id: 'school',
      name: 'المدارس والمؤسسات',
      badge: 'للجهات التعليمية والجامعات',
      priceMonthly: '199',
      priceYearly: '1990',
      currency: 'ر.س',
      description: 'مساحة عمل مركزية مخصصة لإدارة المعلمين والطلاب وتوحيد تجربة التعلم.',
      features: [
        'حسابات غير محدودة للمعلمين والطلاب',
        'لوحة تحكم مركزية للإشراف والإحصائيات',
        'ربط مع أنظمة إدارة التعلم (LMS / منصة مدرستي)',
        'عزل أمني تام وصلاحيات مخصصة لكل مدرسة',
        'تخزين سحابي غير محدود للملفات والمشاريع',
        'دعم فني وتدريب مخصص على مدار الساعة',
        'نظام فلترة ذكي وحماية سلامة المحتوى',
      ],
      isPopular: false,
      buttonText: user.plan === 'school' ? 'خطتك الحالية' : 'تفعيل خطة المؤسسات',
      buttonDisabled: user.plan === 'school',
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setUser({ ...user, plan: planId as any });
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>خطط تناسب الأفراد والمدارس</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          اختر الخطة المناسبة لاحتياجاتك التعليمية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          استمتع بتجربة لوحات رقمية لا متناهية مع أدوات ذكاء اصطناعي وصلاحيات تحكم مرنة.
        </p>

        {/* Billing Switch */}
        <div className="pt-2 flex items-center justify-center">
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              فاتورة شهرية
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>فاتورة سنوية</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                خصم 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isSelected = user.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-white dark:bg-slate-900 border-2 border-sky-500 shadow-2xl shadow-sky-500/10 scale-105 z-10'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold text-[11px] shadow-md">
                  الخيار المفضل للمعلمين
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{plan.currency}</span>
                  <span className="text-xs text-slate-400">
                    /{billingCycle === 'monthly' ? 'شهرياً' : 'سنوياً'}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">ما الذي تتضمنه الخطة؟</p>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isSelected}
                  className={`w-full py-3 rounded-2xl font-bold text-xs transition shadow-md cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                      : plan.isPopular
                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20 active:scale-95'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 active:scale-95'
                  }`}
                >
                  {isSelected ? '✓ خطتك النشطة الحالية' : plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
