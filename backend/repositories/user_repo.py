from db import db
from bson import ObjectId


def find_user_by_username(username):
    """Find a user by username"""
    return db.users.find_one({"username": username})


def find_user_by_user_id(user_id):
    """Find a user by their user_id field"""
    return db.users.find_one({"user_id": user_id})


def find_user_by_db_id(db_id):
    """Find a user by their database _id"""
    return db.users.find_one({"_id": ObjectId(db_id)})


def create_user(username, user_id, pw_hash):
    """Insert a new user into the database"""
    user = {"username": username, "user_id": user_id, "pw_hash": pw_hash}
    result = db.users.insert_one(user)
    return result.inserted_id
