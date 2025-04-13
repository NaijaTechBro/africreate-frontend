import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string, isCreator: boolean, name: string) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (resetToken: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refetchUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/creator/me');
          setUser(response.data.user);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, [token]);
  
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setError(null);
      
      return response.data.user;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (username: string, email: string, password: string, isCreator: boolean, name: string) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password, 
        isCreator,
        name
      });
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      await api.get('/logout');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/forgotPassword', { email });
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process forgot password request');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (resetToken: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.put(`/auth/resetPassword/${resetToken}`, { password });
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const response = await api.put('/users/update', userData);
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const refetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/refetch');
      if (response.data.user) {
        setUser(response.data.user);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refetch user data');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      forgotPassword, 
      resetPassword, 
      updateUser,
      refetchUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};