import requests
from app.database import get_users_collection

def sync_users_from_api():
    """Fetch users from DummyJSON and store them in MongoDB."""
    url = "https://dummyjson.com/users"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        users = data.get("users", [])
        
        if not users:
            return {"status": "success", "message": "No users found in API response", "count": 0}
        
        users_collection = get_users_collection()
        
        # We'll use 'id' from DummyJSON as a unique identifier to avoid duplicates
        # and store it as 'remote_id' or 'id' in our doc.
        # Pymongo's replace_one with upsert=True is good for this.
        
        inserted_count = 0
        for user in users:
            # Upsert based on the DummyJSON id
            result = users_collection.replace_one(
                {"id": user["id"]},
                user,
                upsert=True
            )
            inserted_count += 1
            
        return {
            "status": "success", 
            "message": f"Successfully synced {inserted_count} users", 
            "count": inserted_count
        }
        
    except requests.RequestException as e:
        return {"status": "error", "message": str(e)}
    except Exception as e:
        return {"status": "error", "message": f"An unexpected error occurred: {str(e)}"}
