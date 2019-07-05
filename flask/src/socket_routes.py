import json
import functools
from flask import request, jsonify
from jwt import ExpiredSignatureError
from flask_jwt_extended.exceptions import NoAuthorizationError
from src.app import socketio
from src.models.game import GameModel
from src.models.player import PlayerModel
from src.util.cards import Card, Hand, Deck, PlayedCards, DiscardPile
from flask_socketio import (
    emit,
    join_room,
    leave_room,
    close_room,
    rooms,
    disconnect
)
from flask_jwt_extended import (
    verify_jwt_in_request,
    current_user,
    jwt_refresh_token_required,
    get_jwt_identity,
    create_access_token,
    set_access_cookies,
    jwt_required
)


def authenticated_only(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except NoAuthorizationError as e:
            emit('not authorized', {'message': str(e)})
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


# @socketio.on('refresh', namespace='/game')
# @jwt_refresh_token_required
# def refresh_token(data):
#     current_user = get_jwt_identity()
#     new_token = create_access_token(identity=current_user, fresh=False)
#     resp = jsonify({'refreshed': True})
#     set_access_cookies(resp, new_token)

#     return resp, 200

@socketio.on('new_game', namespace='/game')
@authenticated_only
def new_game(data):
    if 'position' not in data:
        return {'message': "'position' must be sent as part of the request"}
    
    position = int(data['position'])
    deck = Deck()
    hand = deck.deal_hand(position)

    player = PlayerModel()
    player.hand = hand.serialize()
    player.user = current_user
    player.position = position

    game = GameModel()
    game.draw_pile = deck.serialize()
    game.players.append(player)
    game.save_to_db()

    # Join a room so only people associated with this room/game
    # will be sent events
    join_room(game.id)
    # TODO consider joining a second room named like so 'player_1_game_4'
    # this would allow methods to send messages directly to one user in a game

    opponent_position = (position % 2) + 1
    opponent = PlayerModel.query.with_parent(game).filter(PlayerModel.position == opponent_position).first()

    emit('game_created',
         {
             'gameId': game.id,
             'position': player.position,
             'hand': player.hand,
             'deck': game.draw_pile,
             'discard': game.discard_pile,
             'currentPlayer': game.current_player,
             'played': {
                position: player.played,
                opponent_position: opponent.played if opponent else {
                    'red': [],
                    'green': [],
                    'blue': [],
                    'white': [],
                    'yellow': []
                }
            }
         }
    )

@socketio.on('join_game', namespace='/game')
@authenticated_only
def join_game(data):
    if 'position' not in data:
        return {'message': "'position' must be sent as part of the request"}
    elif 'gameId' not in data:
        return {'message': "'gameId' must be sent as part of the request"}

    game = GameModel.find_by_id(int(data['gameId']))
    if not game:
        return {'message': "could not find game with id '{}'".format(data['gameId'])}

    position = int(data['position'])
    player = PlayerModel.query.with_parent(game).filter(PlayerModel.position == position).first()
    
    # Check if there is a player at that position already. If not, add the current player.
    # If so, replace them.
    if not player:
        deck = Deck(game.draw_pile)
        player = PlayerModel()
        player.hand = deck.deal_hand(position).serialize()
        player.position = position
        player.user = current_user
        player.game = game
        player.save_to_db()
    elif player.user_id != current_user.id:
        player.user = current_user
        player.save_to_db()
    
    # Join a room for the game so only people associated with this game
    # will be sent events
    join_room(game.id)

    opponent_position = (position % 2) + 1
    opponent = PlayerModel.query.with_parent(game).filter(PlayerModel.position == opponent_position).first()

    emit('game_joined',
        {
            'currentPlayer': game.current_player,
            'deck': game.draw_pile,
            'discard': game.discard_pile,
            'hand': player.hand,
            'played': {
                position: player.played,
                opponent_position: opponent.played if opponent else {
                    'red': [],
                    'green': [],
                    'blue': [],
                    'white': [],
                    'yellow': []
                }
            },
            'over': game.is_over
        }
    )
    # Send both clients a message saying the game is ready to
    # to be played now that there are 2 players
    if PlayerModel.query.with_parent(game).count() == 2:
        emit('game_ready', {'ready': True}, room=game.id)


@socketio.on('play_card', namespace='/game')
@authenticated_only
def play_card(data):
    if 'cardIndex' not in data:
        return {'message': "'cardIndex' must be sent as part of the request"}
    elif 'gameId' not in data:
        return {'message': "'gameId' must be sent as part of the request"}

    index = int(data['cardIndex'])
    gameId = int(data['gameId'])

    game = GameModel.find_by_id(gameId)
    if not game:
        return {'message': "could not find game with id '{}'".format(data['gameId'])}

    player = PlayerModel.query.with_parent(game).filter(PlayerModel.position == game.current_player).first()
    
    if player and player.user_id == current_user.id:
        hand = Hand(player.hand)
        played_pile = PlayedCards(player.played)
        
        played_pile.add_card(hand.get_card(index))
        player.hand = hand.serialize()
        player.played = played_pile.serialize()
        player.save_to_db()

        opponent_position = (player.position % 2) + 1
        opponent = PlayerModel.query.with_parent(game).filter(PlayerModel.position == opponent_position).first()

        emit('updated_hand',
            {'hand': hand.serialize()}
        )
        emit('played_cards',
            {
                'played': {
                    player.position: player.played,
                    opponent_position: opponent.played if opponent else {
                        'red': [],
                        'green': [],
                        'blue': [],
                        'white': [],
                        'yellow': []
                    }
                }
            },
            room=game.id
        )
    
    return {'message': 'It is not your turn'}


@socketio.on('discard_card', namespace='/game')
@authenticated_only
def discard_card(data):
    if 'cardIndex' not in data:
        return {'message': "'cardIndex' must be sent as part of the request"}
    elif 'gameId' not in data:
        return {'message': "'gameId' must be sent as part of the request"}
    
    gameId = int(data['gameId'])
    index = int(data['cardIndex'])

    game = GameModel.find_by_id(gameId)
    player = PlayerModel.query.with_parent(game).filter(PlayerModel.position == game.current_player).first()
    
    if player and player.user_id == current_user.id:
        hand = Hand(player.hand)
        discard = DiscardPile(game.discard_pile)

        card = hand.get_card(index)
        discard.add_card(card)

        player.hand = hand.serialize()
        game.discard_pile = discard.serialize()
        game.current_player = (game.current_player % 2) + 1

        game.save_to_db()
        player.save_to_db()
        emit('discard_card', {
                'hand': player.hand,
                'discard': game.discard_pile,
                'currentPlayer': game.current_player
            },
            broadcast=True
        )

    return {'message': "It is not your turn"}, 403


@socketio.on('draw_card', namespace='/game')
@authenticated_only
def draw_card(data):
    gameId = int(data['gameId'])
    game = GameModel.find_by_id(gameId)
    player = PlayerModel.query.with_parent(game).filter(PlayerModel.position == game.current_player).first()
    
    if player and player.user_id == current_user.id:
        deck = Deck(game.draw_pile)
        hand = Hand(player.hand)
        hand.add_card(deck.draw())
        player.hand = hand.serialize()
        game.draw_pile = deck.serialize()
        game.current_player = (game.current_player % 2) + 1

        game.save_to_db()
        player.save_to_db()
        emit('card_drawn', {
                'hand': player.hand,
                'deck': game.draw_pile,
                'currentPlayer': game.current_player
            },
            broadcast=True
        )

    return {'message': "It is currently player '{}' turn".format(game.current_player)}, 403


@socketio.on('draw_discard', namespace='/game')
def draw_from_discard_pile(data):
    gameId = int(data['gameId'])
    color = data['color']

    game = GameModel.find_by_id(gameId)
    player = PlayerModel.query.with_parent(game).filter(PlayerModel.position == game.current_player).first()
    
    discard = DiscardPile(game.discard_pile)
    card = discard.get_card(color)
    
    hand = Hand(player.hand)
    hand.add_card(card)

    game.discard_pile = discard.serialize()
    player.hand = hand.serialize()

    player.save_to_db()
    game.save_to_db()
    emit('discard_draw',
         {
             'currentPlayer': game.current_player,
             'hand': player.hand,
             'discard': game.discard_pile
         },
         broadcast=True
    )
