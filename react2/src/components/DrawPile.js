import React from "react";
import { makeStyles } from "@material-ui/core";

import Card from "./Card";
const useStyles = makeStyles(theme => ({
  drawPile: {
    transform: "rotate(90deg)",
    display: "inline-block"
  }
}));

function DrawPile(props) {
  const { drawPile } = props;
  const classes = useStyles();

  return (
    <div className={classes.drawPile}>
      <Card type="facedown" />
    </div>
  );
}

export default DrawPile;
