import React from "react";
import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import Background from "../images/background.png";
import YellowDiscard from "../images/yellow_discard.png";
import BlueDiscard from "../images/blue_discard.png";
import WhiteDiscard from "../images/white_discard.png";
import GreenDiscard from "../images/green_discard.png";
import RedDiscard from "../images/red_discard.png";
import Card from "../components/Card";

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
  discardItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    height: "100%",
    "&:not(:last-child)": {
      paddingRight: "4rem"
    },
  },
  discardItemImage: {
    height: "100%"
  }
}));

export default function Game(props) {
  const classes = useStyles();

  return (
    <section className={classes.root}>
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
            <Grid item className={classes.discardItem}>
              <img src={YellowDiscard} className={classes.discardItemImage} />
              <Card color="green" value={5} />
            </Grid>
            <Grid item className={classes.discardItem}>
              <img src={BlueDiscard} className={classes.discardItemImage} />
            </Grid>
            <Grid item className={classes.discardItem}>
              <img src={WhiteDiscard} className={classes.discardItemImage} />
            </Grid>
            <Grid item className={classes.discardItem}>
              <img src={GreenDiscard} className={classes.discardItemImage} />
            </Grid>
            <Grid item className={classes.discardItem}>
              <img src={RedDiscard} className={classes.discardItemImage} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
}
