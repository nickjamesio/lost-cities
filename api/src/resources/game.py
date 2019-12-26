from flask_restful import Resource, request, reqparse
from flask_jwt_extended import (
    jwt_required,
    current_user,
    get_jwt_identity
)

from src import api
from src.models.game import GameModel
from src.models.player import PlayerModel


class MyGame(Resource):
    @jwt_required
    def get(self, gid):
        game = GameModel.find_by_id(gid)
        if not game:
            return {'message': 'Game not found'}, 404

        # Check if current user is a player in the game
        # There are only two players so no need to perform
        # another database query
        player = None
        opponent = None
        for p in game.players:
            if p.user_id == current_user.id:
                player = p
            else:
                opponent = p
            
        if not player:
            return {'message': 'You are not a player in the requested game'}, 401
        
        opponent_position = (player.position % 2) + 1
        return {
            'gameId': game.id,
            'position': player.position,
            'hand': player.hand,
            'deck': game.draw_pile,
            'currentPlayer': game.current_player,
            'discard': game.discard_pile,
            'played': {
                player.position: player.played,
                opponent_position: opponent.played if opponent else {
                    'red': [],
                    'green': [],
                    'blue': [],
                    'white': [],
                    'yellow': []
                }
            },
            'gameReady': True if len(game.players) == 2 else False,
            'over': game.is_over
        }


class GameList(Resource):
    def post(self):
      pass
        # cards = Cards()
        # cards.shuffle()
        # cards.deal()
        # serialized_data = cards.serialize()

        # self.playerOne['hand'] = serialized_data['hand1']
        # self.playerTwo['hand'] = serialized_data['hand2']
        # self.drawPile = serialized_data['deck']
        # # self.players.append(data['player'])
        # return {
        #     'playerOne': self.playerOne,
        #     'playerTwo': self.playerTwo,
        #     'drawPile': self.drawPile,
        #     'discardPile': self.discardPile
        # }

    def get(self):
        data = {
            'playerOne': self.playerOne,
            'playerTwo': self.playerTwo,
            'drawPile': self.drawPile
        }
        return data
        # products = ProductModel.query.all()
        # return {'data': [product.json() for product in products]}, 200

api.add_resource(MyGame, '/mygame/<int:gid>')