import { supabase } from './client';
import { MealPlan } from '../types/mealPlan';

export const getMealPlan = async (userId: string): Promise<MealPlan | null> => {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting meal plan:', error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
};

export const upsertMealPlan = async (mealPlan: MealPlan): Promise<MealPlan | null> => {
  console.log("MealPlan object being sent to Supabase for upsert:", mealPlan);
  const { data, error } = await supabase.from('meal_plans').upsert(mealPlan).select();

  if (error) {
    console.error('Error upserting meal plan:', error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
};