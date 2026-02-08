import os

import pytest

from backend import embeddings
from backend.scoring import match_user, score_rule_based


def test_score_rule_based_orders_by_match_quality():
	user = {
		"courses": ["COMP 202"],
		"preferences": {
			"location": "library",
			"style": "quiet",
			"format": "in-person",
			"group_size_preference": "small",
		},
		"availability": [
			{"day": "Mon", "start": "10:00", "end": "12:00"},
		],
	}

	session_best = {
		"course": "COMP 202",
		"location": "main library room 204",
		"style": "quiet",
		"format": "in-person",
		"time": {"day": "Mon", "start": "10:30", "end": "11:30"},
		"current_members": [],
		"max_size": 4,
		"difficulty": "hard",
		"group_size_preference": "small",
	}

	session_ok = {
		"course": "COMP 202",
		"location": "cafe",
		"style": "collaborative",
		"format": "online",
		"time": {"day": "Mon", "start": "10:30", "end": "11:30"},
		"current_members": ["user_001"],
		"max_size": 4,
		"difficulty": "easy",
		"group_size_preference": "large",
	}

	session_course_miss = {
		"course": "MATH 240",
		"location": "main library room 204",
		"style": "quiet",
		"format": "in-person",
		"time": {"day": "Mon", "start": "10:30", "end": "11:30"},
		"current_members": [],
		"max_size": 4,
		"difficulty": "medium",
		"group_size_preference": "small",
	}

	score_best = score_rule_based(user, session_best)
	score_ok = score_rule_based(user, session_ok)
	score_course_miss = score_rule_based(user, session_course_miss)

	assert score_best == 90
	assert score_ok == 65
	assert score_course_miss == 50

def test_score_rule_based_ignores_difficulty_field():
	user = {
		"courses": ["COMP 202"],
		"preferences": {
			"location": "library",
			"style": "quiet",
			"format": "in-person",
			"group_size_preference": "small",
		},
		"availability": [
			{"day": "Mon", "start": "10:00", "end": "12:00"},
		],
	}

	base_session = {
		"course": "COMP 202",
		"location": "main library room 204",
		"style": "quiet",
		"format": "in-person",
		"time": {"day": "Mon", "start": "10:30", "end": "11:30"},
		"current_members": [],
		"max_size": 4,
		"difficulty": "easy",
		"group_size_preference": "small",
	}

	varied_session = {**base_session, "difficulty": "hard"}

	assert score_rule_based(user, base_session) == score_rule_based(user, varied_session)


def test_score_rule_based_group_size_preference_influences_score():
	user = {
		"courses": ["COMP 202"],
		"preferences": {
			"location": "library",
			"style": "quiet",
			"format": "in-person",
			"group_size_preference": "small",
		},
		"availability": [
			{"day": "Mon", "start": "10:00", "end": "12:00"},
		],
	}

	base_session = {
		"course": "COMP 202",
		"location": "main library room 204",
		"style": "quiet",
		"format": "in-person",
		"time": {"day": "Mon", "start": "10:30", "end": "11:30"},
		"current_members": [],
		"max_size": 4,
		"difficulty": "easy",
		"group_size_preference": "small",
	}

	large_group_session = {**base_session, "group_size_preference": "large"}

	assert score_rule_based(user, base_session) > score_rule_based(user, large_group_session)

def test_full_pipeline_ranking_with_filters_and_scoring(seed_db):
	seed_db.sessions.update_many({}, {"$unset": {"embedding": ""}})

	user = seed_db.users.find_one({"_id": "user_vec_001"})
	user_embedding = embeddings.generate_embedding(embeddings.build_user_embedding_text(user))
	user["embedding"] = user_embedding

	session_ids = ["session_pipe_a", "session_pipe_b", "session_pipe_c", "session_pipe_d"]
	for session_id in session_ids:
		session = seed_db.sessions.find_one({"_id": session_id})
		text = embeddings.build_session_embedding_text(session)
		embedding = embeddings.generate_embedding(text)
		seed_db.sessions.update_one({"_id": session_id}, {"$set": {"embedding": embedding}})

	results = match_user(db=seed_db, user=user)
	ordered_ids = [item["session"]["_id"] for item in results]

	assert ordered_ids[:3] == ["session_pipe_a", "session_pipe_b", "session_pipe_c"]
	assert "session_pipe_d" not in ordered_ids
