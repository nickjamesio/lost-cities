import json
import functools
from flask import request
from flask_jwt_extended import verify_jwt_in_request, current_user
from jwt import ExpiredSignatureError
from flask_jwt_extended.exceptions import NoAuthorizationError
from src.app import socketio
from src.models.game import Game
from src.util.cards import Card, Hand, Deck
from flask_socketio import emit, join_room, leave_room, \
    close_room, rooms, disconnect

players = [
    {
        'id': 1,
        'name': '',
        'hand': [],
        'played': {
            'red': [],
            'green': [],
            'blue': [],
            'white': [],
            'yellow': []
        },
        'score': 0
    },
    {
        'id': 2,
        'name': '',
        'hand': [],
        'played': {
            'red': [],
            'green': [],
            'blue': [],
            'white': [],
            'yellow': []
        },
        'score': 0
    }
]

currentPlayer = None

drawPile = []

discardPile = {
    'red': [],
    'green': [],
    'blue': [],
    'white': [],
    'yellow': []
}

def authenticated_only(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except NoAuthorizationError as e:
            emit( 'game_data', {'message': str(e)})
            disconnect()
        except ExpiredSignatureError as e:
            emit( 'game_data', {'message': str(e)})
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapper

@socketio.on('test', namespace='/game')
def test(data):
    print(data)

@socketio.on('join_game', namespace='/game')
def join_game(data):
    # Need game id
    # need player id
    # need player position
    global players, currentPlayer, drawPile, discardPile
    player = {}
    opponent = {}
    for person in players:
        if person['name'] == data['player_name']:
            player = person
        else:
            opponent = person
    
    emit( 'join_game',
        {
            'myId': player['id'],
            'opponentId': opponent['id'],
            'players': {
                players[0]['id']: players[0],
                players[1]['id']: players[1]
            },
            'drawPile': drawPile,
            'discardPile': discardPile,
            'currentPlayer': currentPlayer
        }
    )

@socketio.on('new_game', namespace='/game')
@authenticated_only
def new_game(data):
    deck = Deck()
    hand1, hand2 = deck.deal()

    game = Game()
    game.player_one_hand = hand1.serialize()
    game.player_two_hand = hand2.serialize()
    game.draw_pile = deck.serialize()
    game.discard_pile = []
    game.player_one_score = 0
    game.player_two_score = 0

    if data['position'] == 'first':
        game.player_one_id = current_user.id
        game.current_player_id = current_user.id
    else:
        game.player_two_id = current_user.id

    game.save_to_db()
    
    emit( 'game_data',
        {
            'game_id': game.id,
            'players': {
                'player_one': game.player_one_id,
                'player_two': game.player_two_id
            },
            'drawPile': game.draw_pile,
            'discardPile': game.discard_pile,
            'currentPlayer': game.current_player_id
        }
    )

@socketio.on('play_card', namespace='/game')
def play_card(data):
    player = get_user(data['pid'])
    selectedCard = data['selectedCard']
    card = player['hand'][selectedCard]
    
    del player['hand'][selectedCard]
    player['played'][card['type']].append(card['value'])

    emit('update_hand',
        {
            'pid': player['id'],
            'player': player

        },
        broadcast=True
    )

@socketio.on('discard_card', namespace='/game')
def discard_card(data):
    global discardPile
    player = get_user(data['pid'])
    selectedCard = data['selectedCard']
    card = player['hand'][selectedCard]
    
    del player['hand'][selectedCard]
    discardPile[card['type']].append(card['value'])

    emit('discard_card',
        {
            'pid': player['id'],
            'player': player,
            'discardPile': discardPile

        },
        broadcast=True
    )

@socketio.on('draw_card', namespace='/game')
def draw_card(data):
    global drawPile
    player = get_user(data['pid'])
    card = drawPile.pop()
    player['hand'].append(card)
    emit('draw_common_pile',
        {
            'pid': data['pid'],
            'player': player,
            'drawPile': drawPile 
        },
        broadcast=True
    )

@socketio.on('draw_discard', namespace='/game')
def draw_from_discard_pile(data):
    global discardPile
    player = get_user(data['pid'])
    card_value = discardPile[data['pile_color']].pop()
    player['hand'].append({'type': data['pile_color'], 'value': card_value})
    emit('draw_discard_pile',
        {
            'pid': data['pid'],
            'player': player,
            'discardPile': discardPile 
        },
        broadcast=True
    )

def get_user(pid):
    global players
    for player in players:
        if player['id'] == pid:
            return player

def clear_game():
    global players, currentPlayer, drawPile, discardPile
    players = [
        {
            'id': 1,
            'name': '',
            'hand': [],
            'played': {
                'red': [],
                'green': [],
                'blue': [],
                'white': [],
                'yellow': []
            },
            'score': 0
        },
        {
            'id': 2,
            'name': '',
            'hand': [],
            'played': {
                'red': [],
                'green': [],
                'blue': [],
                'white': [],
                'yellow': []
            },
            'score': 0
        }
    ]

    currentPlayer = None

    drawPile = []

    discardPile = {
        'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []
    }