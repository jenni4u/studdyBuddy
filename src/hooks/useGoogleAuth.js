import { useCallback, useEffect, useRef, useState } from "react";

export default function useGoogleAuth(clientId, scopes) {
  const [googleUser, setGoogleUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const tokenClientRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      tokenClientRef.current = window.google?.accounts?.oauth2?.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: (response) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
            setGoogleUser(true);
          }
        },
      });
    };
    document.head.appendChild(script);
  }, [clientId, scopes]);

  const signInWithGoogle = useCallback(() => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    }
  }, []);

  const createGoogleMeetLink = useCallback(async () => {
    if (!accessToken) return null;
    const event = {
      summary: "StudyBuddy Session",
      description: "Study session created via StudyBuddy",
      start: {
        dateTime: new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(Date.now() + 7200000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(2, 12),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );
      const data = await response.json();
      const entryPoint = data.conferenceData?.entryPoints?.find(
        (entry) => entry.entryPointType === "video"
      );
      return entryPoint ? entryPoint.uri : null;
    } catch {
      return null;
    }
  }, [accessToken]);

  return {
    accessToken,
    googleUser,
    signInWithGoogle,
    createGoogleMeetLink,
  };
}
