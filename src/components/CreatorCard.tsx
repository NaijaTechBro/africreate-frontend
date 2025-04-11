import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface CreatorCardProps {
  creator: User;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  return (
    <Link to={`/profile/${creator.username}`} className="block overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-32">
        <img
          src={creator.coverImage || '/cover-placeholder.jpg'}
          alt={`${creator.username}'s cover`}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="relative px-4 pt-12 pb-4 text-center">
        <div className="absolute w-20 h-20 mx-auto transform -translate-x-1/2 border-4 border-white rounded-full -top-10 left-1/2">
          <img
            src={creator.profilePicture || '/user-placeholder.jpg'}
            alt={creator.username}
            className="w-full h-full rounded-full"
          />
        </div>
        <h3 className="mb-1 text-lg font-medium">{creator.username}</h3>
        {creator.fullName && <p className="mb-2 text-sm text-gray-600">{creator.fullName}</p>}
        <p className="mb-3 text-sm line-clamp-2 text-gray-500">{creator.bio || 'African creator on AfriCreators'}</p>
        <div className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full inline-block">
          {creator.followers?.length || 0} followers
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;