import React from "react";
import { makeStyles } from "@material-ui/core";

import Card, { HAND } from "../components/Card";

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
      marginTop: "-130px"
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

function renderCard(hidden, card, index) {
  return hidden ? (
    <Card type="facedown" location={HAND} />
  ) : (
    <Card type={card.typ} value={card.val} position={index} location={HAND} />
  );
}

function Hand(props) {
  const { cards, hidden } = props;
  const classes = useStyles();
  const rowOne = [];
  const rowTwo = [];
  cards.forEach((card, index) => {
    if (index < 4) {
      rowOne.push(renderCard(hidden, card, index));
    } else {
      rowTwo.push(renderCard(hidden, card, index));
    }
  });

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        {rowOne.map((Card, index) => (
          <div key={`${index}`} className={classes.cardWrapperFull}>
            {Card}
          </div>
        ))}
      </div>
      <div className={classes.row}>
        {rowTwo.map((Card, index) => (
          <div
            key={`${index}`}
            className={
              cards.length === 8
                ? classes.cardWrapperFull
                : classes.cardWrapperNotFull
            }
          >
            {Card}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hand;
