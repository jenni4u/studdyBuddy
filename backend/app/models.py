from pydantic import BaseModel
from typing import Optional, List


class TimeSlot(BaseModel):
    day: str
    start: str
    end: str

class Session(BaseModel):
    # API-created fields (optional for DB-seeded sessions)
    type: Optional[str] = None
    visibility: Optional[str] = None
    course: str
    note: Optional[str] = None
    when: Optional[str] = None
    max_size: int
    gender: Optional[str] = None
    created_by: Optional[str] = None
    # DB-backed fields (optional for API-created sessions)
    location: Optional[str] = None
    style: Optional[str] = None
    format: Optional[str] = None
    description: Optional[str] = None
    time: Optional[TimeSlot] = None
    current_members: Optional[List[str]] = None
    group_size_preference: Optional[str] = None
