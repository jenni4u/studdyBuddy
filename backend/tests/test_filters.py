from backend.scoring import filter as session_filter
from backend.scoring import has_availability_overlap


def test_seeded_collections(seed_db):
    '''check seeded test database has data'''
    assert seed_db.users.count_documents({}) > 0
    assert seed_db.sessions.count_documents({}) > 0


def test_availability_overlap(seed_db):
    user = seed_db.users.find_one({"_id": "user_001"})
    session = seed_db.sessions.find_one({"_id": "session_001"})
    assert has_availability_overlap(user, session) is True


def test_availability_overlap_multiple_pairings(seed_db):
    cases = [
        ("user_001", "session_001", True),
        ("user_001", "session_002", False),
        ("user_002", "session_002", True),
        ("user_002", "session_006", False),
        ("user_006", "session_004", True),
        ("user_006", "session_007", True),
    ]

    for user_id, session_id, expected in cases:
        user = seed_db.users.find_one({"_id": user_id})
        session = seed_db.sessions.find_one({"_id": session_id})
        assert has_availability_overlap(user, session) is expected


def test_availability_overlap_edge_cases():
    user = {
        "availability": [
            {"day": "Mon", "start": "10:00", "end": "12:00"},
            {"day": "Wed", "start": "14:00", "end": "16:00"},
        ]
    }

    cases = [
        ({"day": "Mon", "start": "10:00", "end": "12:00"}, True),
        ({"day": "Mon", "start": "11:00", "end": "13:00"}, True),
        ({"day": "Mon", "start": "09:00", "end": "11:00"}, True),
        ({"day": "Mon", "start": "10:30", "end": "11:00"}, True),
        ({"day": "Mon", "start": "08:00", "end": "09:00"}, False),
        ({"day": "Mon", "start": "12:00", "end": "13:00"}, False),
        ({"day": "Tue", "start": "10:00", "end": "11:00"}, False),
        ({"day": "Wed", "start": "16:00", "end": "17:00"}, False),
    ]

    for session_time, expected in cases:
        session = {"time": session_time}
        assert has_availability_overlap(user, session) is expected


def test_filter_respects_capacity(seed_db):

    user = seed_db.users.find_one({"_id": "user_001"})
    full_session = seed_db.sessions.find_one({"_id": "session_full_001"})
    open_session = seed_db.sessions.find_one({"_id": "session_open_001"})

    assert session_filter(user, full_session) is False
    assert session_filter(user, open_session) is True




