import React from "react";
import SessionCard from "./SessionCard";

export default function SessionsSection({ sessions, onJoin }) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} onJoin={onJoin} />
        ))}
      </div>
    </div>
  );
}
