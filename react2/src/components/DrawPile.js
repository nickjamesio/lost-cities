import React from "react";
import { makeStyles } from "@material-ui/core";

import CardCount from "./CardCount";
import Card, { DECK } from "./Card";

const useStyles = makeStyles(theme => ({
  drawPile: {
    transform: "rotate(90deg)",
    display: "inline-block"
  }
}));

function DrawPile(props) {
  const { cards } = props;
  const classes = useStyles();

  return cards.length ? (
    <div className={classes.drawPile}>
      <CardCount count={cards.length} drawPile>
        <Card type="facedown" location={DECK} />
      </CardCount>
    </div>
  ) : null;
}

export default DrawPile;
