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
