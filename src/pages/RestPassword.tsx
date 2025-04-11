import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const { resetToken } = useParams<{ resetToken: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'gray'
  });

  useEffect(() => {
    // Optionally verify token validity on page load
    const verifyToken = async () => {
      if (!resetToken) {
        setTokenValid(false);
        setMessage({ type: 'error', text: 'Invalid password reset link' });
        return;
      }
      
      // You would need to implement this endpoint on your backend
      // try {
      //   await api.get(`/auth/verifyResetToken/${resetToken}`);
      // } catch (err) {
      //   setTokenValid(false);
      //   setMessage({ type: 'error', text: 'This password reset link is invalid or has expired' });
      // }
    };
    
    verifyToken();
  }, [resetToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Clear any previous messages
    setMessage(null);
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({ score: 0, message: '', color: 'gray' });
      return;
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set message and color based on score
    let message = '';
    let color = '';
    
    switch (score) {
      case 0:
        message = 'Weak';
        color = 'red-500';
        break;
      case 1:
        message = 'Weak';
        color = 'red-500';
        break;
      case 2:
        message = 'Fair';
        color = 'yellow-500';
        break;
      case 3:
        message = 'Good';
        color = 'blue-500';
        break;
      case 4:
        message = 'Strong';
        color = 'green-500';
        break;
      default:
        message = '';
        color = 'gray';
    }
    
    setPasswordStrength({ score, message, color });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const validateForm = () => {
    if (!resetToken) {
      setMessage({ type: 'error', text: 'Invalid password reset token' });
      return false;
    }
    
    if (!formData.password) {
      setMessage({ type: 'error', text: 'Password is required' });
      return false;
    }
    
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post(`/auth/resetPassword/${resetToken}`, {
        password: formData.password
      });
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Password has been reset successfully. You can now log in with your new password.'
        });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to reset password. Please try again.' });
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (err.response.data.message === 'Invalid or Expired Token') {
          setTokenValid(false);
        }
        setMessage({ type: 'error', text: err.response.data.message || 'Failed to reset password. Please try again.' });
      } else {
        setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again later.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Invalid or Expired Link</h1>
          <p className="mb-6 text-gray-600">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </p>
          <Link
            to="/forgot-password"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Reset Your Password</h1>
        
        <p className="mb-4 text-sm text-gray-600 text-center">
          Enter your new password below.
        </p>

        {message && (
          <div 
            className={`p-3 mb-4 text-sm rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`} 
            role="alert"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.password && passwordStrength.message && (
              <div className="mt-1">
                <div className="h-1 w-full bg-gray-200 rounded">
                  <div 
                    className={`h-1 rounded bg-${passwordStrength.color}`} 
                    style={{ width: `${25 * passwordStrength.score}%` }}
                  ></div>
                </div>
                <p className={`text-xs mt-1 text-${passwordStrength.color}`}>
                  {passwordStrength.message}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;