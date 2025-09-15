import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { UserProfile } from '../types/profile';
import { toTitleCaseFromSnakeCase } from '../utils/stringUtils';
import { calculateBmi, getBmiCategory } from '../utils/macroCalc';

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile as UserProfile | null;

  const bmi = profile ? calculateBmi(profile.height_cm, profile.weight_kg) : null;
  const bmiCategory = bmi !== null ? getBmiCategory(bmi) : null;

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card text-center">
              <div className="card-body">
                <h1 className="card-title">No Profile Data</h1>
                <p className="card-text">Please go back and complete your profile.</p>
                <Link to="/" className="btn btn-primary">Go Back</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    navigate('/dashboard', { state: { profile } });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center">Confirm Your Profile</h1>
            </div>
            <div className="card-body">
              <h2>Your Profile Summary</h2>
              <ul>
                <li><strong>Name:</strong> {profile.name}</li>
                <li><strong>Age:</strong> {profile.age}</li>
                <li><strong>Sex:</strong> {profile.sex}</li>
                <li><strong>Height:</strong> {profile.height_cm} cm</li>
                <li><strong>Weight:</strong> {profile.weight_kg} kg</li>
                {bmi !== null && <li><strong>BMI:</strong> {bmi.toFixed(2)} ({bmiCategory})</li>}
                <li><strong>Goal:</strong> {toTitleCaseFromSnakeCase(profile.goal)}</li>
                <li><strong>Activity Level:</strong> {profile.activity_level}</li>
                <li><strong>Allergies:</strong> {profile.allergies?.join(', ') || 'None'}</li>
              </ul>
              <hr />
              <h2>Your Calculated Macro Targets</h2>
              <ul>
                <li><strong>Calories:</strong> {profile.macro_targets?.calories.toFixed(0)} kcal</li>
                <li><strong>Protein:</strong> {profile.macro_targets?.protein_g.toFixed(0)} g</li>
                <li><strong>Carbohydrates:</strong> {profile.macro_targets?.carbs_g.toFixed(0)} g</li>
                <li><strong>Fat:</strong> {profile.macro_targets?.fat_g.toFixed(0)} g</li>
              </ul>
              <div className="d-grid gap-2 mt-4">
                <button className="btn btn-primary" onClick={handleConfirm}>Confirm and Generate Meal Plan</button>
                <Link to="/" className="btn btn-secondary">Go Back and Edit</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;