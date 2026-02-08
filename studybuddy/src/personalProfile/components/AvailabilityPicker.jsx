import React from 'react';

const AvailabilityGrid = ({ availability, onToggleAvailability }) => {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  const formatHour = (hour) => {
    if (hour > 12) return `${hour - 12}PM`;
    if (hour === 12) return '12PM';
    return `${hour}AM`;
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <i className="fas fa-clock text-indigo-600"></i>
        Weekly Availability
      </h3>
      
      <p className="text-sm text-slate-600">
        Select the times you're typically available to study. This helps us match you with compatible study partners!
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-8 gap-1 text-xs">
            {/* Header */}
            <div className="font-bold text-slate-600 text-center py-2">Time</div>
            {DAYS.map(day => (
              <div key={day} className="font-bold text-slate-600 text-center py-2">
                {day.slice(0, 3)}
              </div>
            ))}

            {/* Time slots */}
            {HOURS.map(hour => (
              <React.Fragment key={hour}>
                <div className="text-slate-500 text-right pr-2 py-2">
                  {formatHour(hour)}
                </div>
                {DAYS.map(day => (
                  <button
                    key={`${day}-${hour}`}
                    type="button"
                    onClick={() => onToggleAvailability(day, hour)}
                    className={`py-2 rounded transition-all ${
                      availability[day]?.[hour]
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-600 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-100 rounded border border-slate-200"></div>
          <span>Not Available</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityGrid;
