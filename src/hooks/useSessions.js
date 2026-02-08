import { useCallback, useEffect, useState } from "react";
import { fetchAllSessions } from "../services/sessionApi";

const mapSession = (session) => ({
  id: session._id || session.id || Date.now(),
  course: session.course || "Study",
  name: session.course || "Study Session",
  location: session.type === "online"
    ? "Online"
    : (session.location?.name || session.location || "TBD"),
  time: session.when === "now" ? "LIVE NOW" : session.when || "TBD",
  members: session.members || 1,
  maxMembers: session.max_size || 5,
  organizer: session.created_by || "Unknown",
  meetLink: session.meetLink || null,
  genderPref: session.gender || "any",
  isLive: session.when === "now",
  visibility: session.visibility || "public",
});

export default function useSessions(userId, initialSessions = [], useVisibilityFilter = false) {
  const [sessions, setSessions] = useState(initialSessions);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSessions = useCallback(async () => {
    setLoading(true);
    try {
      // Try to fetch all sessions from backend
      const data = await fetchAllSessions();
      const rawSessions = Array.isArray(data) ? data : [];
      if (rawSessions.length > 0) {
        setSessions(rawSessions.map(mapSession));
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err);
      // Keep initial sessions if backend fails
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  return { sessions, setSessions, refreshSessions, error, loading };
}
