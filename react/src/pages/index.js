import React, { Component } from "react";
import { withRouteData } from "react-static";
import { Grid } from "@material-ui/core";
import io from 'socket.io-client';

import Header from "../components/Header";
import CardStacks from "../components/CardStacks";
import Board from "../components/Board";
import Hand from "../components/Hand";
import NewGameModal from "../components/NewGameModal";
import JoinGame from '../components/JoinGame';
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
      players: {
        [1]: {
          id: null,
          name: '',
          hand: [],
          played: {
              red: [],
              green: [],
              blue: [],
              white: [],
              yellow: []
          },
          score: 0
        },
        [2]: {
          id: null,
          name: '',
          hand: [],
          played: {
              red: [],
              green: [],
              blue: [],
              white: [],
              yellow: []
          },
          score: 0
        }
      },
      myId: 1,
      opponentId: 2,
      currentPlayer: 1,
      drawPile: [],
      selectedCard: null,
      modalOpen: false,
      modalFormData: {
        me: "",
        opponent: "",
        firstPlayer: "me"
      },
      join_name: '',
    };

    this.socket = io('http://localhost:5000/game')
    this.handleClickCard = this.handleClickCard.bind(this);
    this.handleClickPlayButton = this.handleClickPlayButton.bind(this);
    this.handleClickDiscardButton = this.handleClickDiscardButton.bind(this);
    this.handleClickDiscardPile = this.handleClickDiscardPile.bind(this);
    this.handleClickDrawPile = this.handleClickDrawPile.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleUpdateModalForm = this.handleUpdateModalForm.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleUpdateJoinName = this.handleUpdateJoinName.bind(this);

    // Socket handlers
    this.setGameData = this.setGameData.bind(this);
    this.updateHand = this.updateHand.bind(this);
    this.discardCard = this.discardCard.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.commonPileDraw = this.commonPileDraw.bind(this);
    this.discardPileDraw = this.discardPileDraw.bind(this);
    this.socket.on('game_data', this.setGameData);
    this.socket.on('update_hand', this.updateHand);
    this.socket.on('discard_card', this.discardCard);
    this.socket.on('join_game', this.joinGame);
    this.socket.on('draw_common_pile', this.commonPileDraw);
    this.socket.on('draw_discard_pile', this.discardPileDraw);
  }

  discardPileDraw(data) {
    this.setState(({players}) => {
      players[data.pid] = data.player
      return {
        players,
        discardPile: data.discardPile
      }
    })
  }

  commonPileDraw(data) {
    this.setState(({players}) => {
      players[data.pid] = data.player
      return {
        players,
        drawPile: data.drawPile
      }
    })
  }

  joinGame(data) {
    this.setState({
      discardPile: data.discardPile,
      players: data.players,
      drawPile: data.drawPile,
      myId: parseInt(data.myId),
      opponentId: parseInt(data.opponentId),
      currentPlayer: data.currentPlayer
    });
  }

  updateHand(data) {
    this.setState(({players}) => {
      players[data.pid] = data.player;
      return {
        players,
      };
    });
  }

  discardCard(data) {
    this.setState(({players, discardPile}) => {
      players[data.pid] = data.player;
      return {
        players,
        discardPile: data.discardPile
      };
    });
  }

  setGameData(data) {
    const { modalFormData: {me, opponent} } = this.state;
    const myId = Object.keys(data.players).find(
      key => data.players[parseInt(key)].name == me
    );
    const opponentId = Object.keys(data.players).find(
      key => data.players[parseInt(key)].name == opponent
    );

    this.setState({
      discardPile: data.discardPile,
      players: data.players,
      drawPile: data.drawPile,
      myId: parseInt(myId),
      opponentId: parseInt(opponentId),
      currentPlayer: data.currentPlayer
    });
  }

  handleJoinGame(e) {
    const { join_name } = this.state;
    const data = {
      player_name: join_name
    };
    this.socket.emit('join_game', data);
  }

  handleUpdateJoinName(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmitModal() {
    const { modalFormData } = this.state;
    this.socket.emit('new_game', modalFormData);
    this.handleCloseModal();
  }

  handleUpdateModalForm(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(({modalFormData}) => ({
        modalFormData: {
          ...modalFormData,
          [name]: value
        }
    }));
  }

  handleOpenModal() {
    this.setState({ modalOpen: true });
  }

  handleCloseModal() {
    this.setState({ modalOpen: false });
  }

  handleClickPlayButton(e) {
    const { selectedCard, myId } = this.state;

    if (selectedCard !== null) {
      this.socket.emit('play_card', {pid: myId, selectedCard});
      this.setState({selectedCard: null});
    }
  }

  handleClickDiscardButton(e) {
    const { selectedCard, myId } = this.state;

    if (selectedCard !== null) {
      this.socket.emit('discard_card', {pid: myId, selectedCard});
      this.setState({selectedCard: null});
    }
  }

  handleClickCard(e, position) {
    const { myId, players } = this.state;

    if (players[myId].hand.length == 8) {
      this.setState(prevState => ({
        selectedCard: position === prevState.selectedCard ? null : position
      }));
    }
  }

  handleClickDrawPile(e) {
    const { myId, players } = this.state;
    if (players[myId].hand.length < 8) {
      this.socket.emit('draw_card', {pid: myId})
    }
  }

  handleClickDiscardPile(e, color) {
    const { myId, players } = this.state;

    if (players[myId].hand.length < 8) {
      this.socket.emit('discard_draw', {
        pid: myId,
        pile_color: color  
      });
      // this.setState(({ players, myId, discardPile }) => {
      //   const card = {
      //     type: color,
      //     value: discardPile[color].pop()
      //   };
      //   players[myId].hand.push(card);
      //   return {
      //     players,
      //     discardPile
      //   };
      // });
    }
  }

  componentDidMount() {
    // const thang = data => {
    //   this.setState({
    //     discardPile: data.discardPile,
    //     myId: data.playerOne,
    //     opponent: data.playerTwo,
    //     drawPile: data.drawPile
    //   });
    // };
    // newGame()
    //   .then(thang)
    //   .catch(error => console.error(error));
  }

  render() {
    const { data } = this.props;
    const {
      drawPile,
      discardPile,
      players,
      myId,
      opponentId,
      currentPlayer,
      selectedCard,
      modalOpen,
      modalFormData,
      join_name,
    } = this.state;

    return (
      <>
        <Header
          currentPlayer={ players[currentPlayer].name }
          score={players[myId].score}
          handleOpenModal={this.handleOpenModal}
        />
        <JoinGame
          name={join_name}
          handleJoinGame={this.handleJoinGame}
          handleUpdateJoinName={this.handleUpdateJoinName}
        />
        <div>
          My Id: {myId}
        </div>
        <CardStacks stacks={players[opponentId].played} direction="bottom" />
        <Board
          discardPile={discardPile}
          drawPile={drawPile}
          handleClickDrawPile={this.handleClickDrawPile}
          handleClickDiscardPile={this.handleClickDiscardPile}
        />
        <Grid container directoin="row">
          <CardStacks stacks={players[myId].played} direction="top" />
          <Hand
            selectedCard={selectedCard}
            cards={players[myId].hand}
            handleClickCard={this.handleClickCard}
            handleClickPlay={this.handleClickPlayButton}
            handleClickDiscard={this.handleClickDiscardButton}
          />
        </Grid>
        <NewGameModal
          open={modalOpen}
          formData={modalFormData}
          handleClose={this.handleCloseModal}
          handleUpdateModalForm={this.handleUpdateModalForm}
          handleSubmit={this.handleSubmitModal}
        />
      </>
    );
  }
}

export default withRouteData(Game);
