import { UserProfile } from '../types/profile';

export const calculateBmi = (height_cm: number, weight_kg: number): number => {
  if (height_cm <= 0) return 0;
  const heightM = height_cm / 100;
  return weight_kg / (heightM * heightM);
};

export const getBmiCategory = (bmi: number): string => {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return 'Normal weight';
  } else if (bmi >= 25 && bmi < 29.9) {
    return 'Overweight';
  } else if (bmi >= 30 && bmi < 34.9) {
    return 'Obesity (Class I)';
  } else if (bmi >= 35 && bmi < 39.9) {
    return 'Obesity (Class II)';
  } else {
    return 'Obesity (Class III)';
  }
};

export const calculateBmr = (profile: Pick<UserProfile, 'sex' | 'age' | 'height_cm' | 'weight_kg'>): number => {
  const { sex, age, height_cm, weight_kg } = profile;
  if (sex === 'male') {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else if (sex === 'female') {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
  // Averages for 'other' or 'prefer_not_to_say'
  const bmrMale = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  const bmrFemale = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  return (bmrMale + bmrFemale) / 2;
};

export const calculateTdee = (bmr: number, activityLevel: string): number => {
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
    athlete: 1.9,
  };
  return bmr * (activityMultipliers[activityLevel] || 1.2);
};

export const calculateMacroTargets = (profile: UserProfile): { calories: number; protein_g: number; carbs_g: number; fat_g: number; } => {
  const bmr = calculateBmr(profile);
  const tdee = calculateTdee(bmr, profile.activity_level);

  // Adjust calories based on goal
  let calories = tdee;
  if (profile.goal === 'weight_loss') {
    calories -= 500; // 500 calorie deficit for weight loss
  } else if (profile.goal === 'weight_gain') {
    calories += 500; // 500 calorie surplus for weight gain
  }

  // Calculate macros based on a 40/30/30 split
  const carbs_g = Math.round((calories * 0.4) / 4);
  const protein_g = Math.round((calories * 0.3) / 4);
  const fat_g = Math.round((calories * 0.3) / 9);

  return {
    calories,
    protein_g,
    carbs_g,
    fat_g,
  };
};
