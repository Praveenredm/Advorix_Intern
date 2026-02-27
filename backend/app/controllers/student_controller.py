"""
Student controller — business logic for CRUD operations.
Handles all interactions with the MongoDB students collection.
"""

import requests
from bson import ObjectId
from datetime import datetime
from typing import Optional

from app.database import students_collection


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _student_doc_to_response(doc: dict) -> dict:
    """Convert a MongoDB document to a JSON-safe response dict."""
    doc["id"] = str(doc.pop("_id"))
    if isinstance(doc.get("createdAt"), datetime):
        doc["createdAt"] = doc["createdAt"].isoformat()
    elif doc.get("createdAt") is None:
        doc["createdAt"] = datetime.utcnow().isoformat()
    else:
        doc["createdAt"] = str(doc["createdAt"])
    return doc


# ---------------------------------------------------------------------------
# CRUD Operations
# ---------------------------------------------------------------------------

def get_all_students(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    department: Optional[str] = None,
):
    """Return a paginated, optionally filtered list of students."""
    query = {}

    # Build search filter
    if search:
        query["$or"] = [
            {"firstName": {"$regex": search, "$options": "i"}},
            {"lastName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"department": {"$regex": search, "$options": "i"}},
        ]

    if department:
        query["department"] = {"$regex": department, "$options": "i"}

    total = students_collection.count_documents(query)
    skip = (page - 1) * limit

    students_cursor = (
        students_collection
        .find(query)
        .sort("createdAt", -1)
        .skip(skip)
        .limit(limit)
    )

    students = [_student_doc_to_response(doc) for doc in students_cursor]

    return {
        "students": students,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit,
    }


def get_student_by_id(student_id: str):
    """Return a single student by its ObjectId string."""
    if not ObjectId.is_valid(student_id):
        return None
    doc = students_collection.find_one({"_id": ObjectId(student_id)})
    if doc is None:
        return None
    return _student_doc_to_response(doc)


def create_student(student_data: dict):
    """Insert a new student and return the created document."""
    student_data["createdAt"] = datetime.utcnow()
    result = students_collection.insert_one(student_data)
    doc = students_collection.find_one({"_id": result.inserted_id})
    return _student_doc_to_response(doc)


def update_student(student_id: str, update_data: dict):
    """Update fields on an existing student."""
    if not ObjectId.is_valid(student_id):
        return None

    # Remove None values so we only update provided fields
    update_data = {k: v for k, v in update_data.items() if v is not None}

    if not update_data:
        return get_student_by_id(student_id)

    students_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": update_data},
    )
    return get_student_by_id(student_id)


def delete_student(student_id: str):
    """Delete a student by ID. Returns True if deleted, False otherwise."""
    if not ObjectId.is_valid(student_id):
        return False
    result = students_collection.delete_one({"_id": ObjectId(student_id)})
    return result.deleted_count > 0


# ---------------------------------------------------------------------------
# Seed Data
# ---------------------------------------------------------------------------

DEPARTMENTS = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Business Administration",
    "Economics",
]


def seed_data_from_api():
    """
    Fetch users from https://dummyjson.com/users,
    transform them into student documents, and insert into MongoDB.
    """
    try:
        response = requests.get("https://dummyjson.com/users?limit=30", timeout=10)
        response.raise_for_status()
        users = response.json().get("users", [])
    except requests.RequestException as exc:
        return {"error": f"Failed to fetch data from DummyJSON: {str(exc)}"}

    if not users:
        return {"error": "No users returned from DummyJSON API."}

    students = []
    for i, user in enumerate(users):
        address_obj = user.get("address", {})
        address_str = (
            f"{address_obj.get('address', '')}, "
            f"{address_obj.get('city', '')}, "
            f"{address_obj.get('state', '')} "
            f"{address_obj.get('postalCode', '')}"
        ).strip(", ")

        student = {
            "firstName": user.get("firstName", ""),
            "lastName": user.get("lastName", ""),
            "email": user.get("email", ""),
            "age": user.get("age", 18),
            "phone": user.get("phone", ""),
            "department": DEPARTMENTS[i % len(DEPARTMENTS)],
            "address": address_str or "N/A",
            "createdAt": datetime.utcnow(),
        }
        students.append(student)

    # Clear existing data before seeding
    students_collection.delete_many({})
    result = students_collection.insert_many(students)

    return {
        "message": f"Successfully seeded {len(result.inserted_ids)} students.",
        "count": len(result.inserted_ids),
    }


def get_stats():
    """Return dashboard statistics."""
    total = students_collection.count_documents({})

    # Department breakdown
    pipeline = [
        {"$group": {"_id": "$department", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    dept_breakdown = list(students_collection.aggregate(pipeline))
    departments = {item["_id"]: item["count"] for item in dept_breakdown if item["_id"]}

    # Recent students (last 5)
    recent_cursor = (
        students_collection
        .find()
        .sort("createdAt", -1)
        .limit(5)
    )
    recent = [_student_doc_to_response(doc) for doc in recent_cursor]

    return {
        "totalStudents": total,
        "departments": departments,
        "recentStudents": recent,
    }
