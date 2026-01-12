
import React, { useEffect, useState } from 'react';
import { Profile, SavedPlan } from '../types';
import { getAllUsers, getAllPlans } from '../services/supabaseService';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'users' | 'plans'>('plans');

  useEffect(() => {
    async function loadData() {
      setError(null);
      setLoading(true);
      try {
        const [u, p] = await Promise.all([getAllUsers(), getAllPlans()]);
        setUsers(u);
        setPlans(p);
      } catch (err: any) {
        console.error("Admin data load failed:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Platform overview and management</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-center sm:self-auto">
          <button 
            onClick={() => setTab('plans')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'plans' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Recent Plans
          </button>
          <button 
            onClick={() => setTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'users' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            User List
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold flex flex-col gap-1">
          <p>⚠️ Dashboard Error:</p>
          <p className="opacity-70 font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-5 rounded-2xl border border-white dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1 text-center sm:text-left">Total Users</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white text-center sm:text-left">{users.length}</p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1 text-center sm:text-left">Plans Generated</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white text-center sm:text-left">{plans.length}</p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1 text-center sm:text-left">Active Today</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white text-center sm:text-left">
            {users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
      </div>

      <div className="glass rounded-3xl border border-white dark:border-slate-800 shadow-xl dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'plans' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Skill</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Goal</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {plans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">{(p as any).profiles?.email || 'Guest'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold uppercase whitespace-nowrap">{p.skill}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-500 max-w-xs truncate">{p.goal}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 dark:text-slate-600 whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 dark:text-slate-600">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
