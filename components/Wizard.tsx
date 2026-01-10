
import React, { useState, useMemo, useEffect } from 'react';
import { UserPreferences, ExperienceLevel } from '../types';
import { updateProfileName } from '../services/supabaseService';

interface WizardProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
  initialName?: string;
  userId?: string;
}

interface SkillDetails {
  definition: string;
  earning: string;
  entails: string[];
}

const SKILL_INFO: Record<string, SkillDetails> = {
  'AI Content Creation': {
    definition: "Using AI to generate high-quality written content, from blogs to social media and copy.",
    earning: "$50 – $150 per hour / $500+ per client retainer.",
    entails: ["Prompt engineering", "SEO optimization", "Editing & Fact-checking", "Jasper/Copy.ai mastery"]
  },
  'AI Video Generation': {
    definition: "Creating professional videos, ads, and animations using generative AI tools.",
    earning: "$500 – $5,000 per project or video series.",
    entails: ["Text-to-video tools", "AI Avatars", "Video editing", "Scene prompting"]
  },
  'AI Marketing': {
    definition: "Optimizing marketing campaigns, ad spend, and customer journeys with AI automation.",
    earning: "$1,500 – $10,000 monthly retainers.",
    entails: ["AI Ad platforms", "Audience segmentation", "Funnel automation", "Data analysis"]
  },
  'AI Image & Design': {
    definition: "Generating visuals, logos, and UI/UX assets using generative art models.",
    earning: "$100 – $1,000 per asset or brand package.",
    entails: ["Midjourney/DALL-E", "Image upscaling", "Style consistency", "Photoshop AI"]
  },
  'AI Automation': {
    definition: "Building custom workflows that connect apps and AI to handle business tasks automatically.",
    earning: "$2,000 – $15,000 per workflow implementation.",
    entails: ["Zapier/Make.com", "API integrations", "Prompt chaining", "Workflow mapping"]
  },
  'AI Voice & Audio': {
    definition: "Generating voiceovers, music, and sound effects for podcasts, ads, and films.",
    earning: "$200 – $2,000 per project.",
    entails: ["ElevenLabs", "Audio clean-up", "Music generation", "Emotion prompting"]
  },
  'No-Code AI Apps': {
    definition: "Building functional web or mobile applications integrated with AI without writing code.",
    earning: "$5,000 – $25,000 per application.",
    entails: ["Bubble/Flutterflow", "AI API setup", "Database design", "UX for AI"]
  },
  'Prompt Engineering': {
    definition: "The art of crafting perfect inputs to get the most accurate and creative outputs from LLMs.",
    earning: "$100k – $300k salary or $250+/hr consulting.",
    entails: ["Few-shot prompting", "Chain-of-thought", "System instruction design", "Output parsing"]
  },
  'AI Business Strategy': {
    definition: "Helping companies integrate AI into their operations to increase efficiency and revenue.",
    earning: "$5,000 – $50,000 per consulting engagement.",
    entails: ["ROI analysis", "AI tool audit", "Staff training", "Governance & Ethics"]
  }
};

const SKILL_PRESETS = [
  { id: 'content', label: 'AI Content Creation', icon: '✍️' },
  { id: 'video', label: 'AI Video Generation', icon: '🎬' },
  { id: 'marketing', label: 'AI Marketing', icon: '📈' },
  { id: 'design', label: 'AI Image & Design', icon: '🎨' },
  { id: 'automation', label: 'AI Automation', icon: '🤖' },
  { id: 'voice', label: 'AI Voice & Audio', icon: '🎙️' },
  { id: 'coding', label: 'No-Code AI Apps', icon: '📱' },
  { id: 'prompt', label: 'Prompt Engineering', icon: '⌨️' },
  { id: 'strategy', label: 'AI Business Strategy', icon: '💡' },
  { id: 'other', label: 'Other / Custom', icon: '✨' },
];

export const Wizard: React.FC<WizardProps> = ({ onSubmit, isLoading, initialName = '', userId }) => {
  const [step, setStep] = useState(initialName ? 2 : 1);
  const [prefs, setPrefs] = useState<UserPreferences>({
    name: initialName,
    skill: '',
    experience: ExperienceLevel.BEGINNER,
    goal: ''
  });
  const [customSkill, setCustomSkill] = useState('');
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const totalSteps = 4;

  const nextStep = async () => {
    if (step === 1 && prefs.name && userId) {
      try {
        await updateProfileName(userId, prefs.name);
      } catch (err: any) {
        console.error("Failed to save name:", err.message || err);
      }
    }
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => {
    if (initialName && step === 2) return;
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = () => {
    const finalSkill = prefs.skill === 'Other / Custom' ? customSkill : prefs.skill;
    onSubmit({ ...prefs, skill: finalSkill });
  };

  const progress = (step / totalSteps) * 100;

  const inputClasses = "w-full px-4 py-3 md:py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm md:text-base font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-700";
  const btnNextClasses = "group px-5 md:px-7 py-2 md:py-3 bg-indigo-600 text-white text-xs md:text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
  const btnBackClasses = "px-5 md:px-7 py-2 md:py-3 text-slate-400 dark:text-slate-500 font-bold rounded-xl hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs md:text-sm";

  const handleSkillSelect = (skillLabel: string) => {
    setPrefs({ ...prefs, skill: skillLabel });
    if (skillLabel !== 'Other / Custom') {
      setTimeout(() => nextStep(), 250);
    }
  };

  const suggestions = useMemo(() => {
    const skill = prefs.skill === 'Other / Custom' ? customSkill : prefs.skill;
    const level = prefs.experience;
    if (!skill) return [];

    const suggestionMap: Record<string, Record<ExperienceLevel, string[]>> = {
      'AI Content Creation': {
        [ExperienceLevel.BEGINNER]: ["Start a niche blog with AI SEO", "Manage social media for 5 clients", "Ghostwrite LinkedIn posts"],
        [ExperienceLevel.INTERMEDIATE]: ["Build a content automation agency", "Create an AI writing course", "Scale a newsletter to 10k subs"],
        [ExperienceLevel.PROFESSIONAL]: ["Develop proprietary LLM workflows", "Consult on AI content strategy", "Scale an AI-first media empire"]
      },
      'AI Video Generation': {
        [ExperienceLevel.BEGINNER]: ["Launch a faceless YouTube channel", "Create AI short-form ads", "Offer AI avatars for local shops"],
        [ExperienceLevel.INTERMEDIATE]: ["Build an AI production studio", "Create high-end AI music videos", "Automate video outreach"],
        [ExperienceLevel.PROFESSIONAL]: ["Integrate AI in film workflows", "Develop AI-native video SaaS", "Lead AI video pipelines"]
      }
    };

    return (suggestionMap as any)[skill]?.[level] || (level === ExperienceLevel.BEGINNER 
      ? ["Earn my first $1k using AI", "Build a professional portfolio", "Land a junior AI-related role"]
      : ["Scale my income by 2x", "Become a recognized expert", "Consult for high-paying clients"]);
  }, [prefs.skill, customSkill, prefs.experience]);

  return (
    <div className="w-full mx-auto relative">
      {activeInfo && SKILL_INFO[activeInfo] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-transparent dark:border-slate-800">
            <div className="p-6 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white relative">
              <button onClick={() => setActiveInfo(null)} className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>{SKILL_PRESETS.find(p => p.label === activeInfo)?.icon}</span>
                {activeInfo}
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">What it is</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{SKILL_INFO[activeInfo].definition}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Earning Potential</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{SKILL_INFO[activeInfo].earning}</p>
              </div>
              <button onClick={() => setActiveInfo(null)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">Got it!</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5 px-1">
          <p className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Construction Progress</p>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600">Step {step} of {totalSteps}</p>
        </div>
        <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="glass p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
        
        <div key={step} className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-wider">Step 01</span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  Hi, I'm Anna. <br/>
                  <span className="text-slate-400 dark:text-slate-600">What's your name?</span>
                </h2>
              </div>
              <input autoFocus type="text" placeholder="Your name..." className={inputClasses} value={prefs.name} onChange={(e) => setPrefs({ ...prefs, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && prefs.name && nextStep()} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-wider">Step 02</span>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  Hi {prefs.name}, <br/>
                  <span className="text-slate-400 dark:text-slate-600">Which skill calls to you?</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {SKILL_PRESETS.map((preset) => (
                  <div key={preset.id} className="relative group">
                    <button
                      onClick={() => handleSkillSelect(preset.label)}
                      className={`w-full flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                        prefs.skill === preset.label 
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-md dark:shadow-none" 
                          : "border-slate-50 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-100 dark:hover:border-indigo-900/50"
                      }`}
                    >
                      <span className="text-base">{preset.icon}</span>
                      <span className={`font-bold text-[11px] md:text-xs ${prefs.skill === preset.label ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                        {preset.label}
                      </span>
                    </button>
                    {SKILL_INFO[preset.label] && (
                      <button onClick={(e) => { e.stopPropagation(); setActiveInfo(preset.label); }} className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${prefs.skill === preset.label ? "text-indigo-200 hover:text-white" : "text-slate-300 dark:text-slate-600 hover:text-indigo-400 dark:hover:text-indigo-400"}`} title="What is this?">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {prefs.skill === 'Other / Custom' && (
                <div className="animate-in fade-in zoom-in-95">
                  <input autoFocus type="text" placeholder="e.g. AI Prompt Engineering..." className={inputClasses} value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-wider">Step 03</span>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Your starting level?</h2>
              </div>
              <div className="space-y-2">
                {Object.values(ExperienceLevel).map((lvl) => (
                  <label key={lvl} className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${prefs.experience === lvl ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20" : "border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900"}`}>
                    <input type="radio" name="experience" value={lvl} checked={prefs.experience === lvl} onChange={() => setPrefs({ ...prefs, experience: lvl })} className="hidden" />
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${prefs.experience === lvl ? "border-indigo-600 bg-indigo-600" : "border-slate-300 dark:border-slate-700"}`}>
                        {prefs.experience === lvl && <div className="w-1 h-1 rounded-full bg-white" />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs md:text-sm font-bold ${prefs.experience === lvl ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-400"}`}>{lvl}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-600 font-medium">
                          {lvl === ExperienceLevel.BEGINNER ? "Brand new to this skill." : lvl === ExperienceLevel.INTERMEDIATE ? "Know basics, ready to apply." : "Pro looking to optimize."}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-wider">Step 04</span>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">What is your big vision?</h2>
              </div>
              <div className="space-y-3">
                <textarea autoFocus rows={2} placeholder="e.g. Build a $3,000/mo freelance business." className={inputClasses + " resize-none text-xs md:text-sm"} value={prefs.goal} onChange={(e) => setPrefs({ ...prefs, goal: e.target.value })} />
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Suggested for you:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((sug, i) => (
                      <button key={i} type="button" onClick={() => setPrefs({...prefs, goal: sug})} className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors font-bold whitespace-nowrap">
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between z-10 relative">
          <div className="flex-shrink-0">
            {(step > 1 && !(initialName && step === 2)) && <button onClick={prevStep} className={btnBackClasses}>Back</button>}
          </div>
          <div className="flex gap-2">
            {step < totalSteps ? (
              <button onClick={nextStep} disabled={(step === 1 && !prefs.name) || (step === 2 && (!prefs.skill || (prefs.skill === 'Other / Custom' && !customSkill))) || (step === 3 && !prefs.experience)} className={btnNextClasses}>
                <span>Continue</span>
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isLoading || !prefs.goal} className={btnNextClasses + " min-w-[130px] flex items-center justify-center"}>
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span>View My Plan</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
