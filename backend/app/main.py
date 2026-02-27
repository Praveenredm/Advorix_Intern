"""
FastAPI application entry point.
Sets up CORS, includes routers, and provides a health-check endpoint.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.student_routes import router as student_router
from app.routes.user_routes import router as user_router

# ---------------------------------------------------------------------------
# App Initialization
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Student Management System API",
    description="A production-ready REST API for managing students and syncing users, built with FastAPI and MongoDB.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the React dev server to reach the API
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

from app.routes.student_routes import router as student_router
from app.routes.user_routes import router as user_router
from app.routes.auth_routes import router as auth_router

# ... inside main.py ...
app.include_router(student_router)
app.include_router(user_router, prefix="/api")
app.include_router(auth_router, prefix="/api")

# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
def health_check():
    """Simple health-check endpoint."""
    return {
        "status": "healthy",
        "message": "Student Management System API is running 🚀",
    }
