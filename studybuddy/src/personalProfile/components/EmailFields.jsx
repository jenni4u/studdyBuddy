import React from 'react';

const EmailFields = ({ personalEmail, schoolEmail, onPersonalEmailChange, onSchoolEmailChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          Personal Email *
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          value={personalEmail}
          onChange={(e) => onPersonalEmailChange(e.target.value)}
          placeholder="john.doe@gmail.com"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          McGill Email *
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          value={schoolEmail}
          onChange={(e) => onSchoolEmailChange(e.target.value)}
          placeholder="john.doe@mail.mcgill.ca"
        />
        {schoolEmail && !schoolEmail.includes('@mail.mcgill.ca') && (
          <p className="text-xs text-red-500 mt-1">⚠️ Must be a McGill email</p>
        )}
      </div>
    </div>
  );
};

export default EmailFields;
