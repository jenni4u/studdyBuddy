import os

import pytest

from backend import embeddings


def test_build_user_embedding_text_includes_defaults_and_availability():
	user = {
		"preferences": {"style": "quiet", "location": "library", "format": "in-person"},
		"learning_style": "visual",
		"courses": ["COMP 202", "MATH 240"],
		"availability": [
			{"day": "Mon", "start": "10:00", "end": "12:00"},
			{"day": "Wed", "start": "14:00", "end": "16:00"},
		],
	}

	text = embeddings.build_user_embedding_text(user)

	assert "Study preferences: quiet style, library location, in-person time." in text
	assert "Courses: COMP 202, MATH 240." in text
	assert "Available on: Mon, Wed." in text


def test_build_user_embedding_text_handles_missing_fields():
	user = {"courses": []}

	text = embeddings.build_user_embedding_text(user)

	assert "Study preferences: not specified style, not specified location, not specified time." in text
	assert "Courses: ." in text


def test_build_session_embedding_text_defaults():
	session = {
		"course": "COMP 202",
		"location": "main library",
		"description": "Exam prep",
	}

	text = embeddings.build_session_embedding_text(session)

	assert "Course: COMP 202" in text
	assert "Location: main library" in text
	assert "Study style: quiet" in text
	assert "Format: in-person" in text
	assert "Description: Exam prep" in text


def test_generate_embedding_uses_model(monkeypatch):
	def fake_embed_content(text):
		return {"embedding": [0.1, 0.2, 0.3]}

	monkeypatch.setattr(embeddings.embedding_model, "embed_content", fake_embed_content)

	result = embeddings.generate_embedding("hello")

	assert result == [0.1, 0.2, 0.3]


@pytest.mark.skipif(
	os.environ.get("RUN_GEMINI_TESTS") != "1",
	reason="Set RUN_GEMINI_TESTS=1 to call the real Gemini API",
)
def test_generate_embedding_real_api_returns_vector():
	result = embeddings.generate_embedding("test embedding")

	assert isinstance(result, list)
	assert len(result) == 768


def test_embed_user_profile_saves_embedding(seed_db, monkeypatch):
	monkeypatch.setattr(embeddings, "generate_embedding", lambda text: [1.0, 2.0])

	embedding = embeddings.embed_user_profile(seed_db, "user_001")

	assert embedding == [1.0, 2.0]
	updated = seed_db.users.find_one({"_id": "user_001"})
	assert updated["embedding"] == [1.0, 2.0]


def test_embed_user_profile_missing_user_raises(seed_db):
	with pytest.raises(ValueError, match="User not found"):
		embeddings.embed_user_profile(seed_db, "missing")


def test_embed_study_session_saves_embedding(seed_db, monkeypatch):
	monkeypatch.setattr(embeddings, "generate_embedding", lambda text: [0.5, 0.6])

	embedding = embeddings.embed_study_session(seed_db, "session_embed_001")

	assert embedding == [0.5, 0.6]
	updated = seed_db.study_sessions.find_one({"_id": "session_embed_001"})
	assert updated["embedding"] == [0.5, 0.6]


def test_embed_study_session_missing_session_raises(seed_db):
	with pytest.raises(ValueError, match="Study session not found"):
		embeddings.embed_study_session(seed_db, "missing")


@pytest.mark.skipif(
	os.environ.get("RUN_GEMINI_TESTS") != "1",
	reason="Set RUN_GEMINI_TESTS=1 to call the real Gemini API",
)
def test_real_embedding_persists_and_overwrites(seed_db):
	user_id = "user_001"
	first = embeddings.embed_user_profile(seed_db, user_id)
	assert isinstance(first, list)
	assert len(first) == 768

	stored = seed_db.users.find_one({"_id": user_id})
	assert stored["embedding"] == first

	second = embeddings.embed_user_profile(seed_db, user_id)
	stored_again = seed_db.users.find_one({"_id": user_id})
	assert stored_again["embedding"] == second
