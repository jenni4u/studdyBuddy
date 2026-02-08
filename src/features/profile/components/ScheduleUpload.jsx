import React, { useState } from 'react';
import { scanSchedule } from '../../../services/sessionApi';

const ScheduleUpload = ({ scheduleFile, courses, onScheduleUpload, onAddCourse, onRemoveCourse, onCoursesExtracted }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }

    onScheduleUpload(file);
    setError(null);
    setScanResult(null);
    setIsScanning(true);

    try {
      const result = await scanSchedule(file);
      setScanResult(result);
      
      if (result.courses && result.courses.length > 0) {
        // Notify parent about extracted courses
        if (onCoursesExtracted) {
          onCoursesExtracted(result.courses);
        }
      }
    } catch (err) {
      console.error("Error scanning schedule:", err);
      setError(err.response?.data?.detail || "Failed to scan schedule. You can still add courses manually.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddCourse = () => {
    const course = prompt('Enter course code (e.g., COMP 202)');
    if (course) {
      onAddCourse(course.toUpperCase());
    }
  };

  const handleAddExtractedCourse = (course) => {
    // Check if course already exists
    if (!courses.includes(course)) {
      onAddCourse(course);
    }
  };

  const handleAddAllExtracted = () => {
    if (scanResult?.courses) {
      scanResult.courses.forEach(course => {
        if (!courses.includes(course)) {
          onAddCourse(course);
        }
      });
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
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isScanning}
        />
        <label htmlFor="schedule-upload" className={`cursor-pointer ${isScanning ? 'opacity-50' : ''}`}>
          {isScanning ? (
            <>
              <div className="text-5xl mb-3 animate-pulse">🔍</div>
              <p className="font-bold text-indigo-600">Scanning your schedule...</p>
              <p className="text-xs text-slate-500 mt-2">Our AI is extracting your courses</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">📄</div>
              <p className="font-bold text-slate-700">
                {scheduleFile ? scheduleFile.name : 'Click to upload schedule'}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Accepts PDF, PNG, JPG, WebP (Max 10MB)
              </p>
            </>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
          <i className="fas fa-exclamation-circle text-red-600 text-xl"></i>
          <div>
            <p className="text-sm font-bold text-red-900">Scan Error</p>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanResult && scanResult.courses && scanResult.courses.length > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
              <p className="text-sm font-bold text-green-900">
                Found {scanResult.courses.length} courses!
              </p>
            </div>
            <button
              onClick={handleAddAllExtracted}
              className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {scanResult.courses.map((course, i) => {
              const alreadyAdded = courses.includes(course);
              return (
                <button
                  key={i}
                  onClick={() => !alreadyAdded && handleAddExtractedCourse(course)}
                  disabled={alreadyAdded}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    alreadyAdded
                      ? 'bg-gray-200 text-gray-500 cursor-default'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                  }`}
                >
                  {alreadyAdded ? '✓ ' : '+ '}{course}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {scanResult && scanResult.courses && scanResult.courses.length === 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <i className="fas fa-info-circle text-yellow-600 text-xl"></i>
          <div>
            <p className="text-sm font-bold text-yellow-900">No courses detected</p>
            <p className="text-xs text-yellow-700 mt-1">
              Try uploading a clearer image or add courses manually below.
            </p>
          </div>
        </div>
      )}

      {/* Manual Course Management */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Your Courses
        </label>
        <div className="flex flex-wrap gap-2">
          {courses && courses.map((course, i) => (
            <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
              {course}
              <button 
                type="button" 
                onClick={() => onRemoveCourse(i)}
                className="text-indigo-400 hover:text-red-500"
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
            + Add Manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleUpload;
