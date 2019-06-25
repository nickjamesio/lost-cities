import json
from flask_restful import Resource, reqparse, request
from models.game import Game
from util.cards import Card, Deck, Hand, PlayedCards
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
        data = request.get_json()

        game = Game.find_by_id(data['gameId'])
        if not game:
            return {'message': 'could not load game with id ' + str(data['gameId'])}

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
        return {'message': 'restricted worked'}, 200