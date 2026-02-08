from pydantic import BaseModel
from typing import List
from datetime import datetime

class Session(BaseModel):
    type: str
    visibility: str
    course: str
    note: str
    when: str
    max_size: int
    gender: str
    created_by: str
