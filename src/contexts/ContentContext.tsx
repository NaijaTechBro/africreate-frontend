import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { User } from '../types';

// Define types for the content-related data
interface Content {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  likes: string[];
  // Add other content fields as needed
}

interface Comment {
  _id: string;
  text: string;
  user: string | User;
  createdAt: string;
  // Add other comment fields as needed
}

interface Category {
  _id: string;
  name: string;
  // Add other category fields as needed
}

interface ContentContextType {
  trendingContent: Content[];
  creatorContent: Content[];
  categories: Category[];
  currentContent: Content | null;
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchTrendingContent: (category?: string | null) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCreatorContent: () => Promise<void>;
  getContent: (contentId: string) => Promise<Content>;
  likeContent: (contentId: string) => Promise<boolean>;
  unlikeContent: (contentId: string) => Promise<boolean>;
  addComment: (contentId: string, text: string) => Promise<Comment>;
  getComments: (contentId: string) => Promise<Comment[]>;
  createContent: (contentData: Partial<Content>) => Promise<Content>;
  updateContent: (contentId: string, contentData: Partial<Content>) => Promise<Content>;
  deleteContent: (contentId: string) => Promise<boolean>;
  clearError: () => void;
}

// Create the ContentContext
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Custom hook to use the ContentContext
export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// ContentProvider component
export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trendingContent, setTrendingContent] = useState<Content[]>([]);
  const [creatorContent, setCreatorContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error helper function
  const clearError = () => {
    setError(null);
  };

  // Fetch trending content
  const fetchTrendingContent = useCallback(async (category: string | null = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = category ? `/content/trending?category=${category}` : '/content/trending';
      const response = await api.get(url);
      
      setTrendingContent(response.data.contents);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching trending content');
      console.error('Error fetching trending content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch content categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/content/categories');
      setCategories(response.data.categories);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch content by creator (for the logged-in user)
  const fetchCreatorContent = useCallback(async () => {
    if (!user || !user.isCreator) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/creator/me');
      setCreatorContent(response.data.contents);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching creator content');
      console.error('Error fetching creator content:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get single content by ID
  const getContent = useCallback(async (contentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/content/${contentId}`);
      setCurrentContent(response.data.content);
      return response.data.content;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching content');
      console.error('Error fetching content:', err);
      throw err; // Re-throw so the component can handle it
    } finally {
      setLoading(false);
    }
  }, []);

  // Like content
  const likeContent = useCallback(async (contentId: string) => {
    if (!user) throw new Error('User must be logged in');
    
    try {
      setLoading(true);
      await api.post(`/content/${contentId}/like`);
      
      // Update current content if it's the one being liked
      if (currentContent && currentContent._id === contentId) {
        setCurrentContent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            likes: [...prev.likes, user._id]
          };
        });
      }
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error liking content');
      console.error('Error liking content:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentContent]);

  // Unlike content
  const unlikeContent = useCallback(async (contentId: string) => {
    if (!user) throw new Error('User must be logged in');
    
    try {
      setLoading(true);
      await api.delete(`/content/${contentId}/unlike`);
      
      // Update current content if it's the one being unliked
      if (currentContent && currentContent._id === contentId) {
        setCurrentContent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            likes: prev.likes.filter(id => id !== user._id)
          };
        });
      }
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error unliking content');
      console.error('Error unliking content:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentContent]);

  // Add comment to content
  const addComment = useCallback(async (contentId: string, text: string) => {
    if (!user) throw new Error('User must be logged in');
    if (!text.trim()) throw new Error('Comment text cannot be empty');
    
    try {
      setLoading(true);
      const response = await api.post(`/content/${contentId}/comment`, { text });
      
      // Update comments if we're viewing the content being commented on
      if (currentContent && currentContent._id === contentId) {
        setComments(prev => [response.data.comment, ...prev]);
      }
      
      return response.data.comment;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error adding comment');
      console.error('Error adding comment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentContent]);

  // Get comments for content
  const getComments = useCallback(async (contentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/content/${contentId}/comments`);
      setComments(response.data.comments);
      return response.data.comments;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error getting comments');
      console.error('Error getting comments:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new content (for creators)
  const createContent = useCallback(async (contentData: Partial<Content>) => {
    if (!user || !user.isCreator) throw new Error('User must be a creator');
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/content', contentData);
      
      // Update creator content list with the new content
      setCreatorContent(prev => [response.data.content, ...prev]);
      
      return response.data.content;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating content');
      console.error('Error creating content:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update existing content
  const updateContent = useCallback(async (contentId: string, contentData: Partial<Content>) => {
    if (!user || !user.isCreator) throw new Error('User must be a creator');
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/content/${contentId}`, contentData);
      
      // Update creator content list
      setCreatorContent(prev => prev.map(content => 
        content._id === contentId ? response.data.content : content
      ));
      
      // Update current content if it's the one being updated
      if (currentContent && currentContent._id === contentId) {
        setCurrentContent(response.data.content);
      }
      
      return response.data.content;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating content');
      console.error('Error updating content:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentContent]);

  // Delete content
  const deleteContent = useCallback(async (contentId: string) => {
    if (!user || !user.isCreator) throw new Error('User must be a creator');
    
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/content/${contentId}`);
      
      // Update creator content list
      setCreatorContent(prev => prev.filter(content => content._id !== contentId));
      
      // Clear current content if it's the one being deleted
      if (currentContent && currentContent._id === contentId) {
        setCurrentContent(null);
      }
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting content');
      console.error('Error deleting content:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentContent]);

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchTrendingContent();
  }, [fetchCategories, fetchTrendingContent]);

  // Load creator content when user is logged in and is a creator
  useEffect(() => {
    if (user && user.isCreator) {
      fetchCreatorContent();
    }
  }, [user, fetchCreatorContent]);

  // Context value
  const value = {
    trendingContent,
    creatorContent,
    categories,
    currentContent,
    comments,
    loading,
    error,
    fetchTrendingContent,
    fetchCategories,
    fetchCreatorContent,
    getContent,
    likeContent,
    unlikeContent,
    addComment,
    getComments,
    createContent,
    updateContent,
    deleteContent,
    clearError
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentContext;