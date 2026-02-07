from fastapi import FastAPI
from app.database import db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#get all courses
@app.get("/courses")
def get_courses():
    courses = list(db.courses.find())
    
    for course in courses:
        course["_id"] = str(course["_id"])
    
    return {"courses": courses}
