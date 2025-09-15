import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile } from '../types/profile';

// Access your API key as an environment variable (see "Set up your API key" above)
const API_KEY = 'YOUR_GOOGLE_GEMINI_API_KEY'; // Ensure GEMINI_API_KEY is set in your .env file

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateMealPlanFromGemini = async (profile: UserProfile): Promise<any> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate a daily meal plan for a person with the following profile:
    Name: ${profile.name}
    Age: ${profile.age}
    Sex: ${profile.sex}
    Height: ${profile.height_cm} cm
    Weight: ${profile.weight_kg} kg
    Goal: ${profile.goal}
    Activity Level: ${profile.activity_level}
    Dietary Pattern: ${profile.dietary_pattern}
    Allergies: ${(profile.allergies || []).join(', ') || 'None'}
    Intolerances: ${(profile.intolerances || []).join(', ') || 'None'}
    Disliked Foods: ${(profile.disliked_foods || []).join(', ') || 'None'}
    Favorite Foods: ${(profile.favorite_foods || []).join(', ') || 'None'}
    Meals Per Day: ${profile.meals_per_day}
    Cooking Skill: ${profile.cooking_skill}
    Constraints: ${JSON.stringify(profile.constraints)}
    Macro Targets: ${JSON.stringify(profile.macro_targets)}
    Preferences: ${JSON.stringify(profile.preferences)}
    Notes: ${profile.notes || 'None'}

    Provide the output in a JSON format. The root object should contain "meal_plan" and "daily_nutrition_summary".
    The "meal_plan" should be an array of meal objects. Each meal object should have:
    - meal_title (string)
    - preparation_time_minutes (number)
    - cooking_time_minutes (number)
    - ingredients (array of objects with item, quantity, and unit)
    - instructions (array of strings)
    - nutrition (object with calories, protein, carbohydrates, fat, and fiber)

    Ensure that 
    - preparation_time_minutes,
    - cooking_time_minutes,
    - and all fields in nutrition
    are populated with realistic, non-zero values.

    The "daily_nutrition_summary" object should have total_calories, total_protein, total_carbohydrates, total_fat, and total_fiber for the entire day.

    Example JSON structure:
    {
      "meal_plan": [
        {
          "meal_title": "Breakfast Title",
          "preparation_time_minutes": 5,
          "cooking_time_minutes": 5,
          "ingredients": [
            { "item": "Oats", "quantity": 50, "unit": "g" }
          ],
          "instructions": ["Instruction 1", "Instruction 2"],
          "nutrition": { "calories": 300, "protein": 15, "carbohydrates": 40, "fat": 10, "fiber": 5 }
        }
      ],
      "daily_nutrition_summary": {
        "total_calories": 1800,
        "total_protein": 100,
        "total_carbohydrates": 200,
        "total_fat": 60,
        "total_fiber": 30
      }
    }
    `

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // The Gemini API might return text that needs to be parsed as JSON
    // It might also include markdown formatting (e.g., ```json ... ```)
    const jsonString = text.replace(/```json\n|```/g, '').trim();

    try {
      const parsedData = JSON.parse(jsonString);
      return parsedData;
    } catch (jsonError) {
      console.error("Error parsing Gemini API response to JSON:", jsonError);
      console.error("Raw text from Gemini:", text);
      throw new Error("Failed to parse Gemini API response. Malformed JSON received.");
    }

  } catch (error) {
    console.error("Error generating meal plan from Gemini:", error);
    throw error;
  }
};