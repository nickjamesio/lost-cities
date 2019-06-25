import json
import functools
from flask import request, jsonify
from flask_jwt_extended import (
    verify_jwt_in_request,
    current_user,
    jwt_refresh_token_required,
    get_jwt_identity,
    create_access_token,
    set_access_cookies,
    jwt_required
)
from jwt import ExpiredSignatureError
from flask_jwt_extended.exceptions import NoAuthorizationError
from app import socketio
from models.game import Game
from util.cards import Card, Hand, Deck, PlayedCards
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
        else:
            return f(*args, **kwargs)
    return wrapper

@socketio.on_error_default
def default_error_handler(e):
    # need to establish error handlers for JWt errors that
    # occur when making web socket request. See all exceptions
    # that can be raised in flask_jwt_extended.jwt_manager
    raise e

@socketio.on('test', namespace='/game')
@jwt_required
def test(data):
    print(data)

# @socketio.on('refresh', namespace='/game')
# @jwt_refresh_token_required
# def refresh_token(data):
#     current_user = get_jwt_identity()
#     new_token = create_access_token(identity=current_user, fresh=False)
#     resp = jsonify({'refreshed': True})
#     set_access_cookies(resp, new_token)
    
#     return resp, 200

@socketio.on('join_game', namespace='/game')
@authenticated_only
def join_game(data):
    #TODO confirm there is id in data

    # check who is current player. if empty, assume game started
    # and you are first player. if not null, only update if we are
    # replacing the previous current player
    game = Game.find_by_id(data['gameId'])
    if data['position'] == 1:
        playerHand = game.player_one_hand
        playedCards = game.player_one_played
        if game.current_player_id == None or game.current_player_id == game.player_one_id:
            game.current_player_id = current_user.id
        game.player_one_id = current_user.id
    else:
        playerHand = game.player_two_hand
        playedCards = game.player_two_played
        if game.current_player_id == game.player_two_id:
            game.current_player_id = current_user.id
    game.save_to_db()
    
    emit( 'game_joined',
        {
            'drawPile': game.draw_pile,
            'discardPile': game.discard_pile,
            'currentPlayer': game.current_player_id,
            'playerHand': playerHand,
            'playedCards': playedCards
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

    if data['position'] == 1:
        playerHand = game.player_one_hand
        playedCards = game.player_one_played
        game.player_one_id = current_user.id
        game.current_player_id = current_user.id
    else:
        playerHand = game.player_two_hand
        playedCards = game.player_two_played
        game.player_two_id = current_user.id

    game.save_to_db()
    
    emit( 'game_created',
        {
            'gameId': game.id,
            'players': {
                'playerOne': game.player_one_id,
                'playerTwo': game.player_two_id
            },
            'playerHand': playerHand,
            'drawPile': game.draw_pile,
            'discardPile': game.discard_pile,
            'currentPlayer': game.current_player_id,
            'playedCards': playedCards
        }
    )

@socketio.on('play_card', namespace='/game')
@authenticated_only
def play_card(data):
    # TODO make sure data fields are present
    # TODO remove duplicate code in each clause
    # TODO confirm user has making move is actually one of the players in this game
    #   and its their turn
    gameId = int(data['gameId'])

    game = Game.find_by_id(gameId)
    if game.player_one_id == current_user.id:
        hand = Hand(game.player_one_hand)
        card = hand.get_card(data['cardIndex'])
        game.player_one_hand = hand.serialize()
        
        played_pile = PlayedCards(game.player_one_played)
        played_pile.add_card(card)
        game.player_one_played = played_pile.serialize()
    else:
        hand = Hand(game.player_two_hand)
        card = hand.get_card(data['cardIndex'])
        game.player_two_hand = hand.serialize()
        
        played_pile = PlayedCards(game.player_two_played)
        played_pile.add_card(card)
        game.player_two_played = played_pile.serialize()

    game.save_to_db()
    
    emit('card_played',
        {
            'playerHand': hand.serialize(),
            'playedCards': played_pile.serialize(),
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
@authenticated_only
def draw_card(data):
    gameId = int(data['gameId'])
    game = Game.find_by_id(gameId)
    deck = Deck(game.draw_pile)

    if current_user.id == game.player_one_id:
        hand = Hand(game.player_one_hand)
        hand.add_card(deck.draw())
        game.player_one_hand = hand.serialize()
        game.draw_pile = deck.serialize()
    else:
        hand = Hand(game.player_two_hand)
        hand.add_card(deck.draw())
        game.player_two_hand = hand.serialize()
        game.draw_pile = deck.serialize()

    game.save_to_db()

    emit('card_drawn',
        {
            'playerHand': hand.serialize(),
            'drawPile': deck.serialize() 
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