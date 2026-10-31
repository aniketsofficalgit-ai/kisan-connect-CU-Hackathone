import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from config import config
from app.database.connection import init_db

def create_app():
    app = Flask(__name__, static_folder="../uploads")
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["MAX_CONTENT_LENGTH"] = config.MAX_CONTENT_LENGTH

    # CORS configuration
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize Database and Seed Data
    with app.app_context():
        try:
            init_db()
        except Exception as e:
            app.logger.error(f"Error during database initialization: {e}")

    # Register Blueprints
    from app.auth.routes import auth_bp
    from app.farmers.routes import farmers_bp
    from app.waste_management.routes import waste_bp
    from app.partners.routes import partners_bp
    from app.collections.routes import collections_bp
    from app.ai_assistant.routes import ai_bp
    from app.notifications.routes import notifications_bp
    from app.admin.routes import admin_bp
    from app.recycling.routes import recycling_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(farmers_bp, url_prefix="/api/farmers")
    app.register_blueprint(waste_bp, url_prefix="/api/waste")
    app.register_blueprint(partners_bp, url_prefix="/api/partners")
    app.register_blueprint(collections_bp, url_prefix="/api/collections")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(recycling_bp, url_prefix="/api/recycling")

    # Static file server for uploaded images
    @app.route("/uploads/<path:filename>")
    def serve_upload(filename):
        return send_from_directory(config.UPLOAD_FOLDER, filename)

    # Health check & platform info
    @app.route("/api/health")
    def health():
        return jsonify({
            "status": "healthy",
            "project": config.PROJECT_NAME,
            "tagline": config.TAGLINE,
            "team": config.TEAM_NAME,
            "version": config.VERSION
        }), 200

    @app.route("/")
    def index():
        return jsonify({
            "platform": "Kisan Connect API",
            "tagline": "Turning Farm Waste into Valuable Resources",
            "team": "CLOVER GUARDIAN",
            "documentation": "/api/health"
        }), 200

    # Global error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "An internal server error occurred"}), 500

    return app
