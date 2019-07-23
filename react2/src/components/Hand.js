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
    height: "200px",
    "&:nth-child(2)": {
      marginTop: "-80px"
    }
  },
  cardWrapperFull: {
    "&:nth-child(1)": {
      transform: "rotate(-18deg)",
      marginRight: "-40px",
      marginTop: "30px"
    },
    "&:nth-child(2)": {
      transform: "rotate(-9deg)",
      marginRight: "-50px",
      marginTop: "15px"
    },
    "&:nth-child(3)": {
      transform: "rotate(9deg)",
      marginRight: "-40px",
      marginTop: "15px"
    },
    "&:nth-child(4)": {
      transform: "rotate(18deg)",
      marginTop: "30px"
    }
  },
  cardWrapperNotFull: {
    "&:nth-child(1)": {
      transform: "rotate(-9deg)",
      marginRight: "-40px",
      marginTop: "30px"
    },
    "&:nth-child(2)": {
      // Not sure why but had to add transform so middle card has correct overlap
      // and z-index
      transform: "rotate(0deg)",
      marginRight: "-50px",
      marginTop: "15px"
    },
    "&:nth-child(3)": {
      transform: "rotate(9deg)",
      marginTop: "30px"
    }
  }
}));

function renderCard(hidden, card) {
  return hidden ? (
    <Card type="facedown" />
  ) : (
    <Card type={card.typ} value={card.val} />
  );
}

function Hand(props) {
  const { cards, hidden } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        {cards.slice(0, 4).map((card, index) => (
          <div key={`${card.typ}${index}`} className={classes.cardWrapperFull}>
            {renderCard(hidden, card)}
          </div>
        ))}
      </div>
      <div className={classes.row}>
        {cards.slice(4).map((card, index) => (
          <div
            key={`${card.typ}${index}`}
            className={
              cards.length === 8
                ? classes.cardWrapperFull
                : classes.cardWrapperNotFull
            }
          >
            {renderCard(hidden, card)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hand;
