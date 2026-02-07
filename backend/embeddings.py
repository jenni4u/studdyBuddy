import google.generativeai as genai

# configure API key and initialize embedding model
genai.configure(api_key="AIzaSyA-TklRWXsA_mHy5KgUoZHE4S0DZvY_fpE")
embedding_model = genai.GenerativeModel("models/embedding-001")

def build_user_embedding_text(user: dict) -> str:
    prefs = user.get("preferences", {})
    
    lines = [
        f"Study style: {prefs.get('style', 'not specified')}",
        f"Preferred location: {prefs.get('location', 'not specified')}",
        f"Format preference: {prefs.get('format', 'either')}",
        f"Learning style: {user.get('learning_style', 'not specified')}",
        f"Courses: {', '.join(user.get('courses', []))}",
    ]

    # Optional: summarize availability into a human-friendly sentence
    # TODO: figure it out and see what else to add
    availability = user.get("availability", [])
    if availability:
        days = ", ".join([slot['day'] for slot in availability])
        lines.append(f"Available on: {days}")

    return "\n".join(lines)

def build_session_embedding_text(session):
    lines = [
        f"Course: {session['course']}",
        f"Location: {session['location']}",
        f"Study style: {session.get('style', 'quiet')}",
        f"Format: {session.get('format', 'in-person')}",
        f"Description: {session.get('description', '')}"
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