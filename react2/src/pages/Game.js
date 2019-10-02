import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import classnames from "classnames";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Background from "../images/background.png";
import DiscardPile from "../components/DiscardPile";
import PlaySquare from "../components/PlaySquare";
import Hand from "../components/Hand";
import DrawPile from "../components/DrawPile";
import CardStack from "../components/CardStack";
import { initializeGame } from "../socket";
import { useGameState } from "../context/GameStateProvider";
import Player from "../components/Player";
import GameOverDialog from "../components/GameOverDialog";
// import TestFrom from "../components/TestForm";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url(${Background})`,
    height: "100vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  columns: {
    height: "inherit"
  },
  cards: {
    // backgroundColor: "rgba(255,0,0,.5)",
    display: "flex",
    flexDirection: "column"
  },
  play: {
    height: "inherit"
    // backgroundColor: "rgba(0,255,0,.5)",
  },
  boardWrapper: {
    height: "100%"
  },
  boardColumnWrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    "&:not(:last-child)": {
      paddingRight: "4rem"
    }
  },
  discardPile: {
    height: "160px"
  },
  playedWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
    overflow: "hidden",
    "&.opponent": {
      justifyContent: "flex-end"
    }
  },
  handWrapper: {
    flexGrow: 1,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    overflow: "hidden",
    "&.opponent": {
      transform: "rotate(180deg)"
    }
  },
  hand: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  drawPile: {
    display: "flex",
    justifyContent: "space-around",
    height: "150px"
  }
}));

export default function Game(props) {
  const { id: gameId } = props;
  const classes = useStyles();
  const state = useGameState();
  const opponentPosition = (state.position % 2) + 1;

  useEffect(() => {
    // If page loaded or refreshed with /game/:id, the game
    // should be rehydrated
    if (/[0-9]+/.test(gameId)) {
      initializeGame(gameId);
    }
  }, [gameId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <section className={classes.root}>
        <Grid container className={classes.columns}>
          <Grid item xs={4} className={classes.cards}>
            <div className={classnames(classes.handWrapper, "opponent")}>
              <div className={classes.hand}>
                <Hand
                  cards={[
                    { typ: "facedown" },
                    { typ: "facedown" },
                    { typ: "facedown" },
                    { typ: "facedown" },
                    { typ: "facedown" },
                    { typ: "facedown" },
                    { typ: "facedown" },
                    { typ: "facedown" }
                  ]}
                />
              </div>
            </div>
            <Player
              player={state.players[opponentPosition]}
              active={state.position !== state.currentPlayer}
            />
            <div className={classes.drawPile}>
              <DrawPile cards={state.deck} />
            </div>
            <Player
              player={state.players[state.position]}
              active={state.position === state.currentPlayer}
            />
            <div className={classes.handWrapper}>
              <div className={classes.hand}>
                <Hand cards={state["hand"]} />
              </div>
            </div>
          </Grid>
          <Grid
            item
            container
            xs={8}
            className={classes.play}
            justify="center"
            alignItems="center"
          >
            {["yellow", "blue", "white", "green", "red"].map(color => (
              <div key={color} className={classes.boardColumnWrapper}>
                <div className={classnames(classes.playedWrapper, "opponent")}>
                  <PlaySquare opponent>
                    <CardStack opponent color={color} cards={state.played[opponentPosition][color]} />
                  </PlaySquare>
                </div>
                <DiscardPile
                  color={color}
                  className={classes.discardPile}
                  cards={state.discard[color]}
                />
                <div className={classes.playedWrapper}>
                  <PlaySquare>
                    <CardStack color={color} cards={state.played[state.position][color]} />
                  </PlaySquare>
                </div>
              </div>
            ))}
          </Grid>
        </Grid>
        {/* <TestFrom /> */}
        <GameOverDialog isOver={state.over} />
      </section>
    </DndProvider>
  );
}
