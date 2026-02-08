import os
from pathlib import Path

import google.generativeai as genai

ENV_PATH = Path(__file__).resolve().parent / ".env"

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

_load_env_file(ENV_PATH)

# configure API key and initialize embedding model
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set")
genai.configure(api_key=api_key)
embedding_model = genai.GenerativeModel("embedding-001")

def build_user_embedding_text(user: dict) -> str:
    prefs = user.get("preferences", {})

    study_style = prefs.get("style", "")
    location = prefs.get("location", "")
    format = prefs.get("format", "")

    parts = []
    if study_style:
        parts.append(f"{study_style} style")
    if location:
        parts.append(f"{location} location")
    if format:
        parts.append(f"{format} format")
    prefs_text = ", ".join(parts)

    return prefs_text

def build_session_embedding_text(session):
    lines = [
        f"{session['location']} location",
        f"{session.get('style', 'quiet')} style",
        f"{session.get('format', 'in-person')} format",
        f"{session.get('description', '')}"
    ]
    return "\n".join(lines)

def generate_embedding(text: str):
    result = embedding_model.embed_content(text)
    return result["embedding"]

def save_user_embedding(db, user_id, embedding):
    db.users.update_one(
        {"_id": user_id},
        {"$set": {"embedding": embedding}}
    )

def embed_user_profile(db, user_id):
    user = db.users.find_one({"_id": user_id})
    if not user:
        raise ValueError("User not found")

    # Build text for Gemini
    text = build_user_embedding_text(user)

    # Generate embedding
    embedding = generate_embedding(text)

    # Save to MongoDB
    save_user_embedding(db, user_id, embedding)

    return embedding

def embed_study_session(db, session_id):
    session = db.study_sessions.find_one({"_id": session_id})
    if not session:
        raise ValueError("Study session not found")

    # Build text for Gemini
    text = build_session_embedding_text(session)

    # Generate embedding
    embedding = generate_embedding(text)

    # Save to MongoDB
    db.study_sessions.update_one(
        {"_id": session_id},
        {"$set": {"embedding": embedding}}
    )

    return embedding