"""
Student API routes — maps HTTP endpoints to controller functions.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.schemas.student import StudentCreate, StudentUpdate
from app.controllers import student_controller

router = APIRouter(tags=["Students"])


# ---------------------------------------------------------------------------
# CRUD Endpoints
# ---------------------------------------------------------------------------

@router.get("/students")
def list_students(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term"),
    department: Optional[str] = Query(None, description="Filter by department"),
):
    """Get a paginated list of students with optional search and filters."""
    return student_controller.get_all_students(
        page=page, limit=limit, search=search, department=department
    )


@router.get("/students/{student_id}")
def get_student(student_id: str):
    """Get a single student by ID."""
    student = student_controller.get_student_by_id(student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.post("/students", status_code=201)
def create_student(student: StudentCreate):
    """Create a new student."""
    student_data = student.model_dump()
    created = student_controller.create_student(student_data)
    return created


@router.put("/students/{student_id}")
def update_student(student_id: str, student: StudentUpdate):
    """Update an existing student."""
    update_data = student.model_dump()
    updated = student_controller.update_student(student_id, update_data)
    if updated is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated


@router.delete("/students/{student_id}")
def delete_student(student_id: str):
    """Delete a student by ID."""
    deleted = student_controller.delete_student(student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}


# ---------------------------------------------------------------------------
# Seed & Stats Endpoints
# ---------------------------------------------------------------------------

@router.post("/seed-data")
def seed_data():
    """Fetch users from DummyJSON and seed the MongoDB collection."""
    result = student_controller.seed_data_from_api()
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result


@router.get("/stats")
def get_stats():
    """Get dashboard statistics."""
    try:
        return student_controller.get_stats()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not connect to MongoDB. Make sure MongoDB is running. Error: {str(e)}"
        )
