from repositories.hardware_repo import (
    get_hardware_by_project_ids,
    find_hardware_by_id,
    checkout_hardware_item as checkout_repo,
    checkin_hardware_item as checkin_repo
)
from repositories.project_repo import get_user_project_ids


def list_user_hardware(user_id):
    """Get all hardware from projects the user is a member of"""
    project_ids = get_user_project_ids(user_id)
    return get_hardware_by_project_ids(project_ids)


def checkout_hardware(hw_id, user_id):
    """
    Checkout hardware (decrease available count)
    Returns: (success: bool, message: str, data: dict or None)
    """
    hw = find_hardware_by_id(hw_id)
    
    if not hw:
        return False, "Not found", None
    
    if hw["available"] <= 0:
        return False, "None available", None
    
    checkout_repo(hw_id)
    hw["available"] -= 1
    hw["_id"] = str(hw["_id"])
    hw["checked_out_by"] = user_id
    
    return True, "Checkout successful", hw


def checkin_hardware(hw_id):
    """
    Check in hardware (increase available count)
    Returns: (success: bool, message: str, data: dict or None)
    """
    hw = find_hardware_by_id(hw_id)
    
    if not hw:
        return False, "Not found", None
    
    if hw["available"] >= hw["capacity"]:
        return False, "Already full", None
    
    checkin_repo(hw_id)
    hw["available"] += 1
    hw["_id"] = str(hw["_id"])
    
    return True, "Checkin successful", hw
