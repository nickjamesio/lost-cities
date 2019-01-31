import React, { Component } from 'react';
import { withRouteData } from 'react-static';

import Header from '../components/Header';
import Card from '../components/Card';
import CardStack from '../components/CardStack';
import CardStacks from '../components/CardStacks';
import Board from '../components/Board';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discardPile: {
        red: [
          {value: 'h', type: 'red'},
        ],
        green: [],
        white: [],
        blue: [],
        yellow: [],
      },
      me: {
        name: '',
        hand: [],
        score: 0,
        cardsPlayed: {
          red: [],
          green: [],
          white: [],
          blue: [],
          yellow: [],
        }
      },
      opponent: {
        name: '',
        score: 0,
        cardsPlayed: {
          red: [
            {value: 'h', type: 'red'},
            {value: 'h', type: 'red'},
            {value: 'h', type: 'red'},
            {value: '2', type: 'red'},
            {value: '3', type: 'red'},
            {value: '4', type: 'red'},
            {value: '5', type: 'red'},
            {value: '6', type: 'red'},
            {value: '7', type: 'red'},
            {value: '8', type: 'red'},
            {value: '9', type: 'red'},
            {value: '10', type: 'red'}
          ],
          green: [
            {value: '7', type: 'green'},
            {value: '8', type: 'green'},
            {value: '9', type: 'green'},
            {value: '10', type: 'green'}
          ],
          white: [
            {value: '7', type: 'white'},
            {value: '8', type: 'white'},
            {value: '9', type: 'white'},
            {value: '10', type: 'white'}
          ],
          blue: [
            {value: '7', type: 'blue'},
            {value: '8', type: 'blue'},
            {value: '9', type: 'blue'},
            {value: '10', type: 'blue'}
          ],
          yellow: [
            {value: '7', type: 'yellow'},
            {value: '8', type: 'yellow'},
            {value: '9', type: 'yellow'},
            {value: '10', type: 'yellow'}
          ],
        }
      },
      currentPlayer: {},
    }
  }

  componentDidMount() {
    fetch('http://api.localhost/products')
      .then(response => response.json())
      .then(({data}) => this.setState({products: data}))
      .catch(error => console.error(error));
  }

  render() {
    const { data } = this.props;
    const { drawPile, discardPile, players, currentPlayer, me, opponent } = this.state;

    return (
      <>
        <Header currentPlayer={currentPlayer} player={me} />
        <CardStacks stacks={opponent.cardsPlayed} direction="bottom" />
        <Board discardPile={discardPile} />
        <CardStacks stacks={opponent.cardsPlayed} direction="top" />
      </>
    );
  }
}

export default withRouteData(Game);
