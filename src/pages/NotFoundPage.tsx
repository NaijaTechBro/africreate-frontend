import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-gray-50">
      <div className="max-w-md p-8 text-center">
        <div className="mb-4 text-6xl font-bold text-blue-600">404</div>
        <h1 className="mb-4 text-3xl font-bold">Page Not Found</h1>
        <p className="mb-8 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Home
          </Link>
          <Link
            to="/explore"
            className="px-6 py-3 font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Explore Content
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
