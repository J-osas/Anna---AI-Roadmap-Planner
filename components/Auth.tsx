
import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage({ type: 'error', text: 'Authentication is currently disabled.' });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Verification sent! Please check your email inbox.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "An authentication error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6 md:py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-40"></div>

        <div className="relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-indigo-50 rounded-2xl mb-4 md:mb-6 shadow-sm border border-indigo-100">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">
              {isSignUp ? 'Join Anna AI' : 'Welcome Back'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-xs mx-auto font-medium px-4">
              {isSignUp 
                ? 'Create your free account to start building your personal roadmap library.' 
                : 'Sign in to access your saved roadmaps and continue your journey.'}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-[11px] md:text-xs font-bold flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {message.type === 'success' ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                )}
              </div>
              <span className="flex-1">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4 md:space-y-5">
            <div className="space-y-1.5 md:space-y-2">
              <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input
                type="email"
                required
                className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full mt-4 py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Verifying...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                  {isSignUp ? 'Create My Account' : 'Sign-in to Library'}
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              )}
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>

          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-100 flex flex-col items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] md:text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2"
            >
              {isSignUp ? 'Already have an account? Sign In' : "New to Anna? Join Now"}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">
              By continuing, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
