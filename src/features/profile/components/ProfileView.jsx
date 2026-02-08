import React, { useState } from 'react';
import { StudyStyle, StudyEnvironment, TimePreference, BuddyRole, GroupSize } from '../types';
import AvatarUpload from './AvatarUpload';
import ChipSelector from './ChipSelector';
import AvailabilityPicker from './AvailabilityPicker';

const ProfileView = ({ user, onSave }) => {
  const [profile, setProfile] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [email, setEmail] = useState(user.email || '');
  
  const [availability, setAvailability] = useState({
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {}
  });

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const total = 10;

    if (profile.name) completed++;
    if (profile.major) completed++;
    if (profile.year) completed++;
    if (email) completed++;
    if (profile.bio && profile.bio.length > 20) completed++;
    if (profile.studyStyle) completed++;
    if (profile.environmentPreference) completed++;
    if (profile.timePreference) completed++;
    if (profile.buddyRolePreference) completed++;
    if (profile.groupSizePreference) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email');
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      const updatedProfile = {
        ...profile,
        avatar: avatarPreview,
        email: email,
      };
      
      onSave(updatedProfile);
      setIsSaving(false);
      alert('Profile updated successfully! 🎉');
    }, 800);
  };

  const toggleAvailability = (day, hour) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: !prev[day]?.[hour]
      }
    }));
  };

  const completion = calculateCompletion();

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Your Study Profile</h2>
          <p className="text-slate-500">How you study determines who you match with.</p>
        </div>
        <div className="hidden sm:block">
           <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
              <div className="h-3 w-24 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500" 
                  style={{width: `${completion}%`}}
                ></div>
              </div>
              <span className="text-xs font-bold text-indigo-600">{completion}% Complete</span>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & AI Info */}
        <div className="lg:col-span-1 space-y-6">
          <AvatarUpload 
            avatarPreview={avatarPreview}
            onAvatarChange={setAvatarPreview}
            name={profile.name}
            major={profile.major}
            year={profile.year}
          />

          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <i className="fas fa-robot"></i>
              AI Matching Logic
            </h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              We're currently prioritizing <strong>{profile.studyStyle || 'your study style'}</strong> partners in <strong>{profile.environmentPreference || 'your preferred environment'}</strong> settings for your <strong>{profile.timePreference || 'preferred time'}</strong> sessions.
            </p>
          </div>
        </div>

        {/* Right Column: All Profile Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fas fa-user text-indigo-600"></i>
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Major *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  value={profile.major}
                  onChange={(e) => setProfile({...profile, major: e.target.value})}
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Year Level *</label>
              <div className="flex gap-2 flex-wrap">
                {['U0', 'U1', 'U2', 'U3', 'U4', 'Graduate'].map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setProfile({...profile, year})}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                      profile.year === year 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Professional Bio</label>
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm min-h-[100px]"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Tell buddies about your academic goals, study habits, and what you're looking for in a study partner..."
                maxLength={500}
              />
              <p className="text-xs text-slate-400 mt-1">{profile.bio?.length || 0} / 500 characters</p>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fas fa-sliders-h text-indigo-600"></i>
              Study Preferences
            </h3>

            <ChipSelector 
              label="Study Mode"
              options={StudyStyle}
              selectedValue={profile.studyStyle}
              onSelect={(value) => setProfile({...profile, studyStyle: value})}
              required
            />

            <ChipSelector 
              label="Preferred Environment"
              options={StudyEnvironment}
              selectedValue={profile.environmentPreference}
              onSelect={(value) => setProfile({...profile, environmentPreference: value})}
              required
            />

            <ChipSelector 
              label="When do you focus best?"
              options={TimePreference}
              selectedValue={profile.timePreference}
              onSelect={(value) => setProfile({...profile, timePreference: value})}
              required
            />

            <ChipSelector 
              label="I am a..."
              options={BuddyRole}
              selectedValue={profile.buddyRolePreference}
              onSelect={(value) => setProfile({...profile, buddyRolePreference: value})}
              required
            />

            <ChipSelector 
              label="Preferred Group Size"
              options={GroupSize}
              selectedValue={profile.groupSizePreference}
              onSelect={(value) => setProfile({...profile, groupSizePreference: value})}
              required
            />
          </div>

          {/* Weekly Availability */}
          <AvailabilityPicker 
            availability={availability}
            onToggleAvailability={toggleAvailability}
          />

          {/* Submit Button */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <button
              type="submit"
              disabled={isSaving || completion < 80}
              className="w-full px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : completion < 80 ? (
                <>
                  <i className="fas fa-exclamation-circle"></i>
                  Complete profile to {80 - completion}% more to save
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Study Profile
                </>
              )}
            </button>

            {completion >= 80 && (
              <p className="text-xs text-center text-slate-500 mt-3">
                ✨ Great! Your profile is ready to find study buddies
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileView;
