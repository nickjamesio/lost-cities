import random

class Card(object):
    def __init__(self, cType, value):
        self.type = cType
        self.value = value

    def serialize(self):
        return {'typ': self.type, 'val': self.value}

    def __str__(self):
        return '<{},{}>'.format(self.type, self.value)

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
        return self.stack.pop()

    def append(self, card):
        self.stack.append(Card(card['typ'], card['val']))

    def serialize(self):
        return [card.serialize() for card in self.stack]

    def __str__(self):
        return_val = "Stack: "
        for card in self.stack:
            return_val += str(card)
        
        return return_val

class Hand(CardStack):
    def get_card(self, index):
        card = None
        if len(self.stack) >= index:
            card = self.stack[index]
            del self.stack[index]
        return card

    def add_card(self, card):
        self.append(card)
        self.stack = sorted(self.stack, key=lambda card: card['typ'] + str(card['val']) )

class Deck(CardStack):
    CARD_VALUES = [
            'h', 'h', 'h', '2',
            '3', '4', '5', '6',
            '7', '8', '9', '10']
    CARD_COLORS = ['red', 'green', 'white', 'blue', 'yellow']

    def __init__(self, cards=None):
        super(Deck, self).__init__(cards)
        if not cards:
            self.stack = [Card(color, value) for color in self.CARD_COLORS for value in self.CARD_VALUES]

    @property
    def draw_pile(self):
        return self.stack

    def deal(self):
        self.shuffle()
        tmp_hand1 = self.stack[0:16:2]
        tmp_hand2 = self.stack[1:16:2]
        self.stack = self.stack[16:]

        hand1 = Hand()
        hand2 = Hand()
        for card in tmp_hand1:
            hand1.add_card(card)
        for card in tmp_hand2:
            hand2.add_card(card)

        return  hand1, hand2

if __name__ == '__main__':
    pass
    # cards = Cards()
    # print(cards)
    # print('Deck count: {}'.format(len(cards.deck)))
    # cards.shuffle()
    # print('Shuffled {}'.format(cards))
    # print('Deck count: {}'.format(len(cards.deck)))
    # cards.deal()
    # print(cards)
    # print('Deck count: {}'.format(len(cards.deck)))
    