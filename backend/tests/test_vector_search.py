import os

import pytest

from backend import scoring


def test_vector_search_ranks_expected_session(seed_db):
	user = seed_db.users.find_one({"_id": "user_vec_001"})
	print(user.get("_id"))

	count = 1

	for session in seed_db.sessions.find():
		print(session["_id"])
		print(count)
		count += 1
		if count > 10:
			break

	count = 1
	for session in scoring.get_similar_sessions(seed_db, user, k=20):
		print(session["_id"], session["_score"])
		print(count)
		count += 1
		if count > 10:
			break

	print("----")

