import React from 'react';

const ChipSelector = ({ label, options, selectedValue, onSelect, required = false }) => {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
        {label} {required && '*'}
      </label>
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.values(options).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              selectedValue === opt 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChipSelector;
