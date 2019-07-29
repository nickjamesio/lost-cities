import React from "react";
import { makeStyles } from "@material-ui/core";
import classnames from "classnames";

import Card from "./Card";
import CardCount from "./CardCount";
import YellowDiscard from "../images/yellow_discard.png";
import BlueDiscard from "../images/blue_discard.png";
import WhiteDiscard from "../images/white_discard.png";
import GreenDiscard from "../images/green_discard.png";
import RedDiscard from "../images/red_discard.png";

const useStyles = makeStyles(theme => ({
  discardPile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%"
  },
  discardPileImage: {
    height: "100%"
  },
  cardWrapper: {
    position: "absolute",
    zIndex: "1"
  },
  count: {
    
  }
}));

export default function DiscardPile(props) {
  const { color, cards, children, className: classNameProp } = props;
  const classes = useStyles();
  const card = cards.length ? cards[cards.length - 1] : null;

  let imgSrc;
  switch (color) {
    case "red":
      imgSrc = RedDiscard;
      break;
    case "white":
      imgSrc = WhiteDiscard;
      break;
    case "yellow":
      imgSrc = YellowDiscard;
      break;
    case "green":
      imgSrc = GreenDiscard;
      break;
    case "blue":
      imgSrc = BlueDiscard;
      break;
    default:
      imgSrc = "";
  }

  return (
    <div className={classnames(classes.discardPile, classNameProp)}>
      <img
        src={imgSrc}
        className={classes.discardPileImage}
        alt={`${color} discard pile`}
      />
      <div className={classes.cardWrapper}>
        {card ? (
          <CardCount count={cards.length}>
            <Card type={card.typ} value={card.val} />
          </CardCount>
        ) : null}
      </div>
    </div>
  );
}
