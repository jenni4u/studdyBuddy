import React from "react";

export default function SessionCard({ session, onJoin }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-sm font-semibold text-indigo-600">{session.course}</span>
          <h3 className="font-bold text-lg mt-1">{session.name}</h3>
        </div>
        {session.isLive && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">LIVE</span>
        )}
      </div>
      <p className="text-sm text-gray-600">📍 {session.location}</p>
      <p className="text-sm text-gray-600">🕐 {session.time}</p>
      <p className="text-sm text-gray-600">👥 {session.maxMembers} members</p>
      {session.genderPref !== "any" && (
        <p className="text-sm text-gray-600">⚧ {session.genderPref} preferred</p>
      )}
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">by {session.organizer}</span>
        <button
          onClick={() => onJoin(session)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          {session.meetLink ? "Join Meet" : "Join"}
        </button>
      </div>
    </div>
  );
}
