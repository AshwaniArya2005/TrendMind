import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/config';
import { signOut as firebaseSignOut } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      setAuthError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    isAuthenticated: !!currentUser,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 