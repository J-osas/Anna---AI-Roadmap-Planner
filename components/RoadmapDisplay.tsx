
import React from 'react';
import { RoadmapResponse } from '../types';

interface RoadmapDisplayProps {
  data: RoadmapResponse;
  onReset: () => void;
  onDelete?: () => void;
}

export const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ data, onReset, onDelete }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700 w-full mx-auto">
      <div className="glass p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <svg className="w-20 h-20 md:w-28 md:h-28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{data.greeting}</h2>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">{data.intro}</p>
        <div className="flex items-center gap-6">
          <button
            onClick={onReset}
            className="text-indigo-600 text-[10px] md:text-xs font-bold hover:text-indigo-700 underline transition-colors uppercase tracking-widest"
          >
            Start new roadmap
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-red-400 text-[10px] md:text-xs font-bold hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete this roadmap
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:gap-4">
        {data.steps.map((step, index) => (
          <div
            key={index}
            className="group glass p-4 md:p-6 rounded-xl md:rounded-2xl border border-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row gap-3 md:gap-5">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm md:text-base font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {index + 1}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 transition-colors group-hover:text-indigo-600">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-3">
                  {step.description}
                </p>
                {step.tips.length > 0 && (
                  <div className="bg-slate-50/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-slate-100">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2 flex items-center gap-2">
                      Practical Guidance
                    </p>
                    <ul className="space-y-1.5">
                      {step.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="text-[11px] md:text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-8 md:p-12 bg-indigo-600 rounded-2xl md:rounded-[3rem] text-white shadow-2xl shadow-indigo-200">
        <h3 className="text-lg md:text-xl font-bold mb-2">Ready to take the first step?</h3>
        <p className="text-xs md:text-sm mb-6 opacity-90 max-w-md mx-auto leading-relaxed">Anna has built your plan. Dedicate just 20 minutes today to Step 1 and start your journey.</p>
        <button
          onClick={onReset}
          className="bg-white text-indigo-600 text-xs md:text-sm font-bold py-2.5 md:py-3 px-6 md:px-10 rounded-xl hover:bg-slate-50 transition-all shadow-xl hover:scale-105"
        >
          Build Another Roadmap
        </button>
      </div>
    </div>
  );
};
