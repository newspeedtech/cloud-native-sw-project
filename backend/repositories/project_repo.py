from backend.db import db
from bson import ObjectId


def get_user_project_ids(user_id):
    """Get all project IDs for projects the user is a member of"""
    user_projects = db.projects.find({"users": ObjectId(user_id)})
    return [ObjectId(str(p["_id"])) for p in user_projects]


def find_project_by_slug(slug):
    """Find a project by its slug"""
    return db.projects.find_one({"slug": slug})


def create_project(slug, name, description, owner_id):
    """Create a new project"""
    project = {
        "slug": slug,
        "name": name,
        "description": description,
        "owner": ObjectId(owner_id),
        "users": [ObjectId(owner_id)]
    }
    result = db.projects.insert_one(project)
    return result.inserted_id


def get_user_projects(user_id):
    """Get all projects for a user with user_id lookups"""
    projects_cursor = db.projects.find({"users": ObjectId(user_id)})
    projects = []
    
    for p in projects_cursor:
        # Look up owner user_id
        owner_doc = db.users.find_one({"_id": p["owner"]})
        owner_user_id = owner_doc.get("user_id") if owner_doc else str(p["owner"])
        
        # Look up user_ids for all users
        user_ids = []
        for u_id in p["users"]:
            u_doc = db.users.find_one({"_id": u_id})
            if u_doc and "user_id" in u_doc:
                user_ids.append(u_doc["user_id"])
            else:
                user_ids.append(str(u_id))
        
        projects.append({
            "id": str(p["_id"]),
            "name": p["name"],
            "slug": p["slug"],
            "owner": owner_user_id,
            "users": user_ids,
            "description": p.get("description", "")
        })
    
    return projects


def add_user_to_project(project_id, user_id):
    """Add a user to a project"""
    db.projects.update_one(
        {"_id": project_id},
        {"$push": {"users": ObjectId(user_id)}}
    )

