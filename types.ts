
export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  PROFESSIONAL = 'Professional'
}

export interface UserPreferences {
  name: string;
  skill: string;
  experience: ExperienceLevel;
  goal: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  tips: string[];
}

export interface RoadmapResponse {
  greeting: string;
  intro: string;
  steps: RoadmapStep[];
}

export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  full_name?: string;
  created_at: string;
}

export interface SavedPlan {
  id: string;
  user_id: string;
  skill: string;
  experience: string;
  goal: string;
  plan_data: RoadmapResponse;
  created_at: string;
}
