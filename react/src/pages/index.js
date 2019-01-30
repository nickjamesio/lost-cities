import React, { Component } from 'react';
import { withRouteData } from 'react-static';

import Header from '../components/Header';
import Card from '../components/Card';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPile: [],
      discardPile: {
        red: [],
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
          red: [],
          green: [],
          white: [],
          blue: [],
          yellow: [],
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
    const { drawPile, discardPile, players, currentPlayer, me } = this.state;

    return (
      <>
        <Header currentPlayer={currentPlayer} player={me} />
        <Card type="red" value={5}/>
        <Card type="back" />
      </>
    );
  }
}

export default withRouteData(Game);
