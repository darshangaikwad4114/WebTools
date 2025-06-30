'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('webtools_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Simulate sign up
    const userData = {
      id: Date.now().toString(),
      email,
      user_metadata: { full_name: fullName }
    };
    
    localStorage.setItem('webtools_user', JSON.stringify(userData));
    setUser(userData);
    
    return { data: { user: userData }, error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Simulate sign in
    const userData = {
      id: Date.now().toString(),
      email,
      user_metadata: { full_name: email.split('@')[0] }
    };
    
    localStorage.setItem('webtools_user', JSON.stringify(userData));
    setUser(userData);
    
    return { data: { user: userData }, error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('webtools_user');
    setUser(null);
    return { error: null };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
}