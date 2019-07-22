import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import classnames from "classnames";

import Background from "../images/background.png";
import Card from "../components/Card";
import DiscardPile from "../components/DiscardPile";
import {
  GAME_CREATED,
  useGameState,
  useGameSocket,
  useGameDispatch
} from "../context/GameContext";
import { getGame } from "../util/api";
import PlaySquare from "../components/PlaySquare";
import Hand from "../components/Hand";

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
  hand: {
    // backgroundColor: "rgba(255,0,0,.5)",
    height: "inherit"
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
  cardWrapper: {
    position: "absolute",
    zIndex: "1"
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
  handRows: {
    display: "flex",
    flexDirection: "column",
  },
  hand: {
    flexGrow: 1
  }
}));

export default function Game(props) {
  const { id: gameId } = props;
  const classes = useStyles();
  const state = useGameState();
  const socket = useGameSocket();
  const dispatch = useGameDispatch();

  useEffect(() => {
    // If page loaded or refreshed with /game/:id, the game
    // should be rehydrated
    if (state.gameId === null) {
      // Dispatch to GAME_CREATED even though the game is not being created
      // Same data is returned so its ok
      async function fetchData() {
        const result = await getGame(gameId);
        if (result.code === 200) {
          dispatch({ type: GAME_CREATED, data: result.data });
        } else {
          // TODO take care of case where get 401 code
          // 401 happens when trying to load a game when
          // you are not one of the players
        }
      }
      fetchData();
    }
  }, [gameId, state.gameId, dispatch]);

  return (
    <section className={classes.root}>
      <Grid container className={classes.columns}>
        <Grid item xs={4} className={classes.hand}>
          <div className={classes.handRows}>
            <div className={classes.hand}>
              <Hand cards={state['hand']} />
            </div>
            <div className={classes.hand}>

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
                <PlaySquare hide/>
              </div>
              <DiscardPile color={color} className={classes.discardPile}>
                <div className={classes.cardWrapper}>
                  <Card color={color} value={5} />
                </div>
              </DiscardPile>
              <div className={classes.playedWrapper}>
                <PlaySquare />
              </div>
            </div>
          ))}
        </Grid>
      </Grid>
    </section>
  );
}
