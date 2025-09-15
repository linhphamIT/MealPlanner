export interface UserProfile {
  id: string;
  user_id: string;
  email: string; // Added email
  name: string;
  age: number;
  sex: string;
  height_cm: number;
  weight_kg: number;
  goal: string;
  activity_level: string;
  dietary_pattern: string;
  allergies: string[];
  intolerances: string[];
  disliked_foods: string[];
  favorite_foods: string[];
  meals_per_day: number;
  cooking_skill: string;
  constraints: {
    time_per_meal_min: number;
    budget_level: string;
    equipment: string[];
  };
  macro_targets: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  preferences: {
    cuisines: string[];
  };
  notes: string;
}
