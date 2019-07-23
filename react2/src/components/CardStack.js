import React from "react";
import { makeStyles } from "@material-ui/core";

import Card from "./Card";

const useStyles = makeStyles(theme => ({
  cardStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  card: {
    position: "absolute",
    "&:not(:first-child)": {
    }
  }
}));

function CardStack(props) {
  const { cards } = props;
  const classes = useStyles();
  return (
    <div className={classes.cardStack}>
      {cards.map((card, index) => (
        <div key={`${card.typ}${index}`} className={classes.card} style={{top: index * 33}}>
          <Card type={card.typ} value={card.val} />
        </div>
      ))}
    </div>
  );
}

export default CardStack;
