from flask_restful.representations import json
from flask import Flask, jsonify, Response
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager

from db import db
from config import Config
from resources.home import Home
from resources.user import (
    UserRegister,
    User,
    UserList,
    UserLogin,
    TokenRefresh
)

app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)
socketio = SocketIO(app)
db.init_app(app)
jwt = JWTManager(app)

# Enable CORS
# if app.env == 'production':
#     CORS(app, origins=["https://DOMAIN.com", "https://www.DOMAIN.com"])
# else:
CORS(app, origins=["http://api.localhost", "http://nickjames.local"], supports_credentials=True)

import socket_routes
from models import user, player

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

# Routes
api.add_resource(Home, '/')
api.add_resource(UserRegister, '/register')
api.add_resource(User, '/user/<int:uid>')
api.add_resource(UserList, '/users')
api.add_resource(UserLogin, '/login')
api.add_resource(TokenRefresh, '/refresh')

@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    pass
    # from db import db
    # db.init_app(app)
    # socketio.init_app(app)
    socketio.run(app)
    # app.run()
