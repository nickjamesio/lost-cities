from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO
from src.config import Config

app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)
socketio = SocketIO(app)

# Enable CORS
# if app.env == 'production':
#     CORS(app, origins=["https://DOMAIN.com", "https://www.DOMAIN.com"])
# else:
#     CORS(app)

# from resources.game import Game, GameList
from src import socket_routes
from src.resources.home import Home

# Routes
api.add_resource(Home, '/')
# api.add_resource(Game, '/games/<int:pid>')

# @app.before_first_request
# def create_db():
#     db.create_all()

if __name__ == '__main__':
    from db import db
    db.init_app(app)
    socketio.init_app(app)
    socketio.run(app)
    # app.run()
