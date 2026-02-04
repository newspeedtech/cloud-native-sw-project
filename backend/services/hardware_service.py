from repositories.hardware_repo import (
    get_all_hardware,
    find_hardware_by_id,
    checkout_hardware_item as checkout_repo,
    checkin_hardware_item as checkin_repo,
    initialize_hardware as initialize_repo
)


def list_user_hardware(user_id):
    """Get all hardware (global - shared between all projects)"""
    return get_all_hardware()


def checkout_hardware(hw_id, user_id, quantity=1):
    """
    Checkout hardware (decrease available count)
    Returns: (success: bool, message: str, data: dict or None)
    """
    hw = find_hardware_by_id(hw_id)
    
    if not hw:
        return False, "Not found", None
    
    if hw["available"] < quantity:
        return False, f"Only {hw['available']} available", None
    
    checkout_repo(hw_id, quantity)
    hw["available"] -= quantity
    hw["_id"] = str(hw["_id"])
    hw["checked_out_by"] = user_id
    
    return True, f"Checked out {quantity} items", hw


def checkin_hardware(hw_id, quantity=1):
    """
    Check in hardware (increase available count)
    Returns: (success: bool, message: str, data: dict or None)
    """
    hw = find_hardware_by_id(hw_id)
    
    if not hw:
        return False, "Not found", None
    
    if hw["available"] + quantity > hw["capacity"]:
        return False, f"Can only check in {hw['capacity'] - hw['available']} more items", None
    
    checkin_repo(hw_id, quantity)
    hw["available"] += quantity
    hw["_id"] = str(hw["_id"])
    
    return True, f"Checked in {quantity} items", hw


def initialize_hardware():
    """
    Initialize the 2 global hardware sets (clears existing hardware)
    Returns: (success: bool, message: str, data: dict or None)
    """
    try:
        deleted_count, created_count = initialize_repo()
        return True, "Hardware initialized successfully", {
            "deleted": deleted_count,
            "created": created_count
        }
    except Exception as e:
        return False, str(e), None
    
    return True, "Checkin successful", hw
