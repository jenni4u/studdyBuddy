from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import Session, User, FriendRequest
from app.database import sessions_collection, users_collection
from app.store import sessions_cache

import asyncio

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load all sessions from DB on startup
@app.on_event("startup")
async def load_sessions():
    sessions_cache.clear()
    cursor = sessions_collection.find()
    async for s in cursor:
        s["_id"] = str(s["_id"])
        sessions_cache.append(Session(**s))
    print(f"Loaded {len(sessions_cache)} sessions from DB")

# Optional: refresh cache every N seconds
async def refresh_cache(interval=60):
    while True:
        sessions_cache.clear()
        cursor = sessions_collection.find()
        async for s in cursor:
            s["_id"] = str(s["_id"])
            sessions_cache.append(Session(**s))
        await asyncio.sleep(interval)

@app.on_event("startup")
async def start_cache_refresh():
    asyncio.create_task(refresh_cache())

# API endpoints
@app.get("/sessions")
async def get_sessions():
    return sessions_cache

@app.post("/sessions")
async def create_session(session: Session):
    required_fields = ["type", "visibility", "when", "gender", "created_by"]
    missing = [field for field in required_fields if not getattr(session, field)]
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing required fields: {', '.join(missing)}")

    session_dict = session.dict()
    result = await sessions_collection.insert_one(session_dict)
    session_dict["_id"] = str(result.inserted_id)
    sessions_cache.append(Session(**session_dict))
    return {"status": "success", "id": str(result.inserted_id)}


# ==================== USER ENDPOINTS ====================

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return user


@app.post("/users")
async def create_user(user: User):
    existing = await users_collection.find_one({"id": user.id})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    user_dict = user.dict()
    await users_collection.insert_one(user_dict)
    return {"status": "success", "id": user.id}


@app.put("/users/{user_id}")
async def update_user(user_id: str, user: User):
    result = await users_collection.update_one(
        {"id": user_id},
        {"$set": user.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success"}


# ==================== FRIENDS ENDPOINTS ====================

@app.get("/users/{user_id}/friends")
async def get_friends(user_id: str):
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get full friend details
    friends = []
    for friend_id in user.get("friends", []):
        friend = await users_collection.find_one({"id": friend_id})
        if friend:
            friends.append({
                "id": friend["id"],
                "name": friend["name"],
                "email": friend["email"],
                "avatar": friend.get("avatar")
            })
    return friends


@app.post("/friends/request")
async def send_friend_request(request: FriendRequest):
    from_user = await users_collection.find_one({"id": request.from_user_id})
    to_user = await users_collection.find_one({"id": request.to_user_id})
    
    if not from_user or not to_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already friends
    if request.to_user_id in from_user.get("friends", []):
        raise HTTPException(status_code=400, detail="Already friends")
    
    # Check if request already sent
    if request.to_user_id in from_user.get("friend_requests_sent", []):
        raise HTTPException(status_code=400, detail="Friend request already sent")
    
    # Add to sent requests for from_user
    await users_collection.update_one(
        {"id": request.from_user_id},
        {"$addToSet": {"friend_requests_sent": request.to_user_id}}
    )
    
    # Add to received requests for to_user
    await users_collection.update_one(
        {"id": request.to_user_id},
        {"$addToSet": {"friend_requests_received": request.from_user_id}}
    )
    
    return {"status": "success", "message": "Friend request sent"}


@app.post("/friends/accept")
async def accept_friend_request(request: FriendRequest):
    # from_user_id is the one who SENT the original request
    # to_user_id is the one ACCEPTING
    from_user = await users_collection.find_one({"id": request.from_user_id})
    to_user = await users_collection.find_one({"id": request.to_user_id})
    
    if not from_user or not to_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify request exists
    if request.from_user_id not in to_user.get("friend_requests_received", []):
        raise HTTPException(status_code=400, detail="No pending friend request")
    
    # Add each other as friends
    await users_collection.update_one(
        {"id": request.from_user_id},
        {
            "$addToSet": {"friends": request.to_user_id},
            "$pull": {"friend_requests_sent": request.to_user_id}
        }
    )
    
    await users_collection.update_one(
        {"id": request.to_user_id},
        {
            "$addToSet": {"friends": request.from_user_id},
            "$pull": {"friend_requests_received": request.from_user_id}
        }
    )
    
    return {"status": "success", "message": "Friend request accepted"}


@app.post("/friends/reject")
async def reject_friend_request(request: FriendRequest):
    # Remove from pending requests
    await users_collection.update_one(
        {"id": request.from_user_id},
        {"$pull": {"friend_requests_sent": request.to_user_id}}
    )
    
    await users_collection.update_one(
        {"id": request.to_user_id},
        {"$pull": {"friend_requests_received": request.from_user_id}}
    )
    
    return {"status": "success", "message": "Friend request rejected"}


@app.delete("/friends/{user_id}/{friend_id}")
async def remove_friend(user_id: str, friend_id: str):
    # Remove from both users' friend lists
    await users_collection.update_one(
        {"id": user_id},
        {"$pull": {"friends": friend_id}}
    )
    
    await users_collection.update_one(
        {"id": friend_id},
        {"$pull": {"friends": user_id}}
    )
    
    return {"status": "success", "message": "Friend removed"}


@app.get("/users/{user_id}/friend-requests")
async def get_friend_requests(user_id: str):
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get details of users who sent requests
    received = []
    for sender_id in user.get("friend_requests_received", []):
        sender = await users_collection.find_one({"id": sender_id})
        if sender:
            received.append({
                "id": sender["id"],
                "name": sender["name"],
                "email": sender["email"],
                "avatar": sender.get("avatar")
            })
    
    return {"received": received, "sent": user.get("friend_requests_sent", [])}


# ==================== SESSIONS WITH VISIBILITY ====================

@app.get("/sessions/visible/{user_id}")
async def get_visible_sessions(user_id: str):
    """Get sessions visible to a specific user (public + friends-only from their friends)"""
    user = await users_collection.find_one({"id": user_id})
    user_friends = user.get("friends", []) if user else []
    
    visible_sessions = []
    for session in sessions_cache:
        session_dict = session.dict()
        visibility = session_dict.get("visibility", "public")
        created_by = session_dict.get("created_by")
        
        # Public sessions are visible to everyone
        if visibility == "public":
            visible_sessions.append(session_dict)
        # Friends-only (private) sessions are visible if creator is a friend or the user themselves
        elif visibility in ["friends", "private"]:
            if created_by == user_id or created_by in user_friends:
                visible_sessions.append(session_dict)
    
    return visible_sessions


@app.get("/users/search/{query}")
async def search_users(query: str, current_user_id: str = ""):
    """Search users by name or email"""
    cursor = users_collection.find({
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"email": {"$regex": query, "$options": "i"}}
        ]
    })
    users = []
    async for user in cursor:
        if user["id"] != current_user_id:  # Exclude current user
            users.append({
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "avatar": user.get("avatar")
            })
    return users
