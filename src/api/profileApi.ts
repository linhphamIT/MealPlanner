import { supabase } from './client';
import { UserProfile } from '../types/profile';

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
};

export const createProfile = async (profile: UserProfile): Promise<UserProfile | null> => {
  const { data, error } = await supabase.from('profiles').insert([profile]).select();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }
  return data && data.length > 0 ? data[0] : null;
};

export const updateProfile = async (profile: UserProfile): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', profile.id);

  if (error) {
    console.error('Error updating profile:', error);
  }
};
