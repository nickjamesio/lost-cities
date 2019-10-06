import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  overlay: {
    display: "none",
    "&.open": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      backgroundColor: "#00000085",
      height: "100%",
      width: "100%",
      zIndex: "2"
    }
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "150px",
    padding: "0 2rem"
  }
}));

export default function GameOverDialog(props) {
  const classes = useStyles();
  const { isOver, players } = props;
  const p1 = players["1"];
  const p2 = players["2"];
  const p1Name = p1.username ? p1.username : "";
  const p2Name = p1.username ? p2.username : "";
  let winner = "Tie game!";

  if (p1.score && p2.score && p1.score > p2.score) {
    winner = `Winner: ${p1Name}`;
  } else if (p1.score && p2.score && p2.score > p1.score) {
    winner = `Winner: ${p2Name}`;
  }

  return (
    <div
      className={classnames(classes.overlay, isOver ? "open" : null)}
    >
      <Paper className={classes.content}>
        <Typography>GAME OVER</Typography>
        <Typography>{winner}</Typography>
      </Paper>
    </div>
  );
}

GameOverDialog.propTypes = {
  isOver: PropTypes.bool.isRequired
};
