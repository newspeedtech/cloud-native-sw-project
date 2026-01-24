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
# MongoDB setup
# ----------------------
uri = os.environ.get("MONGO_URI")
if not uri:
    raise ValueError("MONGO_URI environment variable not set")
client = MongoClient(uri, server_api=ServerApi('1'), serverSelectionTimeoutMS=5000)
db = client["the_db"]

# Test connection
try:
    client.admin.command('ping')
    print("Pinged your MongoDB deployment. Connection successful!")
except Exception as e:
    print("Failed to ping MongoDB:", e)

# ----------------------
# Users
# ----------------------
@app.route("/users", methods=["POST"])
def create_user():
    """Signup route"""
    data = request.json
    username = data.get("username")
    password = data.get("password")
    chosen_user_id = data.get("user_id")

    if not username or not password or not chosen_user_id:
        return jsonify({"error": "Username, user_id and password required"}), 400

    if db.users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    if db.users.find_one({"user_id": chosen_user_id}):
        return jsonify({"error": "User ID already exists"}), 400

    pw_hash = generate_password_hash(password)
    user = {"username": username, "user_id": chosen_user_id, "pw_hash": pw_hash}
    user_db_id = db.users.insert_one(user).inserted_id

    # Generate JWT for new user (use DB id)
    access_token = create_access_token(identity=str(user_db_id))

    return jsonify({
        "user_id": chosen_user_id,
        "user_db_id": str(user_db_id),
        "access_token": access_token
    }), 201

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
        if "project_id" in i:
            try:
                i["project_id"] = str(i["project_id"])
            except Exception:
                i["project_id"] = None
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
# Projects
# ----------------------
@app.route("/projects", methods=["GET", "POST"])
@jwt_required()
def projects():
    user_id = get_jwt_identity()  # signed-in user

    if request.method == "POST":
        data = request.json
        slug = data.get("slug")
        name = data.get("name")
        description = data.get("description", "")

        if not slug or not name:
            return jsonify({"error": "slug and name required"}), 400

        if db.projects.find_one({"slug": slug}):
            return jsonify({"error": "Slug already exists"}), 400

        project = {
            "slug": slug,
            "name": name,
            "description": description,
            "owner": ObjectId(user_id),
            "users": [ObjectId(user_id)]
        }

        project_id = db.projects.insert_one(project).inserted_id

        # Auto-generate hardware
        hw1 = {
            "name": "HardwareSet1",
            "description": f"Auto-generated for project {slug}",
            "capacity": 10,
            "available": 10,
            "project_id": project_id
        }
        hw2 = {
            "name": "HardwareSet2",
            "description": f"Auto-generated for project {slug}",
            "capacity": 10,
            "available": 10,
            "project_id": project_id
        }
        db.hardware.insert_many([hw1, hw2])

        return jsonify({"project_id": str(project_id)}), 201

    elif request.method == "GET":
        # List all projects for this user
        projects_cursor = db.projects.find({"users": ObjectId(user_id)})
        projects = []
        for p in projects_cursor:
            projects.append({
                "id": str(p["_id"]),
                "name": p["name"],
                "slug": p["slug"],
                "owner": str(p["owner"]),
                "users": [str(u) for u in p["users"]],
                "description": p.get("description", "")
            })
        return jsonify(projects), 200


@app.route("/projects/<slug>", methods=["GET"])
@jwt_required()
def get_project(slug):
    project = db.projects.find_one({"slug": slug})
    if not project:
        return jsonify({"error": "Not found"}), 404

    project["_id"] = str(project["_id"])
    project["owner"] = str(project["owner"])
    project["users"] = [str(u) for u in project["users"]]

    hardware = list(db.hardware.find({"project_id": ObjectId(project["_id"])}))
    for h in hardware:
        h["_id"] = str(h["_id"])
    project["hardware"] = hardware

    return jsonify(project)

# ----------------------
# Run Flask
# ----------------------
if __name__ == "__main__":
    app.run(debug=True)
