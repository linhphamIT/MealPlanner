import { UserProfile } from '../types/profile';
import { MealPlan, Day, Meal, Ingredient } from '../types/mealPlan';
import { generateMealPlanFromGemini } from '../api/geminiApi';

export const generateMealPlan = async (profile: UserProfile): Promise<MealPlan> => {
  profile.allergies = profile.allergies || []; // Ensure allergies is an array
  const geminiOutput: any = await generateMealPlanFromGemini(profile);
  console.log("MealPlan from Gemini:", geminiOutput); // Added console.log

  // Transform Gemini output into MealPlan structure
  let transformedMealPlan: MealPlan;

  if (Array.isArray(geminiOutput)) {
    // Case 1: geminiOutput is an array of meals (single day)
    const mealsForDay = geminiOutput.map((geminiMeal: any) => ({
      slot: geminiMeal.title,
      title: geminiMeal.title,
      prep_time_min: parseInt(geminiMeal.preparation_time.replace(' minutes', '')),
      cook_time_min: parseInt(geminiMeal.cooking_time.replace(' minutes', '')),
      servings: 1, // Placeholder
      ingredients: geminiMeal.ingredients.map((ing: any) => ({
        name: ing.item,
        quantity: `${ing.quantity} ${ing.unit || ''}`,
      })),
      instructions: geminiMeal.instructions,
      nutrition: geminiMeal.nutritional_breakdown ? {
        calories: geminiMeal.nutritional_breakdown.calories ?? 0,
        protein_g: geminiMeal.nutritional_breakdown.protein ?? 0,
        carbs_g: geminiMeal.nutritional_breakdown.carbohydrates ?? 0,
        fat_g: geminiMeal.nutritional_breakdown.fat ?? 0,
        fiber_g: geminiMeal.nutritional_breakdown.fiber ?? 0,
      } : { // Default values if nutritional_breakdown is missing
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        fiber_g: 0,
      },
      tags: [], // Placeholder
      allergen_flags: [], // Placeholder
    }));

    console.log("mealsForDay before reduce:", mealsForDay); // Added console.log
    const dailyTotals = mealsForDay.reduce((acc: any, meal: any) => {
      console.log("Processing meal in reduce:", meal); // Added console.log
      console.log("Meal nutrition in reduce:", meal.nutrition); // Added console.log
      if (meal.nutrition) { // Add check for meal.nutrition
        acc.calories += meal.nutrition.calories;
        acc.protein_g += meal.nutrition.protein_g;
        acc.carbs_g += meal.nutrition.carbohydrates;
        acc.fat_g += meal.nutrition.fat;
        acc.fiber_g += meal.nutrition.fiber_g;
      }
      return acc;
    }, { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 });


    transformedMealPlan = {
      user_id: profile.user_id,
      user_name: profile.name, // Added user_name
      timeframe: "daily",
      daily_targets: {
        calories: dailyTotals.calories,
        protein_g: dailyTotals.protein_g,
        carbs_g: dailyTotals.carbs_g,
        fat_g: dailyTotals.fat_g,
      },
      days: [
        {
          day_index: 0,
          date: new Date().toISOString().split('T')[0],
          meals: mealsForDay,
          totals: dailyTotals,
        },
      ],
      grocery_list: [],
      adjustment_notes: [],
    };

  } else if (geminiOutput && geminiOutput.meal_plan && geminiOutput.daily_nutrition_summary) {
    // Case 2: geminiOutput is an object with meal_plan and daily_nutrition_summary
    transformedMealPlan = {
      user_id: profile.user_id,
      user_name: profile.name, // Added user_name
      timeframe: "daily",
      daily_targets: geminiOutput.daily_nutrition_summary ? {
        calories: geminiOutput.daily_nutrition_summary.total_calories,
        protein_g: geminiOutput.daily_nutrition_summary.total_protein,
        carbs_g: geminiOutput.daily_nutrition_summary.total_carbohydrates,
        fat_g: geminiOutput.daily_nutrition_summary.total_fat,
      } : {
        calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0,
      },
      days: [
        {
          day_index: 0,
          date: new Date().toISOString().split('T')[0],
          meals: geminiOutput.meal_plan.map((geminiMeal: any) => ({
            slot: geminiMeal.meal_title,
            title: geminiMeal.meal_title,
            prep_time_min: geminiMeal.preparation_time_minutes,
            cook_time_min: geminiMeal.cooking_time_minutes,
            servings: 1, // Placeholder
            ingredients: geminiMeal.ingredients.map((ing: any) => ({
              name: ing.item,
              quantity: `${ing.quantity} ${ing.unit || ''}`,
            })),
            instructions: geminiMeal.instructions,
            nutrition: {
              calories: geminiMeal.nutrition?.calories ?? 0,
              protein_g: geminiMeal.nutrition?.protein ?? 0,
              carbs_g: geminiMeal.nutrition?.carbohydrates ?? 0,
              fat_g: geminiMeal.nutrition?.fat ?? 0,
              fiber_g: geminiMeal.nutrition?.fiber ?? 0,
            },
            tags: [], // Placeholder
            allergen_flags: [], // Placeholder
          })),
          totals: {
            calories: geminiOutput.daily_nutrition_summary?.total_calories ?? 0,
            protein_g: geminiOutput.daily_nutrition_summary?.total_protein ?? 0,
            carbs_g: geminiOutput.daily_nutrition_summary?.total_carbohydrates ?? 0,
            fat_g: geminiOutput.daily_nutrition_summary?.total_fat ?? 0,
            fiber_g: geminiOutput.daily_nutrition_summary?.total_fiber ?? 0,
          },
        },
      ],
      grocery_list: [],
      adjustment_notes: [],
    };
  } else {
    // Handle unexpected Gemini output structure
    console.error("Unexpected Gemini output structure:", geminiOutput);
    throw new Error("Failed to generate meal plan due to unexpected data format.");
  }

  const mealPlan = transformedMealPlan; // Assign the transformed object to mealPlan

  // JSON validation
  const jsonOutput = JSON.stringify(mealPlan, null, 2);
  try {
    JSON.parse(jsonOutput);
  } catch (error) {
    console.error('Invalid JSON output from Gemini:', error);
    // Handle the error appropriately
    throw new Error('Invalid meal plan format from Gemini.');
  }

  // Macro target validation
  if (profile.macro_targets && mealPlan.days && mealPlan.days.length > 0) {
    const macroVariance = {
      calories: Math.abs(mealPlan.days[0].totals.calories - profile.macro_targets.calories) / profile.macro_targets.calories,
      protein: Math.abs(mealPlan.days[0].totals.protein_g - profile.macro_targets.protein_g) / profile.macro_targets.protein_g,
      carbs: Math.abs(mealPlan.days[0].totals.carbs_g - profile.macro_targets.carbs_g) / profile.macro_targets.carbs_g,
      fat: Math.abs(mealPlan.days[0].totals.fat_g - profile.macro_targets.fat_g) / profile.macro_targets.fat_g,
    };

    if (macroVariance.calories > 0.05) {
      console.warn(`Calorie variance is greater than 5%: ${macroVariance.calories * 100}%`);
    }
    if (macroVariance.protein > 0.05) {
      console.warn(`Protein variance is greater than 5%: ${macroVariance.protein * 100}%`);
    }
    if (macroVariance.carbs > 0.05) {
      console.warn(`Carbs variance is greater than 5%: ${macroVariance.carbs * 100}%`);
    }
    if (macroVariance.fat > 0.05) {
      console.warn(`Fat variance is greater than 5%: ${macroVariance.fat * 100}%`);
    }
  }

  // Allergen validation
  if (profile.allergies.length > 0 && mealPlan.days && mealPlan.days.length > 0) {
    const allergens = profile.allergies;
    mealPlan.days.forEach((day: Day) => {
      if (day.meals) {
        day.meals.forEach((meal: Meal) => {
          if (meal.ingredients) {
            meal.ingredients.forEach((ingredient: Ingredient) => {
              if (allergens.includes(ingredient.name)) {
                console.error(`Allergen found in recipe: ${ingredient.name}`);
                // Handle the error appropriately
              }
            });
          }
        });
      }
    });
  } else if (profile.allergies.length === 0 && mealPlan.days && mealPlan.days.length > 0) {
    // No allergies to validate against, so no action needed.
    // This branch handles the case where profile.allergies is an empty array.
  } else if (profile.allergies.length > 0 && (!mealPlan.days || mealPlan.days.length === 0)) {
    console.warn("Meal plan has no days for allergen validation, but profile has allergies.");
  }

  return mealPlan;
};