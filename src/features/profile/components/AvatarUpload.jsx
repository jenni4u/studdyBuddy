import React from 'react';

const AvatarUpload = ({ avatarPreview, onAvatarChange, name, major, year }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
      <div className="relative group">
        <div className="h-32 w-32 rounded-full border-4 border-indigo-50 overflow-hidden mb-4 relative">
          <img src={avatarPreview} alt={name || 'Profile'} className="h-full w-full object-cover" />
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <i className="fas fa-camera text-white text-2xl"></i>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900">{name || 'Your Name'}</h3>
      <p className="text-indigo-600 font-semibold text-sm">{major || 'Your Major'}</p>
      <p className="text-slate-500 text-sm">{year || 'Year'}</p>
    </div>
  );
};

export default AvatarUpload;
