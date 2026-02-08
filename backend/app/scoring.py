import os
from backend.app import embeddings

VECTOR_INDEX = os.environ.get("VECTOR_INDEX", "vector_index")

def filter(user, session):
    # Session must have space
    if len(session["current_members"]) >= session["max_size"]:
        return False

    return True

def get_search_string(user):
    prefs = user.get("preferences", {})

    # courses
    for course in user.get("courses", []):
        search_string += f"{course} "
    
    # preferences
    for pref in prefs:
        search_string += f"{prefs[pref]} "
    
    return search_string.strip()

def has_availability_overlap(user, session):
    user_availability = user.get("availability", [])
    session_time = session.get("time")

    for slot in user_availability:
        if slot["day"] == session_time["day"]:
            # Assuming time is in "HH:MM" format, we can check for overlap
            user_start = slot["start"]
            user_end = slot["end"]
            session_start = session_time["start"]
            session_end = session_time["end"]

            if (user_start <= session_start < user_end) or (user_start < session_end <= user_end):
                return True

    return False

def has_course_match(user, session):
    return session["course"] in user["courses"]

def has_time_match(user, session):
    session_time = session.get("time")
    for slot in user.get("availability", []):
        if slot["day"] == session_time["day"]:
            user_start = slot["start"]
            user_end = slot["end"]
            session_start = session_time["start"]
            session_end = session_time["end"]

            if (user_start <= session_start < user_end) or (user_start < session_end <= user_end):
                return True
    return False

def has_size_match(user, session):
    pref_size = user.get("preferences", {}).get("group_size_preference")
    if not pref_size:
        return True
    return pref_size == session.get("group_size_preference")

def score_rule_based(user, session):
    score = 0

    prefs = user.get("preferences", {})
    if isinstance(prefs, str):
        pref_text = prefs.lower()
        pref_location = next(
            (loc for loc in ["library", "science library", "engineering building", "cafe", "online"] if loc in pref_text),
            None,
        )
        pref_style = next(
            (style for style in ["quiet", "collaborative", "casual"] if style in pref_text),
            None,
        )
        pref_format = next(
            (fmt for fmt in ["in-person", "online", "either"] if fmt in pref_text),
            "either",
        )
        pref_group_size = next(
            (size for size in ["small", "large"] if size in pref_text),
            None,
        )
    else:
        pref_location = prefs.get("location")
        pref_style = prefs.get("style")
        pref_format = prefs.get("format", "either")
        pref_group_size = prefs.get("group_size_preference")

    if session["course"] in user["courses"]:
        score += 40

    if has_availability_overlap(user, session):
        score += 25

    if pref_location and pref_location in session["location"].lower():
        score += 15

    if pref_style and pref_style == session.get("style", "quiet"):
        score += 10

    if pref_format == "either" or pref_format == session.get("format"):
        score += 10

    if pref_group_size and pref_group_size == session.get("group_size_preference"):
        score += 5

    return score

def get_similar_sessions_atlas(db, user, k=20):
    search_string = get_search_string(user)
    
    pipeline = [
            {
                "$search": {
                "index": "user",
                "text": {
                    "query": f"{search_string}",
                    "path": {
                    "wildcard": "*"
                    }
                }
                }
            }
            ]
        

    return list(db.sessions.aggregate(pipeline))

def get_similar_sessions(db, user, k=20):
    user_embedding = embeddings.embed_user_profile(db, user["_id"])
    
    pipeline = [
        {
            "$vectorSearch": {
                "queryVector": user_embedding,
                "path": "embedding",
                "numCandidates": max(k * 5, 50),
                "limit": k,
                "index": VECTOR_INDEX
            }
        }
    ]

    return list(db.sessions.aggregate(pipeline))

def get_similar_users(db, user, k=20):
    user_embedding = embeddings.embed_user_profile(db, user["_id"])
    
    pipeline = [
        {
            "$vectorSearch": {
                "queryVector": user_embedding,
                "path": "embedding",
                "numCandidates": max(k * 5, 50),
                "limit": k,
                "index": "users"
            }
        }
    ]

    return list(db.users.aggregate(pipeline))

def match_user(db, user_id, k=20):
    # Step 1: get vector-similar sessions (compares in embedded)
    user = db.users.find_one({"_id": user_id})
    sessions = get_similar_sessions(db, user, k=k)

    results = []

    # Step 2: apply rule-based filtering and scoring
    for session in sessions:
        if filter(user, session):
            results.append(session)

        # rule_score = score_rule_based(user, session)
        # ai_score = session["_score"]

        # final = 0.7 * rule_score + 0.3 * ai_score

        # results.append({
        #     "session": session,
        #     "score": final
        # })

    return sorted(results, key=lambda x: x["_score"], reverse=True)