import { useState } from 'react';
import { UserProfile } from '../types/profile';
import { updateProfile as updateProfileApi } from '../api/profileApi';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async (updatedProfile: UserProfile) => {
    setLoading(true);
    await updateProfileApi(updatedProfile);
    setProfile(updatedProfile);
    setLoading(false);
  };

  return { profile, loading, updateUserProfile };
};