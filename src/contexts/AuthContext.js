import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, signUp as apiSignUp } from '@/services/authService';
import { isAuthenticated, getAuthToken } from '@/services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const token = await getAuthToken();
        // You can decode the JWT token here to get user info if needed
        setUser({ token });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      setUser({ token: response.token });
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await apiSignUp(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      // Here you would typically call an API to update user data
      // For now, we'll just update the local state
      setUser(prev => ({ ...prev, ...userData }));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        signUp,
        logout,
        updateUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
