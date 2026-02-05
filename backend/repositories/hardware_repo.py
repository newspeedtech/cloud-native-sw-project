from db import db
from bson import ObjectId


def get_all_hardware():
    """Get all hardware (global - only 2 sets)"""
    items = list(db.hardware.find({}))
    for i in items:
        i["_id"] = str(i["_id"])
        # Ensure checkouts field exists, defaulting to empty dict
        if "checkouts" not in i:
            i["checkouts"] = {}
    return items


def find_hardware_by_id(hw_id):
    """Find hardware by ID"""
    return db.hardware.find_one({"_id": ObjectId(hw_id)})


def checkout_hardware_item(hw_id, quantity=1, project_id=None):
    """Decrease available count by quantity and track by project"""
    update_obj = {"$inc": {"available": -quantity}}
    if project_id:
        update_obj["$inc"][f"checkouts.{project_id}"] = quantity
    db.hardware.update_one({"_id": ObjectId(hw_id)}, update_obj)


def checkin_hardware_item(hw_id, quantity=1, project_id=None):
    """Increase available count by quantity and track by project"""
    update_obj = {"$inc": {"available": quantity}}
    if project_id:
        update_obj["$inc"][f"checkouts.{project_id}"] = -quantity
    db.hardware.update_one({"_id": ObjectId(hw_id)}, update_obj)


def initialize_hardware():
    """Initialize the 2 global hardware sets (clears existing hardware and project references)"""
    # Delete all hardware
    delete_result = db.hardware.delete_many({})
    
    # Remove any hardware fields from projects (cleanup if they exist)
    db.projects.update_many({}, {"$unset": {"hardware": ""}})
    
    # Create the 2 global hardware sets
    insert_result = db.hardware.insert_many([
        {"name": "HWSet1", "capacity": 100, "description": "This is hardware set 1.", "available": 100, "checkouts": {}},
        {"name": "HWSet2", "capacity": 100, "description": "This is hardware set 2.", "available": 100, "checkouts": {}}
    ])
    return delete_result.deleted_count, len(insert_result.inserted_ids)
