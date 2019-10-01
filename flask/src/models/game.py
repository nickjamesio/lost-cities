from src import db
from src.models.types.json_field import JSONEncoded


class GameModel(db.Model):
    """
    Game model
    """
    __tablename__ = 'game'

    id = db.Column(db.Integer, primary_key=True)
    current_player = db.Column(db.Integer, default=1)
    draw_pile = db.Column(JSONEncoded(1400))
    discard_pile = db.Column(JSONEncoded(1000), default={
        'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []
    })
    is_over = db.Column(db.Boolean, default=False)

    # One to many
    players = db.relationship("PlayerModel", back_populates="game")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, gid):
        return cls.query.filter_by(id=gid).first()

    def __repr__(self):
        return '<Game {}>'.format(self.id)