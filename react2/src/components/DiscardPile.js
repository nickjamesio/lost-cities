import React from "react";
import { makeStyles } from "@material-ui/core";
import classnames from "classnames";

import { useDrop } from "react-dnd";

import Card from "./Card";
import CardCount from "./CardCount";
import YellowDiscard from "../images/yellow_discard.png";
import BlueDiscard from "../images/blue_discard.png";
import WhiteDiscard from "../images/white_discard.png";
import GreenDiscard from "../images/green_discard.png";
import RedDiscard from "../images/red_discard.png";
import { useGameSocket, useGameState } from "../context/GameContext";
import { ItemTypes } from "../util/constants";
import {
  DISCARD_CARD,
  DISCARD_DRAW,
} from "../socket";
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
  },
}));

export default function DiscardPile(props) {
  const { color, cards, className: classNameProp } = props;
  const classes = useStyles();
  const socket = useGameSocket();
  const state = useGameState();
  const card = cards.length ? cards[cards.length - 1] : null;
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.FACE_UP,
    drop: (item, monitor) => {
      socket.emit(DISCARD_CARD, {
        gameId: state.gameId,
        cardIndex: item.position
      });
    },
    canDrop: (item, monitor) => {
      return item.color == color && state.currentPlayer == state.position;
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
            <Card type={card.typ} value={card.val} />
          </CardCount>
        ) : null}
      </div>
      {!isOver && canDrop && <Overlay color="black" />}
      {isOver && canDrop && <Overlay color={color} />}
    </div>
  );
}
