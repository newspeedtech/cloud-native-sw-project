import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# ----------------------
# MongoDB setup
# ----------------------
uri = os.environ.get("MONGO_URI")
if not uri:
    raise ValueError("MONGO_URI environment variable not set")
client = MongoClient(uri, server_api=ServerApi('1'), serverSelectionTimeoutMS=5000)

# Test MongoDB connection
try:
    client.admin.command('ping')
    print("Pinged your MongoDB deployment. Connection successful!")
except Exception as e:
    print("Failed to ping MongoDB:", e)
    
db = client["the_db"]

