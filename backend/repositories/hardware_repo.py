from db import db
from bson import ObjectId


def get_all_hardware():
    """Get all hardware (global - only 2 sets)"""
    items = list(db.hardware.find({}))
    for i in items:
        i["_id"] = str(i["_id"])
    return items


def find_hardware_by_id(hw_id):
    """Find hardware by ID"""
    return db.hardware.find_one({"_id": ObjectId(hw_id)})


def checkout_hardware_item(hw_id, quantity=1):
    """Decrease available count by quantity"""
    db.hardware.update_one({"_id": ObjectId(hw_id)}, {"$inc": {"available": -quantity}})


def checkin_hardware_item(hw_id, quantity=1):
    """Increase available count by quantity"""
    db.hardware.update_one({"_id": ObjectId(hw_id)}, {"$inc": {"available": quantity}})


def initialize_hardware():
    """Initialize the 2 global hardware sets (clears existing hardware)"""
    delete_result = db.hardware.delete_many({})
    insert_result = db.hardware.insert_many([
        {"name": "HWSet1", "capacity": 100, "description": "This is hardware set 1.", "available": 100},
        {"name": "HWSet2", "capacity": 100, "description": "This is hardware set 2.", "available": 100}
    ])
    return delete_result.deleted_count, len(insert_result.inserted_ids)
