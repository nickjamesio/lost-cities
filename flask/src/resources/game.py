from flask_restful import Resource, request, reqparse
from src.models.product import ProductModel
from src.models.product_colors import ProductColorsModel
from src.util.cards import Cards

class Game(Resource):
    def get(self, pid):
        product = ProductModel.load_by_id(pid)
        if not product:
            return {'message': 'Product not found'}, 404
        return {'data': product.json()}, 200

class GameList(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('player',
                        type=int,
                        # required=True,
                        help="This field cannot be left blank!"
                        )
    # parser.add_argument('description',
    #                     type=str,
    #                     required=True,
    #                     help="This field cannot be left blank!"
    #                     )
    # parser.add_argument('person',
    #                     type=str,
    #                     required=True,
    #                     help="This field cannot be left blank!"
    #                     )
    # parser.add_argument('colors',
    #                     type=str,
    #                     action='append',
    #                     required=True,
    #                     help="This field cannot be left blank!"
    #                     )
    # parser.add_argument('product_type',
    #                     type=str,
    #                     required=True,
    #                     help="This field cannot be left blank!"
    #                     )
    # parser.add_argument('price',
    #                     type=float,
    #                     required=True,
    #                     help="This field cannot be left blank!"
    #                     )
    playerOne = {
        'name': 'Nick',
        'hand': [],
        'played': {
            'red': [],
            'green': [],
            'blue': [],
            'white': [],
            'yellow': []
        },
        'score': 17
    }

    playerTwo = {
        'name': 'Dad',
        'hand': [],
        'played': {
            'red': [],
            'green': [],
            'blue': [],
            'white': [],
            'yellow': []
        },
        'score': 45
    }

    drawPile = []

    discardPile = {
        'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []
    }

    def post(self):
        data = self.parser.parse_args()
        cards = Cards()
        cards.shuffle()
        cards.deal()
        serialized_data = cards.serialize()

        self.playerOne['hand'] = serialized_data['hand1']
        self.playerTwo['hand'] = serialized_data['hand2']
        self.drawPile = serialized_data['deck']
        # self.players.append(data['player'])
        return {
            'playerOne': self.playerOne,
            'playerTwo': self.playerTwo,
            'drawPile': self.drawPile,
            'discardPile': self.discardPile
        }
        # colors = []
        # for color in data.colors:
        #     colors.append(ProductColorsModel(color=color))

        # data['colors'] = colors
        # product = ProductModel(**data)

        # try:
        #     product.save_to_db()
        # except:
        #     return {"message": "An error occurred inserting the item."}, 500

        # return product.json(), 201

    def get(self):
        data = {
            'playerOne': self.playerOne,
            'playerTwo': self.playerTwo,
            'drawPile': self.drawPile
        }
        return data
        # products = ProductModel.query.all()
        # return {'data': [product.json() for product in products]}, 200