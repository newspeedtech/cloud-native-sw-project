import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import datetime
from backend.db import db, client
import os
print("MONGO_URI =", os.getenv("MONGO_URI"))
print("🔥 FLASK FILE LOADED 🔥")

# ----------------------
# Flask setup
# ----------------------
app = Flask(
    __name__,
    static_folder="../frontend/build",
    static_url_path=""
)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
""" CORS(
    app,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
) """

from flask import request

@app.before_request
def debug_all_requests():
    print("➡️", request.method, request.path) 

# ----------------------

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)
jwt = JWTManager(app)

# JWT error handlers for better debugging
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"[JWT ERROR] Token expired: {jwt_payload}")
    return {"error": "Token has expired", "message": "Please log in again"}, 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f"[JWT ERROR] Invalid token: {error}")
    return {"error": "Invalid token", "message": str(error)}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print(f"[JWT ERROR] Missing token: {error}")
    return {"error": "Authorization required", "message": "Missing Authorization header"}, 401

# Test MongoDB connection
try:
    client.admin.command('ping')
    print("Pinged your MongoDB deployment. Connection successful!")
except Exception as e:
    print("Failed to ping MongoDB:", e)

# ----------------------
# Register Blueprints
# ----------------------
from backend.api.user_routes import user_bp
from backend.api.project_routes import project_bp
from backend.api.hardware_routes import hardware_bp

app.register_blueprint(user_bp)
app.register_blueprint(project_bp)
app.register_blueprint(hardware_bp)

# ----------------------
# # Serve React frontend (production)
# ----------------------

from flask import send_from_directory

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    full_path = os.path.join(app.static_folder, path)

    if path != "" and os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")



# ----------------------
# Run Flask
# ----------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)

