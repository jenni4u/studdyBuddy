import os
import pytest

from backend import scoring
from backend import embeddings


def test_vector_search_ranks_expected_session(seed_db):
	n = 5
	user = seed_db.users.find_one({"_id": "user_001"})
	sesh = seed_db.sessions.find_one({"_id": "session_001"})

	print(user.get("name"))
	print(embeddings.build_user_embedding_text(user))
	print(embeddings.build_session_embedding_text(sesh))

	embeddings.embed_user_profile(seed_db, user["_id"])
	user = seed_db.users.find_one({"_id": "user_001"})

	count = 1
	for session in seed_db.sessions.find():
		embeddings.embed_study_session(seed_db, session["_id"])

		updated = seed_db.sessions.find_one({"_id": session["_id"]})
		print(session["_id"])
		print((updated.get("embedding") or "")[:n])

	count = 1
	print(user.get("embedding")[:n])
	l = scoring.get_similar_sessions(seed_db, user, k=20)
	print(f"Found {len(l)} similar sessions")
	for session in l:
		print(session["_id"])
		print(count)
		count += 1
		if count > 10:
			break

	# Verify embeddings exist and are same length
	a = seed_db.users.find_one({"_id": "user_001"})["embedding"]
	b = seed_db.sessions.find_one({"_id": "session_001"})["embedding"]
	print(len(a), len(b))

	# Compute cosine similarity directly
	import math
	def cosine(x, y):
		dot = sum(i*j for i, j in zip(x, y))
		nx = math.sqrt(sum(i*i for i in x))
		ny = math.sqrt(sum(j*j for j in y))
		return dot / (nx * ny)

	print(cosine(a, b))

