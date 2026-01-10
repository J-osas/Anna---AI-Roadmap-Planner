
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Wizard } from './components/Wizard';
import { RoadmapDisplay } from './components/RoadmapDisplay';
import { Auth } from './components/Auth';
import { Welcome } from './components/Welcome';
import { AdminDashboard } from './components/AdminDashboard';
import { generateRoadmap } from './services/geminiService';
import { supabase, getProfile, savePlan, getUserPlans, deletePlan } from './services/supabaseService';
import { UserPreferences, RoadmapResponse, Profile, SavedPlan } from './types';

type View = 'planner' | 'admin' | 'my-plans' | 'auth' | 'welcome';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [userPlans, setUserPlans] = useState<SavedPlan[]>([]);
  const [appInitialized, setAppInitialized] = useState(false);

  // Auth Initialization & Listener
  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setCurrentView('planner');
      setAppInitialized(true);
      return;
    }

    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(initialSession);
        if (initialSession) {
          await fetchProfile(initialSession.user.id);
          setCurrentView(prev => (prev === 'welcome' || prev === 'auth' ? 'planner' : prev));
        }
      } catch (err: any) {
        console.error("Session initialization failed:", err.message);
      } finally {
        if (mounted) setAppInitialized(true);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      setSession(newSession);
      
      if (newSession) {
        await fetchProfile(newSession.user.id);
        setCurrentView(prev => (prev === 'auth' || prev === 'welcome' ? 'planner' : prev));
      } else {
        setProfile(null);
        if (event === 'SIGNED_OUT') {
          setCurrentView('welcome');
          setRoadmap(null);
          setActivePlanId(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const fetchProfile = async (userId: string) => {
    try {
      const prof = await getProfile(userId);
      setProfile(prof);
    } catch (err: any) {
      console.error("Profile fetch failed:", err.message);
    }
  };

  const loadUserPlans = async () => {
    if (!session?.user || !supabase) return;
    setLoading(true);
    try {
      const plans = await getUserPlans(session.user.id);
      setUserPlans(plans);
    } catch (err: any) {
      console.error("Load plans failed:", err.message);
      setError("Failed to load your roadmap library.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this roadmap from your library? This cannot be undone.")) return;
    
    try {
      await deletePlan(planId);
      setUserPlans(prev => prev.filter(p => p.id !== planId));
      
      // If we are currently viewing this plan, reset the view
      if (activePlanId === planId) {
        reset();
      }
    } catch (err: any) {
      console.error("Delete plan failed:", err.message);
      setError("Failed to delete roadmap.");
    }
  };

  const handleGenerate = async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false);
    setActivePlanId(null);
    try {
      const result = await generateRoadmap(prefs);
      setRoadmap(result);
      if (session?.user && supabase) {
        const newId = await savePlan(session.user.id, prefs, result);
        if (newId) setActivePlanId(newId);
        setSaveSuccess(true);
        loadUserPlans();
      }
    } catch (err: any) {
      console.error("Generation failed:", err.message || err);
      setError("Something went wrong while generating your roadmap. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  const reset = () => {
    setRoadmap(null);
    setActivePlanId(null);
    setError(null);
    setSaveSuccess(false);
  };

  const NavLink = ({ view, label, variant = 'default' }: { view: View, label: string, variant?: 'default' | 'admin' }) => (
    <button
      onClick={() => { 
        setCurrentView(view); 
        if(view === 'my-plans') loadUserPlans(); 
      }}
      className={`relative px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${
        currentView === view 
          ? variant === 'admin' ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
          : variant === 'admin' ? 'text-purple-600 hover:bg-purple-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      {label}
      {currentView === view && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current"></span>
      )}
    </button>
  );

  if (!appInitialized) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waking up Anna...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {saveSuccess && (
        <div 
          onClick={() => setSaveSuccess(false)}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] cursor-pointer animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl shadow-emerald-200 flex items-center gap-3 border border-emerald-500">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-wide">Saved to Library!</span>
          </div>
        </div>
      )}

      <div className="flex flex-row justify-between items-center mb-6 md:mb-12 w-full gap-2">
        <div className="flex items-center gap-2 p-1 md:p-1.5 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
          {session ? (
            <>
              <NavLink view="planner" label="Planner" />
              <NavLink view="my-plans" label="Library" />
              {profile?.role === 'admin' && <NavLink view="admin" label="Admin" variant="admin" />}
            </>
          ) : (
            <div className="px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-300">
              {currentView === 'welcome' ? 'Welcome' : 'Sign In'}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {session ? (
            <div className="flex items-center gap-2 md:gap-4 bg-white pl-3 md:pl-5 pr-1 md:pr-2 py-1 md:py-1.5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter opacity-60">Connected</span>
                <span className="text-[11px] font-bold text-slate-700 lowercase leading-none max-w-[80px] md:max-w-[120px] truncate">{session.user.email}</span>
              </div>
              <button 
                onClick={handleSignOut} 
                className="px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Exit
              </button>
            </div>
          ) : (
            currentView === 'welcome' && (
              <button 
                onClick={() => setCurrentView('auth')} 
                className="px-4 md:px-6 py-2 md:py-2.5 bg-indigo-600 text-white rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center justify-between text-xs font-bold">
          <span>{error}</span>
          <button onClick={reset} className="uppercase tracking-wider hover:opacity-70 transition-opacity">Dismiss</button>
        </div>
      )}

      <div className="w-full">
        {currentView === 'welcome' && !session && (
          <Welcome onGetStarted={() => setCurrentView('auth')} />
        )}
        
        {currentView === 'auth' && !session && <Auth />}
        
        {currentView === 'planner' && (
          !roadmap ? (
            <Wizard 
              onSubmit={handleGenerate} 
              isLoading={loading} 
              initialName={profile?.full_name}
              userId={session?.user?.id}
            />
          ) : (
            <RoadmapDisplay 
              data={roadmap} 
              onReset={reset} 
              onDelete={activePlanId ? () => handleDeletePlan(activePlanId) : undefined}
            />
          )
        )}

        {currentView === 'my-plans' && session && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">Your Roadmap Library</h2>
              <p className="text-sm text-slate-500 font-medium">Pick up where you left off or explore new paths.</p>
            </div>
            
            {userPlans.length === 0 && !loading ? (
              <div className="glass p-10 md:p-20 rounded-[2.5rem] text-center border-dashed border-2 border-slate-200 bg-transparent">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <p className="text-slate-400 text-sm font-medium">Your library is currently empty.</p>
                <button 
                  onClick={() => setCurrentView('planner')} 
                  className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Create Your First Roadmap
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPlans.map((p) => (
                  <div 
                    key={p.id} 
                    className="glass group p-8 rounded-3xl border border-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all cursor-pointer relative overflow-hidden" 
                    onClick={() => { setRoadmap(p.plan_data); setActivePlanId(p.id); setCurrentView('planner'); }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-100 transition-colors"></div>
                    <div className="flex justify-between items-start mb-6 relative">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                        {p.skill}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-300 font-bold">{new Date(p.created_at).toLocaleDateString()}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeletePlan(p.id); }}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors bg-white/50 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{p.experience} Roadmap</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{p.goal}</p>
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">View Roadmap</span>
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'admin' && profile?.role === 'admin' && <AdminDashboard />}
      </div>
    </Layout>
  );
};

export default App;
