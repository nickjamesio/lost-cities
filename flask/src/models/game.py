from src.db import db

class Game(db.Model):
    """
    New game
    """
    __tablename__ = 'game'

    id = db.Column(db.Integer, primary_key=True)
    player_one_id = db.Column(db.Integer)
    player_two_id = db.Column(db.Integer)
    current_player_id = db.Column(db.Integer)
    player_one_hand = db.Column(db.String(23))
    player_two_hand = db.Column(db.String(23))


draw pile
discard piles
player one score
player two score