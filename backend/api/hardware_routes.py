from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.hardware_service import (
    list_user_hardware,
    checkout_hardware as checkout_service,
    checkin_hardware as checkin_service
)

hardware_bp = Blueprint("hardware", __name__)


@hardware_bp.route("/hardware", methods=["GET"])
@jwt_required()
def list_hardware():
    """Get all hardware from projects the user is a member of"""
    user_id = get_jwt_identity()
    items = list_user_hardware(user_id)
    return jsonify(items)


@hardware_bp.route("/hardware/<hw_id>/checkout", methods=["POST"])
@jwt_required()
def checkout_hardware(hw_id):
    """Checkout hardware (decrease available count)"""
    user_id = get_jwt_identity()
    success, message, data = checkout_service(hw_id, user_id)
    
    if not success:
        status_code = 404 if message == "Not found" else 400
        return jsonify({"error": message}), status_code
    
    return jsonify(data)


@hardware_bp.route("/hardware/<hw_id>/checkin", methods=["POST"])
@jwt_required()
def checkin_hardware(hw_id):
    """Check in hardware (increase available count)"""
    success, message, data = checkin_service(hw_id)
    
    if not success:
        status_code = 404 if message == "Not found" else 400
        return jsonify({"error": message}), status_code
    
    return jsonify(data)
