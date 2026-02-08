import React, { useState } from 'react';
import Sessions from './pages/Sessions';
import Login from './loginPage/Login';
import ProfileView from './features/profile/components/ProfileView';
import FriendsPanel from './components/FriendsPanel';

function App() {
  // Initialize user from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('studybuddy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentPage, setCurrentPage] = useState('sessions'); // 'sessions' or 'profile'
  const [showFriendsPanel, setShowFriendsPanel] = useState(false);

  // Handle login
  const handleLogin = (user) => {
    localStorage.setItem('studybuddy_user', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentPage('sessions');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('studybuddy_user');
    setCurrentUser(null);
    setCurrentPage('sessions');
  };

  // If not logged in, show login page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Build user data for ProfileView from logged in user
  const userData = {
    id: currentUser.id || 'user_001',
    name: currentUser.name || 'User',
    email: currentUser.email || '',
    avatar: currentUser.avatar || 'https://i.pravatar.cc/300?img=5',
    major: currentUser.major || 'Computer Science',
    year: currentUser.year || 'U2',
    courses: ['COMP 202', 'MATH 240'],
    bio: 'Love studying in coffee shops and helping others learn!',
    studyStyle: '',
    environmentPreference: '',
    timePreference: '',
    buddyRolePreference: '',
    groupSizePreference: '',
    availability: '',
    friends: []
  };

  const handleSaveProfile = (updatedProfile) => {
    console.log('Profile saved:', updatedProfile);
    // Backend will handle the actual API call
    alert('Profile saved! (This will go to your backend)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-indigo-600">StudyBuddy</h1>
          <span className="text-sm text-slate-500">Welcome, {currentUser.name}</span>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage('sessions')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === 'sessions'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-calendar-alt mr-2"></i>
            Sessions
          </button>

          <button
            onClick={() => setShowFriendsPanel(true)}
            className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <i className="fas fa-users mr-2"></i>
            Friends
          </button>
          
          <button
            onClick={() => setCurrentPage('profile')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === 'profile'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-user mr-2"></i>
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-medium transition-all bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div>
        {currentPage === 'sessions' && <Sessions userId={currentUser.id} />}
        {currentPage === 'profile' && <ProfileView user={userData} onSave={handleSaveProfile} />}
      </div>

      {/* Friends Panel Modal */}
      <FriendsPanel
        userId={currentUser.id}
        isOpen={showFriendsPanel}
        onClose={() => setShowFriendsPanel(false)}
      />
    </div>
  );
}

export default App;