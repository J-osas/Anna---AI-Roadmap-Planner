
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-4 md:p-8 transition-colors duration-300">
      <header className="w-full max-w-[85vw] mb-10 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none flex-shrink-0">
            A
          </div>
          <div className="text-left">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">Anna</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.15em] uppercase">AI Skill Roadmap Planner</p>
            <p className="text-[7px] text-slate-300 dark:text-slate-700 font-bold tracking-[0.15em] uppercase">Designed Joshua Ehimare</p>
          </div>
        </div>
      </header>
      <main className="w-full max-w-[85vw]">
        {children}
      </main>
      <footer className="mt-16 py-8 text-center text-slate-400 dark:text-slate-600 text-[10px] md:text-xs border-t border-slate-200 dark:border-slate-800/50 w-full max-w-[85vw] font-medium tracking-wide">
        &copy; {new Date().getFullYear()} Anna AI. Your path to profitable AI mastery. | 
        <a 
          href="https://joshuaehimare.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline decoration-slate-200 dark:decoration-slate-800 underline-offset-2"
        >
          Designed Joshua Ehimare
        </a>
      </footer>
    </div>
  );
};
