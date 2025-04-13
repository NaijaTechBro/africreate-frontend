import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Content, Comment, User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const ContentPage: React.FC = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setLoading(true);
        
        // Fetch content details
        const contentRes = await api.get(`/content/${contentId}`);
        setContent(contentRes.data.content);
        setLikeCount(contentRes.data.content.likes?.length || 0);
        
        // Check if current user has liked this content
        if (user && contentRes.data.content.likes) {
          setIsLiked(contentRes.data.content.likes.includes(user._id));
        }
        
        // Fetch creator details
        const creatorRes = await api.get(`/users/${contentRes.data.content.creator}`);
        setCreator(creatorRes.data.user);
        
        // Check if current user is subscribed to the creator
        if (user && creatorRes.data.user._id) {
          try {
            const subRes = await api.get(`/subscriptions/check/${creatorRes.data.user._id}`);
            setIsSubscribed(subRes.data.isSubscribed);
          } catch (err) {
            setIsSubscribed(false);
          }
        }
        
        // Fetch comments
        const commentsRes = await api.get(`/content/${contentId}/comments`);
        setComments(commentsRes.data.comments);
        
        setLoading(false);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to load content';
        setError(message);
        setLoading(false);
        
        // If content requires subscription and user is not subscribed, redirect
        if (err.response?.status === 403) {
          navigate(`/profile/${creator?.username}`);
        }
      }
    };

    fetchContentData();
  }, [contentId, user, navigate, creator?.username]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await api.delete(`/content/${contentId}/unlike`);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await api.post(`/content/${contentId}/like`);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !user) return;
    
    try {
      const res = await api.post(`/content/${contentId}/comment`, {
        text: commentText
      });
      
      setComments([res.data.comment, ...comments]);
      setCommentText('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading content...</div>
      </div>
    );
  }

  if (error || !content || !creator) {
    return (
      <div className="container p-4 mx-auto">
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
          <p>{error || 'Content not found'}</p>
          <Link to="/" className="mt-2 text-blue-600 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* Content Header */}
        <div className="mb-6">
          <h1 className="mb-4 text-3xl font-bold">{content.title}</h1>
          <div className="flex items-center mb-6">
            <Link to={`/profile/${creator.username}`} className="flex items-center mr-4">
              <img
                src={creator.profilePicture || '/user-placeholder.jpg'}
                alt={creator.username}
                className="w-10 h-10 mr-2 rounded-full"
              />
              <span className="font-medium">{creator.username}</span>
            </Link>
            <span className="mr-4 text-gray-500">
              {formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}
            </span>
            {content.category && (
              <Link
                to={`/category/${content.category.toLowerCase()}`}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
              >
                {content.category}
              </Link>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="mb-8">
          {content.contentType === 'image' && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img 
                src={content.mediaUrl} 
                alt={content.title} 
                className="w-full object-cover"
              />
            </div>
          )}
          
          {content.contentType === 'video' && (
            <div className="mb-6 overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
              <video 
                src={content.mediaUrl} 
                controls
                className="w-full"
                poster={content.thumbnailUrl}
              />
            </div>
          )}
          
          {content.contentType === 'audio' && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <audio 
                src={content.mediaUrl} 
                controls
                className="w-full"
              />
            </div>
          )}
          
          <div className="mb-6 prose max-w-none">
            <p>{content.description}</p>
          </div>
          {/* Interaction Section */}
          <div className="flex items-center justify-between py-4 mb-6 border-t border-b">
            <div className="flex items-center gap-6">
              <button 
                className={`flex items-center gap-2 ${isLiked ? 'text-red-600' : 'text-gray-700'}`}
                onClick={handleLike}
              >
                <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likeCount} Likes</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{comments.length} Comments</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
            <div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Tip Creator
              </button>
            </div>
          </div>
        </div>

        {/* Creator Card */}
        <div className="p-6 mb-8 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            <Link to={`/profile/${creator.username}`} className="mb-4 sm:mb-0 sm:mr-6">
              <img
                src={creator.profilePicture || '/user-placeholder.jpg'}
                alt={creator.username}
                className="w-20 h-20 rounded-full"
              />
            </Link>
            <div className="flex-1 text-center sm:text-left">
              <Link to={`/profile/${creator.username}`} className="text-xl font-bold">
                {creator.username}
              </Link>
              <p className="mb-3 text-gray-600">{creator.bio?.substring(0, 120)}...</p>
              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                <div className="text-sm">
                  <span className="font-semibold">{creator.followers?.length || 0}</span> followers
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{creator.contentCount || 0}</span> posts
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              {user && user._id !== creator._id && (
                isSubscribed ? (
                  <Link
                    to={`/profile/${creator.username}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md"
                  >
                    Subscribed
                  </Link>
                ) : (
                  <Link
                    to={`/profile/${creator.username}?tab=subscribe`}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Subscribe
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Comments</h2>
          
          {user ? (
            <form onSubmit={handleComment} className="mb-6">
              <div className="mb-3">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 mb-6 text-center bg-gray-50 rounded-lg">
              <p className="mb-2">Sign in to leave a comment</p>
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          )}
          
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="pb-4 border-b border-gray-200">
                  <div className="flex items-start mb-2">
                    <Link to={`/profile/${comment.user.username}`} className="mr-3">
                      <img
                        src={comment.user.profilePicture || '/user-placeholder.jpg'}
                        alt={comment.user.username}
                        className="w-10 h-10 rounded-full"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <Link to={`/profile/${comment.user.username}`} className="mr-2 font-medium">
                          {comment.user.username}
                        </Link>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-800">{comment.text}</p>
                    </div>
                  </div>
                  <div className="flex items-center ml-12 text-sm text-gray-500">
                    <button className="mr-4 hover:text-gray-700">Like</button>
                    <button className="hover:text-gray-700">Reply</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;