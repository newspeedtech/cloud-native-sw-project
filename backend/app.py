import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)  # Allow React dev server to access API despite being differnt 'origins'

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

#
# Users
#
@app.route("/users", methods=["POST"])
def create_user():
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
    return jsonify({"user_id": str(user_id)}), 201

#
# Hardware
#
@app.route("/hardware", methods=["GET"])
def list_hardware():
    items = list(db.hardware.find())
    for i in items:
        i["_id"] = str(i["_id"])
    return jsonify(items)

@app.route("/hardware/<hw_id>/checkout", methods=["POST"])
def checkout_hardware(hw_id):
    hw = db.hardware.find_one({"_id": ObjectId(hw_id)})
    if not hw:
        return jsonify({"error": "Not found"}), 404
    if hw["available"] <= 0:
        return jsonify({"error": "None available"}), 400
    db.hardware.update_one({"_id": ObjectId(hw_id)}, {"$inc": {"available": -1}})
    hw["available"] -= 1
    hw["_id"] = str(hw["_id"])
    return jsonify(hw)

@app.route("/hardware/<hw_id>/checkin", methods=["POST"])
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

#
# Projects
#
@app.route("/projects", methods=["POST"])
def create_project():
    data = request.json
    slug = data.get("slug")
    name = data.get("name")
    owner_id = data.get("owner")  # string of ObjectId
    user_ids = data.get("users", [])  # list of ObjectId strings

    if not slug or not name or not owner_id:
        return jsonify({"error": "slug, name, and owner required"}), 400

    if db.projects.find_one({"slug": slug}):
        return jsonify({"error": "Slug already exists"}), 400

    user_object_ids = [ObjectId(u) for u in user_ids]

    project = {
        "slug": slug,
        "name": name,
        "owner": ObjectId(owner_id),
        "users": user_object_ids
    }

    project_id = db.projects.insert_one(project).inserted_id

    # Auto-generate hardware for this project
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

@app.route("/projects/<slug>", methods=["GET"])
def get_project(slug):
    project = db.projects.find_one({"slug": slug})
    if not project:
        return jsonify({"error": "Not found"}), 404

    project["_id"] = str(project["_id"])
    project["owner"] = str(project["owner"])
    project["users"] = [str(u) for u in project["users"]]

    # Also return hardware for this project
    hardware = list(db.hardware.find({"project_id": ObjectId(project["_id"])}))
    for h in hardware:
        h["_id"] = str(h["_id"])
    project["hardware"] = hardware

    return jsonify(project)

# Run Flask
if __name__ == "__main__":
    app.run(debug=True)
