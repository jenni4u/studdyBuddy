from pydantic import BaseModel

class TimeSlot(BaseModel):
    day: str
    start: str
    end: str
