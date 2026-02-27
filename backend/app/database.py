"""
Database connection module.
Connects to MongoDB using pymongo and exports the students collection.
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "Mongo")

# Create MongoDB client with a short timeout for the initial check
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)

# Get database
db = client[DB_NAME]

# Get collections
students_collection = db["students"]
users_collection = db["users"]

def check_connection():
    """Verify MongoDB connection."""
    try:
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        return True
    except Exception:
        return False

# Perform initial check
if not check_connection():
    print("\n" + "!"*60)
    print("CRITICAL: Could not connect to MongoDB at " + MONGO_URI)
    print("Please ensure MongoDB is installed and running.")
    print("!"*60 + "\n")

def get_database():
    """Return the database instance."""
    return db

def get_students_collection():
    """Return the students collection."""
    return students_collection

def get_users_collection():
    return db["users"]

def get_teachers_collection():
    return db["teachers"]
