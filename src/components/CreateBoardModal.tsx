import React, { useState } from 'react';
import { 
  X, Sparkles, LayoutGrid, Columns, Clock, MapPin, Palette, 
  Presentation, HelpCircle, Layers, Image as ImageIcon, Lock, 
  Check, ArrowLeft, Wand2, Compass, Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BoardType } from '../types';

export const CreateBoardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { createBoard, setActiveBoardId, direction } = useApp();
  
  const [activeTab, setActiveTab] = useState<'custom' | 'ai'>('custom');
  
  // Custom board state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<BoardType>('wall');
  const [selectedBgIndex, setSelectedBgIndex] = useState(0);
  const [font, setFont] = useState<'cairo' | 'tajawal' | 'outfit'>('cairo');
  const [cardShape, setCardShape] = useState<'rounded' | 'elevated' | 'bordered' | 'minimal'>('rounded');
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'password'>('public');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGrade, setAiGrade] = useState('المرحلة المتوسطة والثانوية');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  if (!isOpen) return null;

  const bgOptions = [
    { type: 'gradient', value: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', name: 'سماء زرقاء' },
    { type: 'gradient', value: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)', name: 'زمرد هادئ' },
    { type: 'gradient', value: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', name: 'أرجوان ملكي' },
    { type: 'gradient', value: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', name: 'غروب دافئ' },
    { type: 'gradient', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', name: 'ليل داكن' },
    { type: 'image', value: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=800&auto=format&fit=crop&q=80', name: 'مكتبة وكتب' },
    { type: 'image', value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', name: 'شاطئ هادئ' },
    { type: 'image', value: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', name: 'فضاء ومجرات' },
    { type: 'color', value: '#f8fafc', name: 'ورق رمادي ناصع' },
  ];

  const boardTypeOptions: { id: BoardType; name: string; desc: string; icon: any }[] = [
    { id: 'wall', name: 'حائط (Wall)', desc: 'توزيع مرن للبطاقات بشكل جذاب ومتناسق', icon: LayoutGrid },
    { id: 'grid', name: 'شبكة (Grid)', desc: 'بطاقات منظمة في صفوف وأعمدة متساوية', icon: Layers },
    { id: 'columns', name: 'أعمدة (Columns)', desc: 'تنظيم المحتوى في أقسام مثل كانبان وسير العمل', icon: Columns },
    { id: 'timeline', name: 'مخطط زمني (Timeline)', desc: 'تسلسل تاريخي أو زمني عبر شريط تفاعلي', icon: Clock },
    { id: 'gallery', name: 'معرض وسائط (Gallery)', desc: 'تركيز بارز على الصور والفيديوهات والرسومات', icon: ImageIcon },
    { id: 'qa', name: 'أسئلة وأجوبة (Q&A)', desc: 'طرح الأسئلة والتصويت على الإجابات الأكثر فائدة', icon: HelpCircle },
    { id: 'canvas', name: 'مخطط حر (Canvas)', desc: 'مساحة لا نهائية لتحريك البطاقات بحرية تامة', icon: Compass },
    { id: 'presentation', name: 'عرض شرائح (Presentation)', desc: 'استعراض كل منشور كشريحة عرض سينمائية', icon: Presentation },
    { id: 'map', name: 'خريطة (Map)', desc: 'ربط المنشورات بمواقع جغرافية تفاعلية', icon: MapPin },
  ];

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedBg = bgOptions[selectedBgIndex];
      const newBoard = await createBoard({
        title: title.trim() || 'لوحة بدون عنوان',
        description: description.trim(),
        type,
        background: {
          type: selectedBg.type as any,
          value: selectedBg.value,
          name: selectedBg.name,
        },
        font,
        cardShape,
        privacy,
        password: privacy === 'password' ? password : undefined,
      });

      onClose();
      setActiveBoardId(newBoard.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) {
      setAiError('يرجى إدخال موضوع أو وصف للوحة المراد توليدها');
      return;
    }
    setAiError('');
    setIsGeneratingAi(true);

    try {
      const res = await fetch('/api/ai/generate-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          gradeLevel: aiGrade,
          boardType: type,
        }),
      });
      const data = await res.json();
      if (data.boardData) {
        const generated = data.boardData;
        const newBoard = await createBoard(
          {
            title: generated.title || aiPrompt,
            description: generated.description || 'تم إنشاؤها بذكاء بواسطة لوحتي AI',
            type: generated.type || type,
            background: {
              type: 'gradient',
              value: generated.backgroundGradient || 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              name: 'تدرج ذكي',
            },
            font: 'cairo',
            cardShape: 'rounded',
            privacy: 'public',
            columns: generated.columns ? generated.columns.map((c: string, idx: number) => ({
              id: 'col_' + idx,
              title: c,
              color: ['#fef08a', '#bae6fd', '#bbf7d0', '#fbcfe8'][idx % 4],
            })) : undefined,
          },
          generated.posts || []
        );

        onClose();
        setActiveBoardId(newBoard.id);
      }
    } catch (err) {
      setAiError('حدث خطأ أثناء التوليد بالذكاء الاصطناعي، يرجى المحاولة ثانية');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Tabs */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'custom'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              إنشاء يدوي مخصص
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>توليد ذكي (لوحتي AI)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {activeTab === 'ai' ? (
            /* AI Generation Tab */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-teal-500/10 border border-sky-300/30 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">التوليد الذكي للوحات</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    اكتب موضوع الدرس، أو الهدف من الاجتماع، وسيقوم المساعد الذكي بتنسيق اللوحة بالكامل وإضافة بطاقات تفاعلية واستطلاعات ومهام مناسبة.
                  </p>
                </div>
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs border border-rose-200 dark:border-rose-800">
                  {aiError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    عن ماذا تتحدث لوحتك؟ (اكتب الموضوع بالتفصيل)
                  </label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="مثال: دورة المياه في الطبيعة وتأثيرها على الطقس للصف الخامس، أو عصف ذهني لإطلاق تطبيق هاتف..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      المرحلة الدراسية أو السياق
                    </label>
                    <select
                      value={aiGrade}
                      onChange={(e) => setAiGrade(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs"
                    >
                      <option value="المرحلة الابتدائية">المرحلة الابتدائية</option>
                      <option value="المرحلة المتوسطة والثانوية">المرحلة المتوسطة والثانوية</option>
                      <option value="التعليم الجامعي">التعليم الجامعي</option>
                      <option value="فريق عمل وشركات">فريق عمل / أعمال وشركات</option>
                      <option value="عصف ذهني ومشاريع عامة">عصف ذهني ومشاريع عامة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      التخطيط المفضل للوحة
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs"
                    >
                      <option value="columns">أعمدة كانبان للمحاور (الأكثر تفاعلاً)</option>
                      <option value="wall">حائط بطاقات مرن (Wall)</option>
                      <option value="grid">شبكة منتظمة (Grid)</option>
                      <option value="timeline">تسلسل زمني (Timeline)</option>
                      <option value="qa">أسئلة وأجوبة (Q&A)</option>
                    </select>
                  </div>
                </div>

                {/* Quick Suggestion Chips */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400">أفكار جاهزة للتجربة السريعة:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'المجموعة الشمسية والظواهر الفلكية',
                      'استراتيجيات التعلم النشط وتطبيقاتها',
                      'العصف الذهني لتطبيق بيئي لإعادة التدوير',
                      'تحديات الذكاء الاصطناعي ومستقبل الوظائف',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setAiPrompt(chip)}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-950/60 hover:text-sky-600 transition"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={isGeneratingAi}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-sky-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>جاري توليد اللوحة وتنسيق البطاقات التفاعلية...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>توليد اللوحة بالكامل فوراً</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Custom Board Creation */
            <form onSubmit={handleCreateCustom} className="space-y-6">
              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان اللوحة *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: مشروع مادة العلوم - الفصل الدراسي الثاني"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الوصف أو التوجيهات للمشاركين
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب نبذة ترحيبية أو تعليمات المشاركة في اللوحة..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Board Layout Type Selector (10 Options) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  نوع وتخطيط اللوحة (اختر من بين 9 نماذج بصرية)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {boardTypeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = type === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setType(opt.id)}
                        className={`p-3 rounded-2xl border text-start flex flex-col justify-between transition cursor-pointer ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                          {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{opt.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wallpaper / Background Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  خلفية اللوحة
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {bgOptions.map((bg, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedBgIndex(idx)}
                      className={`h-14 rounded-xl border relative overflow-hidden transition cursor-pointer ${
                        selectedBgIndex === idx ? 'ring-2 ring-sky-500 ring-offset-2' : 'border-slate-200 dark:border-slate-700'
                      }`}
                      style={{
                        background: bg.type === 'image' ? `url(${bg.value}) center/cover no-repeat` : bg.value,
                      }}
                    >
                      {selectedBgIndex === idx && (
                        <div className="absolute inset-0 bg-sky-950/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1 rounded truncate max-w-[80%]">
                        {bg.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font and Shape Customization */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    خط اللوحة
                  </label>
                  <select
                    value={font}
                    onChange={(e) => setFont(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="cairo">خط كايرو (Cairo)</option>
                    <option value="tajawal">خط تجوال (Tajawal)</option>
                    <option value="outfit">خط Outfit الحديث</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شكل البطاقات
                  </label>
                  <select
                    value={cardShape}
                    onChange={(e) => setCardShape(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="rounded">حواف دائرية عصرية</option>
                    <option value="elevated">مرتفعة مع ظلال بارزة</option>
                    <option value="bordered">مؤطرة بخط رفيع</option>
                    <option value="minimal">بسيطة مسطحة</option>
                  </select>
                </div>
              </div>

              {/* Privacy Setting */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  الخصوصية وصلاحيات الوصول
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'public', label: 'عامة للجميع' },
                    { id: 'password', label: 'برقم سري' },
                    { id: 'private', label: 'خاصة بي فقط' },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPrivacy(p.id as any)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                        privacy === p.id
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {privacy === 'password' && (
                  <div className="pt-2">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة مرور الدخول للوحة"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري إنشاء اللوحة...' : 'إنشاء اللوحة والبدء بالعمل 🚀'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
