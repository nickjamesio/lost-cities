import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import classnames from "classnames";

import Background from "../images/background.png";
import Card from "../components/Card";
import DiscardPile from "../components/DiscardPile";
import { getGame } from "../util/api";
import PlaySquare from "../components/PlaySquare";
import Hand from "../components/Hand";
import DrawPile from "../components/DrawPile";
import CardStack from "../components/CardStack";
import { INITIALIZE_GAME } from "../socket";
import {
  GAME_CREATED,
  useGameState,
  useGameSocket,
  useGameDispatch
} from "../context/GameContext";
import TestFrom from "../components/TestForm";

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
    height: "250px"
  },
  playedWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
    "&.opponent": {
      justifyContent: "flex-end"
    }
  },
  hand: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    overflow: "hidden",
    "&.opponent": {
      transform: "rotate(180deg)"
    }
  },
  drawPile: {
    display: "flex",
    justifyContent: "space-around"
  }
}));

export default function Game(props) {
  const { id: gameId } = props;
  const classes = useStyles();
  const state = useGameState();
  const socket = useGameSocket();
  const dispatch = useGameDispatch();
  const opponentPosition = (state.position % 2) + 1;

  useEffect(() => {
    // If page loaded or refreshed with /game/:id, the game
    // should be rehydrated
    if (state.gameId === null) {
      socket.emit(INITIALIZE_GAME, { gameId });
    }
  }, [gameId, state.gameId]);

  return (
    <section className={classes.root}>
      <Grid container className={classes.columns}>
        <Grid item xs={4} className={classes.cards}>
          <div className={classnames(classes.hand, "opponent")}>
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
          <div className={classes.drawPile}>
            <DrawPile />
          </div>
          <div className={classes.hand}>
            <Hand cards={state["hand"]} />
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
                  <CardStack cards={state.played[opponentPosition][color]} />
                </PlaySquare>
              </div>
              <DiscardPile
                color={color}
                className={classes.discardPile}
                cards={state.discard[color]}
              />
              <div className={classes.playedWrapper}>
                <PlaySquare>
                  <CardStack cards={state.played[state.position][color]} />
                </PlaySquare>
              </div>
            </div>
          ))}
        </Grid>
      </Grid>
      <TestFrom />
    </section>
  );
}
