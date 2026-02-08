import { useCallback, useEffect, useState } from "react";
import { fetchMatchedSessions, fetchVisibleSessions } from "../services/sessionApi";

const mapSession = (session) => ({
  id: session._id || Date.now(),
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

  const refreshSessions = useCallback(async () => {
    if (!userId) return;
    try {
      // Use visibility-filtered endpoint when friends feature is needed
      const data = useVisibilityFilter 
        ? await fetchVisibleSessions(userId)
        : await fetchMatchedSessions(userId);
      if (data?.error) {
        setError(data.error);
        setSessions([]);
        return;
      }
      const rawSessions = Array.isArray(data) ? data : [];
      setSessions(rawSessions.map(mapSession));
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, [userId, useVisibilityFilter]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  return { sessions, setSessions, refreshSessions, error };
}
