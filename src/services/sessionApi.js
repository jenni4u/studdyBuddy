import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const fetchAllSessions = async () => {
  const response = await axios.get(`${API_BASE_URL}/sessions`);
  return response.data;
};

export const fetchMatchedSessions = async (userId, k = 20) => {
  // Fallback to fetching all sessions if match endpoint doesn't exist
  try {
    const response = await axios.post(`${API_BASE_URL}/sessions/match?k=${k}`, {
      user_id: userId,
    });
    return response.data;
  } catch (err) {
    // Fallback to all sessions
    return fetchAllSessions();
  }
};

export const createSession = async (session) => {
  const response = await axios.post(`${API_BASE_URL}/sessions`, session);
  return response.data;
};

export const fetchVisibleSessions = async (userId) => {
  // Fallback to fetching all sessions if visible endpoint doesn't exist
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions/visible/${userId}`);
    return response.data;
  } catch (err) {
    // Fallback to all sessions
    return fetchAllSessions();
  }
};

// ==================== USER API ====================

export const getUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await axios.post(`${API_BASE_URL}/users`, user);
  return response.data;
};

export const updateUser = async (userId, user) => {
  const response = await axios.put(`${API_BASE_URL}/users/${userId}`, user);
  return response.data;
};

// ==================== FRIENDS API ====================

export const getFriends = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/friends`);
  return response.data;
};

export const getFriendRequests = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/friend-requests`);
  return response.data;
};

export const sendFriendRequest = async (fromUserId, toUserId) => {
  const response = await axios.post(`${API_BASE_URL}/friends/request`, {
    from_user_id: fromUserId,
    to_user_id: toUserId,
  });
  return response.data;
};

export const acceptFriendRequest = async (fromUserId, toUserId) => {
  const response = await axios.post(`${API_BASE_URL}/friends/accept`, {
    from_user_id: fromUserId,
    to_user_id: toUserId,
  });
  return response.data;
};

export const rejectFriendRequest = async (fromUserId, toUserId) => {
  const response = await axios.post(`${API_BASE_URL}/friends/reject`, {
    from_user_id: fromUserId,
    to_user_id: toUserId,
  });
  return response.data;
};

export const removeFriend = async (userId, friendId) => {
  const response = await axios.delete(`${API_BASE_URL}/friends/${userId}/${friendId}`);
  return response.data;
};

export const searchUsers = async (query, currentUserId) => {
  const response = await axios.get(`${API_BASE_URL}/users/search/${query}?current_user_id=${currentUserId}`);
  return response.data;
};
