from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status
from app.database import get_teachers_collection
from app.models.teacher import TeacherCreate, TeacherResponse
from app.utils.auth import get_password_hash, verify_password, create_access_token

def signup_teacher(teacher_data: TeacherCreate):
    teachers_collection = get_teachers_collection()
    
    # Check if email exists
    if teachers_collection.find_one({"email": teacher_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A teacher with this email already exists"
        )
    
    new_teacher = teacher_data.model_dump()
    new_teacher["password"] = get_password_hash(new_teacher["password"])
    new_teacher["created_at"] = datetime.utcnow()
    new_teacher["is_active"] = True
    new_teacher["is_verified"] = False
    
    result = teachers_collection.insert_one(new_teacher)
    
    # Mock email confirmation
    # In a real app, send email with a link to /verify?token=...
    print(f"--- MOCK EMAIL ---")
    print(f"To: {teacher_data.email}")
    print(f"Subject: Confirm your Teacher account")
    print(f"Body: Welcome to StudentHub! Click here to confirm your account.")
    print(f"------------------")
    
    new_teacher["_id"] = str(result.inserted_id)
    return new_teacher

def login_teacher(email, password):
    teachers_collection = get_teachers_collection()
    teacher = teachers_collection.find_one({"email": email})
    
    if not teacher or not verify_password(password, teacher["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": teacher["email"]})
    return {"access_token": access_token, "token_type": "bearer", "user": {
        "email": teacher["email"],
        "full_name": teacher.get("full_name"),
        "id": str(teacher.get("_id"))
    }}

def google_login_mock(email, name, picture):
    teachers_collection = get_teachers_collection()
    teacher = teachers_collection.find_one({"email": email})
    
    if not teacher:
        # Create new teacher via Google
        new_teacher = {
            "email": email,
            "full_name": name,
            "picture": picture,
            "created_at": datetime.utcnow(),
            "is_active": True,
            "is_verified": True, # Google emails are already verified
            "provider": "google"
        }
        result = teachers_collection.insert_one(new_teacher)
        teacher = new_teacher
        teacher["_id"] = result.inserted_id
    
    access_token = create_access_token(data={"sub": teacher["email"]})
    return {"access_token": access_token, "token_type": "bearer", "user": {
        "email": teacher["email"],
        "full_name": teacher.get("full_name"),
        "id": str(teacher.get("_id"))
    }}
