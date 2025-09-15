import { supabase } from './client';

export interface FeedbackData {
  rating: number;
  improvement: string;
}

export const submitFeedback = (feedbackData: FeedbackData) => {
  return supabase.from('feedback').insert([feedbackData]);
};
