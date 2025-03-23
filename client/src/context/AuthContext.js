import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const result = await authService.validateToken();
          if (result.success) {
            setUser(result.data.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        setUser(result.data.user);
        setIsAuthenticated(true);
        setError(null);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      const result = await authService.register({ username, email, password });
      
      if (result.success) {
        setError(null);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  const value = {
    isAuthenticated,
    user,
    error,
    login,
    register,
    logout,
    updateUserInfo: (userData) => {
      setUser(userData);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 