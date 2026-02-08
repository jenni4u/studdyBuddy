from pydantic import BaseModel
from typing import Optional

class Session(BaseModel):
    type: str
    visibility: str
    course: str
    note: Optional[str] = None
    when: str
    max_size: int
    gender: str
    created_by: str
