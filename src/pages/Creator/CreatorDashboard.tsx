// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../../services/api';
// import { Content, Subscription } from '../../types';

// const CreatorDashboard: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [contents, setContents] = useState<Content[]>([]);
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [stats, setStats] = useState({
//     totalSubscribers: 0,
//     totalRevenue: 0,
//     totalContent: 0,
//     totalViews: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch creator content
//         const contentRes = await api.get('/content/creator');
//         setContents(contentRes.data.contents);
        
//         // Fetch subscriptions
//         const subscriptionsRes = await api.get('/subscriptions/creator');
//         setSubscriptions(subscriptionsRes.data.subscriptions);
        
//         // Fetch stats
//         const statsRes = await api.get('/users/creator/stats');
//         setStats(statsRes.data.stats);
        
//         setLoading(false);
//       } catch (err: any) {
//         setError(err.response?.data?.message || 'Failed to load dashboard data');
//         setLoading(false);
//       }
//     };

//     if (user?.isCreator) {
//       fetchDashboardData();
//     } else {
//       navigate('/');
//     }
//   }, [user, navigate]);

//   const handleCreateNew = () => {
//     navigate('/create-content');
//   };

//   const handleEditContent = (contentId: string) => {
//     navigate(`/edit-content/${contentId}`);
//   };

//   const handleDeleteContent = async (contentId: string) => {
//     if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
//       try {
//         await api.delete(`/content/${contentId}`);
//         // Remove content from state
//         setContents(contents.filter(content => content._id !== contentId));
//         // Update stats
//         setStats(prev => ({
//           ...prev,
//           totalContent: prev.totalContent - 1
//         }));
//       } catch (err: any) {
//         setError(err.response?.data?.message || 'Failed to delete content');
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-lg font-semibold">Loading dashboard...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container p-4 mx-auto">
//         <div className="p-4 text-red-700 bg-red-100 rounded-lg">
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container p-4 mx-auto">
//       <h1 className="mb-6 text-2xl font-bold">Creator Dashboard</h1>
      
//       {/* Stats Overview with improved styling */}
//       <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
//         <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-blue-500">
//           <h3 className="text-sm font-medium text-gray-500">Total Subscribers</h3>
//           <p className="mt-1 text-2xl font-semibold">{stats.totalSubscribers}</p>
//         </div>
//         <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-green-500">
//           <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
//           <p className="mt-1 text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
//         </div>
//         <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-purple-500">
//           <h3 className="text-sm font-medium text-gray-500">Content Published</h3>
//           <p className="mt-1 text-2xl font-semibold">{stats.totalContent}</p>
//         </div>
//         <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-yellow-500">
//           <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
//           <p className="mt-1 text-2xl font-semibold">{stats.totalViews}</p>
//         </div>
//       </div>
      
//       {/* Tab Navigation */}
//       <div className="mb-6 border-b border-gray-200">
//         <nav className="flex -mb-px">
//           <button
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'overview'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'content'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab('content')}
//           >
//             Content
//           </button>
//           <button
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'subscribers'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab('subscribers')}
//           >
//             Subscribers
//           </button>
//           <button
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'earnings'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//             onClick={() => setActiveTab('earnings')}
//           >
//             Earnings
//           </button>
//         </nav>
//       </div>
      
//       {/* Tab Content */}
//       <div className="bg-white rounded-lg shadow-md">
//         {activeTab === 'overview' && (
//           <div className="p-6">
//             <h2 className="mb-4 text-xl font-semibold">Dashboard Overview</h2>
//             <div className="mb-6">
//               <h3 className="mb-2 text-lg font-medium">Recent Activity</h3>
//               {/* Activity feed would go here */}
//               <div className="p-4 text-gray-600 bg-gray-50 rounded-lg">
//                 <p>Recent subscriber and content interaction activity will appear here.</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               <div>
//                 <h3 className="mb-2 text-lg font-medium">Recent Content</h3>
//                 {contents.length > 0 ? (
//                   <ul className="space-y-2">
//                     {contents.slice(0, 5).map((content) => (
//                       <li key={content._id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
//                         <h4 className="font-medium">{content.title}</h4>
//                         <p className="text-sm text-gray-500">
//                           {new Date(content.createdAt).toLocaleDateString()} • {content.views} views
//                         </p>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="p-4 text-gray-600 bg-gray-50 rounded-lg">
//                     <p>No content published yet.</p>
//                     <button 
//                       onClick={handleCreateNew}
//                       className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                     >
//                       Create Your First Content
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <h3 className="mb-2 text-lg font-medium">Recent Subscribers</h3>
//                 {subscriptions.length > 0 ? (
//                   <ul className="space-y-2">
//                     {subscriptions.slice(0, 5).map((sub) => (
//                       <li key={sub._id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
//                         <h4 className="font-medium">
//                           {typeof sub.subscriber === 'object' ? sub.subscriber.username : 'User'}
//                         </h4>
//                         <p className="text-sm text-gray-500">
//                           Subscribed on {new Date(sub.startDate).toLocaleDateString()} • ${sub.price}/month
//                         </p>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="p-4 text-gray-600 bg-gray-50 rounded-lg">No subscribers yet.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
        
//         {activeTab === 'content' && (
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold">Your Content</h2>
//               <button 
//                 onClick={handleCreateNew}
//                 className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Create New
//               </button>
//             </div>
//             {contents.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full table-auto">
//                   <thead className="text-sm text-gray-700 bg-gray-50">
//                     <tr>
//                       <th className="p-4 text-left">Title</th>
//                       <th className="p-4 text-left">Type</th>
//                       <th className="p-4 text-left">Published</th>
//                       <th className="p-4 text-left">Views</th>
//                       <th className="p-4 text-left">Status</th>
//                       <th className="p-4 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                     {contents.map((content) => (
//                       <tr key={content._id} className="border-b hover:bg-gray-50">
//                         <td className="p-4">
//                           <Link to={`/content/${content._id}`} className="hover:text-blue-600">
//                             {content.title}
//                           </Link>
//                         </td>
//                         <td className="p-4 capitalize">{content.contentType}</td>
//                         <td className="p-4">{new Date(content.createdAt).toLocaleDateString()}</td>
//                         <td className="p-4">{content.views}</td>
//                         <td className="p-4">
//                           <span className={`px-2 py-1 text-xs rounded-full ${
//                             content.status === 'published' 
//                               ? 'bg-green-100 text-green-800' 
//                               : content.status === 'draft'
//                               ? 'bg-gray-100 text-gray-800'
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {content.status || 'Published'}
//                           </span>
//                         </td>
//                         <td className="p-4">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleEditContent(content._id)}
//                               className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 flex items-center"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                               </svg>
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDeleteContent(content._id)}
//                               className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 flex items-center"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                               </svg>
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
//                 <p className="mb-4">You haven't published any content yet.</p>
//                 <button 
//                   onClick={handleCreateNew}
//                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                 >
//                   Create Your First Content
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
        
//         {activeTab === 'subscribers' && (
//           <div className="p-6">
//             <h2 className="mb-4 text-xl font-semibold">Your Subscribers</h2>
//             {subscriptions.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full table-auto">
//                   <thead className="text-sm text-gray-700 bg-gray-50">
//                     <tr>
//                       <th className="p-4 text-left">Subscriber</th>
//                       <th className="p-4 text-left">Start Date</th>
//                       <th className="p-4 text-left">Next Billing</th>
//                       <th className="p-4 text-left">Amount</th>
//                       <th className="p-4 text-left">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                     {subscriptions.map((sub) => (
//                       <tr key={sub._id} className="border-b hover:bg-gray-50">
//                         <td className="p-4">
//                           <div className="flex items-center">
//                             <img 
//                               src={typeof sub.subscriber === 'object' ? sub.subscriber.profilePicture || '/user-placeholder.jpg' : '/user-placeholder.jpg'} 
//                               alt="User" 
//                               className="w-8 h-8 mr-3 rounded-full"
//                             />
//                             <div>
//                               <p className="font-medium">{typeof sub.subscriber === 'object' ? sub.subscriber.username : 'User'}</p>
//                               <p className="text-xs text-gray-500">{typeof sub.subscriber === 'object' ? sub.subscriber.email : ''}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4">{new Date(sub.startDate).toLocaleDateString()}</td>
//                         <td className="p-4">{new Date(sub.nextBillingDate).toLocaleDateString()}</td>
//                         <td className="p-4">${sub.price}/month</td>
//                         <td className="p-4">
//                           <span className={`px-2 py-1 text-xs rounded-full ${
//                             sub.status === 'active' 
//                               ? 'bg-green-100 text-green-800' 
//                               : sub.status === 'canceled'
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {sub.status || 'Active'}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
//                 <p>You don't have any subscribers yet.</p>
//                 <p className="mt-2">Create engaging content to attract subscribers!</p>
//               </div>
//             )}
//           </div>
//         )}
        
//         {activeTab === 'earnings' && (
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold">Your Earnings</h2>
//               <div className="flex items-center">
//                 <div className="mr-4">
//                   <label htmlFor="period" className="block text-sm font-medium text-gray-700">Period</label>
//                   <select 
//                     id="period" 
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                     defaultValue="month"
//                   >
//                     <option value="week">Last 7 days</option>
//                     <option value="month">Last 30 days</option>
//                     <option value="year">Last 12 months</option>
//                     <option value="all">All time</option>
//                   </select>
//                 </div>
//                 <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
//                   Download Report
//                 </button>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
//               <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
//                 <p className="mt-1 text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
//                 <div className="mt-1 text-sm text-green-600">+5.3% from last month</div>
//               </div>
//               <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-500">Subscription Revenue</h3>
//                 <p className="mt-1 text-2xl font-semibold">${(stats.totalRevenue * 0.85).toFixed(2)}</p>
//                 <div className="mt-1 text-sm text-green-600">+3.2% from last month</div>
//               </div>
//               <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-500">Tips & Donations</h3>
//                 <p className="mt-1 text-2xl font-semibold">${(stats.totalRevenue * 0.15).toFixed(2)}</p>
//                 <div className="mt-1 text-sm text-green-600">+12.7% from last month</div>
//               </div>
//             </div>
            
//             <div className="mb-6">
//               <h3 className="mb-4 text-lg font-medium">Revenue Overview</h3>
//               <div className="p-4 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//                 <p className="text-gray-500">Revenue chart will appear here</p>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="mb-4 text-lg font-medium">Recent Transactions</h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full table-auto">
//                   <thead className="text-sm text-gray-700 bg-gray-50">
//                     <tr>
//                       <th className="p-4 text-left">Date</th>
//                       <th className="p-4 text-left">User</th>
//                       <th className="p-4 text-left">Type</th>
//                       <th className="p-4 text-left">Content</th>
//                       <th className="p-4 text-left">Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                     {subscriptions.slice(0, 5).map((sub, index) => (
//                       <tr key={index} className="border-b hover:bg-gray-50">
//                         <td className="p-4">{new Date(sub.startDate).toLocaleDateString()}</td>
//                         <td className="p-4">
//                           <div className="flex items-center">
//                             <img 
//                               src={typeof sub.subscriber === 'object' ? sub.subscriber.profilePicture || '/user-placeholder.jpg' : '/user-placeholder.jpg'} 
//                               alt="User" 
//                               className="w-8 h-8 mr-2 rounded-full"
//                             />
//                             <span>{typeof sub.subscriber === 'object' ? sub.subscriber.username : 'User'}</span>
//                           </div>
//                         </td>
//                         <td className="p-4">Subscription</td>
//                         <td className="p-4">-</td>
//                         <td className="p-4 font-medium text-green-600">+${sub.price}</td>
//                       </tr>
//                     ))}
//                     {/* Add some dummy tip transactions */}
//                     <tr className="border-b hover:bg-gray-50">
//                       <td className="p-4">{new Date(Date.now() - 86400000 * 2).toLocaleDateString()}</td>
//                       <td className="p-4">
//                         <div className="flex items-center">
//                           <img src="/user-placeholder.jpg" alt="User" className="w-8 h-8 mr-2 rounded-full" />
//                           <span>SupportiveFan</span>
//                         </div>
//                       </td>
//                       <td className="p-4">Tip</td>
//                       <td className="p-4">{contents[0]?.title || "My Best Content"}</td>
//                       <td className="p-4 font-medium text-green-600">+$5.00</td>
//                     </tr>
//                     <tr className="border-b hover:bg-gray-50">
//                       <td className="p-4">{new Date(Date.now() - 86400000 * 5).toLocaleDateString()}</td>
//                       <td className="p-4">
//                         <div className="flex items-center">
//                           <img src="/user-placeholder.jpg" alt="User" className="w-8 h-8 mr-2 rounded-full" />
//                           <span>BigTipper</span>
//                         </div>
//                       </td>
//                       <td className="p-4">Tip</td>
//                       <td className="p-4">-</td>
//                       <td className="p-4 font-medium text-green-600">+$20.00</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreatorDashboard;






import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Content, Subscription } from '../../types';

const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        
        // Fetch creator stats using the new endpoint
        const statsRes = await api.get('/content/creator/stats');
        setStats(statsRes.data.stats);
        
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    if (user?.isCreator) {
      fetchDashboardData();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const handleCreateNew = () => {
    navigate('/create-content');
  };

  const handleEditContent = (contentId: string) => {
    navigate(`/edit-content/${contentId}`);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      try {
        await api.delete(`/content/${contentId}`);
        // Remove content from state
        setContents(contents.filter(content => content._id !== contentId));
        // Update stats
        setStats(prev => ({
          ...prev,
          totalContent: prev.totalContent - 1
        }));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete content');
      }
    }
  };

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
      
      {/* Stats Overview with improved styling */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Subscribers</h3>
          <p className="mt-1 text-2xl font-semibold">{stats.totalSubscribers}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-1 text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Content Published</h3>
          <p className="mt-1 text-2xl font-semibold">{stats.totalContent}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-yellow-500">
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
      <div className="bg-white rounded-lg shadow-md">
        {activeTab === 'overview' && (
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Dashboard Overview</h2>
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Recent Activity</h3>
              {/* Activity feed would go here */}
              <div className="p-4 text-gray-600 bg-gray-50 rounded-lg">
                <p>Recent subscriber and content interaction activity will appear here.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-medium">Recent Content</h3>
                {contents.length > 0 ? (
                  <ul className="space-y-2">
                    {contents.slice(0, 5).map((content) => (
                      <li key={content._id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(content.createdAt).toLocaleDateString()} • {content.views} views
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-gray-600 bg-gray-50 rounded-lg">
                    <p>No content published yet.</p>
                    <button 
                      onClick={handleCreateNew}
                      className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Create Your First Content
                    </button>
                  </div>
                )}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium">Recent Subscribers</h3>
                {subscriptions.length > 0 ? (
                  <ul className="space-y-2">
                    {subscriptions.slice(0, 5).map((sub) => (
                      <li key={sub._id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
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
                  <p className="p-4 text-gray-600 bg-gray-50 rounded-lg">No subscribers yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'content' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Content</h2>
              <button 
                onClick={handleCreateNew}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
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
                      <tr key={content._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <Link to={`/content/${content._id}`} className="hover:text-blue-600">
                            {content.title}
                          </Link>
                        </td>
                        <td className="p-4 capitalize">{content.contentType}</td>
                        <td className="p-4">{new Date(content.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">{content.views}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            content.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : content.status === 'draft'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {content.status || 'Published'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditContent(content._id)}
                              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteContent(content._id)}
                              className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
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
              <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
                <p className="mb-4">You haven't published any content yet.</p>
                <button 
                  onClick={handleCreateNew}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Create Your First Content
                </button>
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
                      <th className="p-4 text-left">Subscriber</th>
                      <th className="p-4 text-left">Start Date</th>
                      <th className="p-4 text-left">Next Billing</th>
                      <th className="p-4 text-left">Amount</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {subscriptions.map((sub) => (
                      <tr key={sub._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <img 
                              src={typeof sub.subscriber === 'object' ? sub.subscriber.profilePicture || '/user-placeholder.jpg' : '/user-placeholder.jpg'} 
                              alt="User" 
                              className="w-8 h-8 mr-3 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{typeof sub.subscriber === 'object' ? sub.subscriber.username : 'User'}</p>
                              <p className="text-xs text-gray-500">{typeof sub.subscriber === 'object' ? sub.subscriber.email : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                        <td className="p-4">{new Date(sub.nextBillingDate).toLocaleDateString()}</td>
                        <td className="p-4">${sub.price}/month</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            sub.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : sub.status === 'canceled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sub.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
                <p>You don't have any subscribers yet.</p>
                <p className="mt-2">Create engaging content to attract subscribers!</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'earnings' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Earnings</h2>
              <div className="flex items-center">
                <div className="mr-4">
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">Period</label>
                  <select 
                    id="period" 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue="month"
                  >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">Last 12 months</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Download Report
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
              <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="mt-1 text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
                <div className="mt-1 text-sm text-green-600">+5.3% from last month</div>
              </div>
              <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Subscription Revenue</h3>
                <p className="mt-1 text-2xl font-semibold">${(stats.totalRevenue * 0.85).toFixed(2)}</p>
                <div className="mt-1 text-sm text-green-600">+3.2% from last month</div>
              </div>
              <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Tips & Donations</h3>
                <p className="mt-1 text-2xl font-semibold">${(stats.totalRevenue * 0.15).toFixed(2)}</p>
                <div className="mt-1 text-sm text-green-600">+12.7% from last month</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-medium">Revenue Overview</h3>
              <div className="p-4 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Revenue chart will appear here</p>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-medium">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="text-sm text-gray-700 bg-gray-50">
                    <tr>
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-left">User</th>
                      <th className="p-4 text-left">Type</th>
                      <th className="p-4 text-left">Content</th>
                      <th className="p-4 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {subscriptions.slice(0, 5).map((sub, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <img 
                              src={typeof sub.subscriber === 'object' ? sub.subscriber.profilePicture || '/user-placeholder.jpg' : '/user-placeholder.jpg'} 
                              alt="User" 
                              className="w-8 h-8 mr-2 rounded-full"
                            />
                            <span>{typeof sub.subscriber === 'object' ? sub.subscriber.username : 'User'}</span>
                          </div>
                        </td>
                        <td className="p-4">Subscription</td>
                        <td className="p-4">-</td>
                        <td className="p-4 font-medium text-green-600">+${sub.price}</td>
                      </tr>
                    ))}
                    {/* Add some dummy tip transactions */}
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">{new Date(Date.now() - 86400000 * 2).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <img src="/user-placeholder.jpg" alt="User" className="w-8 h-8 mr-2 rounded-full" />
                          <span>SupportiveFan</span>
                        </div>
                      </td>
                      <td className="p-4">Tip</td>
                      <td className="p-4">{contents[0]?.title || "My Best Content"}</td>
                      <td className="p-4 font-medium text-green-600">+$5.00</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4">{new Date(Date.now() - 86400000 * 5).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <img src="/user-placeholder.jpg" alt="User" className="w-8 h-8 mr-2 rounded-full" />
                          <span>BigTipper</span>
                        </div>
                      </td>
                      <td className="p-4">Tip</td>
                      <td className="p-4">-</td>
                      <td className="p-4 font-medium text-green-600">+$20.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;