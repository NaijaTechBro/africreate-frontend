import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
              AfriCreators
            </Link>
          </div>

          {/* Search Bar (hidden on mobile) */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search creators or content..."
                className="w-full py-2 pl-10 pr-4 bg-gray-100 border-transparent rounded-md focus:outline-none focus:bg-white focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center ml-4 space-x-4">
              <Link to="/explore" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                Explore
              </Link>
              
              {user ? (
                <>
                  {user.isCreator && (
                    <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                      Dashboard
                    </Link>
                  )}
                  <div className="relative group">
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                      <img
                        src={user.profilePicture || '/user-placeholder.jpg'}
                        alt="Profile"
                        className="w-6 h-6 mr-2 rounded-full"
                      />
                      {user.username}
                    </button>
                    <div className="absolute right-0 z-10 invisible w-48 py-1 mt-2 bg-white rounded-md shadow-lg group-hover:visible">
                      <Link to={`/profile/${user.username}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <Link to="/subscriptions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Subscriptions
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>
)}
</button>
</div>
</div>
</div>

{/* Mobile menu */}
{mobileMenuOpen && (
<div className="md:hidden">
<div className="px-2 pt-2 pb-3 space-y-1">
{/* Mobile Search */}
<form onSubmit={handleSearch} className="relative p-2">
<input
type="text"
placeholder="Search creators or content..."
className="w-full py-2 pl-10 pr-4 bg-gray-100 border-transparent rounded-md focus:outline-none focus:bg-white focus:border-blue-500"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
/>
<div className="absolute inset-y-0 left-0 flex items-center pl-5">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
</div>
</form>

<Link 
to="/explore" 
className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
onClick={() => setMobileMenuOpen(false)}
>
Explore
</Link>

{user ? (
<>
<Link 
to={`/profile/${user.username}`} 
className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
onClick={() => setMobileMenuOpen(false)}
>
Your Profile
</Link>

{user.isCreator && (
<Link 
  to="/dashboard" 
  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
  onClick={() => setMobileMenuOpen(false)}
>
  Creator Dashboard
</Link>
)}

<Link 
to="/subscriptions" 
className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
onClick={() => setMobileMenuOpen(false)}
>
Subscriptions
</Link>

<Link 
to="/settings" 
className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
onClick={() => setMobileMenuOpen(false)}
>
Settings
</Link>

<button
onClick={() => {
  logout();
  setMobileMenuOpen(false);
}}
className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-md hover:bg-gray-100"
>
Sign out
</button>
</>
) : (
<>
<Link 
to="/login" 
className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
onClick={() => setMobileMenuOpen(false)}
>
Log in
</Link>

<Link
to="/register"
className="block px-3 py-2 text-base font-medium text-blue-600 rounded-md hover:bg-blue-50"
onClick={() => setMobileMenuOpen(false)}
>
Sign up
</Link>
</>
)}
</div>
</div>
)}
</nav>
);
};

export default Navigation;