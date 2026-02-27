from fastapi import APIRouter, HTTPException
from app.controllers.user_service import sync_users_from_api
from app.database import get_users_collection

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/sync")
async def sync_users():
    """Trigger synchronization from DummyJSON API to MongoDB."""
    result = sync_users_from_api()
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/")
async def get_users():
    """Retrieve all users stored in MongoDB."""
    users_collection = get_users_collection()
    # Exclude _id from results for easier JSON serialization if needed, 
    # but DummyJSON users have their own 'id'.
    users = list(users_collection.find({}, {"_id": 0}))
    return {"users": users, "count": len(users)}
