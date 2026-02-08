from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Session
from database import sessions_collection
from store import sessions_cache

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
    session_dict = session.dict()
    result = await sessions_collection.insert_one(session_dict)
    session_dict["_id"] = str(result.inserted_id)
    sessions_cache.append(Session(**session_dict))
    return {"status": "success", "id": str(result.inserted_id)}
