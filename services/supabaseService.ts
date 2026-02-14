
import { createClient } from '@supabase/supabase-js';
import { Profile, SavedPlan, RoadmapResponse, UserPreferences } from '../types';

const isEnvAvailable = typeof process !== 'undefined' && process.env;

const supabaseUrl = (isEnvAvailable && process.env.SUPABASE_URL) || 'https://ulquhpajbfvxluxpwmik.supabase.co';
const supabaseAnonKey = (isEnvAvailable && process.env.SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscXVocGFqYmZ2eGx1eHB3bWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODY0NjEsImV4cCI6MjA4MzU2MjQ2MX0.9TZ7HWqRkwGhWpvOYwrGWw2Yi_lonkrqzFR3ydo6KRc';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) return null;
  return data as Profile;
}

export async function updateProfileName(userId: string, name: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: name })
    .eq('id', userId);
  
  if (error) throw error;
}

export async function savePlan(userId: string, prefs: UserPreferences, plan: RoadmapResponse): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('plans')
    .insert({
      user_id: userId,
      skill: prefs.skill,
      experience: prefs.experience,
      goal: prefs.goal,
      plan_data: plan
    })
    .select('id')
    .single();
  
  if (error) throw error;
  return data?.id || null;
}

export async function deletePlan(planId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('plans')
    .delete()
    .eq('id', planId);
  
  if (error) throw error;
}

export async function getUserPlans(userId: string): Promise<SavedPlan[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as SavedPlan[];
}

export async function getAllUsers(): Promise<Profile[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Profile[];
}

/**
 * Fetches all plans with user emails. 
 * If a direct database JOIN fails (e.g., due to relationship mapping between public/auth schemas),
 * it performs a manual in-memory join silently to ensure the UI remains clean and functional.
 */
export async function getAllPlans(): Promise<SavedPlan[]> {
  if (!supabase) return [];
  
  // 1. Try with the relationship JOIN
  const { data, error } = await supabase
    .from('plans')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false });
  
  // 2. If relationship join fails (PGRST200 is relationship missing), perform manual join silently
  if (error && error.code === 'PGRST200') {
    const [plansRes, profilesRes] = await Promise.all([
      supabase.from('plans').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email')
    ]);

    if (plansRes.error) throw plansRes.error;
    
    const profileMap = (profilesRes.data || []).reduce((acc: any, p: any) => {
      acc[p.id] = p;
      return acc;
    }, {});

    return (plansRes.data || []).map((plan: any) => ({
      ...plan,
      profiles: profileMap[plan.user_id] || { email: 'Unknown User' }
    })) as SavedPlan[];
  }
  
  if (error) throw error;
  return data as SavedPlan[];
}
