import React from "react";
import { Grid, Button, Typography, withStyles } from "@material-ui/core";

const styles = {
  root: {
    backgroundColor: "#FFF7E1"
  }
};

const Header = props => {
  const { classes, currentPlayer, score, handleOpenModal } = props;

  return (
    <section>
      <Grid container className={classes.root} justify="space-between">
        <Typography variant="h5">
          Current Player: {currentPlayer}
        </Typography>
        <Typography variant="h5">Score: {score}</Typography>
        <Button variant="contained" onClick={handleOpenModal}>
          New Game
        </Button>
      </Grid>
    </section>
  );
};

export default withStyles(styles)(Header);
