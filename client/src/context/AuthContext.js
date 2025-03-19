import React, { createContext, useState, useCallback } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    try {
      const result = await authService.login({ email, password });
      
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

  const value = {
    isAuthenticated,
    user,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 