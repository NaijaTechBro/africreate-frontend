import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Content, SubscriptionTier } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ContentCard from '../components/Contentcard';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userRes = await api.get(`/users/profile/${username}`);
        setProfileUser(userRes.data.user);
        
        // Fetch user content
        const contentRes = await api.get(`/content/user/${userRes.data.user._id}`);
        setContents(contentRes.data.contents);
        
        // If user is a creator, fetch subscription tiers
        if (userRes.data.user.isCreator) {
          const tiersRes = await api.get(`/users/${userRes.data.user._id}/subscription-tiers`);
          setTiers(tiersRes.data.tiers);
        }
        
        // Check if current user is subscribed to this creator
        if (currentUser && userRes.data.user.isCreator) {
          try {
            const subRes = await api.get(`/subscriptions/check/${userRes.data.user._id}`);
            setIsSubscribed(subRes.data.isSubscribed);
          } catch (err) {
            // Not subscribed or error checking
            setIsSubscribed(false);
          }
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, currentUser]);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setShowSubscribeModal(true);
  };

  const confirmSubscription = async () => {
    if (!selectedTier) return;
    
    try {
      await api.post('/subscriptions/create', {
        creatorId: profileUser?._id,
        tierId: selectedTier._id
      });
      
      setIsSubscribed(true);
      setShowSubscribeModal(false);
    } catch (err: any) {
      console.error('Subscription error:', err);
      // Handle error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading profile...</div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="container p-4 mx-auto">
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
          <p>{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div className="h-64 overflow-hidden rounded-t-lg">
          <img
            src={profileUser.coverImage || '/cover-placeholder.jpg'}
            alt="Cover"
            className="object-cover w-full"
          />
        </div>
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-b-lg">
          <div className="flex flex-col items-center md:flex-row">
            <div className="relative -mt-20 md:-mt-16 mb-4 md:mb-0 md:mr-6">
              <img
                src={profileUser.profilePicture || '/user-placeholder.jpg'}
                alt={profileUser.username}
                className="w-32 h-32 border-4 border-white rounded-full"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="mb-1 text-2xl font-bold">{profileUser.username}</h1>
              {profileUser.fullName && <p className="mb-2 text-gray-600">{profileUser.fullName}</p>}
              <p className="mb-4 text-gray-700">{profileUser.bio || 'No bio provided'}</p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4 md:justify-start">
                <div className="text-sm">
                  <span className="font-semibold">{profileUser.followers?.length || 0}</span> followers
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{profileUser.following?.length || 0}</span> following
                </div>
                {profileUser.country && (
                  <div className="text-sm">
                    <span className="font-semibold">From:</span> {profileUser.country}
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-semibold">Joined:</span> {new Date(profileUser.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {currentUser && currentUser._id !== profileUser._id && (
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                    Follow
                  </button>
                  {profileUser.isCreator && !isSubscribed && (
                    <button 
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={() => setShowSubscribeModal(true)}
                    >
                      Subscribe
                    </button>
                  )}
                  {profileUser.isCreator && isSubscribed && (
                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md cursor-default">
                      Subscribed
                    </button>
                  )}
                </div>
              )}
              {currentUser && currentUser._id === profileUser._id && (
                <Link
                  to="/settings"
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
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
          {profileUser.isCreator && (
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'subscribe'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('subscribe')}
            >
              Subscribe
            </button>
          )}
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'content' && (
          <div>
            {contents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {contents.map((content) => (
                  <ContentCard key={content._id} content={content} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600 bg-gray-50 rounded-lg">
                <p>No content available.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'subscribe' && profileUser.isCreator && (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Subscription Tiers</h2>
            {tiers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {tiers.map((tier) => (
                  <div key={tier._id} className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="mb-2 text-lg font-medium">{tier.name}</h3>
                    <p className="mb-4 text-2xl font-bold">
                      {tier.currency} {tier.price}
                      <span className="text-base font-normal text-gray-500">/month</span>
                    </p>
                    <ul className="mb-6 space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    {isSubscribed ? (
                      <button className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md cursor-default">
                        Currently Subscribed
                      </button>
                    ) : (
                      <button
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        onClick={() => handleSubscribe(tier)}
                      >
                        Subscribe
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600 bg-gray-50 rounded-lg">
                <p>No subscription tiers available.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="max-w-3xl">
            <h2 className="mb-4 text-xl font-semibold">About {profileUser.username}</h2>
            
            {profileUser.bio ? (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Bio</h3>
                <p className="text-gray-700">{profileUser.bio}</p>
              </div>
            ) : null}
            
            {profileUser.isCreator && profileUser.creatorDetails?.categories?.length ? (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {profileUser.creatorDetails.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Account Info</h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Joined:</span> {new Date(profileUser.createdAt).toLocaleDateString()}
                </li>
                {profileUser.country && (
                  <li>
                    <span className="font-medium">Country:</span> {profileUser.country}
                  </li>
                )}
                <li>
                  <span className="font-medium">Account Type:</span> {profileUser.isCreator ? 'Creator' : 'Subscriber'}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Subscribe to {profileUser.username}</h2>
            {selectedTier && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">{selectedTier.name}</h3>
                <p className="mb-4">
                  {selectedTier.currency} {selectedTier.price}/month
                </p>
                <p className="mb-4 text-gray-700">
                  By subscribing, you'll get access to exclusive content from {profileUser.username}.
                </p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowSubscribeModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={confirmSubscription}
              >
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;