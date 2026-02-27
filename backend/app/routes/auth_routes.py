from fastapi import APIRouter, Depends, status, Body
from app.models.teacher import TeacherCreate, TeacherResponse, Token
from app.controllers import auth_controller

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(teacher: TeacherCreate):
    """Register a new teacher."""
    return auth_controller.signup_teacher(teacher)

@router.post("/login", response_model=Token)
def login(email: str = Body(...), password: str = Body(...)):
    """Authenticate and get access token."""
    return auth_controller.login_teacher(email, password)

@router.post("/google")
def google_auth(
    email: str = Body(...), 
    name: str = Body(...), 
    picture: str = Body(None)
):
    """Authenticate via Google."""
    return auth_controller.google_login_mock(email, name, picture)
