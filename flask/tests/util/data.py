from sqlalchemy.sql import text

game_data = (
    {
        'current': 1,
        'deck': '[{"typ":"red","val":"h"},{"typ":"blue","val":"h"},{"typ":"white","val":"7"},{"typ":"yellow","val":"7"},{"typ":"blue","val":"8"},{"typ":"green","val":"10"},{"typ":"red","val":"10"},{"typ":"green","val":"8"},{"typ":"yellow","val":"h"},{"typ":"yellow","val":"10"},{"typ":"yellow","val":"4"},{"typ":"green","val":"5"},{"typ":"yellow","val":"6"},{"typ":"green","val":"3"},{"typ":"blue","val":"6"},{"typ":"green","val":"h"},{"typ":"yellow","val":"5"},{"typ":"white","val":"3"},{"typ":"red","val":"h"},{"typ":"green","val":"h"},{"typ":"red","val":"8"},{"typ":"red","val":"5"},{"typ":"blue","val":"10"},{"typ":"blue","val":"2"},{"typ":"white","val":"10"},{"typ":"blue","val":"7"},{"typ":"blue","val":"4"},{"typ":"green","val":"9"},{"typ":"blue","val":"9"},{"typ":"green","val":"2"},{"typ":"yellow","val":"3"},{"typ":"yellow","val":"9"},{"typ":"red","val":"3"},{"typ":"white","val":"8"},{"typ":"white","val":"4"},{"typ":"white","val":"5"},{"typ":"yellow","val":"h"},{"typ":"red","val":"6"},{"typ":"green","val":"7"},{"typ":"red","val":"2"},{"typ":"blue","val":"5"},{"typ":"white","val":"2"},{"typ":"green","val":"6"},{"typ":"blue","val":"3"},{"typ":"yellow","val":"2"},{"typ":"green","val":"4"},{"typ":"yellow","val":"8"},{"typ":"yellow","val":"h"},{"typ":"red","val":"9"},{"typ":"white","val":"h"},{"typ":"blue","val":"h"},{"typ":"white","val":"h"}]',
        'discard': '{"red":[],"green":[],"blue":[],"white":[],"yellow":[]}',
        'over': False
    },
    {
        'current': 2,
        'deck': '[{"typ":"red","val":"h"},{"typ":"blue","val":"h"},{"typ":"white","val":"7"},{"typ":"yellow","val":"7"},{"typ":"blue","val":"8"},{"typ":"green","val":"10"},{"typ":"red","val":"10"},{"typ":"green","val":"8"},{"typ":"yellow","val":"h"},{"typ":"yellow","val":"10"},{"typ":"yellow","val":"4"},{"typ":"green","val":"5"},{"typ":"yellow","val":"6"},{"typ":"green","val":"3"},{"typ":"blue","val":"6"},{"typ":"green","val":"h"},{"typ":"yellow","val":"5"},{"typ":"white","val":"3"},{"typ":"red","val":"h"},{"typ":"green","val":"h"},{"typ":"red","val":"8"},{"typ":"red","val":"5"},{"typ":"blue","val":"10"},{"typ":"blue","val":"2"},{"typ":"white","val":"10"},{"typ":"blue","val":"7"},{"typ":"blue","val":"4"},{"typ":"green","val":"9"},{"typ":"blue","val":"9"},{"typ":"green","val":"2"},{"typ":"yellow","val":"3"},{"typ":"yellow","val":"9"},{"typ":"red","val":"3"},{"typ":"white","val":"8"},{"typ":"white","val":"4"},{"typ":"white","val":"5"},{"typ":"yellow","val":"h"},{"typ":"red","val":"6"},{"typ":"green","val":"7"},{"typ":"red","val":"2"},{"typ":"blue","val":"5"},{"typ":"white","val":"2"},{"typ":"green","val":"6"},{"typ":"blue","val":"3"},{"typ":"yellow","val":"2"},{"typ":"green","val":"4"},{"typ":"yellow","val":"8"},{"typ":"yellow","val":"h"},{"typ":"red","val":"9"},{"typ":"white","val":"h"},{"typ":"blue","val":"h"},{"typ":"white","val":"h"}]',
        'discard': '{"red":[],"green":[],"blue":[],"white":[],"yellow":[]}',
        'over': False
    })

user_data = (
    {'name': 'test', 'pass': 'test'},
    {'name': 'one', 'pass': 'blah'},
    {'name': 'two', 'pass': 'blah'}
)

user_statement = text("INSERT INTO users (username, password) VALUES(:name, :pass)")   
game_statement = text("INSERT INTO game (current_player, draw_pile, discard_pile, game_over) VALUES(:current, :deck, :discard, :over)")

class TestData:
    def __init__(self, connection):
        self._connection = connection

    def create_test_users(self):
        for user in user_data:
            self._connection.execute(user_statement, **user)
    
    def create_test_games(self):
        for game in game_data:
            self._connection.execute(game_statement, **game)