from db import db
from bson import ObjectId


def get_hardware_by_project_ids(project_ids):
    """Get all hardware for the given project IDs"""
    items = list(db.hardware.find({"project_id": {"$in": project_ids}}))
    for i in items:
        i["_id"] = str(i["_id"])
        if "project_id" in i:
            try:
                i["project_id"] = str(i["project_id"])
            except Exception:
                i["project_id"] = None
    return items


def find_hardware_by_id(hw_id):
    """Find hardware by ID"""
    return db.hardware.find_one({"_id": ObjectId(hw_id)})


def checkout_hardware_item(hw_id):
    """Decrease available count by 1"""
    db.hardware.update_one({"_id": ObjectId(hw_id)}, {"$inc": {"available": -1}})


def checkin_hardware_item(hw_id):
    """Increase available count by 1"""
    db.hardware.update_one({"_id": ObjectId(hw_id)}, {"$inc": {"available": 1}})
