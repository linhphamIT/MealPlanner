import React, { useState } from 'react';
import { UserProfile } from '../../types/profile';

interface ProfileFormProps {
  profile: UserProfile | null;
  onSubmit: (profile: UserProfile) => void;
  loading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, loading }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile || { allergies: [] });

  const requiredFields = [
    'name',
    'age',
    'sex',
    'height_cm',
    'weight_kg',
    'goal',
    'activity_level',
    'dietary_pattern',
    'meals_per_day',
    'cooking_skill',
  ];

  const calculateCompleteness = () => {
    const filledFields = requiredFields.filter((field) => formData[field as keyof UserProfile]);
    return (filledFields.length / requiredFields.length) * 100;
  };

  const completeness = calculateCompleteness();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAllergiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const allergies = value.split(',').map(s => s.trim());
    setFormData({ ...formData, allergies });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as UserProfile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name:</label>
        <input type="text" id="name" name="name" className="form-control" value={formData.name || ''} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="age" className="form-label">Age:</label>
        <input type="number" id="age" name="age" className="form-control" value={formData.age || ''} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="sex" className="form-label">Sex:</label>
        <select id="sex" name="sex" className="form-select" value={formData.sex || ''} onChange={handleChange}>
          <option value="">Select sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="height_cm" className="form-label">Height (cm):</label>
        <input type="number" id="height_cm" name="height_cm" className="form-control" value={formData.height_cm || ''} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="weight_kg" className="form-label">Weight (kg):</label>
        <input type="number" id="weight_kg" name="weight_kg" className="form-control" value={formData.weight_kg || ''} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="goal" className="form-label">Goal:</label>
        <select id="goal" name="goal" className="form-select" value={formData.goal || ''} onChange={handleChange}>
          <option value="">Select a goal</option>
          <option value="lose_fat">Lose Fat</option>
          <option value="maintain">Maintain</option>
          <option value="gain_muscle">Gain Muscle</option>
          <option value="general_health">General Health</option>
          <option value="performance">Performance</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="activity_level" className="form-label">Activity Level:</label>
        <select id="activity_level" name="activity_level" className="form-select" value={(formData as any).activity_level || ''} onChange={handleChange}>
          <option value="">Select an activity level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="athlete">Athlete</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="dietary_pattern" className="form-label">Dietary Pattern:</label>
        <select id="dietary_pattern" name="dietary_pattern" className="form-select" value={(formData as any).dietary_pattern || ''} onChange={handleChange}>
          <option value="">Select a dietary pattern</option>
          <option value="standard">Standard</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="paleo">Paleo</option>
          <option value="keto">Keto</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="allergies" className="form-label">Allergies (comma-separated)</label>
        <input
          type="text"
          className="form-control"
          id="allergies"
          name="allergies"
          value={formData.allergies ? formData.allergies.join(', ') : ''}
          onChange={handleAllergiesChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="meals_per_day" className="form-label">Meals Per Day:</label>
        <input type="number" id="meals_per_day" name="meals_per_day" className="form-control" value={(formData as any).meals_per_day || ''} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="cooking_skill" className="form-label">Cooking Skill:</label>
        <select id="cooking_skill" name="cooking_skill" className="form-select" value={(formData as any).cooking_skill || ''} onChange={handleChange}>
          <option value="">Select your cooking skill</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Profile Completeness</label>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{width: `${completeness}%`}} aria-valuenow={completeness} aria-valuemin={0} aria-valuemax={100}>{completeness.toFixed(0)}%</div>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary" disabled={loading || completeness < 90}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;