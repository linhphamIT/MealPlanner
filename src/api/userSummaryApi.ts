import { supabase } from './client';
import { UserProfile } from '../types/profile';

export interface UserSummary {
  id?: string;
  user_id: string;
  bmi: number;
  bmi_category: string;
  calculated_macro_targets: any; // Use 'any' for now, or define a specific interface
  created_at?: string;
}

export const saveUserSummary = async (summary: UserSummary): Promise<UserSummary | null> => {
  const { data, error } = await supabase
    .from('user_summaries')
    .upsert(summary, { onConflict: 'user_id' }) // Upsert based on user_id
    .select();

  if (error) {
    console.error('Error saving user summary:', error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
};

export const getUserSummary = async (userId: string): Promise<UserSummary | null> => {
  const { data, error } = await supabase
    .from('user_summaries')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting user summary:', error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
};