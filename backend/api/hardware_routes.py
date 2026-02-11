from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.services.hardware_service import (
    list_user_hardware,
    checkout_hardware as checkout_service,
    checkin_hardware as checkin_service,
    initialize_hardware as initialize_service
)

hardware_bp = Blueprint("hardware", __name__)


@hardware_bp.route("/api/hardware", methods=["GET"])
@jwt_required()
def list_hardware():
    """Get all global hardware sets (2 sets shared between all projects)"""
    user_id = get_jwt_identity()
    items = list_user_hardware(user_id)
    return jsonify(items)


@hardware_bp.route("/api/hardware/<hw_id>/checkout", methods=["POST"])
@jwt_required()
def checkout_hardware(hw_id):
    """Checkout hardware (decrease available count)"""
    user_id = get_jwt_identity()
    data = request.json or {}
    quantity = data.get("quantity", 1)
    project_id = data.get("project_id")
    
    if not project_id:
        return jsonify({"error": "project_id required"}), 400
    
    try:
        quantity = int(quantity)
        if quantity <= 0:
            return jsonify({"error": "Quantity must be positive"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid quantity"}), 400
    
    success, message, result = checkout_service(hw_id, user_id, quantity, project_id)
    
    if not success:
        status_code = 404 if message == "Not found" else 400
        return jsonify({"error": message}), status_code
    
    return jsonify(result)


@hardware_bp.route("/api/hardware/<hw_id>/checkin", methods=["POST"])
@jwt_required()
def checkin_hardware(hw_id):
    """Check in hardware (increase available count)"""
    data = request.json or {}
    quantity = data.get("quantity", 1)
    project_id = data.get("project_id")
    
    if not project_id:
        return jsonify({"error": "project_id required"}), 400
    
    try:
        quantity = int(quantity)
        if quantity <= 0:
            return jsonify({"error": "Quantity must be positive"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid quantity"}), 400
    
    success, message, result = checkin_service(hw_id, quantity, project_id)
    
    if not success:
        status_code = 404 if message == "Not found" else 400
        return jsonify({"error": message}), status_code
    
    return jsonify(result)


# You can hit this endpoint with `curl -X POST http://localhost:5000/hardware/initialize`
@hardware_bp.route("/api/hardware/initialize", methods=["POST"])
def initialize_hardware():
    """Initialize the 2 global hardware sets (clears existing hardware)"""
    success, message, data = initialize_service()
    
    if not success:
        return jsonify({"error": message}), 500
    
    return jsonify({
        "message": message,
        **data
    }), 200
