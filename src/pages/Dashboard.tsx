import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { MealPlan } from '../types/mealPlan';
import { UserProfile } from '../types/profile';
import { toTitleCaseFromSnakeCase } from '../utils/stringUtils';
import { calculateBmi, getBmiCategory } from '../utils/macroCalc';
import { generateMealPlan } from '../utils/generateMealPlan';
import { getMealPlan, upsertMealPlan } from '../api/mealPlanApi';
import { getUserSummary, UserSummary } from '../api/userSummaryApi';

const Dashboard: React.FC = () => {
  const { profile } = useOutletContext<{ profile: UserProfile | null }>();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);

  const darkBlue = '#00008B';

  const boxStyle = {
    border: `1px solid ${darkBlue}`,
    padding: '1rem',
    borderRadius: '0.25rem',
    backgroundColor: 'white',
    height: '100%',
  };

  const headingStyle = {
    borderBottom: `1px solid ${darkBlue}`,
    color: darkBlue,
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  };

  useEffect(() => {
    const loadData = async () => {
      if (profile) {
        if (profile.height_cm && profile.weight_kg) {
          const currentBmi = calculateBmi(profile.height_cm, profile.weight_kg);
          const currentBmiCategory = getBmiCategory(currentBmi);
          setBmi(currentBmi);
          setBmiCategory(currentBmiCategory);
        }

        const summary = await getUserSummary(profile.id);
        if (summary) {
          setUserSummary(summary);
        }

        const plan = await getMealPlan(profile.user_id);
        if (plan) {
          setMealPlan(plan);
        }
      }
    };
    loadData();
  }, [profile]);


  const handleGenerateMealPlan = async () => {
    if (profile) {
      setMealPlanLoading(true);
      const newMealPlan = await generateMealPlan(profile);
      if (newMealPlan) {
        if (mealPlan && mealPlan.plan_id) {
          newMealPlan.plan_id = mealPlan.plan_id;
        }
        const savedMealPlan = await upsertMealPlan(newMealPlan);
        if (savedMealPlan) {
          setMealPlan(savedMealPlan);
        }
      }
      setMealPlanLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '80%' }}>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div style={boxStyle}>
                    <h3 style={headingStyle}>Your Profile</h3>
                    <ul className="list-unstyled">
                      <li><strong>Email:</strong> {profile.email}</li>
                      <li><strong>Name:</strong> {profile.name}</li>
                      <li><strong>Age:</strong> {profile.age}</li>
                      <li><strong>Sex:</strong> {profile.sex}</li>
                      <li><strong>Height:</strong> {profile.height_cm} cm</li>
                      <li><strong>Weight:</strong> {profile.weight_kg} kg</li>
                      <li><strong>Goal:</strong> {toTitleCaseFromSnakeCase(profile.goal)}</li>
                    </ul>
                    <Link to="/onboarding" state={{ profile }} className="btn btn-outline-primary btn-sm mt-3">Edit Profile</Link>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div style={boxStyle}>
                    <h3 style={headingStyle}>Your Calculated Macro Targets</h3>
                    {userSummary ? (
                      <ul className="list-unstyled">
                        <li><strong>BMI:</strong> {userSummary.bmi.toFixed(2)} ({userSummary.bmi_category})</li>
                        <li><strong>Calories:</strong> {userSummary.calculated_macro_targets.calories}</li>
                        <li><strong>Protein:</strong> {userSummary.calculated_macro_targets.protein_g}g</li>
                        <li><strong>Carbs:</strong> {userSummary.calculated_macro_targets.carbs_g}g</li>
                        <li><strong>Fat:</strong> {userSummary.calculated_macro_targets.fat_g}g</li>
                      </ul>
                    ) : (
                      profile.macro_targets && (
                        <ul className="list-unstyled">
                          {bmi !== null && <li><strong>BMI:</strong> {bmi.toFixed(2)} ({bmiCategory})</li>}
                          <li><strong>Calories:</strong> {profile.macro_targets.calories}</li>
                          <li><strong>Protein:</strong> {profile.macro_targets.protein_g}g</li>
                          <li><strong>Carbs:</strong> {profile.macro_targets.carbs_g}g</li>
                          <li><strong>Fat:</strong> {profile.macro_targets.fat_g}g</li>
                        </ul>
                      )
                    )}
                  </div>
                </div>
              </div>
              <hr />
              {mealPlan ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h2>Full Plan Details</h2>
                    <button className="btn btn-primary btn-sm" onClick={handleGenerateMealPlan} disabled={mealPlanLoading}>
                      {mealPlanLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                  <hr />
                  {mealPlan.days && mealPlan.days.length > 0 ? (
                    mealPlan.days.map((day, dayIndex) => (
                      <div key={dayIndex} className="mb-4">
                        <h4>Day {dayIndex + 1}</h4>
                        {day.meals.map((meal, mealIndex) => (
                          <div key={mealIndex} className="card mb-3">
                            <div className="card-body">
                              <h5 className="card-title">{meal.title}</h5>
                              <h6 className="card-subtitle mb-2 text-muted">Preparation: {meal.prep_time_min} mins | Cook: {meal.cook_time_min} mins</h6>
                              <p className="card-text"><strong>Ingredients:</strong></p>
                              <ul>
                                {meal.ingredients.map((ingredient, ingredientIndex) => (
                                  <li key={ingredientIndex}>
                                    {ingredient.name} ({ingredient.quantity})
                                  </li>
                                ))}
                              </ul>
                              <p className="card-text"><strong>Instructions:</strong></p>
                              <ol>
                                {meal.instructions.map((instruction, instructionIndex) => (
                                  <li key={instructionIndex}>{instruction}</li>
                                ))}
                              </ol>
                              <p className="card-text"><strong>Nutrition:</strong></p>
                              <ul>
                                <li>Calories: {meal.nutrition.calories}</li>
                                <li>Protein: {meal.nutrition.protein_g}g</li>
                                <li>Carbs: {meal.nutrition.carbs_g}g</li>
                                <li>Fat: {meal.nutrition.fat_g}g</li>
                                <li>Fiber: {meal.nutrition.fiber_g}g</li>
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <p>No meal plan details available.</p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p>Click the button to generate your meal plan.</p>
                  <button className="btn btn-primary" onClick={handleGenerateMealPlan} disabled={mealPlanLoading}>
                    {mealPlanLoading ? 'Generating...' : 'Generate Meal Plan'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;