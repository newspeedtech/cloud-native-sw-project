print("🔥 USER ROUTES FILE LOADED 🔥", __file__)
from flask import Blueprint, request, jsonify
from backend.services.user_service import signup_user, login_user

user_bp = Blueprint("users", __name__)


@user_bp.route("/api/users", methods=["POST", "OPTIONS"])
def create_user():
    print("🟢 USERS ROUTE HIT:", request.method)

    # Handle preflight request
    if request.method == "OPTIONS":
        return "", 200

    """Signup route"""
    data = request.json
    username = data.get("username")
    password = data.get("password")
    chosen_user_id = data.get("user_id")

    if not username or not password or not chosen_user_id:
        return jsonify({"error": "Username, user_id and password required"}), 400

    success, message, data = signup_user(username, chosen_user_id, password)
    
    if not success:
        return jsonify({"error": message}), 400
    
    return jsonify(data), 201


@user_bp.route("/api/login", methods=["POST"])
def login():
    """Login route"""
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    success, message, result = login_user(username, password)
    
    if not success:
        return jsonify({"error": message}), 401
    
    return jsonify(result)
