export interface MealPlan {
  plan_id?: string; // Made optional and renamed
  user_id: string;
  user_name?: string; // Added user_name
  timeframe: string;
  daily_targets: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  days: Day[];
  grocery_list: GroceryItem[];
  adjustment_notes: string[];
}

export interface Day {
  day_index: number;
  date: string;
  meals: Meal[];
  totals: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  };
}

export interface Meal {
  slot: string;
  title: string;
  prep_time_min: number;
  cook_time_min: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  };
  tags: string[];
  allergen_flags: string[];
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface GroceryItem {
  item: string;
  total_quantity: string;
  category: string;
}
