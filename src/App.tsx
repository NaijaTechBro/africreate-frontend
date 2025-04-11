import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import ProfilePage from './pages/ProfilePage';
import CreatorDashboard from './pages/CreatorDashboard';
import ContentPage from './pages/ContentPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const CreatorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || !user.isCreator) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
            <Route 
              path="/profile/:username" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <CreatorRoute>
                  <CreatorDashboard />
                </CreatorRoute>
              } 
            />
            <Route 
              path="/content/:contentId" 
              element={
                <ProtectedRoute>
                  <ContentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscriptions" 
              element={
                <ProtectedRoute>
                  <SubscriptionsPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;