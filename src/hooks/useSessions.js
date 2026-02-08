import { useCallback, useEffect, useState } from "react";
import { fetchMatchedSessions } from "../services/sessionApi";

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
});

export default function useSessions(userId, initialSessions = []) {
  const [sessions, setSessions] = useState(initialSessions);
  const [error, setError] = useState(null);

  const refreshSessions = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await fetchMatchedSessions(userId);
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
  }, [userId]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  return { sessions, setSessions, refreshSessions, error };
}
