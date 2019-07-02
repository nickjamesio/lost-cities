import os
import tempfile
import pytest
from sqlalchemy.sql import text
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
from src.db import db
from src.models.user import UserModel

basedir = os.path.abspath(os.path.dirname(__file__))

@socketio.on('blah')
def stuff(data):
    emit('response', 'stuff')

@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    app.config['SECRET_KEY'] = 'secret'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.db')
    client = socketio.test_client(app, namespace='/game')
    
    user_data = ({'name': 'one', 'pass': 'blah'}, {'name': 'two', 'pass': 'blah'})
    game_data = (
        {
            'current': 1,
            'deck': '[{"typ":"red","val":"h"},{"typ":"blue","val":"h"},{"typ":"white","val":"7"},{"typ":"yellow","val":"7"},{"typ":"blue","val":"8"},{"typ":"green","val":"10"},{"typ":"red","val":"10"},{"typ":"green","val":"8"},{"typ":"yellow","val":"h"},{"typ":"yellow","val":"10"},{"typ":"yellow","val":"4"},{"typ":"green","val":"5"},{"typ":"yellow","val":"6"},{"typ":"green","val":"3"},{"typ":"blue","val":"6"},{"typ":"green","val":"h"},{"typ":"yellow","val":"5"},{"typ":"white","val":"3"},{"typ":"red","val":"h"},{"typ":"green","val":"h"},{"typ":"red","val":"8"},{"typ":"red","val":"5"},{"typ":"blue","val":"10"},{"typ":"blue","val":"2"},{"typ":"white","val":"10"},{"typ":"blue","val":"7"},{"typ":"blue","val":"4"},{"typ":"green","val":"9"},{"typ":"blue","val":"9"},{"typ":"green","val":"2"},{"typ":"yellow","val":"3"},{"typ":"yellow","val":"9"},{"typ":"red","val":"3"},{"typ":"white","val":"8"},{"typ":"white","val":"4"},{"typ":"white","val":"5"},{"typ":"yellow","val":"h"},{"typ":"red","val":"6"},{"typ":"green","val":"7"},{"typ":"red","val":"2"},{"typ":"blue","val":"5"},{"typ":"white","val":"2"},{"typ":"green","val":"6"},{"typ":"blue","val":"3"},{"typ":"yellow","val":"2"},{"typ":"green","val":"4"},{"typ":"yellow","val":"8"},{"typ":"yellow","val":"h"},{"typ":"red","val":"9"},{"typ":"white","val":"h"},{"typ":"blue","val":"h"},{"typ":"white","val":"h"}]',
            'discard': '{"red":[],"green":[],"blue":[],"white":[],"yellow":[]}',
            'over': False
        },
        {
            'current': 2,
            'deck': '[{"typ":"red","val":"h"},{"typ":"blue","val":"h"},{"typ":"white","val":"7"},{"typ":"yellow","val":"7"},{"typ":"blue","val":"8"},{"typ":"green","val":"10"},{"typ":"red","val":"10"},{"typ":"green","val":"8"},{"typ":"yellow","val":"h"},{"typ":"yellow","val":"10"},{"typ":"yellow","val":"4"},{"typ":"green","val":"5"},{"typ":"yellow","val":"6"},{"typ":"green","val":"3"},{"typ":"blue","val":"6"},{"typ":"green","val":"h"},{"typ":"yellow","val":"5"},{"typ":"white","val":"3"},{"typ":"red","val":"h"},{"typ":"green","val":"h"},{"typ":"red","val":"8"},{"typ":"red","val":"5"},{"typ":"blue","val":"10"},{"typ":"blue","val":"2"},{"typ":"white","val":"10"},{"typ":"blue","val":"7"},{"typ":"blue","val":"4"},{"typ":"green","val":"9"},{"typ":"blue","val":"9"},{"typ":"green","val":"2"},{"typ":"yellow","val":"3"},{"typ":"yellow","val":"9"},{"typ":"red","val":"3"},{"typ":"white","val":"8"},{"typ":"white","val":"4"},{"typ":"white","val":"5"},{"typ":"yellow","val":"h"},{"typ":"red","val":"6"},{"typ":"green","val":"7"},{"typ":"red","val":"2"},{"typ":"blue","val":"5"},{"typ":"white","val":"2"},{"typ":"green","val":"6"},{"typ":"blue","val":"3"},{"typ":"yellow","val":"2"},{"typ":"green","val":"4"},{"typ":"yellow","val":"8"},{"typ":"yellow","val":"h"},{"typ":"red","val":"9"},{"typ":"white","val":"h"},{"typ":"blue","val":"h"},{"typ":"white","val":"h"}]',
            'discard': '{"red":[],"green":[],"blue":[],"white":[],"yellow":[]}',
            'over': False
        })
    user_statement = text("INSERT INTO users (username, password) VALUES(:name, :pass)")   
    game_statement = text("INSERT INTO game (current_player, draw_pile, discard_pile, game_over) VALUES(:current, :deck, :discard, :over)")
    with app.app_context() as context, db.engine.connect() as con:
        db.init_app(app)
        db.create_all()
        for user in user_data:
            con.execute(user_statement, **user)

        player = UserModel.find_by_id(1)
        # db.executescript(_data_sql)

    yield client

    os.close(db_fd)
    os.unlink(app.config['DATABASE'])



def test_new_game(client):
    # response = client.get('/')
    # received1 = client.get_received()
    client.emit('test', {'blah': 'stuff'}, namespace="/game")
    # recieved = client.get_received('/game')
    x = 1