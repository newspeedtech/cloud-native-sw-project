from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from db import db   # shared db module (see below)

project_bp = Blueprint("projects", __name__)

@project_bp.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    data = request.json or {}
    slug = data.get("slug")
    name = data.get("name")
    user_id = get_jwt_identity()

    if not slug or not name:
        return jsonify({"error": "slug and name required"}), 400

    if db.projects.find_one({"slug": slug}):
        return jsonify({"error": "Slug already exists"}), 400

    project = {
        "slug": slug,
        "name": name,
        "owner": ObjectId(user_id),
        "users": [ObjectId(user_id)]
    }

    project_id = db.projects.insert_one(project).inserted_id

    db.hardware.insert_many([
        {
            "name": "HardwareSet1",
            "description": f"Auto-generated for project {slug}",
            "capacity": 10,
            "available": 10,
            "project_id": project_id
        },
        {
            "name": "HardwareSet2",
            "description": f"Auto-generated for project {slug}",
            "capacity": 10,
            "available": 10,
            "project_id": project_id
        }
    ])

    return jsonify({"project_id": str(project_id)}), 201


@project_bp.route("/projects/<slug>", methods=["GET"])
@jwt_required()
def get_project(slug):
    project = db.projects.find_one({"slug": slug})
    if not project:
        return jsonify({"error": "Not found"}), 404

    project_id = project["_id"]

    project["_id"] = str(project_id)
    project["owner"] = str(project["owner"])
    project["users"] = [str(u) for u in project["users"]]

    hardware = list(db.hardware.find({"project_id": project_id}))
    for h in hardware:
        h["_id"] = str(h["_id"])
        h["project_id"] = str(h["project_id"])

    project["hardware"] = hardware
    return jsonify(project)
