import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const fetchMatchedSessions = async (userId, k = 20) => {
  const response = await axios.post(`${API_BASE_URL}/sessions/match?k=${k}`, {
    user_id: userId,
  });

  return response.data;
};

export const createSession = async (session) => {
  const response = await axios.post(`${API_BASE_URL}/sessions`, session);
  return response.data;
};
