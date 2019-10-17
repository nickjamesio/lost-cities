import os
from flask_restful.representations import json
from flask import Flask, jsonify, Response
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy


# instantiate the extensions
api = Api()
socketio = SocketIO()
jwt = JWTManager()
cors = CORS()
db = SQLAlchemy()


@jwt.user_claims_loader
def add_claims_to_jwt(identity):
    if identity == 1: # should read from database
        return {'is_admin': True}
    return {'is_admin': False}

@jwt.user_loader_callback_loader
def user_loader_callback(identity):
    """
    Return current user or None if not found
    """
    from src.models import user
    return user.UserModel.find_by_id(identity)

@jwt.expired_token_loader
def expired_token_callback():
    return jsonify({
        'message': 'The token has expired',
        'error': 'token_expired'
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'message': 'Invalid token given.',
        'error': 'invalid_token'
    }), 422

@jwt.unauthorized_loader
def unauthorized_token_callback(error):
    return jsonify({
        'message': 'Request does not contain an access token.',
        'error': 'authorization_required'
    }), 401

@jwt.needs_fresh_token_loader
def token_not_fresh_callback(error):
    return jsonify({
        'message': 'The token is not fresh.',
        'error': 'fresh_token_required'
    }), 401

@jwt.revoked_token_loader
def revoke_token_callback(error):
    return jsonify({
        'message': 'The token has been revoked.',
        'error': 'token_required'
    }), 401

@api.representation('application/json')
def output_json(data, code, headers=None):
    """Makes a Flask response with a JSON encoded body"""
    if isinstance(data, Response):
        return data

    return json.output_json(data, code, headers)


def create_app():
    # instantiate the app
    app = Flask(__name__)
    
    # import routes and models here to prevent circular imports
    import src.socket_routes
    from src.resources import home, user, game
    from src.models import user, game, player


    # set config
    app_settings = os.getenv('APP_SETTINGS', 'src.config.DevelopmentConfig')
    app.config.from_object(app_settings)

    # set up extensions
    db.init_app(app)
    api.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    socketio.init_app(app, cors_allowed_origins=app.config['CORS_ORIGINS'])

    return app