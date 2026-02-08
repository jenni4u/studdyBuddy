import React, { useState } from "react";
import { GOOGLE_CLIENT_ID, SCOPES } from "../constants/studyBuddyData";
import SessionsSection from "../components/SessionsSection";
import CreateSessionModal from "../components/CreateSessionModal";
import useGoogleAuth from "../hooks/useGoogleAuth";
import useSessions from "../hooks/useSessions";
import { createSession } from "../services/sessionApi";

const DEFAULT_SESSIONS = [
  {
    id: 1,
    course: "COMP 202",
    name: "Programming Practice",
    location: "Café Olimpico",
    time: "2:00 PM",
    members: 2,
    maxMembers: 5,
    organizer: "Sarah Chen",
    meetLink: null,
  },
];

export default function Sessions({ userId = "user_001" }) {
  const [modal, setModal] = useState(false);
  const { accessToken, signInWithGoogle, createGoogleMeetLink } = useGoogleAuth(
    GOOGLE_CLIENT_ID,
    SCOPES
  );
  // Use visibility filter to show only public sessions + friends-only sessions from friends
  const { sessions, setSessions, refreshSessions } = useSessions(userId, DEFAULT_SESSIONS, true);

  const handlePersistSession = async (sessionToSave) => {
    await createSession(sessionToSave);
    // Refresh sessions from backend after creating
    await refreshSessions();
  };

  const handleSessionCreated = (session) => {
    setSessions((prev) => [session, ...prev]);
  };

  const joinSession = (session) => {
    if (session.meetLink) {
      window.open(session.meetLink, "_blank");
    } else {
      alert(`Joining ${session.name} at ${session.location}!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <SessionsSection sessions={sessions} onJoin={joinSession} />

      <button
        onClick={() => setModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-3xl z-50"
      >
        +
      </button>

      <CreateSessionModal
        isOpen={modal}
        onClose={() => setModal(false)}
        onPersistSession={handlePersistSession}
        onSessionCreated={handleSessionCreated}
        accessToken={accessToken}
        onSignIn={signInWithGoogle}
        createGoogleMeetLink={createGoogleMeetLink}
      />
    </div>
  );
}
