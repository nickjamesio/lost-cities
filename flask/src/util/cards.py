import random

class Cards:
    def __init__(self):
        card_values = [
            'h', 'h', 'h', '2',
            '3', '4', '5', '6',
            '7', '8', '9', '10']
        card_colors = ['red', 'green', 'white', 'blue', 'yellow']
        self.deck = [Card(color, value) for color in card_colors for value in card_values]
        self.hand1 = []
        self.hand2 = []

    def shuffle(self):
        random.shuffle(self.deck)

    def deal(self):
        self.hand1 = self.deck[0:8]
        self.hand2 = self.deck[8:16]
        self.deck = self.deck[16:]

    def serialize(self):
        return {
            'deck': [card.serialize() for card in self.deck],
            'hand1': [card.serialize() for card in self.hand1],
            'hand2': [card.serialize() for card in self.hand2],
        }

    def __str__(self):
        return_val = "Deck: "
        for card in self.deck:
            return_val += str(card)

        return_val += "\nHand1: "
        for card in self.hand1:
            return_val += str(card)

        return_val += "\nHand2: "
        for card in self.hand2:
            return_val += str(card)
        
        return return_val

class Card:
    def __init__(self, cType, value):
        self.type = cType
        self.value = value

    def serialize(self):
        return {'type': self.type, 'value': self.value}

    def __str__(self):
        return '<{},{}>'.format(self.type, self.value)

if __name__ == '__main__':
    cards = Cards()
    print(cards)
    print('Deck count: {}'.format(len(cards.deck)))
    cards.shuffle()
    print('Shuffled {}'.format(cards))
    print('Deck count: {}'.format(len(cards.deck)))
    cards.deal()
    print(cards)
    print('Deck count: {}'.format(len(cards.deck)))
    