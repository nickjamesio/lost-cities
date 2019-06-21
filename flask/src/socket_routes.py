import json
import functools
from flask import request, jsonify
from flask_jwt_extended import (
    verify_jwt_in_request,
    current_user,
    jwt_refresh_token_required,
    get_jwt_identity,
    create_access_token,
    set_access_cookies
)
from jwt import ExpiredSignatureError
from flask_jwt_extended.exceptions import NoAuthorizationError
from app import socketio
from models.game import Game
from util.cards import Card, Hand, Deck
from flask_socketio import (
    emit,
    join_room,
    leave_room,
    close_room,
    rooms,
    disconnect
)

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
            emit( 'not authorized', {'message': str(e)})
            disconnect()
        except ExpiredSignatureError as e:
            emit( 'expired token', {'message': str(e)})
            # disconnect()
        else:
            return f(*args, **kwargs)
    return wrapper

@socketio.on('test', namespace='/game')
def test(data):
    print(data)

@socketio.on('refresh', namespace='/game')
@jwt_refresh_token_required
def refresh_token(data):
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user, fresh=False)
    resp = jsonify({'refreshed': True})
    set_access_cookies(resp, new_token)
    
    return resp, 200

@socketio.on('join_game', namespace='/game')
def join_game(data):
    # Need game id
    # need player position
    #TODO confirm there is id in data
    game = Game.find_by_id(data['game_id'])
    if data['position'] == 'first':
        game.player_one_id = current_user.id
        game.current_player_id = current_user.id
    else:
        game.player_two_id = current_user.id
    game.save_to_db()
    
    emit( 'join_game',
        {
            'draw_pile': game.draw_pile,
            'discard_pile': game.discard_pile,
            'current_player': game.current_player_id
        }
    )

@socketio.on('new_game', namespace='/game')
@authenticated_only
def new_game(data):
    deck = Deck()
    hand1, hand2 = deck.deal()

    game = Game()
    game.player_one_played = {
        'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []
    }
    game.player_two_played = {
        'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []
    }
    game.discard_pile = {
        'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []
    }
    game.player_one_hand = hand1.serialize()
    game.player_two_hand = hand2.serialize()
    game.draw_pile = deck.serialize()
    game.player_one_score = 0
    game.player_two_score = 0

    if data['position'] == 'first':
        game.player_one_id = current_user.id
        game.current_player_id = current_user.id
    else:
        game.player_two_id = current_user.id

    game.save_to_db()
    
    emit( 'game_created',
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
@authenticated_only
def play_card(data):
    # TODO make sure data fields are present
    # TODO remove duplicate code in each clause
    game = Game.find_by_id(data['game_id'])
    if game.player_one_id == current_user.id:
        hand = game.player_one_hand
        hand = Hand(hand)
        card = hand.get_card(data['card_index'])
        
        game.player_one_hand = hand.serialize()
        played_pile = game.player_one_played[card['typ']].append(card.serialize())
        game.player_one_played = played_pile
        game.current_player_id = game.player_two_id
    else:
        hand = game.player_two_hand
        hand = Hand(hand)
        card = hand.get_card(data['card_index'])
        
        game.player_two_hand = hand.serialize()
        played_pile = game.player_one_played[card['typ']].append(card.serialize())
        game.player_one_played = played_pile
        game.current_player_id = game.player_one_id

    game.save_to_db()
    
    emit('card_played',
        {
            'hand': hand.serialize(),
            'play_pile': played_pile
        },
        broadcast=True
    )

@socketio.on('discard_card', namespace='/game')
@authenticated_only
def discard_card(data):
    # need game id
    # need card index to discard
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
    # need to know which pile to draw from
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