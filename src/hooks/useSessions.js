import { useCallback, useEffect, useState } from "react";
import { fetchMatchedSessions } from "../services/sessionApi";

const formatTimeBlock = (time) => {
  if (!time) return null;
  if (time.day && time.start && time.end) return `${time.day} ${time.start} - ${time.end}`;
  if (time.start && time.end) return `${time.start} - ${time.end}`;
  return null;
};

const resolveLocation = (session) => {
  if (session.type === "online" || session.format === "online") return "Online";
  return session.location?.name || session.location || "TBD";
};

const resolveDisplayName = (session, courseLabel) => {
  return session.name
    || session.description
    || session.note
    || (courseLabel !== "Study" ? `${courseLabel} Study Session` : "Study Session");
};

const resolveWhen = (session) => {
  if (session.when === "now") return "LIVE NOW";
  if (session.when) return session.when;
  const timeLabel = formatTimeBlock(session.time);
  return timeLabel || "TBD";
};

const mapSession = (session) => {
  const courseLabel = session.course || "Study";
  const membersCount = Array.isArray(session.current_members)
    ? session.current_members.length
    : (session.members || 1);

  return {
    id: session._id || session.id || Date.now(),
    course: courseLabel,
    name: resolveDisplayName(session, courseLabel),
    location: resolveLocation(session),
    time: resolveWhen(session),
    maxMembers: session.max_size || session.maxMembers || 5,
    organizer: session.created_by || "Unknown",
    meetLink: session.meetLink || null,
    genderPref: session.gender || "any",
    isLive: session.when === "now",
    visibility: session.visibility || null,
    description: session.description || session.note || null,
    style: session.style || null,
    format: session.format || null,
    timeBlock: session.time || null,
    raw: session,
  };
};

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
