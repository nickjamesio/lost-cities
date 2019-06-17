from src.app import db
from src.models.types.json_field import JSONEncoded

class Game(db.Model):
    """
    New game
    """
    __tablename__ = 'game'

    id = db.Column(db.Integer, primary_key=True)
    player_one_id = db.Column(db.Integer)
    player_two_id = db.Column(db.Integer)
    current_player_id = db.Column(db.Integer)
    player_one_hand = db.Column(JSONEncoded(200))
    player_two_hand = db.Column(JSONEncoded(200))
    draw_pile = db.Column(JSONEncoded(800))
    discard_pile = db.Column(JSONEncoded(800))
    player_one_score = db.Column(db.Integer)
    player_two_score = db.Column(db.Integer)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, gid):
        return cls.query.filter_by(id=gid).first()
# draw pile
# discard piles
# player one score
# player two score