import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/client';

const AuthRedirector: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    };

    checkSessionAndRedirect();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return <div>Loading...</div>; // Or a splash screen
};

export default AuthRedirector;