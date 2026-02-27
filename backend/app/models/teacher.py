from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class TeacherBase(BaseModel):
    email: EmailStr
    full_name: str
    department: Optional[str] = None

class TeacherCreate(TeacherBase):
    password: str

class TeacherUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    password: Optional[str] = None

class TeacherResponse(TeacherBase):
    id: str = Field(alias="_id")
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime

    class Config:
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[dict] = None

class TokenData(BaseModel):
    email: Optional[str] = None
