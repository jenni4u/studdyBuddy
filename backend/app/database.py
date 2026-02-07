from pymongo import MongoClient
import os

# MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://admin:adminpw@studybuddy.hilnv62.mongodb.net/")
DB_NAME = os.getenv("DB_NAME", "studybuddy")

# Create MongoDB client
client = MongoClient(MONGO_URI)

# Get database
db = client[DB_NAME]


