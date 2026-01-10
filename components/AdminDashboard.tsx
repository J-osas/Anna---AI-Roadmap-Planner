
import React, { useEffect, useState } from 'react';
import { Profile, SavedPlan } from '../types';
import { getAllUsers, getAllPlans } from '../services/supabaseService';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'users' | 'plans'>('plans');

  useEffect(() => {
    async function loadData() {
      try {
        const [u, p] = await Promise.all([getAllUsers(), getAllPlans()]);
        setUsers(u);
        setPlans(p);
      } catch (err) {
        console.error(err);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-xs text-slate-500">Platform overview and management</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setTab('plans')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'plans' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Recent Plans
          </button>
          <button 
            onClick={() => setTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'users' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            User List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-5 rounded-2xl border border-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
          <p className="text-2xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plans Generated</p>
          <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Today</p>
          <p className="text-2xl font-bold text-slate-900">
            {users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
      </div>

      <div className="glass rounded-3xl border border-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'plans' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Goal</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{(p as any).profiles?.email || 'Guest'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">{p.skill}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{p.goal}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
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
