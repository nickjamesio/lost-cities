import React from "react";
import { useGameState } from "../context/GameContext";
import { makeStyles } from "@material-ui/core";

import Card from "../components/Card";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  row: {
    display: "flex",
    justifyContent: "center"
  }
}));

function Hand(props) {
  const { cards } = props;
  const classes = useStyles();
  const transforms = [
    "rotate(-18deg)",
    "rotate(-9deg)",
    "rotate(9deg)",
    "rotate(18deg)"
  ];

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        {cards.slice(0, 4).map((card, index) => (
            <div style={{ transform: transforms[index]}}>
                <Card key={`${card.typ}${index}`} color={card.typ} value={card.val} />
            </div>
        ))}
      </div>
      <div className={classes.row}>
        {cards.slice(4).map((card, index) => (
          <Card key={`${card.typ}${index}`} color={card.typ} value={card.val} />
        ))}
      </div>
    </div>
  );
}

export default Hand;
