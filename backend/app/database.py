from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "studybuddy"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
sessions_collection = db.sessions
users_collection = db.users


