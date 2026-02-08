import React, { useState, useEffect, useCallback } from "react";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
} from "../services/sessionApi";

export default function FriendsPanel({ userId, isOpen, onClose }) {
  const [tab, setTab] = useState("friends"); // friends, requests, search
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadFriends = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getFriends(userId);
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
    }
  }, [userId]);

  const loadFriendRequests = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getFriendRequests(userId);
      setFriendRequests(data);
    } catch (error) {
      console.error("Error loading friend requests:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen) {
      loadFriends();
      loadFriendRequests();
    }
  }, [isOpen, loadFriends, loadFriendRequests]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchUsers(searchQuery, userId);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setLoading(false);
  };

  const handleSendRequest = async (toUserId) => {
    try {
      await sendFriendRequest(userId, toUserId);
      setMessage("Friend request sent!");
      loadFriendRequests();
      // Remove from search results
      setSearchResults((prev) => prev.filter((u) => u.id !== toUserId));
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to send request");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAcceptRequest = async (fromUserId) => {
    try {
      await acceptFriendRequest(fromUserId, userId);
      setMessage("Friend request accepted!");
      loadFriends();
      loadFriendRequests();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage("Failed to accept request");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRejectRequest = async (fromUserId) => {
    try {
      await rejectFriendRequest(fromUserId, userId);
      loadFriendRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Remove this friend?")) return;
    try {
      await removeFriend(userId, friendId);
      loadFriends();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Friends</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: "friends", label: "My Friends", icon: "👥" },
            { id: "requests", label: "Requests", icon: "📬", count: friendRequests.received.length },
            { id: "search", label: "Add Friends", icon: "🔍" },
          ].map(({ id, label, icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                tab === id ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-1">{icon}</span>
              {label}
              {count > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="mx-4 mt-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm">{message}</div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Friends Tab */}
          {tab === "friends" && (
            <div className="space-y-3">
              {friends.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👋</div>
                  <p>No friends yet</p>
                  <p className="text-sm mt-1">Search and add friends to study together!</p>
                </div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {friend.avatar ? (
                          <img src={friend.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          friend.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{friend.name}</div>
                        <div className="text-sm text-gray-500">{friend.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Requests Tab */}
          {tab === "requests" && (
            <div className="space-y-4">
              {friendRequests.received.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Received</h3>
                  <div className="space-y-2">
                    {friendRequests.received.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                            {request.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{request.name}</div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {friendRequests.sent.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Sent (Pending)</h3>
                  <div className="space-y-2">
                    {friendRequests.sent.map((userId) => (
                      <div
                        key={userId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="text-sm text-gray-600">Request sent to {userId}</div>
                        <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Pending</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {friendRequests.received.length === 0 && friendRequests.sent.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          )}

          {/* Search Tab */}
          {tab === "search" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by name or email..."
                  className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "..." : "Search"}
                </button>
              </div>

              <div className="space-y-2">
                {searchResults.map((user) => {
                  const isFriend = friends.some((f) => f.id === user.id);
                  const isPending = friendRequests.sent.includes(user.id);
                  
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      {isFriend ? (
                        <span className="text-green-600 text-sm">✓ Friends</span>
                      ) : isPending ? (
                        <span className="text-yellow-600 text-sm">Pending</span>
                      ) : (
                        <button
                          onClick={() => handleSendRequest(user.id)}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                        >
                          Add Friend
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
