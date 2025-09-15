import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../api/client';
import { UserProfile } from '../types/profile';
import { getProfile, createProfile } from '../api/profileApi';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const darkBlue = '#00008B';
  const headerStyle = {
    backgroundColor: darkBlue,
    color: 'white',
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const existingProfile = await getProfile(user.id);
        if (existingProfile) {
          setProfile(existingProfile);
        } else {
          const newProfileData: Omit<UserProfile, 'id'> = {
            user_id: user.id,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'New User',
            age: 0, sex: '', height_cm: 0, weight_kg: 0, goal: '',
            activity_level: '', dietary_pattern: '', allergies: [],
            intolerances: [], disliked_foods: [], favorite_foods: [],
            meals_per_day: 0, cooking_skill: '',
            constraints: { time_per_meal_min: 0, budget_level: '', equipment: [] },
            macro_targets: { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
            preferences: { cuisines: [] },
            notes: '',
          };
          const createdProfile = await createProfile(newProfileData as UserProfile);
          if (createdProfile) {
            setProfile(createdProfile);
          } else {
            console.error("Failed to create profile.");
          }
        }
      } else {
        navigate('/auth');
      }
      setLoading(false);
    };
    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={headerStyle}>
        <div className="container" style={{ maxWidth: '80%' }}>
          <Link className="navbar-brand" to="/dashboard">Meal Planner</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/onboarding" state={{ profile }}>Profile</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-link nav-link text-white">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>
        <Outlet context={{ profile, setProfile }} />
      </main>
    </div>
  );
};

export default Layout;