import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setMessage(null); // Clear any previous messages
  };

  const validateForm = () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/forgotPassword', { email });
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Password reset link has been sent to your email. Please check your inbox.'
        });
        setEmail(''); // Clear the form
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Something went wrong. Please try again.' });
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setMessage({ type: 'error', text: err.response.data.message || 'Failed to send reset email. Please try again.' });
      } else {
        setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again later.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Forgot Password</h1>
        
        <p className="mb-4 text-sm text-gray-600 text-center">
          Enter your email address and we'll send you a link to reset your password.
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
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;