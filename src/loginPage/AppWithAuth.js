import React, { useState } from 'react';
import Login from './loginPage/Login';
import SignUp from './loginPage/SignUp';
import StudyBuddy from './StudyBuddy';
import ProfileView from './features/profile/components/ProfileView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAuthPage, setCurrentAuthPage] = useState('login'); // 'login' or 'signup'
  const [currentPage, setCurrentPage] = useState('sessions'); // 'sessions' or 'profile'
  const [user, setUser] = useState(null);

  // Sample user data for ProfileView (will be populated after login)
  const sampleUser = {
    id: '1',
    name: user?.name || 'Your Name',
    avatar: 'https://i.pravatar.cc/300?img=5',
    major: 'Computer Science',
    year: 'U2',
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

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('sessions'); // Go to sessions page after login
  };

  const handleSignUp = (userData) => {
    console.log('User signed up:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('sessions'); // Go to sessions page after signup
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentAuthPage('login');
  };

  const handleSaveProfile = (updatedProfile) => {
    console.log('Profile saved:', updatedProfile);
    // Backend will handle the actual API call
    alert('Profile saved! 🎉');
  };

  // Show Login/SignUp pages if not authenticated
  if (!isAuthenticated) {
    if (currentAuthPage === 'login') {
      return (
        <Login 
          onLogin={handleLogin}
          onSwitchToSignup={() => setCurrentAuthPage('signup')}
        />
      );
    } else {
      return (
        <SignUp 
          onSignUp={handleSignUp}
          onSwitchToLogin={() => setCurrentAuthPage('login')}
        />
      );
    }
  }

  // Show main app after authentication
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">StudyBuddy</h1>
        
        <div className="flex items-center gap-3">
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
            className="px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div>
        {currentPage === 'sessions' && <StudyBuddy />}
        {currentPage === 'profile' && <ProfileView user={sampleUser} onSave={handleSaveProfile} />}
      </div>
    </div>
  );
}

export default App;