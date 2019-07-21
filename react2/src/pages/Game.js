import React from "react";
import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import Background from "../images/background.png";
import Card from "../components/Card";
import DiscardPile from "../components/DiscardPile";
import { useGameState, useGameSocket } from "../context/GameContext";

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
  discardContainer: {
    height: "250px"
  },
  discardWrapper: {
    "&:not(:last-child)": {
      paddingRight: "4rem"
    }
  },
  cardWrapper: {
    position: "absolute",
    zIndex: "1"
  },
  discardItemImage: {
    height: "100%"
  }
}));

export default function Game(props) {
  const { id: gameId } = props;
  const classes = useStyles();
  const { state } = useGameState();
  const { socket } = useGameSocket();

  return (
    <section
      className={classes.root}
    >
      <Grid container className={classes.columns}>
        <Grid item xs={4} className={classes.hand} />
        <Grid
          item
          container
          xs={8}
          className={classes.play}
          justify="center"
          alignItems="center"
        >
          <Grid
            item
            container
            className={classes.discardContainer}
            justify="center"
            alignItems="center"
          >
            {["yellow", "blue", "white", "green", "red"].map(color => (
              <div key={color} className={classes.discardWrapper}>
                <DiscardPile color={color}>
                  <div className={classes.cardWrapper}>
                    <Card color={color} value={5} />
                  </div>
                </DiscardPile>
              </div>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
}
