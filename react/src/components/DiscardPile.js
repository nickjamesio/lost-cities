import React from "react";
import { makeStyles } from "@material-ui/core";
import classnames from "classnames";
import { useDrop } from "react-dnd";

import Card, { DISCARD, HAND } from "./Card";
import CardCount from "./CardCount";
import YellowDiscard from "../images/yellow_discard.png";
import BlueDiscard from "../images/blue_discard.png";
import WhiteDiscard from "../images/white_discard.png";
import GreenDiscard from "../images/green_discard.png";
import RedDiscard from "../images/red_discard.png";
import { useGameState } from "../context/GameStateProvider";
import { ItemTypes } from "../util/constants";
import { discardCard } from "../socket";
import Overlay from "./Overlay";

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
  }
}));

export default function DiscardPile(props) {
  const { color, cards, className: classNameProp } = props;
  const classes = useStyles();
  const state = useGameState();
  const card = cards.length ? cards[cards.length - 1] : null;
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.FACE_UP,
    drop: item => {
      discardCard(state.gameId,item.position);
    },
    canDrop: item => {
      return item.color == color && state.currentPlayer == state.position && item.location === HAND;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

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
    <div className={classnames(classes.discardPile, classNameProp)} ref={drop}>
      <img
        src={imgSrc}
        className={classes.discardPileImage}
        alt={`${color} discard pile`}
      />
      <div className={classes.cardWrapper}>
        {card ? (
          <CardCount count={cards.length}>
            <Card type={card.typ} value={card.val} location={DISCARD} />
          </CardCount>
        ) : null}
      </div>
      {!isOver && canDrop && <Overlay color="black" />}
      {isOver && canDrop && <Overlay color={color} />}
    </div>
  );
}
