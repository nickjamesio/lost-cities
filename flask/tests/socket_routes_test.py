import os
import tempfile
import pytest
from flask import Flask, request, json as flask_json
from flask_socketio import (
    emit,
    join_room,
    leave_room,
    Namespace,
    disconnect
)
from src.app import app, socketio
from src.db import db
from src.models.user import UserModel
from src.models.game import GameModel
from util.auth import AuthActions
from util.data import TestData

basedir = os.path.abspath(os.path.dirname(__file__))

@socketio.on('blah')
def stuff(data):
    emit('response', 'stuff')

@pytest.fixture
def flask_app():
    db_fd, db_path = tempfile.mkstemp()
    app.config['SECRET_KEY'] = 'secret'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.db')
    
    with app.app_context() as context, db.engine.connect() as con:
        db.init_app(app)
        db.create_all()
        test_data = TestData(con)
        test_data.create_test_games()
        test_data.create_test_users()

    yield app

    os.close(db_fd)
    os.unlink(os.path.join(basedir, 'data.db'))

@pytest.fixture
def app_client(flask_app):
    return app.test_client()

@pytest.fixture
def auth(app_client):
    return AuthActions(app_client)

@pytest.fixture
def app_context(flask_app):
    """
    Use this fixture if a query against the database is needed
    """
    with flask_app.app_context() as context:
        yield context

@pytest.fixture
def auth_socket_client(auth, flask_app, app_client):
    auth.login()
    return socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)

def test_perform_action_not_authenticated(app_client):
    # test performing each action on game while unauthenticated
    # confirm connection is disconnected
    pass

def test_new_game_no_position(auth_socket_client):
    ack = auth_socket_client.emit('new_game', {}, namespace="/game", callback=True)
    
    assert 'message' in ack
    assert ack['message'] == "'position' must be sent as part of the request"

def test_new_game(auth_socket_client, app_context):
    auth_socket_client.emit('new_game', {'position': 1}, namespace="/game")
    recieved = auth_socket_client.get_received('/game')
    
    gameData = recieved[0]['args'][0]

    assert gameData['currentPlayer'] == 1
    assert gameData['position'] == 1
    assert 'hand' in gameData
    assert 'deck' in gameData
    assert 'discard' in gameData
    assert 'gameId' in gameData
    assert 'played' in gameData

    # with flask_app.app_context():
    game = GameModel.find_by_id(gameData['gameId'])
    assert game is not None

@pytest.mark.parametrize(("data", "message"), (
    ({'gameId': 1}, "'position' must be sent as part of the request"),
    ({'position': 1}, "'gameId' must be sent as part of the request")
))
def test_join_game_missing_data(auth_socket_client, data, message):
    ack = auth_socket_client.emit('join_game', data, namespace="/game", callback=True)

    assert ack == {'message': message}

def test_join_game_not_exist(auth_socket_client):
    data = {'position': 1, 'gameId': 5}
    ack = auth_socket_client.emit('join_game', data, namespace="/game", callback=True)

    assert ack['message'] == "could not find game with id '5'"

def test_join_game_new_player(auth, flask_app, app_client, app_context):
    auth.login('one', 'blah')
    client1 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    
    auth.login('two', 'blah')
    client2 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    
    data1 = {'position': 1, 'gameId': 1}
    data2 = {'position': 2, 'gameId': 1}
    client1.emit('join_game', data1, namespace="/game")
    received = client1.get_received('/game')

    p1GameData = received[0]['args'][0]
    assert len(received) == 1
    assert p1GameData['currentPlayer'] == 1
    assert 'played' in p1GameData
    assert 'deck' in p1GameData
    assert 'discard' in p1GameData
    assert 'hand' in p1GameData

    client2.emit('join_game', data2, namespace="/game")
    received = client2.get_received('/game')
    
    p2GameData = received[0]['args'][0]
    assert len(received) == 2
    assert 'played' in p2GameData
    assert 'deck' in p2GameData
    assert 'discard' in p2GameData
    assert 'hand' in p2GameData

    assert 'ready' in received[1]['args'][0]
    assert received[1]['args'][0]['ready'] == True

    assert p1GameData['hand'] != p2GameData
    assert p1GameData['played'] == p2GameData['played']
    assert p1GameData['deck'] == p2GameData['deck']
    assert p1GameData['discard'] == p2GameData['discard']
    
    received = client1.get_received('/game')
    assert 'ready' in received[0]['args'][0]
    assert received[0]['args'][0]['ready'] == True
    

def test_play_card_missing_data(auth, app_client):
    # test missing cardIndex
    # test missing gameId
    pass

def test_play_card_not_player_turn(auth, app_client):
    pass

def test_play_card_is_player_turn(auth, app_client):
    pass

def test_discard_card_missing_data(auth, app_client):
    pass

def test_discard_card_not_player_turn(auth, app_client):
    pass

def test_discard_card_is_player_turn(auth, app_client):
    pass

def test_draw_card_missing_data(auth, app_client):
    pass

def test_draw_card_not_player_turn(auth, app_client):
    pass

def test_draw_card_is_player_turn(auth, app_client):
    pass

def test_discard_draw_missing_data(auth, app_client):
    pass

def test_discard_draw_not_player_turn(auth, app_client):
    pass

def test_discard_draw_is_player_turn(auth, app_client):
    pass