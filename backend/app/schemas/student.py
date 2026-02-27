"""
Student request/response schemas for API validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class StudentCreate(BaseModel):
    """Schema for creating a new student."""
    firstName: str = Field(..., min_length=1, max_length=50, description="Student's first name")
    lastName: str = Field(..., min_length=1, max_length=50, description="Student's last name")
    email: str = Field(..., description="Student's email address")
    age: int = Field(..., ge=1, le=150, description="Student's age")
    phone: str = Field(..., min_length=5, max_length=20, description="Student's phone number")
    department: str = Field(..., min_length=1, max_length=100, description="Student's department")
    address: str = Field(..., min_length=1, max_length=300, description="Student's address")


class StudentUpdate(BaseModel):
    """Schema for updating an existing student. All fields optional."""
    firstName: Optional[str] = Field(None, min_length=1, max_length=50)
    lastName: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[str] = None
    age: Optional[int] = Field(None, ge=1, le=150)
    phone: Optional[str] = Field(None, min_length=5, max_length=20)
    department: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = Field(None, min_length=1, max_length=300)


class StudentResponse(BaseModel):
    """Schema for student API responses."""
    id: str = Field(..., description="Student's unique ID")
    firstName: str
    lastName: str
    email: str
    age: int
    phone: str
    department: str
    address: str
    createdAt: str

    class Config:
        populate_by_name = True
