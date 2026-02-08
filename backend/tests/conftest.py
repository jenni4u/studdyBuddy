import json
import os
from pathlib import Path

import pytest
from pymongo import MongoClient

DATA_DIR = Path(__file__).parent / "mock_data"
ENV_PATH = Path(__file__).parent.parent / ".env"

def _load_env_file(path):
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value

# load in environment variables
_load_env_file(ENV_PATH)


def _load_json(filename):
    return json.loads((DATA_DIR / filename).read_text())


@pytest.fixture(scope="session")
def mongo_db():
    mongo_uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri)
    db = client["studybuddy"]
    db.sessions.delete_many({})
    db.users.delete_many({})
    yield db
    

@pytest.fixture(scope="session")
def seed_db(mongo_db):
    users = _load_json("users.json")
    sessions = _load_json("sessions.json")
    mongo_db.users.insert_many(users)
    mongo_db.sessions.insert_many(sessions)
    return mongo_db
