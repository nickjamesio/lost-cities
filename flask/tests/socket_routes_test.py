import os
import json
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
from util.data import TestData, game_data

@socketio.on('blah')
def stuff(data):
    emit('response', 'stuff')

@pytest.fixture
def flask_app():
    db_fd, db_path = tempfile.mkstemp()
    app.config['SECRET_KEY'] = 'secret'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
    
    with app.app_context(), db.engine.connect() as con:
        db.init_app(app)
        db.create_all()
        test_data = TestData(con)
        test_data.create_test_games()
        test_data.create_test_users()

    yield app

    os.close(db_fd)
    os.unlink(os.path.join(db_path))

@pytest.fixture
def app_client(flask_app):
    return flask_app.test_client()

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

    p1Hand = received[0]['args'][0]
    p1GameData = received[1]['args'][0]
    expectedData = game_data[0]

    assert len(received) == 2
    assert len(p1Hand['hand']) == 8
    assert p1GameData['currentPlayer'] == expectedData['current']
    assert p1GameData['deck'] == (expectedData['deck'][0:-15] + expectedData['deck'][-16::2])
    assert p1GameData['over'] == expectedData['over']
    assert p1GameData['discard'] == {'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []}
    assert 'played' in p1GameData
    assert p1GameData['gameReady'] == False

    client2.emit('join_game', data2, namespace="/game")
    received = client2.get_received('/game')
    
    p2Hand = received[0]['args'][0]
    p2GameData = received[1]['args'][0]

    assert len(received) == 2
    assert p2GameData['currentPlayer'] == expectedData['current']
    assert p2GameData['deck'] == expectedData['deck'][0:44]
    assert p2GameData['over'] == expectedData['over']
    assert p2GameData['gameReady'] == True
    assert p2GameData['discard'] == {'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []}
    assert 'played' in p2GameData

    assert p1Hand != p2Hand
    assert p1GameData['played'] == p2GameData['played']
    assert p1GameData['deck'] != p2GameData['deck'][0:44]
    assert p1GameData['discard'] == p2GameData['discard']
    
    received = client1.get_received('/game')
    p1GameData = received[0]['args'][0]

    assert len(received) == 1
    assert p1GameData['deck'] == p2GameData['deck']
    assert p1GameData['gameReady'] == True
    assert p1GameData['currentPlayer'] == expectedData['current']
    
@pytest.mark.parametrize(("data", "message"), (
    ({'gameId': 1}, "'cardIndex' must be sent as part of the request"),
    ({'cardIndex': 1}, "'gameId' must be sent as part of the request")
))
def test_play_card_missing_data(auth_socket_client, data, message):
    ack = auth_socket_client.emit('play_card', data, namespace="/game", callback=True)

    assert ack == {'message': message}

def test_play_card_game_not_exist(auth_socket_client):
    data = {'cardIndex': 1, 'gameId': 5}
    ack = auth_socket_client.emit('play_card', data, namespace="/game", callback=True)

    assert ack['message'] == "could not find game with id '5'"

def test_play_card_not_player_turn(auth_socket_client):
    # Attempt to play a card on a game that has no players
    data = {'cardIndex': 1, 'gameId': 1}
    ack = auth_socket_client.emit('play_card', data, namespace="/game", callback=True)

    assert ack == {'message': 'It is not your turn'}
    
    # Join the game but as player 2. Attempt to play a card
    # when it is player one's turn
    auth_socket_client.emit('join_game', {'gameId': 1, 'position': 2}, namespace="/game")
    auth_socket_client.get_received('/game')

    ack = auth_socket_client.emit('play_card', data, namespace="/game", callback=True)
    assert ack == {'message': 'It is not your turn'}

def test_play_card_is_player_turn(auth, flask_app, app_client):
    auth.login('one', 'blah')
    client1 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    client1.emit('join_game', {'position': 1, 'gameId': 1}, namespace="/game")
    playerOneInitial = client1.get_received('/game')
    
    auth.login('two', 'blah')
    client2 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    client2.emit('join_game', {'position': 2, 'gameId': 1}, namespace="/game")
    client2.get_received('/game')
    # clear out ready response sent to first client
    client1.get_received('/game')

    data = {'cardIndex': 1, 'gameId': 1}
    client1.emit('play_card', data, namespace="/game")
    received = client1.get_received('/game')

    handData = received[0]['args'][0]
    playedData = received[1]['args'][0]

    # play one card and confirm hand is updated
    handCopy = playerOneInitial[0]['args'][0]['hand'][:]
    card = handCopy[1]
    del handCopy[1] 
    assert handData['hand'] == handCopy

    # Confirm played pile for player is updated but opponenets is not
    initialPlayed = playerOneInitial[1]['args'][0]['played']
    assert initialPlayed[1] == {'red': [],'green': [],'blue': [],'white': [],'yellow': []}
    assert initialPlayed[2] == {'red': [],'green': [],'blue': [],'white': [],'yellow': []}

    playedPile = {'red': [],'green': [],'blue': [],'white': [],'yellow': []}
    playedPile[card['typ']].append(card)
    assert playedData['played'][1] == playedPile
    # TODO figure out why list is coming back sorted
    assert playedData['played'][2]['red'] == []
    assert playedData['played'][2]['green'] == []
    assert playedData['played'][2]['blue'] == []
    assert playedData['played'][2]['white'] == []
    assert playedData['played'][2]['yellow'] == []

@pytest.mark.parametrize(("data", "message"), (
    ({'gameId': 1}, "'cardIndex' must be sent as part of the request"),
    ({'cardIndex': 1}, "'gameId' must be sent as part of the request")
))
def test_discard_card_missing_data(auth_socket_client, data, message):
    ack = auth_socket_client.emit('discard_card', data, namespace="/game", callback=True)

    assert ack == {'message': message}

def test_discard_card_not_player_turn(auth_socket_client):
    # Attempt to discard a card on a game that has no players
    data = {'cardIndex': 1, 'gameId': 1}
    ack = auth_socket_client.emit('discard_card', data, namespace="/game", callback=True)

    assert ack == {'message': 'It is not your turn'}
    
    # Join the game but as player 2. Attempt to discard a card
    # when it is player one's turn
    auth_socket_client.emit('join_game', {'gameId': 1, 'position': 2}, namespace="/game")
    auth_socket_client.get_received('/game')

    ack = auth_socket_client.emit('discard_card', data, namespace="/game", callback=True)
    assert ack == {'message': 'It is not your turn'}

def test_discard_card_is_player_turn(auth, flask_app, app_client):
    auth.login('one', 'blah')
    client1 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    client1.emit('join_game', {'position': 1, 'gameId': 1}, namespace="/game")
    playerOneInitial = client1.get_received('/game')
    
    auth.login('two', 'blah')
    client2 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    client2.emit('join_game', {'position': 2, 'gameId': 1}, namespace="/game")
    client2.get_received('/game')
    # clear out ready response sent to first client
    client1.get_received('/game')

    data = {'cardIndex': 1, 'gameId': 1}
    client1.emit('discard_card', data, namespace="/game")
    received = client1.get_received('/game')

    handData = received[0]['args'][0]
    discardData = received[1]['args'][0]

    # play one card and confirm hand is updated
    handCopy = playerOneInitial[0]['args'][0]['hand'][:]
    card = handCopy[1]
    del handCopy[1] 
    assert handData['hand'] == handCopy

    # Confirm discard pile and current player is updated
    initialDiscard = playerOneInitial[1]['args'][0]['discard']
    assert initialDiscard == {'red': [],'green': [],'blue': [],'white': [],'yellow': []}
    
    discardPile = {'red': [],'green': [],'blue': [],'white': [],'yellow': []}
    discardPile[card['typ']].append(card)
    assert discardData['discard'] == discardPile

def test_draw_card_missing_data(auth_socket_client):
    ack = auth_socket_client.emit('draw_card', {}, namespace="/game", callback=True)

    assert ack == {'message': "'gameId' must be sent as part of the request"}

def test_draw_card_not_player_turn(auth_socket_client):
    # Attempt to discard a card on a game that has no players
    data = {'gameId': 1}
    ack = auth_socket_client.emit('draw_card', data, namespace="/game", callback=True)

    assert ack == {'message': 'It is not your turn'}
    
    # Join the game but as player 2. Attempt to discard a card
    # when it is player one's turn
    auth_socket_client.emit('join_game', {'gameId': 1, 'position': 2}, namespace="/game")
    auth_socket_client.get_received('/game')

    ack = auth_socket_client.emit('draw_card', data, namespace="/game", callback=True)
    assert ack == {'message': 'It is not your turn'}

def test_draw_card_is_player_turn(auth, flask_app, app_client):
    auth.login('one', 'blah')
    client1 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    client1.emit('join_game', {'position': 1, 'gameId': 1}, namespace="/game")
    gameInitial = client1.get_received('/game')
    
    auth.login('two', 'blah')
    client2 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    client2.emit('join_game', {'position': 2, 'gameId': 1}, namespace="/game")
    client2.get_received('/game')
    # clear out ready response sent to first client
    client1.get_received('/game')

    client1.emit('draw_card', {'gameId': 1}, namespace="/game")
    received = client1.get_received('/game')

    newHand = received[0]['args'][0]['hand']
    currentPlayer = received[1]['args'][0]['currentPlayer']
    newDeck = received[1]['args'][0]['deck']

    initialHand = gameInitial[0]['args'][0]['hand']
    newCard = gameInitial[1]['args'][0]['deck'][0:44].pop()

    # Count how many instances of the new card are in the player's hand
    # to begin with. This is necessary because there are 3 multiplier
    # cards in each color group
    origOccurrences = initialHand.count(newCard)
    newOccurrences = newHand.count(newCard)
    
    assert newOccurrences > origOccurrences
    assert newDeck == game_data[0]['deck'][0:43]

    received = client2.get_received('/game')
    player2Data = received[0]['args'][0]

    assert player2Data['deck'] == game_data[0]['deck'][0:43]
    assert player2Data['currentPlayer'] == 2
    assert player2Data['over'] == False

@pytest.mark.parametrize(("data", "message"), (
    ({'gameId': 1}, "'color' must be sent as part of the request"),
    ({'color': 1}, "'gameId' must be sent as part of the request")
))
def test_discard_draw_missing_data(auth_socket_client, data, message):
    ack = auth_socket_client.emit('draw_discard', data, namespace="/game", callback=True)

    assert ack == {'message': message}

def test_discard_draw_not_player_turn(auth_socket_client):
    # Attempt to draw a card from discard on a game that has no players
    data = {'gameId': 1, 'color': 'green'}
    ack = auth_socket_client.emit('draw_discard', data, namespace="/game", callback=True)

    assert ack == {'message': 'It is not your turn'}
    
    # Join the game but as player 2. Attempt to draw from discard pile
    # when it is player one's turn
    auth_socket_client.emit('join_game', {'gameId': 1, 'position': 2}, namespace="/game")
    auth_socket_client.get_received('/game')

    ack = auth_socket_client.emit('draw_discard', data, namespace="/game", callback=True)
    assert ack == {'message': 'It is not your turn'}

def test_discard_draw_is_player_turn(auth, flask_app, app_client):
    auth.login('one', 'blah')
    client1 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    client1.emit('join_game', {'position': 1, 'gameId': 1}, namespace="/game")
    playerOneInitial = client1.get_received('/game')
    
    auth.login('two', 'blah')
    client2 = socketio.test_client(flask_app, namespace='/game', flask_test_client=app_client)
    client2.emit('join_game', {'position': 2, 'gameId': 1}, namespace="/game")
    playerTwoInitial = client2.get_received('/game')

    # player discard a card and then draw a card. needed to
    # switch currentPlayer to player 2
    client1.emit('discard_card', {'cardIndex': 1, 'gameId': 1}, namespace="/game")
    client1.emit('draw_card', {'gameId': 1}, namespace="/game")
    
    # clear out all received data from player 1
    client1.get_received('/game')
    
    # player two play a card and then draw from discard pile
    client2.emit('play_card', {'cardIndex': 0, 'gameId': 1}, namespace="/game")
    client2.get_received('/game')

    discardedCard = playerOneInitial[0]['args'][0]['hand'][1]
    client2.emit('draw_discard', {'color': discardedCard['typ'], 'gameId': 1}, namespace="/game")
    received = client2.get_received('/game')

    playerTwoInitialHand = playerTwoInitial[0]['args'][0]['hand']
    origCount = playerTwoInitialHand.count(discardedCard)
    
    playerTwoNewHand = received[0]['args'][0]['hand']
    newCount = playerTwoNewHand.count(discardedCard)
    
    assert newCount > origCount

    discardPile = {'red': [],'green': [],'blue': [],'white': [],'yellow': []}
    playerTwoUpdatedGame = received[1]['args'][0]
    assert playerTwoUpdatedGame['discard'] == discardPile
    assert playerTwoUpdatedGame['currentPlayer'] == 1