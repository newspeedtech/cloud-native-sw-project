from repositories.user_repo import (
    find_user_by_username,
    find_user_by_user_id,
    create_user as create_user_repo
)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token


def signup_user(username, user_id, password):
    """
    Register a new user
    Returns: (success: bool, message: str, data: dict or None)
    """
    # Check if username already exists
    if find_user_by_username(username):
        return False, "Username already exists", None
    
    # Check if user_id already exists
    if find_user_by_user_id(user_id):
        return False, "User ID already exists", None
    
    # Hash password and create user
    pw_hash = generate_password_hash(password)
    user_db_id = create_user_repo(username, user_id, pw_hash)
    
    # Generate JWT
    access_token = create_access_token(identity=str(user_db_id))
    
    return True, "User created successfully", {
        "user_id": user_id,
        "user_db_id": str(user_db_id),
        "access_token": access_token
    }


def login_user(username, password):
    """
    Authenticate a user
    Returns: (success: bool, message: str, data: dict or None)
    """
    user = find_user_by_username(username)
    
    if not user or not check_password_hash(user["pw_hash"], password):
        return False, "Invalid credentials", None
    
    # Generate JWT
    access_token = create_access_token(identity=str(user["_id"]))
    
    return True, "Login successful", {
        "user_id": str(user["_id"]),
        "access_token": access_token
    }
