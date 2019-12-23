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

    @classmethod
    def find_open_games(cls):
        # TODO for now this will work with small amounts of games.
        # However, this will not work well with large amounts of games.
        # Pagination would be ideal
        with db.engine.connect() as con:
            results = con.execute("""
                SELECT game.id as gameid, users.username
                FROM game
                JOIN player
                ON player.game_id = game.id
                JOIN users
                ON player.user_id = users.id
                WHERE (
                    SELECT COUNT(1)
                    FROM player
                    WHERE game_id=game.id
                ) = 1;
            """)
            
        return [{"gameid": item[0], "username": item[1]} for item in results]

    def __repr__(self):
        return '<Game {}>'.format(self.id)