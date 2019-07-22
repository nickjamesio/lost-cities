import React from "react";
import { makeStyles } from "@material-ui/core";

import Card from "../components/Card";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    height: "200px",
    "&:nth-child(2)": {
        marginTop: "-80px"
    }
  },
  card: {
    position: "absolute",
    "&:nth-child(1)": {
      top: 30,
      left: 80,
      transform: "rotate(-18deg)"
    },
    "&:nth-child(2)": {
      top: 15,
      left: 150,
      transform: "rotate(-9deg)"
    },
    "&:nth-child(3)": {
      top: 15,
      left: 220,
      transform: "rotate(9deg)"
    },
    "&:nth-child(4)": {
      top: 30,
      left: 290,
      transform: "rotate(18deg)"
    }
  }
}));

function Hand(props) {
  const { cards } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        {cards.slice(0, 4).map((card, index) => (
          <div className={classes.card}>
            <Card
              key={`${card.typ}${index}`}
              color={card.typ}
              value={card.val}
            />
          </div>
        ))}
      </div>
      <div className={classes.row}>
        {cards.slice(4).map((card, index) => (
          <div className={classes.card}>
            <Card
              key={`${card.typ}${index}`}
              color={card.typ}
              value={card.val}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hand;
