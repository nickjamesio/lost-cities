import json
from flask_restful import Resource, reqparse, request
from src.models.game import GameModel
from src.models.player import PlayerModel
from src.util.cards import Card, Deck, Hand, PlayedCards, DiscardPile
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    current_user
)

class Home(Resource):
    def get(self):
        return {'message': 'worked!'}, 200

    @jwt_required
    def post(self):
        # TODO confirm playerPosition is in data
        # TODO if cannot find game, return error
        # TODO do following checks
        # check for player
        # check for empty discard pile
        data = request.get_json()
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

        return {
            'hand': player.hand,
            'discard': game.discard_pile
        }
