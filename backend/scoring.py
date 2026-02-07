def filter(user, session):
    # Session must have space
    if len(session["current_members"]) >= session["max_size"]:
        return False

    # # Check if session has an embedding
    # if "embedding" not in session:
    #     return False

    # # Calculate cosine similarity
    # user_embedding = user["embedding"]
    # session_embedding = session["embedding"]

    # similarity = cosine_similarity(user_embedding, session_embedding)

    # # Define a threshold for matching (this can be tuned)
    # threshold = 0.7

    return True

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

def score_rule_based(user, session):
    score = 0

    if session["course"] in user["courses"]:
        score += 40

    if has_availability_overlap(user, session):
        score += 25

    if user["preferences"]["location"].lower() in session["location"].lower():
        score += 15

    if user["preferences"]["style"] == session.get("style", "quiet"):
        score += 10

    pref_format = user["preferences"].get("format", "either")
    if pref_format == "either" or pref_format == session.get("format"):
        score += 10

    if len(session["current_members"]) < session["max_size"]:
        score += 5

    return score

def get_similar_sessions(db, user_embedding, k=10):
    pipeline = [
        {
            "$vectorSearch": {
                "queryVector": user_embedding,
                "path": "embedding",
                "numCandidates": 100,
                "limit": k,
                "index": "default"
            }
        }
    ]

    return list(db.sessions.aggregate(pipeline))

def match_user(db, user):
    # Step 1: get vector-similar sessions (compares in embedded)
    sessions = get_similar_sessions(db, user["embedding"], k=20)

    results = []

    # Step 2: apply rule-based filtering and scoring
    for session in sessions:
        if not filter(user, session):
            continue

        rule_score = score_rule_based(user, session)
        ai_score = session["_score"]

        final = 0.7 * rule_score + 0.3 * ai_score

        results.append({
            "session": session,
            "score": final
        })

    return sorted(results, key=lambda x: x["score"], reverse=True)