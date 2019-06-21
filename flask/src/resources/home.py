import json
from flask_restful import Resource, reqparse
from models.game import Game
from util.cards import Card, Deck, Hand
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies
)

class Home(Resource):
    def get(self):
        return {'message': 'worked!'}, 200

    @jwt_required
    def post(self):
        return {'message': 'restricted worked'}, 200