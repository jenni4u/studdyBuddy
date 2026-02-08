import React from "react";

export default function HeaderBar({ googleUser, onSignIn }) {
  return (
    <div className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">StudyBuddy</h1>
      {googleUser ? (
        <span className="text-sm text-green-600 font-medium">✓ Google Connected</span>
      ) : (
        <button
          onClick={onSignIn}
          className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
