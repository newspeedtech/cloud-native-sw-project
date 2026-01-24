from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.project_service import (
    create_new_project,
    get_user_projects as get_user_projects_service,
    get_project_details,
    join_project as join_project_service
)

project_bp = Blueprint("projects", __name__)


@project_bp.route("/projects", methods=["GET", "POST"])
@jwt_required()
def projects():
    """Get all user projects or create a new project"""
    user_id = get_jwt_identity()
    
    if request.method == "POST":
        data = request.json or {}
        slug = data.get("slug")
        name = data.get("name")
        description = data.get("description", "")

        if not slug or not name:
            return jsonify({"error": "slug and name required"}), 400

        success, message, result = create_new_project(slug, name, description, user_id)
        
        if not success:
            return jsonify({"error": message}), 400
        
        return jsonify(result), 201
    
    # GET request
    projects = get_user_projects_service(user_id)
    return jsonify(projects), 200


@project_bp.route("/projects/<slug>", methods=["GET"])
@jwt_required()
def get_project(slug):
    """Get project details by slug"""
    success, message, data = get_project_details(slug)
    
    if not success:
        return jsonify({"error": message}), 404
    
    return jsonify(data)


@project_bp.route("/projects/<slug>/join", methods=["POST"])
@jwt_required()
def join_project(slug):
    """Join a project by slug"""
    user_id = get_jwt_identity()
    success, message, data = join_project_service(slug, user_id)
    
    if not success:
        status_code = 404 if message == "Project not found" else 400
        return jsonify({"error": message}), status_code
    
    return jsonify({"message": message, **data}), 200
