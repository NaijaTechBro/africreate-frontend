import React from 'react';
import { Link } from 'react-router-dom';
import { Content } from '../types';

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const creator = typeof content.creator === 'object' ? content.creator : { username: 'Creator' };
  
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/content/${content._id}`}>
        <div className="relative pb-[56.25%]">
          <img
            src={content.thumbnailUrl || '/placeholder-image.jpg'}
            alt={content.title}
            className="absolute object-cover w-full h-full"
          />
          {content.contentType === 'video' && (
            <div className="absolute flex items-center justify-center w-10 h-10 text-white bg-black bg-opacity-50 rounded-full top-2 right-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          {content.isExclusive && (
            <div className="absolute px-2 py-1 text-xs font-medium text-white bg-purple-600 rounded top-2 left-2">
              Exclusive
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/content/${content._id}`} className="hover:text-blue-600">
          <h3 className="mb-2 text-lg font-medium line-clamp-2">{content.title}</h3>
        </Link>
        <Link to={`/profile/${creator.username}`} className="flex items-center mb-2 group">
          {/* <img
            src={User.profilePicture || '/user-placeholder.jpg'}
            alt={creator.username}
            className="w-8 h-8 mr-2 rounded-full"
          /> */}
          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
            {creator.username}
          </span>
        </Link>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{new Date(content.createdAt).toLocaleDateString()}</span>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            {content.views}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;