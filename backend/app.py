import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import datetime
from db import db, client

# ----------------------
# Flask setup
# ----------------------
app = Flask(__name__)
CORS(app)

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
from api.user_routes import user_bp
from api.project_routes import project_bp
from api.hardware_routes import hardware_bp

app.register_blueprint(user_bp)
app.register_blueprint(project_bp)
app.register_blueprint(hardware_bp)

# ----------------------
# Run Flask
# ----------------------
if __name__ == "__main__":
    app.run(debug=True)
