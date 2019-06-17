from flask_restful import Resource, reqparse
from src.models.game import Game
from src.util.cards import Card, Deck, Hand
import json

class Home(Resource):
    def get(self):
        # game = Game()
        # game.player_one_id = 3
        # game.player_two_id = 4
        # game.current_player_id = 3
        # game.player_one_hand = json.dumps([{'t': 'green', 'v': '2'}, {'t': 'red', 'v': '2'}])
        # game.player_two_hand = [{'t': 'green', 'v': '2'}, {'t': 'red', 'v': '2'}]
        # game.draw_pile = json.dumps([])
        # game.discard_pile = json.dumps([])
        # game.player_one_score = 2
        # game.player_two_score = 3
        # game.save_to_db()

        # stuff = Game.find_by_id(2)


        return {'message': 'worked!'}, 200