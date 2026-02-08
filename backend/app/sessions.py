from fastapi import APIRouter
from app.session import Session
from app.database import db

router = APIRouter()

@router.post("/sessions")
async def create_session(session: Session):
    session_dict = session.dict()
    result = await db.sessions.insert_one(session_dict)
    return {"id": str(result.inserted_id)}
from fastapi import APIRouter
from app.session import Session
from app.database import db
from datetime import datetime

router = APIRouter()

@router.post("/sessions")
async def create_session(session: Session):
    session_dict = session.dict()

    session_dict["members"] = [session.created_by]  # creator joins automatically
    session_dict["created_at"] = datetime.utcnow()

    result = await db.sessions.insert_one(session_dict)

    return {
        "id": str(result.inserted_id),
        "message": "Session created successfully"
    }

@router.get("/sessions")
async def get_sessions():
    sessions = []
    cursor = db.sessions.find()
    async for s in cursor:
        s["_id"] = str(s["_id"]) 
        sessions.append(Session(**s))
    return sessions