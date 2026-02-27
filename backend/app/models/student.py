"""
Student Pydantic models for MongoDB document structure.
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class StudentModel(BaseModel):
    """Represents a student document in MongoDB."""
    id: Optional[str] = Field(None, alias="_id")
    firstName: str
    lastName: str
    email: str
    age: int
    phone: str
    department: str
    address: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
