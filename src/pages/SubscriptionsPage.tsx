import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Subscription } from '../types';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await api.get('/subscriptions/user');
        setSubscriptions(response.data.subscriptions);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  return (
    <div className="container p-4 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Subscriptions</h1>
        <p className="text-gray-600">Manage your subscriptions to creators</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading your subscriptions...</p>
          </div>
        </div>
      ) : subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((subscription) => {
            const creator = typeof subscription.creator === 'object' ? subscription.creator : { username: 'Creator' };
            const tier = typeof subscription.tier === 'object' ? subscription.tier : { name: 'Standard' };
            
            return (
              <div key={subscription._id} className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <img
                      src={creator.profilePicture || '/user-placeholder.jpg'}
                      alt={creator.username}
                      className="w-12 h-12 mr-4 rounded-full"
                    />
                    <div>
                      <Link to={`/profile/${creator.username}`} className="font-medium text-lg hover:text-blue-600">
                        {creator.username}
                      </Link>
                      <p className="text-sm text-gray-500">{tier.name} Tier</p>
                    </div>
                  </div>
                  
                  <div className="p-3 mb-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`text-sm font-medium ${subscription.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {subscription.isActive ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Price</span>
                      <span className="text-sm font-medium">
                        {subscription.currency} {subscription.price.toFixed(2)}/month
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Started</span>
                      <span className="text-sm">{new Date(subscription.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Renews</span>
                      <span className="text-sm">{new Date(subscription.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Link to={`/profile/${creator.username}`} className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                      View Profile
                    </Link>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      {subscription.isActive ? 'Manage Subscription' : 'Renew'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-gray-50 rounded-lg">
          <div className="mb-4 text-4xl text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-medium">No Active Subscriptions</h3>
          <p className="mb-6 text-gray-600">You're not currently subscribed to any creators.</p>
          <Link to="/explore" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Discover Creators
          </Link>
        </div>
      )}
      
      {/* Subscription FAQs */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="mb-4 text-xl font-semibold">Subscription FAQs</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">How do subscriptions work?</h3>
            <p className="text-gray-600">Subscriptions provide you with access to exclusive content from your favorite creators. They renew automatically each month unless canceled.</p>
          </div>
          <div>
            <h3 className="font-medium">How do I cancel a subscription?</h3>
            <p className="text-gray-600">You can cancel your subscription by clicking on "Manage Subscription" and selecting "Cancel". You'll maintain access until the end of your current billing period.</p>
          </div>
          <div>
            <h3 className="font-medium">What payment methods do you accept?</h3>
            <p className="text-gray-600">AfriCreators accepts credit cards, mobile money, and bank transfers depending on your region.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
