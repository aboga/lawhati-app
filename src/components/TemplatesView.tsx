import React, { useState } from 'react';
import { Layers, ArrowLeft, ArrowRight, Sparkles, Check, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BoardTemplate } from '../types';

export const TemplatesView: React.FC = () => {
  const { templates, createBoard, setActiveBoardId, direction } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const categories = [
    'الكل',
    'التعليم والتدريس',
    'العصف الذهني والابتكار',
    'إدارة المشاريع والمهام',
    'التطوير والتخطيط',
  ];

  const filteredTemplates = templates.filter(t => {
    if (selectedCategory === 'الكل') return true;
    return t.category === selectedCategory;
  });

  const handleUseTemplate = async (template: BoardTemplate) => {
    const newBoard = await createBoard(
      {
        title: template.title,
        description: template.description,
        type: template.type,
        background: {
          type: 'gradient',
          value: template.backgroundValue,
          name: 'قالب جاهز',
        },
        category: template.category,
        columns: template.columns,
      },
      template.initialPosts || []
    );

    setActiveBoardId(newBoard.id);
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>مكتبة القوالب التفاعلية الجاهزة</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ابدأ فوراً بأفضل الممارسات التعليمية والإدارية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          اختر من بين تشكيلة واسعة من القوالب المصممة بعناية للدروس، الأنشطة المدرسية، العصف الذهني، وإدارة المشاريع الجماعية.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Template Banner Preview */}
            <div
              className="h-36 w-full p-4 flex flex-col justify-between relative overflow-hidden"
              style={{ background: template.backgroundValue }}
            >
              <div className="flex items-center justify-between z-10">
                <span className="text-3xl">{template.icon}</span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-xs">
                  {template.category}
                </span>
              </div>
              <div className="z-10">
                <span className="text-[11px] font-bold text-white/90 bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
                  تخطيط: {template.type}
                </span>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {template.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {template.description}
                </p>
              </div>

              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>استخدام هذا القالب</span>
                {direction === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
