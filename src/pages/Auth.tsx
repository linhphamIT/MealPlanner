import React, { useState } from 'react';
import { supabase } from '../api/client'; // Assuming supabase client is exported from here
import { AuthForm } from '../components/auth/AuthForm';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (email: string, password: string, username?: string) => {
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        console.log('Logged in:', data);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        console.log('Signed up:', data);
        // Optionally, save username to profiles table after signup
        if (username && data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            user_id: data.user.id,
            email: data.user.email,
            name: username, // Assuming 'name' in profiles table is for username
          });
          if (profileError) throw profileError;
        }
      }
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error: any) {
      alert(error.message);
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            </div>
            <div className="card-body">
              <AuthForm isLogin={isLogin} onSubmit={handleAuth} />
              <p className="text-center mt-3">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <span
                  className="text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;