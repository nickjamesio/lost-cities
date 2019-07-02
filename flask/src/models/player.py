from src.db import db
from src.models.types.json_field import JSONEncoded


class PlayerModel(db.Model):
    """
    Player model
    """
    __tablename__ = 'player'

    id = db.Column(db.Integer, primary_key=True)

    # Many to one
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)
    game = db.relationship("GameModel", back_populates="players")

    # One to one
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship("UserModel", foreign_keys=[user_id])

    position = db.Column(db.Integer)
    hand = db.Column(JSONEncoded(500))
    played = db.Column(JSONEncoded(1000), default={
        'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []
    })
    score = db.Column(db.Integer, default=0)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return '<Player {}>'.format(self.user_id)
