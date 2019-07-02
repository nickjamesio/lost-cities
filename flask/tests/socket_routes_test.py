import os
import tempfile
import pytest
from flask import Flask, request, json as flask_json
from flask_socketio import (
    SocketIO, 
    send,
    emit,
    join_room,
    leave_room,
    Namespace,
    disconnect
)
from src.app import app, socketio

@socketio.on('blah')
def stuff(data):
    emit('response', 'stuff')

@pytest.fixture
def client():
    # app = Flask(__name__)
    app.config['SECRET_KEY'] = 'secret'
    db_fd, app.config['DATABASE'] = tempfile.mkstemp()
    client = socketio.test_client(app, namespace='/game')

    yield client

    os.close(db_fd)
    os.unlink(app.config['DATABASE'])


def test_new_game(client):
    # response = client.get('/')
    # received1 = client.get_received()
    client.emit('test', {'blah': 'stuff'}, namespace="/game")
    recieved = client.get_received('/game')
    x = 1