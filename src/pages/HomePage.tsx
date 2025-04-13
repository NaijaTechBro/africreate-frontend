import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Content, User } from '../types';
import ContentCard from '../components/Contentcard';
import CreatorCard from '../components/CreatorCard';

const HomePage: React.FC = () => {
  const [trendingContent, setTrendingContent] = useState<Content[]>([]);
  const [popularCreators, setPopularCreators] = useState<User[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch trending content
        // Note: The correct endpoint is /trending, not /content/trending
        const contentRes = await api.get('/trending', {
          params: { category: selectedCategory !== 'all' ? selectedCategory : undefined }
        });
        setTrendingContent(contentRes.data.contents || []);
        
        // Fetch popular creators
        try {
          const creatorsRes = await api.get('/popular-creators');
          setPopularCreators(creatorsRes.data.creators || []);
        } catch (creatorErr) {
          console.error('Error fetching popular creators:', creatorErr);
          setPopularCreators([]);
          // Don't set the main error state here to allow other content to load
        }
        
        // Fetch categories
        try {
          const categoriesRes = await api.get('/categories');
          setCategories(categoriesRes.data.categories || []);
        } catch (categoriesErr) {
          console.error('Error fetching categories:', categoriesErr);
          setCategories([]);
          // Don't set the main error state here to allow other content to load
        }
        
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Unable to load content. Please try again later.');
        setTrendingContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [selectedCategory]);

  return (
    <div className="container p-4 mx-auto">
      {/* Hero Section */}
      <div className="p-8 mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl text-white">
        <h1 className="mb-4 text-4xl font-bold">Welcome to AfriCreators</h1>
        <p className="mb-6 text-xl">Discover and support African creators</p>
        <div className="flex justify-center space-x-4">
          <Link to="/register" className="px-6 py-3 font-medium text-blue-600 bg-white rounded-md hover:bg-blue-50">
            Join Now
          </Link>
          <Link to="/explore" className="px-6 py-3 font-medium bg-transparent border border-white rounded-md hover:bg-white/10">
            Explore Content
          </Link>
        </div>
      </div>
      
      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Browse Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Trending Content */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Trending Content</h2>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="inline-block w-8 h-8 border-4 rounded-full border-t-blue-500 animate-spin"></div>
            <span className="ml-3">Loading trending content...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => setSelectedCategory(selectedCategory)} 
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : trendingContent.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trendingContent.map((content) => (
              <ContentCard key={content._id} content={content} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-600 bg-gray-50 rounded-lg">
            <p>No content available in this category yet.</p>
            <p className="mt-2">Be the first to create content!</p>
            <Link 
              to="/create-content" 
              className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Create Content
            </Link>
          </div>
        )}
      </div>
      
      {/* Popular Creators */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Popular Creators</h2>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="inline-block w-8 h-8 border-4 rounded-full border-t-blue-500 animate-spin"></div>
            <span className="ml-3">Loading popular creators...</span>
          </div>
        ) : popularCreators.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularCreators.map((creator) => (
              <CreatorCard key={creator._id} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-600 bg-gray-50 rounded-lg">
            <p>No popular creators available yet.</p>
            <p className="mt-2">Join now and become one of our first featured creators!</p>
            <Link 
              to="/register" 
              className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Join as Creator
            </Link>
          </div>
        )}
      </div>
      
      {/* How It Works */}
      <div className="p-8 mb-12 bg-gray-50 rounded-xl">
        <h2 className="mb-8 text-2xl font-semibold text-center">How AfriCreators Works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-blue-600 rounded-full">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="mb-2 text-lg font-medium">Create an Account</h3>
            <p className="text-gray-600">Sign up as a creator or subscriber in just a few minutes.</p>
          </div>
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-blue-600 rounded-full">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="mb-2 text-lg font-medium">Share or Subscribe</h3>
            <p className="text-gray-600">Create content or subscribe to your favorite creators.</p>
          </div>
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-blue-600 rounded-full">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="mb-2 text-lg font-medium">Earn or Enjoy</h3>
            <p className="text-gray-600">Monetize your content or enjoy exclusive access to creator content.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;