import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Content, Subscription } from '../types';

const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    totalRevenue: 0,
    totalContent: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch creator content
        const contentRes = await api.get('/content/creator');
        setContents(contentRes.data.contents);
        
        // Fetch subscriptions
        const subscriptionsRes = await api.get('/subscriptions/creator');
        setSubscriptions(subscriptionsRes.data.subscriptions);
        
        // Fetch stats
        const statsRes = await api.get('/users/creator/stats');
        setStats(statsRes.data.stats);
        
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    if (user?.isCreator) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-4 mx-auto">
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Creator Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Subscribers</h3>
          <p className="mt-1 text-2xl font-semibold">{stats.totalSubscribers}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-1 text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Content Published</h3>
          <p className="mt-1 text-2xl font-semibold">{stats.totalContent}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
  <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="mt-1 text-2xl font-semibold">{stats.totalViews}</p>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'subscribers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('subscribers')}
          >
            Subscribers
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'earnings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Dashboard Overview</h2>
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Recent Activity</h3>
              {/* Activity feed would go here */}
              <div className="p-4 text-gray-600 bg-gray-50">
                <p>Recent subscriber and content interaction activity will appear here.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-medium">Recent Content</h3>
                {contents.length > 0 ? (
                  <ul className="space-y-2">
                    {contents.slice(0, 5).map((content) => (
                      <li key={content._id} className="p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(content.createdAt).toLocaleDateString()} • {content.views} views
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No content published yet.</p>
                )}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium">Recent Subscribers</h3>
                {subscriptions.length > 0 ? (
                  <ul className="space-y-2">
                    {subscriptions.slice(0, 5).map((sub) => (
                      <li key={sub._id} className="p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium">
                          {typeof sub.subscriber === 'object' ? sub.subscriber.username : 'User'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Subscribed on {new Date(sub.startDate).toLocaleDateString()} • ${sub.price}/month
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No subscribers yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'content' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Content</h2>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Create New
              </button>
            </div>
            {contents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="text-sm text-gray-700 bg-gray-50">
                    <tr>
                      <th className="p-4 text-left">Title</th>
                      <th className="p-4 text-left">Type</th>
                      <th className="p-4 text-left">Published</th>
                      <th className="p-4 text-left">Views</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {contents.map((content) => (
                      <tr key={content._id} className="border-b">
                        <td className="p-4">{content.title}</td>
                        <td className="p-4 capitalize">{content.contentType}</td>
                        <td className="p-4">{new Date(content.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">{content.views}</td>
                        <td className="p-4 capitalize">{content.status}</td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                              Edit
                            </button>
                            <button className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600">
                <p className="mb-4">You haven't created any content yet.</p>
                <p>Start sharing your content with your subscribers!</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'subscribers' && (
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Your Subscribers</h2>
            {subscriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="text-sm text-gray-700 bg-gray-50">
                    <tr>
                      <th className="p-4 text-left">Username</th>
                      <th className="p-4 text-left">Subscription Tier</th>
                      <th className="p-4 text-left">Start Date</th>
                      <th className="p-4 text-left">End Date</th>
                      <th className="p-4 text-left">Price</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {subscriptions.map((sub) => (
                      <tr key={sub._id} className="border-b">
                        <td className="p-4">
                          {typeof sub.subscriber === 'object' ? sub.subscriber.username : 'User'}
                        </td>
                        <td className="p-4">
                          {typeof sub.tier === 'object' ? sub.tier.name : 'Standard'}
                        </td>
                        <td className="p-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                        <td className="p-4">{new Date(sub.endDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          {sub.currency} {sub.price.toFixed(2)}/month
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {sub.isActive ? 'Active' : 'Expired'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600">
                <p>You don't have any subscribers yet.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'earnings' && (
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Earnings</h2>
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                <p className="mt-1 text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Current Month</h3>
                <p className="mt-1 text-2xl font-semibold">$0.00</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Available for Withdrawal</h3>
                <p className="mt-1 text-2xl font-semibold">$0.00</p>
              </div>
            </div>
            
            <h3 className="mb-2 text-lg font-medium">Payment History</h3>
            <div className="p-8 text-center text-gray-600 border border-gray-200 rounded-lg">
              <p>No payment history available yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
