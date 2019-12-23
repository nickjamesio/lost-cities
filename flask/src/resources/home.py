import json
from flask_restful import Resource, reqparse, request
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

from src import api
from src.models.game import GameModel
from src.models.player import PlayerModel
from src.util.cards import Card, Deck, Hand, PlayedCards, DiscardPile
from flask import request

class Home(Resource):
    def get(self):
        player = PlayerModel.find_by_id(2)
        games = player.find_my_games()
        return {'message': 'worked!'}, 200

    @jwt_required
    def post(self):
        data = request.get_json()
        gameId = int(data['gameId'])

        return {
            'gameId': gameId,
            'newData': 'shit stuff'
        }

api.add_resource(Home, '/')
