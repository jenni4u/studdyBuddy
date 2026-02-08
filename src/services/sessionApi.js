import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://0.0.0.0:10000";

// export const fetchMatchedSessions = async (userId, k = 20) => {
//   const response = await axios.get(`${API_BASE_URL}/sessions/match?k=${k}`, {
//     params: {
//       user_id: userId,
//     },
//   });

//   return response.data;
// };

export const fetchMatchedSessions = async (userID) => {
  const response = await axios.get(`${API_BASE_URL}/sessions`);

  return response.data;
};

export const createSession = async (session) => {
  const response = await axios.post(`${API_BASE_URL}/sessions`, session);
  return response.data;
};
