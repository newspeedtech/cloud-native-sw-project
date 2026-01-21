import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
import datetime

# ----------------------
# Flask setup
# ----------------------
app = Flask(__name__)
CORS(app)

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)
jwt = JWTManager(app)

# ----------------------
# Database (shared)
# ----------------------
from db import db   

# Test connection
try:
    client.admin.command('ping')
    print("Pinged your MongoDB deployment. Connection successful!")
except Exception as e:
    print("Failed to ping MongoDB:", e)

# ----------------------
# Register Blueprints
# ----------------------
from api.project_routes import project_bp
app.register_blueprint(project_bp)

# ----------------------
# Users
# ----------------------
@app.route("/users", methods=["POST"])
def create_user():
    """Signup route"""
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if db.users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    pw_hash = generate_password_hash(password)
    user = {"username": username, "pw_hash": pw_hash}
    user_id = db.users.insert_one(user).inserted_id

    # Generate JWT for new user
    access_token = create_access_token(identity=str(user_id))

    return jsonify({"user_id": str(user_id), "access_token": access_token}), 201

@app.route("/login", methods=["POST"])
def login():
    """Login route"""
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = db.users.find_one({"username": username})
    if not user or not check_password_hash(user["pw_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user["_id"]))

    return jsonify({"user_id": str(user["_id"]), "access_token": access_token})

# ----------------------
# Hardware
# ----------------------
@app.route("/hardware", methods=["GET"])
def list_hardware():
    items = list(db.hardware.find())
    for i in items:
        i["_id"] = str(i["_id"])
    return jsonify(items)

@app.route("/hardware/<hw_id>/checkout", methods=["POST"])
@jwt_required()
def checkout_hardware(hw_id):
    hw = db.hardware.find_one({"_id": ObjectId(hw_id)})
    if not hw:
        return jsonify({"error": "Not found"}), 404
    if hw["available"] <= 0:
        return jsonify({"error": "None available"}), 400

    user_id = get_jwt_identity()  # user making this checkout
    db.hardware.update_one({"_id": ObjectId(hw_id)}, {"$inc": {"available": -1}})
    hw["available"] -= 1
    hw["_id"] = str(hw["_id"])
    hw["checked_out_by"] = user_id
    return jsonify(hw)

@app.route("/hardware/<hw_id>/checkin", methods=["POST"])
@jwt_required()
def checkin_hardware(hw_id):
    hw = db.hardware.find_one({"_id": ObjectId(hw_id)})
    if not hw:
        return jsonify({"error": "Not found"}), 404
    if hw["available"] >= hw["capacity"]:
        return jsonify({"error": "Already full"}), 400

    db.hardware.update_one({"_id": ObjectId(hw_id)}, {"$inc": {"available": 1}})
    hw["available"] += 1
    hw["_id"] = str(hw["_id"])
    return jsonify(hw)

# ----------------------
# Run Flask
# ----------------------
if __name__ == "__main__":
    app.run(debug=True)
