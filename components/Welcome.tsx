
import React from 'react';

interface WelcomeProps {
  onGetStarted: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 md:py-20 animate-in fade-in zoom-in-95 duration-700">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="glass p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl dark:shadow-none relative z-10 text-center overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-900 mb-6 md:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Anna AI is Live</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 tracking-tight leading-[1.1] px-2">
            Hi, I am <span className="text-indigo-600 dark:text-indigo-400">Anna</span>, your AI skill roadmap planner.
          </h1>
          
          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            I'm here to help you plan and create a custom roadmap library to take you from 
            <span className="font-bold text-slate-700 dark:text-slate-300"> beginner to expert</span> in the most profitable AI skills—no coding required.
          </p>

          <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-slate-100 dark:border-slate-800 mb-8 md:mb-12 inline-block max-w-lg mx-4">
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              "Create a secure account today to start building your personal library. I'll save every roadmap we generate so you can track your mastery journey easily."
            </p>
          </div>

          {/* Action area changed to flex-row to prevent vertical stacking on mobile */}
          <div className="flex flex-row items-center justify-center gap-4 px-2 sm:px-6">
            <button
              onClick={onGetStarted}
              className="group relative px-6 md:px-10 py-4 md:py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-wider shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0 w-auto whitespace-nowrap"
            >
              Get Started for Free
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <p className="hidden xs:block text-[9px] md:text-xs text-slate-400 dark:text-slate-600 font-bold uppercase tracking-wider text-left leading-tight max-w-[80px] md:max-w-none">
              Join 1,000+ AI Students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
