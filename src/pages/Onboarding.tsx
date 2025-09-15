import React from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import ProfileForm from '../components/forms/ProfileForm';
import { UserProfile } from '../types/profile';
import { calculateMacroTargets, calculateBmi, getBmiCategory } from '../utils/macroCalc';
import { saveUserSummary, UserSummary } from '../api/userSummaryApi';
import { updateProfile } from '../api/profileApi'; // Import updateProfile

const Onboarding: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile: profileFromContext, setProfile: setProfileInContext } = useOutletContext<{ profile: UserProfile | null, setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>> }>();
  const [loading, setLoading] = React.useState(false);

  // Check if profile data is passed via location state (for edit mode)
  const profileToEdit = location.state?.profile as UserProfile | null;

  const initialProfile = profileToEdit || profileFromContext;

  const handleSubmit = async (updatedProfile: UserProfile) => {
    setLoading(true);
    const macroTargets = calculateMacroTargets(updatedProfile);
    const profileWithMacros = { ...updatedProfile, macro_targets: macroTargets };
    
    await updateProfile(profileWithMacros);
    setProfileInContext(profileWithMacros); // Update profile in layout state

    const bmi = calculateBmi(profileWithMacros.height_cm, profileWithMacros.weight_kg);
    const bmiCategory = getBmiCategory(bmi);
    const userSummary: UserSummary = {
      user_id: profileWithMacros.id,
      bmi: bmi,
      bmi_category: bmiCategory,
      calculated_macro_targets: macroTargets,
    };
    await saveUserSummary(userSummary);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '80%' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Welcome to the Meal Planner</h1>
              <p className="card-text text-center mb-4">Let's get started with your profile.</p>
              <ProfileForm profile={initialProfile} onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
