import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Bespoke Logo Icon: Layered Dynamic Canvases with Knowledge Spark */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center flex-shrink-0`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 via-indigo-600 to-teal-400 rounded-xl rotate-6 shadow-md shadow-indigo-500/20 opacity-80 group-hover:rotate-12 transition-transform duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-sky-600 rounded-xl -rotate-3 shadow-lg shadow-sky-500/25 flex items-center justify-center">
          {/* Internal Geometric Symbol */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3/5 h-3/5 text-white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 4 interactive grid nodes connected seamlessly */}
            <rect x="3" y="3" width="7" height="7" rx="2" fill="white" fillOpacity="0.25" />
            <rect x="14" y="3" width="7" height="7" rx="2" fill="white" fillOpacity="0.6" />
            <rect x="3" y="14" width="7" height="7" rx="2" fill="white" fillOpacity="0.85" />
            <circle cx="17.5" cy="17.5" r="3.5" fill="#38bdf8" />
            <path d="M10 6.5h4M6.5 10v4" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white leading-none ${textSizes[size]}`}>
            لوحتي <span className="text-sky-600 dark:text-sky-400 font-normal text-xs sm:text-sm tracking-wider uppercase font-sans">Lawhati</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal mt-0.5 hidden sm:inline">
            المنصة الرقمية للوحات التفاعلية
          </span>
        </div>
      )}
    </div>
  );
};
