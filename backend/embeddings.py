import os
from pathlib import Path
from urllib import response

from google import generativeai as genai

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
    
    lines = []

    if session.get("style"):
        lines.append(f"{session['style']} style")
    lines.append(f"{session['location']} location")
    if session.get("format"):
        lines.append(f"{session['format']} format")
    
    # lines.append(session.get("description", ""))
    
    return ", ".join(lines)

def generate_embedding(text: str):
    result = genai.embed_content(
        model="gemini-embedding-001",
        content=text,
        task_type="retrieval_document"
    )
    return result["embedding"]

def embed_user_profile(db, user_id):
    user = db.users.find_one({"_id": user_id})
    if not user:
        raise ValueError("User not found")

    # Build text for Gemini
    text = build_user_embedding_text(user)

    # Generate embedding
    embedding = generate_embedding(text)

    # Save to MongoDB
    db.users.update_one(
        {"_id": user_id},
        {"$set": {"embedding": embedding}}
    )
    return embedding

def embed_study_session(db, session_id):
    session = db.sessions.find_one({"_id": session_id})
    if not session:
        raise ValueError("Study session not found")

    # Build text for Gemini
    text = build_session_embedding_text(session)
    
    # Generate embedding
    embedding = generate_embedding(text)
    
    # Save to MongoDB
    result = db.sessions.update_one(
        {"_id": session_id},
        {"$set": {"embedding": embedding}}
    )
    return embedding