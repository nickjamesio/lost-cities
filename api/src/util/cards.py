import random
from functools import reduce

CARD_VALUES = [
            'h', 'h', 'h', '2',
            '3', '4', '5', '6',
            '7', '8', '9', '10']
CARD_COLORS = ['red', 'green', 'white', 'blue', 'yellow']

class Card(object):
    def __init__(self, cType, value):
        self._type = cType
        self._value = value

    @property
    def type(self):
        return self._type

    @property
    def value(self):
        return self._value

    def serialize(self):
        return {'typ': self.type, 'val': self._value}

    def __str__(self):
        return '<{},{}>'.format(self.type, self._value)

class CardStack:
    def __init__(self, cards=None):
        self.stack = []
        if cards:
            for card in cards:
                self.stack.append(Card(card['typ'], card['val']))

    def shuffle(self):
        random.shuffle(self.stack)

    def pop(self):
        """
        Used to draw top card
        """
        if self.stack:
            return self.stack.pop()
        
        return None

    def append(self, card):
        self.stack.append(card)

    def serialize(self):
        return [card.serialize() for card in self.stack]

    def __str__(self):
        return_val = "Stack: "
        for card in self.stack:
            return_val += str(card)
        
        return return_val

    def __getitem__(self, key):
        return self.stack[key]

    def __len__(self):
        return len(self.stack)

class Hand(CardStack):
    def get_card(self, index):
        index = int(index)
        card = None
        if len(self.stack) >= index:
            card = self.stack[index]
            del self.stack[index]
        return card

    def add_card(self, card):
        self.append(card)
        self.stack = sorted(self.stack, key=lambda card: card.type + str(card.value) )

class Deck(CardStack):
    def __init__(self, cards=None):
        super(Deck, self).__init__(cards)
        if not cards:
            self.stack = [Card(color, value) for color in CARD_COLORS for value in CARD_VALUES]
            self.shuffle()

    @property
    def draw_pile(self):
        return self.stack

    def deal_hand(self, position):
        # Dealing a hand for each player should work as if the cards were
        # being delt back and forth. This means player one gets every other
        # card and player two gets the first 8 since all the between cards
        # have already been removed
        if position == 1:
            tmp_hand = self.stack[-15::2]
            self.stack = self.stack[0:-15] + self.stack[-14::2]
        else:
            tmp_hand = self.stack[-8:]
            self.stack = self.stack[0:-8]

        hand = Hand()
        for card in tmp_hand:
            hand.add_card(card)

        return hand

    def draw(self):
        return self.pop()

class GroupedStack:
    def __init__(self, cards=None):
        self.card_stack = {
            'red': CardStack(),
            'blue': CardStack(),
            'white': CardStack(),
            'yellow': CardStack(),
            'green': CardStack()
        }
        if cards:
            for color, card_stack in cards.items():
                for card in card_stack:
                    self.card_stack[color].append(Card(card['typ'], card['val']))
    
    def add_card(self, card):
        self.card_stack[card.type].append(card)

    def serialize(self):
        return {color: card_stack.serialize() for color, card_stack in self.card_stack.items()}

class PlayedCards(GroupedStack):
    def get_total_score(self):
        total = 0
        for color in CARD_COLORS:
            total += self.get_score_for_stack(color)

        return total

    def get_score_for_stack(self, color):
        """
        Each expidition that has cards on it has a cost of 20.
        To find the score, find all cards that are not hand cards
        and add up the face values. Subtract 20 from this value
        and then multiply by the multipliers. If there are 8 cards
        in this stack, an additional 20 points will be awarded but
        it is not multiplied.
        Ex.
            hand: h, 3, 4, 10
            face value total: 3 + 4 + 10 = 17
            sub total: 17 - 20 = -3
            eight card bonus: N/A
            final score: -3 * 2 = = -6
        """
        # If stack is empty, score is 0
        if not self.card_stack[color]:
            return 0

        hand_cards = []
        number_cards = []
        for card in self.card_stack[color]:
            if card.value == 'h':
                hand_cards.append(card.value)
            else:
                number_cards.append(card.value)
        
        number_sum = reduce((lambda x, y: int(x) + int(y)), number_cards, 0)
        multiplier = len(hand_cards) + 1
        total = (number_sum - 20) * multiplier
        total = total + 20 if len(self.card_stack[color]) >= 8 else total

        return total

class DiscardPile(GroupedStack):
    def get_card(self, color):
        return self.card_stack[color].pop()        

if __name__ == '__main__':
    cards = {
        'red': [],
        'blue': [
            {'typ': 'blue', 'val':'h'},
            {'typ': 'blue', 'val':'h'},
            {'typ': 'blue', 'val':'h'},
            {'typ': 'blue', 'val':'2'},
            {'typ': 'blue', 'val':'3'},
            # {'typ': 'blue', 'val':'4'},
            # {'typ': 'blue', 'val':'5'},
            # {'typ': 'blue', 'val':'6'},
            # {'typ': 'blue', 'val':'7'},
            {'typ': 'blue', 'val':'8'},
            # {'typ': 'blue', 'val':'9'},
            {'typ': 'blue', 'val':'10'},
        ],
        'white': [],
        'yellow': [],
        'green': []
        }
    played = PlayedCards(cards)
    score = played.get_score_for_stack('blue')
    total_score = played.get_total_score()
    x = 1
    