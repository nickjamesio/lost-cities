import random
from src import app
from src import db
from src.models.product import ProductModel
from src.models.product_colors import ProductColorsModel

@app.before_first_request
def create_db():
    db.create_all()
    rows = ProductModel.query.count()
    if not rows:
        for _ in range(5):
            create_product()

TITLES = [
    'I heart NY',
    'Pizza is the best',
    'You had me at tacos',
    'Tacos are my Valentine',
    'Happy New Year'
]

DESCRIPTIONS = [
    'Awesome NY shirt',
    'Awesome pizza shirt',
    'Awesome taco shirt',
    'Tacos stuff',
    'New year shirt'
]

PRODUCT_TYPES = [
    'shirt',
    'hoodie',
    'tank'
]

PERSON = [
    'male',
    'female'
]

PRICE = [
    22.99,
    26.99,
    29.99
]

def create_product():
    data = {
        'title': TITLES[random.randrange(0, len(TITLES))],
        'description': DESCRIPTIONS[random.randrange(0, len(DESCRIPTIONS))],
        'product_type': PRODUCT_TYPES[random.randrange(0, len(PRODUCT_TYPES))],
        'person': PERSON[random.randrange(0, len(PERSON))],
        'price': PRICE[random.randrange(0, len(PRICE))],
        'colors': [
            ProductColorsModel(color='black'),
            ProductColorsModel(color='red'),
            ProductColorsModel(color='green')
        ]
    }
    ProductModel(**data).save_to_db()