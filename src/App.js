import React, { useState } from 'react';
import Sessions from './pages/Sessions';
import ProfileView from './features/profile/components/ProfileView';

function App() {
  const [currentPage, setCurrentPage] = useState('sessions'); // 'sessions' or 'profile'

  // Sample user data for ProfileView
  const sampleUser = {
    id: '1',
    name: 'Sarah Chen',
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

  const handleSaveProfile = (updatedProfile) => {
    console.log('Profile saved:', updatedProfile);
    // Backend will handle the actual API call
    alert('Profile saved! (This will go to your backend)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">StudyBuddy</h1>
        
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
        </div>
      </div>

      {/* Page Content */}
      <div>
        {currentPage === 'sessions' && <Sessions />}
        {currentPage === 'profile' && <ProfileView user={sampleUser} onSave={handleSaveProfile} />}
      </div>
    </div>
  );
}

export default App;