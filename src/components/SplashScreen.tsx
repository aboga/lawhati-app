import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { ArrowLeft, ArrowRight, Sparkles, LayoutDashboard, Globe, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { direction, language, setCurrentView } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleEnterPlatform = () => {
    if (onComplete) {
      onComplete();
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleGoToLanding = () => {
    setCurrentView('landing');
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div 
      id="splash-screen-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white overflow-hidden select-none animate-in fade-in duration-300"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Tagline & Quick Skip */}
      <div className="w-full flex justify-between items-center max-w-xl pt-2 text-xs text-slate-400 font-medium z-10">
        <span className="flex items-center gap-1.5 text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>منصة الابتكار والتعليم الذكي</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            id="splash-skip-btn"
            onClick={handleEnterPlatform}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
          >
            {language === 'ar' ? 'تخطي' : 'Skip'}
          </button>
          <span className="text-slate-500 font-mono text-[11px]">v2.5 Pro</span>
        </div>
      </div>

      {/* Center Branding */}
      <div className="flex flex-col items-center text-center max-w-lg my-auto space-y-6 z-10">
        <div className="transform hover:scale-105 transition-transform duration-500 cursor-pointer" onClick={handleEnterPlatform}>
          <Logo size="xl" showText={false} />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-sky-300">
            لوحتي <span className="text-sky-400 text-3xl font-sans font-normal">| Lawhati</span>
          </h1>
          <p className="text-base sm:text-xl font-medium text-slate-300 leading-relaxed max-w-md mx-auto">
            {language === 'ar' 
              ? 'شارك أفكارك... اصنع لوحتك... وتعاون مع الآخرين في مساحات عمل بصرية ذكية'
              : 'Share your ideas... Craft your board... Collaborate with the world'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-md pb-6 flex flex-col items-center gap-3 z-10">
        <button
          id="enter-platform-btn"
          onClick={handleEnterPlatform}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-sky-500/30 active:scale-[0.98] hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{language === 'ar' ? 'دخول المنصة' : 'Enter Platform'}</span>
          {direction === 'rtl' ? (
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
          ) : (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          )}
        </button>

        <div className="flex items-center gap-4 pt-1">
          <button
            id="splash-landing-link"
            onClick={handleGoToLanding}
            className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-4 font-semibold transition cursor-pointer"
          >
            {language === 'ar' ? 'الصفحة التعريفية والمميزات' : 'Explore Platform Features'}
          </button>
        </div>

        <span className="text-[11px] text-slate-500 pt-1">
          {language === 'ar' ? 'مصمم للمدارس والجامعات وفرق العمل المبدعة' : 'Designed for schools, universities, and innovative teams'}
        </span>
      </div>
    </div>
  );
};
