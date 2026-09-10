import React, { useState } from 'react';
import { 
  Sparkles, ArrowLeft, ArrowRight, Play, CheckCircle2, ShieldCheck, 
  GraduationCap, Users, LayoutGrid, Palette, Share2, Layers, Zap,
  MessageSquare, FileText, ChevronDown, ChevronUp, Star, Laptop, Heart, 
  BarChart3, BrainCircuit, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsAuthModalOpen, setIsCreateBoardOpen, boards, setActiveBoardId } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const faqs = [
    {
      q: 'ما هي منصة "لوحتي | Lawhati"؟',
      a: 'منصة رقمية تفاعلية حديثة تتيح للأفراد والمعلمين والفرق إنشاء مساحات عمل ولوحات بصرية ومشاركة المنشورات والوسائط والتفاعل الفوري مع الآخرين بحرية مطلقة.',
    },
    {
      q: 'هل تدعم المنصة اللغة العربية بشكل كامل (RTL)؟',
      a: 'نعم بكل تأكيد! تم بناء وتصميم "لوحتي" من الأساس لتوفير أفضل تجربة عربية سلسة مع دعم خطوط الطباعة الراقية وتوافق تام مع الاتجاه من اليمين إلى اليسار.',
    },
    {
      q: 'ما هي أنواع اللوحات المتاحة في المنصة؟',
      a: 'تدعم المنصة 10 أنواع مختلفة من اللوحات: الحائط (Wall)، الشبكة (Grid)، الأعمدة (Columns / Kanban)، القائمة، المخطط الزمني (Timeline)، الخريطة، المخطط الحر (Canvas)، معرض الوسائط، عرض الشرائح، والأسئلة والأجوبة (Q&A).',
    },
    {
      q: 'كيف يفيد نظام "لوحتي" المعلمين والمدارس؟',
      a: 'يوفر قسماً مخصصاً للتعليم يشمل إدارة الفصول الدراسية، توزيع الواجبات والأنشطة، التقييم، واستطلاعات الرأي الفورية للطلاب، بالإضافة إلى لوحة متابعة للمشرفين والمدارس.',
    },
    {
      q: 'ما هي إمكانيات "لوحتي AI" الذكاء الاصطناعي؟',
      a: 'يمكن للذكاء الاصطناعي إنشاء لوحات كاملة بالبطاقات والأنشطة من وصف نصي قصير، تلخيص مئات المنشورات في نقاط مركزة، واقتراح أفكار وأسئلة تفاعلية مناسبة لموضوع الدرس أو الاجتماع.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-sky-400/20 via-indigo-400/20 to-teal-400/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
          
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>الجيل الجديد من اللوحات الرقمية التفاعلية العربية</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white max-w-4xl mx-auto">
            حوّل أفكارك إلى <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-500">لوحات تفاعلية مذهلة</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة للمدارس والجامعات وفرق العمل لإنشاء لوحات بصرية مبتكرة، مشاركة الأفكار والوسائط، والعصف الذهني في الوقت الحقيقي بكل سهولة.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-sky-500/25 active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <span>ابدأ مجاناً الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (boards.length > 0) {
                  setActiveBoardId(boards[0].id);
                } else {
                  setCurrentView('dashboard');
                }
              }}
              className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-base border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-sky-500 fill-current" />
              <span>جرب لوحة تفاعلية حية</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> لا يتطلب بطاقة ائتمان
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> دعم كامل للغة العربية (RTL)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> متوافق مع كافة الأجهزة
            </span>
          </div>

          {/* Hero Interactive App Mockup Preview */}
          <div className="mt-12 relative rounded-3xl p-2 bg-gradient-to-b from-slate-200/50 dark:from-slate-800/60 to-transparent border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 aspect-video max-h-[520px] flex flex-col">
              {/* Window Header */}
              <div className="h-10 bg-slate-800/80 px-4 flex items-center justify-between border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>lawhati.app/board/stem-project-2026</span>
                </div>
                <div className="text-xs text-sky-400 font-bold">متصل الآن (6 طلاب)</div>
              </div>

              {/* Interactive Board Preview Surface */}
              <div 
                className="flex-1 p-6 overflow-hidden relative cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
                onClick={() => setCurrentView('dashboard')}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1 */}
                  <div className="bg-white/95 dark:bg-slate-800/90 rounded-2xl p-4 shadow-lg border border-white/20 transform -rotate-1 hover:rotate-0 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">💡</span>
                      <span className="text-[11px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md">فكرة المشروع</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">استكشاف كواكب المجموعة الشمسية</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">نموذج تفاعلي ثلاثي الأبعاد مع تجارب محاكاة الجاذبية لكل كوكب.</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <span>❤️ 14 إعجاب</span>
                      <span>💬 5 تعليقات</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-4 shadow-lg border border-amber-200/40 transform rotate-1 hover:rotate-0 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">📊</span>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-md">استطلاع رأي</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">ما الكوكب الأكثر إثارة للاهتمام؟</h4>
                    <div className="space-y-1.5 mt-2 text-xs">
                      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>المريخ (الكوكب الأحمر)</span>
                        <span className="text-sky-500">65%</span>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>زحل (ذو الحلقات)</span>
                        <span className="text-sky-500">35%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-4 shadow-lg border border-emerald-200/40 transform -rotate-1 hover:rotate-0 transition hidden md:block">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">✅</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">مهام الفريق</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">خطة العمل للأسبوع القادم</h4>
                    <div className="space-y-1 mt-2 text-xs text-slate-700 dark:text-slate-300">
                      <p className="flex items-center gap-1.5 line-through text-slate-400">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> جمع البيانات العلمية
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block" /> تصميم العرض التقديمي
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block" /> تجربة النموذج مع الفصل
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-4 text-center">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-sky-600 dark:text-sky-400 font-bold text-xs shadow-md backdrop-blur-sm">
                    انقر لاستعراض اللوحة في مساحة العمل الكاملة ↗
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. How it works (كيف يعمل) */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              بسيطة، سريعة، وممتعة
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              كيف تعمل منصة "لوحتي" في 4 خطوات؟
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              من الفكرة إلى اللوحة التفاعلية في ثوانٍ معدودة دون أي تعقيد تقني.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'أنشئ لوحتك',
                desc: 'اختر نوع اللوحة المناسب من بين 10 تخطيطات مختلفة وخصص الخلفية والألوان والخطوط.',
                icon: LayoutGrid,
                color: 'from-sky-500 to-blue-600',
              },
              {
                step: '02',
                title: 'أضف المحتوى الغني',
                desc: 'أدرج نصوصاً، صوراً، مقاطع فيديو، ملفات PDF، تسجيلاً صوتياً، رسماً يدوياً، أو استطلاعات رأي.',
                icon: Palette,
                color: 'from-indigo-500 to-purple-600',
              },
              {
                step: '03',
                title: 'شارك اللوحة بسهولة',
                desc: 'شارك الرابط بضغطة زر، أو برمز الاستجابة السريعة QR، أو ضمن الفصل الدراسي بكلمة سر.',
                icon: Share2,
                color: 'from-teal-500 to-emerald-600',
              },
              {
                step: '04',
                title: 'تعاون في الوقت الفعلي',
                desc: 'شاهد تفاعل زملائك وطلابك فوراً بالتعليقات والإعجابات والتصويت المباشر والتعديل اللحظي.',
                icon: Users,
                color: 'from-amber-500 to-orange-600',
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center font-bold mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 dark:text-slate-700 absolute top-4 left-4 font-mono">
                    {s.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Rich Features Showcase */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            المميزات الاحترافية
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            كل ما تحتاجه لإدارة الأفكار والمشاريع والتعليم
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              10
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">تخطيطات متعددة للوحات</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              الحائط البصري، الشبكة المنتظمة، أعمدة كانبان للمهام، المخطط الزمني للأحداث، الخريطة التفاعلية، ومعرض الوسائط وعرض الشرائح.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">لوحتي AI الذكية</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              توليد لوحات دراسية كاملة بالأنشطة من سطر واحد، وتلخيص المناقشات المطولة، واقتراح أفكار وأسئلة تفاعلية فورية.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">نظام مخصص للتعليم</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              إنشاء الفصول الدراسية وتعيين المهام ومشاركة اللوحات بكود بسيط ومتابعة تسليمات ومشاركات الطلاب أولاً بأول.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Pricing Plans */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              خطط أسعار تناسب الجميع
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              ابدأ مجاناً وقم بالترقية عند الحاجة لدعم مؤسستك أو فصولك الدراسية.
            </p>

            {/* Monthly / Yearly toggle */}
            <div className="inline-flex items-center p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 mt-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  billingCycle === 'monthly' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  billingCycle === 'yearly' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                <span>سنوي</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded-md">
                  خصم 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: 'المجانية',
                price: '0',
                desc: 'مثالية للاستخدام الفردي والبدايات',
                features: ['3 لوحات تفاعلية نشطة', 'حجم ملفات حتى 25MB', 'جميع أنواع اللوحات', 'مشاركة برابط و QR'],
                popular: false,
                buttonText: 'الخطة الحالية',
                active: true,
              },
              {
                name: 'المحترف Pro',
                price: billingCycle === 'yearly' ? '29' : '35',
                desc: 'للأفراد والمستقلين والمدربين',
                features: ['لوحات غير محدودة', 'حجم ملفات حتى 250MB', 'توليد ذكاء اصطناعي غير محدود', 'تصدير PDF و Excel عالي الدقة'],
                popular: false,
                buttonText: 'ترقية إلى Pro',
              },
              {
                name: 'المعلم والتعليم',
                price: billingCycle === 'yearly' ? '49' : '59',
                desc: 'الأفضل للمعلمين والفصول الدراسية',
                features: ['لوحات وفصول غير محدودة', 'إدارة واجبات الطلاب وتقييمها', 'أدوات فلترة المحتوى والرقابة', 'حجم ملفات حتى 500MB'],
                popular: true,
                buttonText: 'اشترك الآن',
              },
              {
                name: 'المدارس والمؤسسات',
                price: billingCycle === 'yearly' ? '199' : '249',
                desc: 'للمدارس والجامعات والشركات الكبرى',
                features: ['حسابات معلمين وطلاب غير محدودة', 'لوحة تحكم إدارية ومؤشرات أداء', 'دعم فني مخصص وخاص', 'تخزين سحابي فائق السعة'],
                popular: false,
                buttonText: 'تواصل معنا',
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'border-sky-500 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-sky-500 text-white font-bold text-[11px] shadow-sm">
                    الأكثر طلباً
                  </span>
                )}

                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.desc}</p>
                  
                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-bold mr-1">ر.س / شهر</span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`mt-8 w-full py-2.5 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer ${
                    plan.popular
                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQs Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">الأسئلة الشائعة</h2>
          <p className="text-xs sm:text-sm text-slate-500">إجابات سريعة على التساؤلات الأكثر تكراراً</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-start font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-sky-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="md" />
          <p className="text-xs text-slate-500 text-center">
            جميع الحقوق محفوظة © {new Date().getFullYear()} لمنصة <span className="font-bold text-slate-700 dark:text-slate-300">لوحتي | Lawhati</span>. صُممت بحب للتعليم والإبداع العربي.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-sky-500">اللوحات</button>
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-sky-500">تسجيل الدخول</button>
            <button onClick={() => setCurrentView('education')} className="hover:text-sky-500">قسم التعليم</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
