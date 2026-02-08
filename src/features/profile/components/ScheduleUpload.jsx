import React from 'react';

const ScheduleUpload = ({ scheduleFile, courses, onScheduleUpload, onAddCourse, onRemoveCourse }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onScheduleUpload(file);
    }
  };

  const handleAddCourse = () => {
    const course = prompt('Enter course code (e.g., COMP 202)');
    if (course) {
      onAddCourse(course.toUpperCase());
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <i className="fas fa-calendar-alt text-indigo-600"></i>
        Course Schedule
      </h3>
      
      <p className="text-sm text-slate-600">
        Upload your class schedule (PDF or image) and we'll automatically detect your courses!
      </p>

      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-all">
        <input
          type="file"
          id="schedule-upload"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="schedule-upload" className="cursor-pointer">
          <div className="text-5xl mb-3">📄</div>
          <p className="font-bold text-slate-700">
            {scheduleFile ? scheduleFile.name : 'Click to upload schedule'}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Accepts PDF, PNG, JPG (Max 10MB)
          </p>
        </label>
      </div>

      {scheduleFile && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
          <i className="fas fa-check-circle text-green-600 text-xl"></i>
          <div>
            <p className="text-sm font-bold text-green-900">Schedule uploaded successfully!</p>
            <p className="text-xs text-green-700 mt-1">Our AI will extract your courses and add them to your profile.</p>
          </div>
        </div>
      )}

      {/* Manual Course Management */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Current Courses
        </label>
        <div className="flex flex-wrap gap-2">
          {courses && courses.map((course, i) => (
            <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
              {course}
              <button 
                type="button" 
                onClick={() => onRemoveCourse(i)}
                className="text-slate-400 hover:text-red-500"
              >
                <i className="fas fa-times"></i>
              </button>
            </span>
          ))}
          <button 
            type="button" 
            className="border-2 border-dashed border-slate-200 text-slate-400 px-3 py-1 rounded-lg text-xs font-bold hover:border-indigo-300 hover:text-indigo-500 transition-colors"
            onClick={handleAddCourse}
          >
            + Add Course Manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleUpload;
