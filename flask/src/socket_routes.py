from src.app import socketio
from src.util.cards import Cards
from src.util.cards import Card
from flask_socketio import emit, join_room, leave_room, \
    close_room, rooms, disconnect

players = [
    {
        'id': 1,
        'name': '',
        'hand': [],
        'played': {
            'red': [],
            'green': [],
            'blue': [],
            'white': [],
            'yellow': []
        },
        'score': 0
    },
    {
        'id': 2,
        'name': '',
        'hand': [],
        'played': {
            'red': [],
            'green': [],
            'blue': [],
            'white': [],
            'yellow': []
        },
        'score': 0
    }
]

currentPlayer = None

drawPile = []

discardPile = {
    'red': [],
    'green': [],
    'blue': [],
    'white': [],
    'yellow': []
}

@socketio.on('test', namespace='/game')
def test(data):
    print(data)

@socketio.on('join_game', namespace='/game')
def join_game(data):
    # Need name
    global players, currentPlayer, drawPile, discardPile
    player = {}
    opponent = {}
    for person in players:
        if person['name'] == data['player_name']:
            player = person
        else:
            opponent = person
    
    emit( 'join_game',
        {
            'myId': player['id'],
            'opponentId': opponent['id'],
            'players': {
                players[0]['id']: players[0],
                players[1]['id']: players[1]
            },
            'drawPile': drawPile,
            'discardPile': discardPile,
            'currentPlayer': currentPlayer
        }
    )

@socketio.on('new_game', namespace='/game')
def new_game(data):
    global players, currentPlayer, drawPile, discardPile
    clear_game()
    cards = Cards()
    cards.shuffle()
    cards.deal()
    serialized_data = cards.serialize()

    players[0]['hand'] = serialized_data['hand1']
    players[1]['hand'] = serialized_data['hand2']
    players[0]['name'] = data['me']
    players[1]['name'] = data['opponent']
    drawPile = serialized_data['deck']

    currentPlayer = players[0]['id'] if data['firstPlayer'] == 'me' else players[1]['id']
    
    emit( 'game_data',
        {
            'players': {
                players[0]['id']: players[0],
                players[1]['id']: players[1]
            },
            'drawPile': drawPile,
            'discardPile': discardPile,
            'currentPlayer': currentPlayer
        }
    )

@socketio.on('play_card', namespace='/game')
def play_card(data):
    player = get_user(data['pid'])
    selectedCard = data['selectedCard']
    card = player['hand'][selectedCard]
    
    del player['hand'][selectedCard]
    player['played'][card['type']].append(card['value'])

    emit('update_hand',
        {
            'pid': player['id'],
            'player': player

        },
        broadcast=True
    )

@socketio.on('discard_card', namespace='/game')
def discard_card(data):
    global discardPile
    player = get_user(data['pid'])
    selectedCard = data['selectedCard']
    card = player['hand'][selectedCard]
    
    del player['hand'][selectedCard]
    discardPile[card['type']].append(card['value'])

    emit('discard_card',
        {
            'pid': player['id'],
            'player': player,
            'discardPile': discardPile

        },
        broadcast=True
    )

@socketio.on('draw_card', namespace='/game')
def draw_card(data):
    global drawPile
    player = get_user(data['pid'])
    card = drawPile.pop()
    player['hand'].append(card)
    emit('draw_common_pile',
        {
            'pid': data['pid'],
            'player': player,
            'drawPile': drawPile 
        },
        broadcast=True
    )

@socketio.on('discard_draw', namespace='/game')
def draw_from_discard_pile(data):
    global discardPile
    player = get_user(data['pid'])
    card_value = discardPile[data['pile_color']].pop()
    player['hand'].append({'type': data['pile_color'], 'value': card_value})
    emit('draw_discard_pile',
        {
            'pid': data['pid'],
            'player': player,
            'discardPile': discardPile 
        },
        broadcast=True
    )

def get_user(pid):
    global players
    for player in players:
        if player['id'] == pid:
            return player

def clear_game():
    global players, currentPlayer, drawPile, discardPile
    players = [
        {
            'id': 1,
            'name': '',
            'hand': [],
            'played': {
                'red': [],
                'green': [],
                'blue': [],
                'white': [],
                'yellow': []
            },
            'score': 0
        },
        {
            'id': 2,
            'name': '',
            'hand': [],
            'played': {
                'red': [],
                'green': [],
                'blue': [],
                'white': [],
                'yellow': []
            },
            'score': 0
        }
    ]

    currentPlayer = None

    drawPile = []

    discardPile = {
        'red': [],
        'green': [],
        'blue': [],
        'white': [],
        'yellow': []
    }