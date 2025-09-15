CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  email TEXT UNIQUE, -- Added email column as unique
  name TEXT,
  age INTEGER,
  sex TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  goal TEXT,
  activity_level TEXT,
  dietary_pattern TEXT,
  allergies TEXT[],
  intolerances TEXT[],
  disliked_foods TEXT[],
  favorite_foods TEXT[],
  meals_per_day INTEGER,
  cooking_skill TEXT,
  "constraints" JSONB,
  macro_targets JSONB,
  preferences JSONB,
  notes TEXT
);

CREATE TABLE public.meal_plans (
  plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT, -- Added user_name column
  timeframe TEXT,
  daily_targets JSONB,
  days JSONB,
  grocery_list JSONB,
  adjustment_notes TEXT[]
);

CREATE TABLE public.user_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) UNIQUE, -- Link to profiles table
  bmi NUMERIC,
  bmi_category TEXT,
  calculated_macro_targets JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
