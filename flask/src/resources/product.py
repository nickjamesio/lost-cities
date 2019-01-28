from flask_restful import Resource, request, reqparse
from src.models.product import ProductModel
from src.models.product_colors import ProductColorsModel

class Product(Resource):
    def get(self, pid):
        product = ProductModel.load_by_id(pid)
        if not product:
            return {'message': 'Product not found'}, 404
        return {'data': product.json()}, 200

class ProductList(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('title',
                        type=str,
                        required=True,
                        help="This field cannot be left blank!"
                        )
    parser.add_argument('description',
                        type=str,
                        required=True,
                        help="This field cannot be left blank!"
                        )
    parser.add_argument('person',
                        type=str,
                        required=True,
                        help="This field cannot be left blank!"
                        )
    parser.add_argument('colors',
                        type=str,
                        action='append',
                        required=True,
                        help="This field cannot be left blank!"
                        )
    parser.add_argument('product_type',
                        type=str,
                        required=True,
                        help="This field cannot be left blank!"
                        )
    parser.add_argument('price',
                        type=float,
                        required=True,
                        help="This field cannot be left blank!"
                        )

    def post(self):
        data = self.parser.parse_args()
        colors = []
        for color in data.colors:
            colors.append(ProductColorsModel(color=color))

        data['colors'] = colors
        product = ProductModel(**data)

        try:
            product.save_to_db()
        except:
            return {"message": "An error occurred inserting the item."}, 500

        return product.json(), 201

    def get(self):
        products = ProductModel.query.all()
        return {'data': [product.json() for product in products]}, 200