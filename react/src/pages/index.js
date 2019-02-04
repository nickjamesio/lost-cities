import React, { Component } from "react";
import { withRouteData } from "react-static";
import { Grid } from "@material-ui/core";

import Header from "../components/Header";
import CardStacks from "../components/CardStacks";
import Board from "../components/Board";
import Hand from "../components/Hand";
import { newGame } from "../utils/api";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discardPile: {
        red: [],
        green: [],
        white: [],
        blue: [],
        yellow: []
      },
      me: {
        name: "",
        hand: [],
        score: 0,
        played: {
          red: [],
          green: [],
          white: [],
          blue: [],
          yellow: []
        }
      },
      opponent: {
        name: "",
        score: 0,
        played: {
          red: [],
          green: [],
          white: [],
          blue: [],
          yellow: []
        }
      },
      currentPlayer: {},
      selectedCard: null
    };

    this.handleClickCard = this.handleClickCard.bind(this);
  }

  handleClickCard(e, position) {
    this.setState(prevState => ({
      selectedCard: position === prevState.selectedCard ? null : position 
    }));
  }

  componentDidMount() {
    const thang = data => {
      const x = 1;
      this.setState({
        discardPile: data.discardPile,
        me: data.playerOne,
        opponent: data.playerTwo,
        drawPile: data.drawPile
      });
    };
    newGame()
      .then(thang)
      .catch(error => console.error(error));
  }

  render() {
    const { data } = this.props;
    const {
      drawPile,
      discardPile,
      players,
      currentPlayer,
      me,
      opponent,
      selectedCard
    } = this.state;

    return (
      <>
        <Header currentPlayer={currentPlayer} player={me} />
        <CardStacks stacks={opponent.played} direction="bottom" />
        <Board discardPile={discardPile} />
        <Grid container directoin="row">
          <CardStacks stacks={me.played} direction="top" />
          <Hand
            selectedCard={selectedCard}
            cards={me.hand}
            handleClick={this.handleClickCard}
          />
        </Grid>
      </>
    );
  }
}

export default withRouteData(Game);
